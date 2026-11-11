/*
 * FreshRoute Backend - Order Controller
 *
 * HTTP endpoints for order lifecycle management:
 * - POST /api/orders - Create order with pricing validation
 * - GET /api/orders/:id - Get order details
 * - GET /api/orders - List orders (with filters)
 * - POST /api/orders/:id/cancel - Cancel order
 * - POST /api/orders/:id/status - Update order status (authorized roles)
 * - GET /api/orders/:id/tracking - Get order tracking info
 */

import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createOrder(@Request() req: any, @Body() dto: CreateOrderDto) {
    return this.orderService.createOrder(req.user?.id, dto);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getOrder(@Param('id') id: string, @Request() req: any) {
    const order = await this.orderService.findOrder(id, req.user?.id, req.user?.role);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  @Get()
  @UseGuards(AuthGuard)
  async listOrders(@Request() req: any, @Query() query: { status?: string; page?: string; limit?: string }) {
    return this.orderService.listOrders(req.user?.id, req.user?.role, query);
  }

  @Post(':id/cancel')
  @UseGuards(AuthGuard)
  async cancelOrder(@Param('id') id: string, @Request() req: any) {
    return this.orderService.cancelOrder(id, req.user?.id, req.user?.role);
  }

  @Post(':id/status')
  @UseGuards(AuthGuard)
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
    @Request() req: any,
  ) {
    return this.orderService.updateStatus(id, dto.status, req.user?.id, req.user?.role);
  }
}