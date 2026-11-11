/*
 * FreshRoute Backend - Tracking Controller
 */

import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('tracking')
export class TrackingController {
  constructor(private trackingService: TrackingService) {}

  @Get(':orderId')
  @UseGuards(AuthGuard)
  async getOrderTracking(@Param('orderId') orderId: string, @Request() req: any) {
    return this.trackingService.getOrderTracking(
      orderId,
      req.user?.id,
      req.user?.role,
    );
  }

  @Get(':orderId/history')
  @UseGuards(AuthGuard)
  async getOrderStatusHistory(@Param('orderId') orderId: string, @Request() req: any) {
    return this.trackingService.getOrderStatusHistory(
      orderId,
      req.user?.id,
      req.user?.role,
    );
  }
}
