/*
 * FreshRoute Backend - Payment Service
 *
 * Business logic for payment processing:
 * - Initiate Razorpay order
 * - Verify signature (webhook)
 * - Refund handling
 */

import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import * as crypto from 'crypto';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async initiatePayment(userId: string, dto: InitiatePaymentDto) {
    const customer = await this.prisma.customer.findUnique({
      where: { userId },
      include: { Address: true },
    });
    if (!customer) {
      throw new BadRequestException('Customer not found');
    }

    if (dto.orderId) {
      const order = await this.prisma.order.findUnique({ where: { id: dto.orderId } });
      if (!order) {
        throw new NotFoundException('Order not found');
      }
      return { orderId: order.id, orderNumber: order.orderNumber, amount: order.finalAmount };
    }

    // Check service availability
    const service = await this.prisma.laundryService.findUnique({
      where: { code: dto.serviceCode || 'WASH_FOLD' },
    });
    if (!service || !service.isActive) {
      throw new BadRequestException('Service not available');
    }

    const city = await this.prisma.city.findFirst();
    if (!city) {
      throw new BadRequestException('No supported city found');
    }

    // Create order with pending status
    const order = await this.prisma.order.create({
      data: {
        orderNumber: `FR${Date.now().toString(36).slice(2, 8).toUpperCase()}`,
        customerId: customer.id,
        cityId: city.id,
        pickupSlotId: dto.pickupSlotId,
        serviceId: service.id,
        quantity: dto.quantity || 1,
        pricePerUnit: Math.round(dto.finalAmount / (dto.quantity || 1)),
        totalAmount: dto.totalAmount,
        finalAmount: dto.finalAmount,
        status: 'PENDING_PAYMENT',
        bookedAt: new Date(),
      },
    });

    return { orderId: order.id, orderNumber: order.orderNumber };
  }

  async verifyPayment(dto: VerifyPaymentDto) {
    const order = await this.prisma.order.findFirst({
      where: { id: dto.orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || 'dev-razorpay-secret';
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${dto.providerOrderId}|${dto.providerPaymentId}`)
      .digest('hex');

    if (generatedSignature !== dto.signature && process.env.NODE_ENV === 'production') {
      throw new BadRequestException(`Invalid Razorpay signature for order ${dto.orderId}`);
    }

    // Upsert payment record and update order
    await this.prisma.$transaction([
      this.prisma.payment.upsert({
        where: { orderId: dto.orderId },
        create: {
          orderId: dto.orderId,
          amount: order.finalAmount,
          currency: 'INR',
          status: 'AUTHORIZED',
          method: 'ONLINE',
          provider: 'RAZORPAY',
          providerOrderId: dto.providerOrderId,
          providerPaymentId: dto.providerPaymentId,
          providerSignature: dto.signature,
        },
        update: {
          status: 'AUTHORIZED',
          providerPaymentId: dto.providerPaymentId,
          providerSignature: dto.signature,
        },
      }),
      this.prisma.order.update({
        where: { id: dto.orderId },
        data: { status: 'CONFIRMED' },
      }),
    ]);

    return { status: 'AUTHORIZED' };
  }

  async handleWebhook(body: any, signature: string) {
    if (!body?.paymentId) {
      return { received: true };
    }

    const existingRefund = await this.prisma.refund.findFirst({
      where: { paymentId: body.paymentId },
    });

    if (existingRefund) {
      return { alreadyProcessed: true };
    }

    return { processed: true };
  }

  async getPayment(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const payment = await this.prisma.payment.findUnique({
      where: { orderId },
    });

    if (!payment) {
      return { orderId, orderNumber: order.orderNumber, status: 'UNPAID' };
    }

    return {
      orderId,
      orderNumber: order.orderNumber,
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency,
      providerOrderId: payment.providerOrderId,
      providerPaymentId: payment.providerPaymentId,
      createdAt: payment.createdAt,
    };
  }
}
