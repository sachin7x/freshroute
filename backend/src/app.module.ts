/*
 * FreshRoute Backend - App Module
 *
 * Root module that registers all domain modules.
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// Core modules
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './auth/auth.module';

// Domain modules
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { PricingModule } from './pricing/pricing.module';
import { SchedulingModule } from './scheduling/scheduling.module';
import { ValetModule } from './valet/valet.module';
import { PartnerModule } from './partner/partner.module';
import { PaymentModule } from './payment/payment.module';
import { NotificationModule } from './notification/notification.module';
import { TrackingModule } from './tracking/tracking.module';
import { AdminModule } from './admin/admin.module';
import { AuditModule } from './audit/audit.module';
import { SubscriptionModule } from './subscription/subscription.module';

// Common
import { AuthGuard } from './common/guards/auth.guard';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 10,
      },
      {
        name: 'medium',
        ttl: 60000,
        limit: 100,
      },
      {
        name: 'long',
        ttl: 3600000,
        limit: 1000,
      },
    ]),
    PrismaModule,
    AuthModule,
    UserModule,
    OrderModule,
    PricingModule,
    SchedulingModule,
    ValetModule,
    PartnerModule,
    PaymentModule,
    NotificationModule,
    TrackingModule,
    AdminModule,
    AuditModule,
    SubscriptionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
