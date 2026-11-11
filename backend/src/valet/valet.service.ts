/*
 * FreshRoute Backend - Valet Service
 *
 * Business logic for valet dispatch:
 * - Assign valet to order
 * - Update valet status
 * - Confirm pickup/delivery
 */

import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ValetService {
  constructor(private prisma: PrismaService) {}

  async assignValet(orderId: string, valetId: string) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id: orderId } });
      if (!order) {
        throw new BadRequestException('Order not found');
      }

      const valet = await tx.valet.findUnique({ where: { id: valetId } });
      if (!valet) {
        throw new BadRequestException('Valet not found');
      }

      // Assign valet to order
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          valet: { connect: { id: valetId } },
          status: 'PICKUP_ASSIGNED',
        },
      });

      await tx.statusHistory.create({
        data: {
          orderId,
          fromStatus: order.status,
          toStatus: 'PICKUP_ASSIGNED',
          changedBy: 'admin',
        },
      });

      return updatedOrder;
    });
  }

  async confirmPickup(orderId: string, valetId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { LaundryBag: true },
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    if (order.valetId !== valetId) {
      throw new ForbiddenException('Valet is not assigned to this order');
    }

    // Update order status to PICKED_UP
    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'PICKED_UP',
        pickedUpAt: new Date(),
      },
    });

    // Mark bag as scanned at pickup
    if (order.LaundryBag) {
      await this.prisma.laundryBag.update({
        where: { id: order.LaundryBag.id },
        data: { scannedAtPickup: new Date() },
      });
    }

    await this.prisma.statusHistory.create({
      data: {
        orderId,
        fromStatus: order.status,
        toStatus: 'PICKED_UP',
        changedBy: 'valet',
      },
    });

    return { status: 'PICKED_UP' };
  }

  async confirmDelivery(orderId: string, valetId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    if (order.valetId !== valetId) {
      throw new ForbiddenException('Valet is not assigned to this order');
    }

    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'DELIVERED',
        deliveredAt: new Date(),
      },
    });

    const bag = await this.prisma.laundryBag.findUnique({ where: { orderId } });
    if (bag) {
      await this.prisma.laundryBag.update({
        where: { id: bag.id },
        data: { scannedAtDelivery: new Date() },
      });
    }

    await this.prisma.statusHistory.create({
      data: {
        orderId,
        fromStatus: order.status,
        toStatus: 'DELIVERED',
        changedBy: 'valet',
      },
    });

    return { status: 'DELIVERED' };
  }
}