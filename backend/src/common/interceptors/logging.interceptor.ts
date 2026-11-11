/*
 * FreshRoute Backend - Common Interceptors
 *
 * Global logging interceptor that captures request/response metadata for
 * audit purposes and request performance monitoring.
 */

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Logger, LoggerService } from '@nestjs/common';

@Injectable()
export class LoggingInterceptor implements NestInterceptor<unknown, unknown> {
  private logger: LoggerService;

  constructor() {
    this.logger = new Logger('HTTP');
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const now = Date.now();

    const { method, originalUrl, ip } = request;
    const userAgent = request.get('User-Agent') || 'unknown';

    return next.handle().pipe(
      tap((data) => {
        const responseTime = Date.now() - now;

        // Log request metadata
        this.logger.log(
          `${method} ${originalUrl} - ${response.statusCode} - ${responseTime}ms - ${ip} - ${userAgent}`,
          'HTTP Access',
        );

        // Attach requestId for distributed tracing if needed
        if (!response.headersSent) {
          response.setHeader('X-Request-Time', `${responseTime}ms`);
        }
      }),
    );
  }
}