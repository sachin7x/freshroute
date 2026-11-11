/*
 * FreshRoute Backend - User Service
 *
 * Business logic for user management:
 * - Customer profile creation and retrieval
 * - Profile validation
 * - Role-aware profile access
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: true,
        Customer: true,
        Valet: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: (user as any).role?.name,
      status: user.status,
      customer: user.Customer
        ? {
            id: user.Customer.id,
            fullName: user.Customer.fullName,
            businessName: user.Customer.businessName,
            gstin: user.Customer.gstin,
          }
        : null,
    };
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async createCustomerProfile(userId: string, dto: { fullName?: string; businessName?: string; gstin?: string }) {
    const customer = await this.prisma.customer.create({
      data: {
        userId,
        fullName: dto.fullName || 'Customer',
        businessName: dto.businessName,
        gstin: dto.gstin,
      },
    });

    return { id: customer.id, fullName: customer.fullName, businessName: customer.businessName, gstin: customer.gstin };
  }

  async updateCustomerProfile(userId: string, dto: { fullName?: string; businessName?: string; gstin?: string }) {
    return this.prisma.customer.update({
      where: { userId },
      data: {
        fullName: dto.fullName,
        businessName: dto.businessName,
        gstin: dto.gstin,
      },
    });
  }
}