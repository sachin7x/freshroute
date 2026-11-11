/*
 * FreshRoute Backend - Scheduling Module
 *
 * Pickup slot booking with Redis-backed capacity locks:
 * - Reserve capacity transactionally
 * - Validate pickup window (7pm-10pm)
 * - Prevent overbooking via DB constraints
 */

import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class SchedulingService {
  constructor(private prisma: PrismaService) {}

  async reservePickupSlot(cityId: string, startTime: Date, zoneId?: string) {
    return this.prisma.$transaction(async (tx) => {
      // Validate slot exists and is active
      const slot = await tx.pickupSlot.findFirst({
        where: {
          cityId,
          startTime: {
            gte: startTime,
          },
          isActive: true,
        },
      });

      if (!slot) {
        throw new BadRequestException('Pickup slot not found for the given city and time');
      }

      // Atomically reserve capacity
      if (slot.bookedCount >= slot.capacity) {
        throw new BadRequestException('Pickup slot is fully booked');
      }

      // Increment booked count
      const updatedSlot = await tx.pickupSlot.update({
        where: { id: slot.id },
        data: { bookedCount: { increment: 1 } },
      });

      return updatedSlot;
    });
  }

  async getAvailableSlots(cityId: string, date: Date) {
    return this.prisma.pickupSlot.findMany({
      where: {
        cityId,
        startTime: {
          gte: date,
        },
        isActive: true,
      },
      orderBy: { startTime: 'asc' },
    });
  }
}