/*
 * FreshRoute Backend - Prisma Service
 *
 * Wraps the Prisma client with useful helpers for the FreshRoute domain.
 */

import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  // Convenience helpers for FreshRoute business operations

  async findCityByCode(code: string) {
    return this.city.findUnique({ where: { code } });
  }

  async findCityByName(name: string) {
    return this.city.findUnique({ where: { name } });
  }

  async findAllCities() {
    return this.city.findMany();
  }

  async findServiceZone(zoneCode: string) {
    return this.serviceZone.findUnique({ where: { code: zoneCode } });
  }

  async findUserByEmail(email: string) {
    return this.user.findUnique({
      where: { email },
      include: { role: true, Customer: true },
    });
  }

  async findUserByPhone(phone: string) {
    return this.user.findUnique({
      where: { phone },
      include: { role: true, Customer: true },
    });
  }

  async findUserById(id: string) {
    return this.user.findUnique({
      where: { id },
      include: { role: true, Customer: true },
    });
  }

  async findActiveUserByEmail(email: string) {
    return this.user.findFirst({
      where: { email, status: 'ACTIVE' },
      include: { role: true, Customer: true },
    });
  }

  async findOrderByNumber(orderNumber: string) {
    return this.order.findFirst({ where: { orderNumber } });
  }

  async findOrderById(id: string) {
    return this.order.findUnique({ where: { id } });
  }

  async findOrdersByCustomerId(customerId: string, status?: string) {
    const where: any = customerId ? { customerId } : {};
    if (status) {
      where.status = status as any;
    }
    return this.order.findMany({ where });
  }

  async findSubscriptionByCustomerId(customerId: string) {
    return this.customerSubscription.findUnique({
      where: { customerId },
    });
  }

  async findPartnerByCode(code: string) {
    return this.partner.findUnique({ where: { code } });
  }

  async findValetById(id: string) {
    return this.valet.findUnique({ where: { id } });
  }

  async findPricingRule(ruleId: string) {
    return this.pricingRule.findUnique({ where: { id: ruleId } });
  }

  async findActivePricingRules(cityId: string, serviceId?: string) {
    const where: any = { cityId, isActive: true };
    if (serviceId) {
      where.serviceId = serviceId;
    }
    return this.pricingRule.findMany({ where });
  }

  async findLaundryService(code: string) {
    return this.laundryService.findUnique({ where: { code } });
  }

  async createAuditLog(data: {
    entity: string;
    entityId: string;
    action: string;
    changes?: any;
    performedBy?: string;
    ipAddress?: string;
  }) {
    return this.auditLog.create({
      data: {
        entity: data.entity,
        entityId: data.entityId,
        action: data.action,
        changes: data.changes,
        performedBy: data.performedBy || 'system',
        ipAddress: data.ipAddress,
      },
    });
  }
}