/*
 * FreshRoute Backend - Admin Service
 *
 * Business logic for administrative operations:
 * - Order management across all customers
 * - Customer lookup
 * - Operational analytics
 * - Audit history
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async listAllOrders(query: { status?: string; page?: string; limit?: string } = {}) {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '20', 10);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.status) {
      where.status = query.status;
    }

    const [orders, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { bookedAt: 'desc' },
        include: { customer: true, service: true, city: true },
      }),
      this.prisma.order.count({ where }),
    ]);

    return { orders, total, page, limit };
  }

  async listAllCustomers(query: { page?: string; limit?: string } = {}) {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '20', 10);
    const skip = (page - 1) * limit;

    const [customers, total] = await this.prisma.$transaction([
      this.prisma.customer.findMany({
        skip,
        take: limit,
        include: { user: true },
      }),
      this.prisma.customer.count(),
    ]);

    return { customers, total, page, limit };
  }

  async getAnalytics() {
    const [totalOrders, completedOrders, totalRevenue] = await this.prisma.$transaction([
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: 'DELIVERED' } }),
      this.prisma.order.aggregate({ _sum: { finalAmount: true } }),
    ]);

    return {
      totalOrders,
      completedOrders,
      totalRevenue: totalRevenue._sum.finalAmount || 0,
    };
  }

  async getAuditLogs(query: { entity?: string; entityId?: string; limit?: string } = {}) {
    const limitNum = parseInt(query.limit || '50', 10);

    const where: any = {};
    if (query.entity) {
      where.entity = query.entity;
    }
    if (query.entityId) {
      where.entityId = query.entityId;
    }

    return this.prisma.auditLog.findMany({
      where,
      take: limitNum,
      orderBy: { createdAt: 'desc' },
    });
  }
}