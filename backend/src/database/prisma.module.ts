/*
 * FreshRoute Backend - Prisma Database Module
 *
 * Provides Prisma client access to all NestJS modules.
 * Uses a global singleton client with proper lifecycle management.
 */

import { Module, Global, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule implements OnModuleInit, OnModuleDestroy {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.prisma.$connect();
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }
}