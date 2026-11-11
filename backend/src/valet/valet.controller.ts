/*
 * FreshRoute Backend - Valet Controller
 *
 * HTTP endpoints for valet dispatch and operations:
 * - POST /api/valets/assign - Assign valet to order
 * - POST /api/valets/pickup - Confirm order pickup
 * - POST /api/valets/delivery - Confirm order delivery
 */

import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { ValetService } from './valet.service';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('valets')
export class ValetController {
  constructor(private valetService: ValetService) {}

  @Post('assign')
  @UseGuards(AuthGuard)
  async assignValet(@Body() body: { orderId: string; valetId: string }) {
    if (!body.orderId || !body.valetId) {
      throw new BadRequestException('orderId and valetId are required');
    }
    return this.valetService.assignValet(body.orderId, body.valetId);
  }

  @Post('pickup')
  @UseGuards(AuthGuard)
  async confirmPickup(@Request() req: any, @Body() body: { orderId: string; valetId?: string }) {
    const valetId = body.valetId || req.user?.id;
    if (!body.orderId || !valetId) {
      throw new BadRequestException('orderId and valetId are required');
    }
    return this.valetService.confirmPickup(body.orderId, valetId);
  }

  @Post('delivery')
  @UseGuards(AuthGuard)
  async confirmDelivery(@Request() req: any, @Body() body: { orderId: string; valetId?: string }) {
    const valetId = body.valetId || req.user?.id;
    if (!body.orderId || !valetId) {
      throw new BadRequestException('orderId and valetId are required');
    }
    return this.valetService.confirmDelivery(body.orderId, valetId);
  }
}
