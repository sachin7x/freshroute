/*
 * FreshRoute Backend - User Controller
 *
 * HTTP endpoints for user management.
 */

import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  async getCurrentUser(@Request() req: any) {
    return this.userService.getProfile(req.user?.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getUser(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Post('customer')
  @UseGuards(AuthGuard)
  async createCustomerProfile(@Request() req: any, @Body() dto: CreateCustomerDto) {
    return this.userService.createCustomerProfile(req.user?.id, dto);
  }

  @Put('customer')
  @UseGuards(AuthGuard)
  async updateCustomerProfile(@Request() req: any, @Body() dto: UpdateCustomerDto) {
    return this.userService.updateCustomerProfile(req.user?.id, dto);
  }
}