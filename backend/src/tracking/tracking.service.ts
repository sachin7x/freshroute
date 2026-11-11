/*
 * FreshRoute Backend - Tracking Service
 *
 * Real-time order tracking via Socket.IO:
 * - Authenticated subscriptions per customer
 * - Event broadcasting (order status changes)
 * - Order status history retrieval
 */

import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class TrackingService {
  constructor(private prisma: PrismaService) {}

  async getOrderTracking(orderId: string, userId: string, role?: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: true,
        statusHistory: { orderBy: { changedAt: 'desc' } },
      },
    });

    if (!order) {
      throw new ForbiddenException('Order not found');
    }

    if (role === 'CUSTOMER' && order.customer.userId !== userId) {
      throw new ForbiddenException('You can only track your own orders');
    }

    return {
      orderId,
      orderNumber: order.orderNumber,
      currentStatus: order.status,
      statusHistory: order.statusHistory.map((h) => ({
        status: h.toStatus,
        changedAt: h.changedAt,
        changedBy: h.changedBy,
      })),
    };
  }

  async getOrderStatusHistory(orderId: string, userId: string, role?: string) {
    const history = await this.prisma.statusHistory.findMany({
      where: { orderId },
      orderBy: { changedAt: 'desc' },
    });

    return history;
  }
}