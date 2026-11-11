/*
 * FreshRoute Backend - Pricing Controller
 *
 * HTTP endpoints for configurable pricing:
 * - GET /api/v1/pricing/rules - List pricing rules
 * - GET /api/v1/pricing/rules/:serviceId/:cityId - Get active pricing rule
 */

import {
  Controller,
  Get,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PricingService } from './pricing.service';
import { Public } from '../common/decorators/public.decorator';

@Controller('pricing')
export class PricingController {
  constructor(private pricingService: PricingService) {}

  @Public()
  @Get('rules')
  async listPricingRules(@Query('cityId') cityId?: string, @Query('serviceCode') serviceCode?: string) {
    return this.pricingService.listRules(cityId, serviceCode);
  }

  @Public()
  @Get('rules/:serviceId/:cityId')
  async getPricingRule(@Param('serviceId') serviceId: string, @Param('cityId') cityId: string) {
    return this.pricingService.getRule(serviceId, cityId);
  }
}
