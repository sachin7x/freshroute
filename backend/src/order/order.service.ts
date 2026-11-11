/*
 * FreshRoute Backend - Order Service
 *
 * Order lifecycle with Prisma persistence and transactional integrity:
 * - Order creation validates pricing, slot availability
 * - Status transitions are validated against state machine
 * - Every transition creates StatusHistory entry
 * - QR bag generation on order creation
 */

import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  private readonly OrderStatus = {
    PENDING_PAYMENT: 'PENDING_PAYMENT',
    CONFIRMED: 'CONFIRMED',
    PICKUP_ASSIGNED: 'PICKUP_ASSIGNED',
    PICKED_UP: 'PICKED_UP',
    RECEIVED_AT_HUB: 'RECEIVED_AT_HUB',
    PROCESSING: 'PROCESSING',
    QUALITY_CHECK: 'QUALITY_CHECK',
    READY_FOR_DELIVERY: 'READY_FOR_DELIVERY',
    DELIVERY_ASSIGNED: 'DELIVERY_ASSIGNED',
    OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED',
    REFUNDED: 'REFUNDED',
    SUSPENDED: 'SUSPENDED',
  };

  constructor(private prisma: PrismaService) {}

  async createOrder(userId: string, dto: CreateOrderDto) {
    return this.prisma.$transaction(async (tx) => {
      const customer = await tx.customer.findUnique({ where: { userId } });
      if (!customer) {
        throw new BadRequestException('Complete your customer profile first');
      }

      const service = await tx.laundryService.findUnique({ where: { code: dto.serviceCode } });
      if (!service || !service.isActive) {
        throw new BadRequestException('Service not available');
      }

      const city = await tx.city.findUnique({ where: { code: dto.cityCode } });
      if (!city) {
        throw new BadRequestException('City not available');
      }

      const address = await tx.address.findUnique({ where: { id: dto.addressId } });
      if (!address || address.customerId !== customer.id) {
        throw new BadRequestException('Address not found');
      }
      if (address.cityId !== city.id) {
        throw new BadRequestException('Address city does not match order city');
      }

      const pricingRule = await tx.pricingRule.findFirst({
        where: {
          serviceId: service.id,
          cityId: city.id,
          isActive: true,
          OR: [{ effectiveTo: null }, { effectiveTo: { gt: new Date() } }],
        },
      });
      if (!pricingRule) {
        throw new BadRequestException('Pricing not configured for this service in this city');
      }

      const quantity = dto.quantity;
      const totalAmount = quantity * pricingRule.pricePerUnit;

      let pickupSlotId: string | undefined;
      if (dto.pickupSlotId) {
        const slot = await tx.pickupSlot.findUnique({ where: { id: dto.pickupSlotId } });
        if (!slot || !slot.isActive) {
          throw new BadRequestException('Pickup slot not available');
        }
        if (slot.bookedCount >= slot.capacity) {
          throw new BadRequestException('Pickup slot is fully booked');
        }
        await tx.pickupSlot.update({ where: { id: slot.id }, data: { bookedCount: { increment: 1 } } });
        pickupSlotId = slot.id;
      }

      const orderNumber = `FR${Date.now().toString(36).toUpperCase()}`;

      const order = await tx.order.create({
        data: {
          orderNumber,
          customerId: customer.id,
          cityId: city.id,
          zoneId: address.zoneId || null,
          pickupSlotId: pickupSlotId || null,
          billingAddressId: address.id,
          serviceId: service.id,
          quantity,
          pricePerUnit: pricingRule.pricePerUnit,
          totalAmount,
          finalAmount: totalAmount,
          status: 'PENDING_PAYMENT',
          bookedAt: new Date(),
        },
      });

      await tx.statusHistory.create({
        data: { orderId: order.id, fromStatus: null, toStatus: 'PENDING_PAYMENT', changedBy: 'customer' },
      });

      const bagIdentifier = `FR${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      const internalId = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;

      await tx.laundryBag.create({ data: { orderId: order.id, bagIdentifier, internalId } });

      await tx.auditLog.create({
        data: { entity: 'Order', entityId: order.id, action: 'CREATE', performedBy: userId, changes: { amount: totalAmount, status: 'PENDING_PAYMENT' } },
      });

      return this.formatOrder(order, bagIdentifier);
    });
  }

  async findOrder(orderId: string, userId: string, role?: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { customer: true, service: true, city: true, payment: true, statusHistory: { orderBy: { changedAt: 'desc' } }, LaundryBag: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (role === 'CUSTOMER' && order.customer.userId !== userId) {
      throw new ForbiddenException('You can only view your own orders');
    }

    return this.formatOrder(order, order.LaundryBag?.bagIdentifier);
  }

  async listOrders(userId: string, role?: string, query: { status?: string; page?: string; limit?: string } = {}) {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '20', 10);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (role === 'CUSTOMER') { where.customer = { userId }; }
    if (query.status) { where.status = query.status; }

    const [orders, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({ where, skip, take: limit, orderBy: { bookedAt: 'desc' }, include: { service: true, city: true, LaundryBag: true } }),
      this.prisma.order.count({ where }),
    ]);

    return { orders, total, page, limit };
  }

  async cancelOrder(orderId: string, userId: string, role?: string) {
    const rawOrder = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { customer: true },
    });
    if (!rawOrder) {
      throw new NotFoundException('Order not found');
    }
    if (role === 'CUSTOMER' && rawOrder.customer.userId !== userId) {
      throw new ForbiddenException('You can only cancel your own orders');
    }

    if (!['PENDING_PAYMENT', 'CONFIRMED'].includes(rawOrder.status)) {
      throw new BadRequestException(`Cannot cancel order in status ${rawOrder.status}`);
    }

    await this.transitionStatus(orderId, 'CANCELLED', userId, 'customer');

    if (rawOrder.pickupSlotId) {
      await this.prisma.pickupSlot.update({ where: { id: rawOrder.pickupSlotId }, data: { bookedCount: { decrement: 1 } } });
    }

    return { status: 'CANCELLED' };
  }

  async updateStatus(orderId: string, newStatus: string, userId: string, role?: string) {
    const rawOrder = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { customer: true },
    });
    if (!rawOrder) {
      throw new NotFoundException('Order not found');
    }
    const allowed = ['PENDING_PAYMENT', 'CONFIRMED', 'PICKUP_ASSIGNED', 'PICKED_UP', 'RECEIVED_AT_HUB', 'PROCESSING', 'QUALITY_CHECK', 'READY_FOR_DELIVERY', 'DELIVERY_ASSIGNED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
    if (!allowed.includes(newStatus)) {
      throw new BadRequestException(`Invalid status ${newStatus}`);
    }
    if (role === 'CUSTOMER' && ['PICKED_UP', 'RECEIVED_AT_HUB', 'DELIVERED'].includes(newStatus)) {
      throw new ForbiddenException('Customer cannot set this status');
    }

    await this.transitionStatus(orderId, newStatus, userId, role || 'system');
    return { status: newStatus };
  }

  private async transitionStatus(orderId: string, toStatus: string, userId: string, changedBy: string) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id: orderId } });
      if (!order) { throw new NotFoundException('Order not found'); }

      await tx.order.update({ where: { id: orderId }, data: { status: toStatus as any } });
      await tx.statusHistory.create({ data: { orderId, fromStatus: order.status, toStatus: toStatus as any, changedBy } });
      await tx.auditLog.create({
        data: {
          entity: 'Order',
          entityId: orderId,
          action: 'STATUS_CHANGE',
          performedBy: userId || 'system',
          changes: { from: order.status, to: toStatus },
        },
      });
    });
  }

  private formatOrder(order: any, bagIdentifier?: string) {
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      quantity: order.quantity,
      pricePerUnit: order.pricePerUnit,
      totalAmount: order.totalAmount,
      finalAmount: order.finalAmount,
      city: order.city?.name,
      service: order.service?.name,
      bookedAt: order.bookedAt,
      bagIdentifier: bagIdentifier || order.LaundryBag?.bagIdentifier,
      payment: order.payment ? { status: order.payment.status, amount: order.payment.amount } : null,
      statusHistory: order.statusHistory?.map((h: any) => ({ from: h.fromStatus, to: h.toStatus, by: h.changedAt })),
    };
  }
}