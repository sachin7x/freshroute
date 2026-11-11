/*
 * FreshRoute Backend - Notification Module
 *
 * Provider abstractions for:
 * - Email (e.g. SendGrid, AWS SES)
 * - SMS (e.g. Twilio)
 * - WhatsApp (e.g. Interakt, Gupshup)
 * - Push (Firebase Cloud Messaging)
 */

import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { PrismaModule } from '../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}