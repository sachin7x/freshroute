/*
 * FreshRoute Backend - Partner Service
 *
 * Business logic for partner management:
 * - Partner onboarding and profile
 * - Facility assignment to cities/zones
 * - Order acceptance/rejection per partner
 */

import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class PartnerService {
  constructor(private prisma: PrismaService) {}

  async listPartners() {
    return this.prisma.partner.findMany({
      include: { PartnerFacility: true },
      where: { status: 'ACTIVE' },
    });
  }

  async findPartnerById(id: string) {
    const partner = await this.prisma.partner.findUnique({
      where: { id },
      include: { PartnerFacility: true },
    });

    if (!partner) {
      throw new BadRequestException('Partner not found');
    }

    return partner;
  }

  async createPartner(dto: { name: string; code: string; email: string; phone: string; addressId?: string }) {
    return this.prisma.partner.create({
      data: {
        name: dto.name,
        code: dto.code,
        email: dto.email,
        phone: dto.phone,
        addressId: dto.addressId,
      },
    });
  }
}