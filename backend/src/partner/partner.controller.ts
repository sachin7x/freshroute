/*
 * FreshRoute Backend - Partner Controller
 */

import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { PartnerService } from './partner.service';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('partners')
export class PartnerController {
  constructor(private partnerService: PartnerService) {}

  @Get()
  @UseGuards(AuthGuard)
  async listPartners() {
    return this.partnerService.listPartners();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getPartner(@Param('id') id: string) {
    return this.partnerService.findPartnerById(id);
  }
}