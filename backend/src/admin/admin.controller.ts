/*
 * FreshRoute Backend - Admin Controller
 *
 * HTTP endpoints for administrative operations:
 * - GET /api/admin/orders - List all orders
 * - GET /api/admin/customers - List all customers
 * - GET /api/admin/analytics - Operational analytics
 * - GET /api/admin/audit-logs - Audit history
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('orders')
  @UseGuards(AuthGuard)
  async listAllOrders(@Query() query: { status?: string; page?: string; limit?: string }) {
    return this.adminService.listAllOrders(query);
  }

  @Get('customers')
  @UseGuards(AuthGuard)
  async listAllCustomers(@Query() query: { page?: string; limit?: string }) {
    return this.adminService.listAllCustomers(query);
  }

  @Get('analytics')
  @UseGuards(AuthGuard)
  async getAnalytics() {
    return this.adminService.getAnalytics();
  }

  @Get('audit-logs')
  @UseGuards(AuthGuard)
  async getAuditLogs(@Query() query: { entity?: string; entityId?: string; limit?: string }) {
    return this.adminService.getAuditLogs(query);
  }
}