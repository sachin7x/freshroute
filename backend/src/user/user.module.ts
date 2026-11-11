/*
 * FreshRoute Backend - User Module
 *
 * User management with Prisma persistence:
 * - User CRUD operations
 * - Role-based profile retrieval
 * - Customer profile management
 */

import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from '../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}