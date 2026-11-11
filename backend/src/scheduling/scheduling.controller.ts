/*
 * FreshRoute Backend - Scheduling Controller
 */

import { Controller, Get, Post, Body, Query, BadRequestException, UseGuards } from '@nestjs/common';
import { SchedulingService } from './scheduling.service';
import { Public } from '../common/decorators/public.decorator';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('scheduling')
export class SchedulingController {
  constructor(private schedulingService: SchedulingService) {}

  @Public()
  @Get('slots')
  async getAvailableSlots(
    @Query('cityId') cityId: string,
    @Query('date') dateStr?: string,
  ) {
    if (!cityId) {
      throw new BadRequestException('cityId is required');
    }
    const date = dateStr ? new Date(dateStr) : new Date();
    return this.schedulingService.getAvailableSlots(cityId, date);
  }

  @Post('reserve')
  @UseGuards(AuthGuard)
  async reservePickupSlot(
    @Body() body: { cityId: string; startTime: string; zoneId?: string },
  ) {
    if (!body.cityId || !body.startTime) {
      throw new BadRequestException('cityId and startTime are required');
    }
    return this.schedulingService.reservePickupSlot(
      body.cityId,
      new Date(body.startTime),
      body.zoneId,
    );
  }
}
