/*
 * FreshRoute Backend - Subscription Controller
 *
 * HTTP endpoints for FreshPass subscription management:
 * - GET /api/subscriptions/me - Get current subscription
 * - POST /api/subscriptions - Create subscription
 * - POST /api/subscriptions/cancel - Cancel subscription
 */

import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  async getSubscription(@Request() req: any) {
    return this.subscriptionService.getSubscription(req.user?.id);
  }

  @Post()
  @UseGuards(AuthGuard)
  async createSubscription(@Request() req: any, @Body() body: { planType?: string }) {
    return this.subscriptionService.createSubscription(req.user?.id, body);
  }

  @Post('cancel')
  @UseGuards(AuthGuard)
  async cancelSubscription(@Request() req: any) {
    return this.subscriptionService.cancelSubscription(req.user?.id);
  }
}
