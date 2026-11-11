/*
 * FreshRoute Backend - Tracking Module
 *
 * Real-time order tracking via Socket.IO:
 * - Authenticated subscriptions per customer
 * - Event broadcasting (order status changes)
 */

import { Module } from '@nestjs/common';
import { TrackingController } from './tracking.controller';
import { TrackingService } from './tracking.service';
import { PrismaModule } from '../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TrackingController],
  providers: [TrackingService],
  exports: [TrackingService],
})
export class TrackingModule {}