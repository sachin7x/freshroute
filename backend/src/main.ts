/*
 * FreshRoute Backend - Main Application Entry Point
 *
 * orchestrates all NestJS modules, database connection, and infrastructure services.
 *
 * Order of module registration matters:
 * 1. Core infrastructure (Config, Logger, Validation)
 * 2. Cross-cutting concerns (Auth, Error Handling, Swagger)
 * 3. Domain modules (User, Order, Pricing, Scheduling, Valet, Partner, Admin)
 * 4. External integrations (Razorpay, SMS, WhatsApp, Maps)
 */

import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'dotenv';
import { Logger, VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

config({ path: '.env' });

async function bootstrap() {
  const port = process.env.PORT || 3001;
  const nodeEnv = process.env.NODE_ENV || 'development';

  const app = await NestFactory.create(AppModule, {
    logger: nodeEnv === 'production' ? ['error', 'warn', 'log'] : ['error', 'warn', 'log', 'debug', 'verbose'],
    cors: {
      origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:3001'],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      credentials: true,
      maxAge: 86400,
    },
  });

  // Global validation pipe - use class-validator and class-transformer
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      errorHttpStatusCode: 400,
    }),
  );

  // Global rate limiting
  const limiter = rateLimit({
    windowMs: 1000, // 1 second
    max: 10, // 10 requests per second per IP
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(limiter);

  // Security headers via Helmet
  app.use(helmet());

  // API versioning
  app.setGlobalPrefix('api');

  // Versioning by path
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1'],
  });

  // Swagger/OpenAPI documentation
  const configSwagger = new DocumentBuilder()
    .setTitle('FreshRoute API')
    .setDescription('Laundry commerce platform API for India - Rinse.com clone')
    .setVersion('1.0')
    .addTag('auth', 'Authentication and authorization')
    .addTag('orders', 'Order lifecycle management')
    .addTag('pricing', 'Pricing and service catalog')
    .addTag('scheduling', 'Pickup slot booking')
    .addTag('valet', 'Valet dispatch and tracking')
    .addTag('partner', 'Partner/laundry facility management')
    .addTag('admin', 'Administrative operations')
    .addTag('notifications', 'Email/SMS/WhatsApp/Push notifications')
    .addTag('tracking', 'Order tracking and real-time updates')
    .addTag('payments', 'Razorpay and payment processing')
    .addTag('partner-management', 'Partner onboarding and operations')
    .addTag('subscription', 'FreshPass subscription management')
    .addTag('audit', 'Audit logging and operational reporting')
    .addServer('http://localhost:3001', 'Local development')
    .addServer('http://api.freshroute.in', 'Production')
    .build();

  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api/docs', app, document);

  // Global error handler - log to structured logger
  // app.useGlobalFilters(new (await import('./common/filters/http-exception.filter').HttpExceptionFilter));

  // Global exception filter for unhandled rejections
  process.on('unhandledRejection', (reason: any) => {
    Logger.error('Unhandled Rejection at: %s', reason?.stack || reason);
  });

  // Graceful shutdown
  const gracefulShutdown = async (signal: string) => {
    Logger.log(`Received ${signal}. Starting graceful shutdown...`);
    await app.close();
    process.exit(0);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  // Root redirect to Swagger docs and landing
  const server = app.getHttpAdapter().getInstance();
  server.get('/', (req: any, res: any) => {
    res.redirect('/api/docs');
  });

  await app.listen(port);

  Logger.log(
    `🚀 FreshRoute API running on http://0.0.0.0:${port}`,
    'NestFactory',
  );
  Logger.log(
    `📄 Swagger documentation available at http://localhost:${port}/api/docs`,
    'NestFactory',
  );
}

bootstrap().catch((err) => {
  console.error('❌ Failed to bootstrap application:', err);
  process.exit(1);
});