/*
 * FreshRoute Backend - Pricing Service
 *
 * Business logic for configurable pricing:
 * - Look up active pricing rule by service + city
 * - Compute order totals server-side
 */

import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class PricingService {
  constructor(private prisma: PrismaService) {}

  async findPricingRule(serviceId: string, cityId: string) {
    const rule = await this.prisma.pricingRule.findFirst({
      where: {
        serviceId,
        cityId,
        isActive: true,
        OR: [{ effectiveTo: null }, { effectiveTo: { gt: new Date() } }],
      },
      include: { city: true, laundryService: true },
    });

    if (!rule) {
      throw new BadRequestException('No active pricing rule for this service in this city');
    }

    return rule;
  }

  async calculateQuote(serviceId: string, cityId: string, quantity: number) {
    const rule = await this.findPricingRule(serviceId, cityId);
    const total = quantity * (rule.pricePerUnit + rule.cityAdjustment);
    return {
      pricePerUnit: rule.pricePerUnit,
      cityAdjustment: rule.cityAdjustment,
      effectiveUnitPrice: rule.pricePerUnit + rule.cityAdjustment,
      quantity,
      totalAmount: total,
      currency: 'INR',
      minQuantity: rule.minQuantity,
    };
  }

  async listRules(cityId?: string, serviceCode?: string) {
    const where: any = { isActive: true };
    if (cityId) where.cityId = cityId;
    return this.prisma.pricingRule.findMany({
      where,
      include: { city: true, laundryService: true },
    });
  }

  async getRule(serviceId: string, cityId: string) {
    return this.findPricingRule(serviceId, cityId);
  }
}