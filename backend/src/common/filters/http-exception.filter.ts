/*
 * FreshRoute Backend - Common Filters & Exception Handling
 *
 * Global exception filter that maps NestJS exceptions to structured error responses.
 */

import { Catch, ExceptionFilter, HttpException, HttpStatus, ArgumentsHost, Logger } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const now = Date.now();

    // Map exception to HTTP status
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorResponse: any = {
      statusCode: 500,
      message: 'Internal server error',
      timestamp: new Date().toISOString(),
      path: request.originalUrl,
      requestId: request.headers['x-request-id'],
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      errorResponse = {
        ...errorResponse,
        statusCode: status,
        message: typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || 'HTTP Error',
        error: typeof exceptionResponse === 'string'
          ? 'Bad Request'
          : (exceptionResponse as any).error,
      };
    } else if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack, 'ExceptionFilter');
      errorResponse.message = exception.message;
    }

    errorResponse.timestamp = new Date().toISOString();
    errorResponse.path = request.originalUrl;
    errorResponse.requestId = request.headers['x-request-id'];

    // Log the error
    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.originalUrl} - ${status}`,
        errorResponse.message,
      );
    }

    // Set error headers
    response
      .status(status)
      .header('Content-Type', 'application/json')
      .header('X-Content-Type-Options', 'nosniff')
      .json(errorResponse);
  }
}