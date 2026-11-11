/*
 * FreshRoute Backend - Payment Module
 *
 * Razorpay integration with webhook verification and idempotency:
 * - Order creation (Razorpay test mode)
 * - Payment verification via signature
 * - Webhook idempotency
 * - Refunds
 */

import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PrismaModule } from '../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}