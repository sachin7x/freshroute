/*
 * FreshRoute Backend - Admin Module
 *
 * Administrative operations:
 * - Admin authentication and role-based permissions
 * - Orders management
 * - Pricing configuration
 * - Serviceability management
 * - Customer lookup
 * - Payment records and refunds
 * - Operational analytics
 * - Audit history
 */

import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PrismaModule } from '../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}