/*
 * FreshRoute Backend - Subscription Service
 *
 * Business logic for FreshPass subscription:
 * - Create subscription (₹999/mo, 4 orders/month)
 * - Cancel subscription
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class SubscriptionService {
  constructor(private prisma: PrismaService) {}

  async getSubscription(userId: string) {
    const customer = await this.prisma.customer.findUnique({ where: { userId } });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return this.prisma.customerSubscription.findUnique({
      where: { customerId: customer.id },
    });
  }

  async createSubscription(userId: string, dto: { planType?: string }) {
    const customer = await this.prisma.customer.findUnique({ where: { userId } });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    const pricePaid = 99900;

    return this.prisma.customerSubscription.create({
      data: {
        customerId: customer.id,
        planType: dto.planType || 'FRESHPASS',
        status: 'ACTIVE',
        pricePaid: pricePaid,
        periodStart: now,
        periodEnd,
        ordersIncluded: 4,
        ordersUsed: 0,
        autoRenew: true,
      },
    });
  }

  async cancelSubscription(userId: string) {
    const customer = await this.prisma.customer.findUnique({ where: { userId } });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const subscription = await this.prisma.customerSubscription.findUnique({
      where: { customerId: customer.id },
    });

    if (!subscription) {
      throw new NotFoundException('No active subscription found');
    }

    return this.prisma.customerSubscription.update({
      where: { id: subscription.id },
      data: { status: 'CANCELLED', autoRenew: false },
    });
  }
}