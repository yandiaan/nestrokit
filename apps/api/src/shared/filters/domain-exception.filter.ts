/**
 * Domain Exception Filter
 *
 * Catches DomainError exceptions and transforms them to HTTP responses.
 * Maps error codes to appropriate HTTP status codes.
 */

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import { DomainError, isDomainError } from '@repo/core/errors';

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details: Record<string, unknown> | undefined;
    timestamp: string;
  };
}

@Catch()
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DomainExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status: number;
    let errorResponse: ErrorResponse;

    // Handle DomainError
    if (isDomainError(exception)) {
      const domainError = exception as DomainError;
      status = domainError.httpStatus;
      errorResponse = {
        success: false,
        error: {
          code: domainError.code,
          message: domainError.message,
          details: domainError.details,
          timestamp: domainError.timestamp.toISOString(),
        },
      };

      // Log operational errors as warnings, others as errors
      if (domainError.isOperational) {
        this.logger.warn(
          `[${request.method}] ${request.url} - ${domainError.code}: ${domainError.message}`,
        );
      } else {
        this.logger.error(
          `[${request.method}] ${request.url} - ${domainError.code}: ${domainError.message}`,
          domainError.stack,
        );
      }
    }
    // Handle NestJS HttpException
    else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      const details =
        typeof exceptionResponse === 'object'
          ? (exceptionResponse as Record<string, unknown>)
          : undefined;

      errorResponse = {
        success: false,
        error: {
          code: HttpStatus[status] || 'HTTP_ERROR',
          message:
            typeof exceptionResponse === 'string'
              ? exceptionResponse
              : (exceptionResponse as { message?: string }).message ||
                exception.message,
          details,
          timestamp: new Date().toISOString(),
        },
      };

      this.logger.warn(
        `[${request.method}] ${request.url} - ${status}: ${errorResponse.error.message}`,
      );
    }
    // Handle unknown errors
    else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      const message =
        exception instanceof Error ? exception.message : 'Internal server error';

      errorResponse = {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message:
            process.env.NODE_ENV === 'production'
              ? 'Internal server error'
              : message,
          details: undefined,
          timestamp: new Date().toISOString(),
        },
      };

      this.logger.error(
        `[${request.method}] ${request.url} - Unhandled exception`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(status).json(errorResponse);
  }
}
