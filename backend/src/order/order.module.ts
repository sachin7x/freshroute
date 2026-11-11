/*
 * FreshRoute Backend - Order Module
 *
 * Complete order lifecycle with Prisma persistence:
 * - Order creation with pricing snapshot
 * - Status state machine with validation
 * - QR bag generation
 * - Audit history
 */

import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PrismaModule } from '../database/prisma.module';
import { PricingModule } from '../pricing/pricing.module';
import { SchedulingModule } from '../scheduling/scheduling.module';

@Module({
  imports: [PrismaModule, PricingModule, SchedulingModule],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}