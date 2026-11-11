/*
 * FreshRoute Backend - Valet Module
 *
 * Valet dispatch and tracking:
 * - Valet profiles and availability
 * - Pickup/delivery assignment
 * - Status updates
 */

import { Module } from '@nestjs/common';
import { ValetController } from './valet.controller';
import { ValetService } from './valet.service';
import { PrismaModule } from '../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ValetController],
  providers: [ValetService],
  exports: [ValetService],
})
export class ValetModule {}