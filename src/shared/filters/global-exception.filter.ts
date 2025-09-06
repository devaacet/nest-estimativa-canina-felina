import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ValidationError } from 'class-validator';
import { QueryFailedError } from 'typeorm';
import { ResponseBuilder } from '../utils';
import {
  ErrorResponseDto,
  ValidationErrorResponseDto,
  ValidationFieldErrorDto,
} from '../dto';
import { MESSAGES } from '../constants/messages';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const startTime = Date.now();
    const metadata = ResponseBuilder.createMetadata(
      request.headers['x-request-id'] as string,
      Date.now() - startTime,
    );

    let errorResponse: ErrorResponseDto | ValidationErrorResponseDto;
    let httpStatus: HttpStatus;

    // Handle different types of exceptions
    if (exception instanceof HttpException) {
      errorResponse = this.handleHttpException(exception, metadata);
      httpStatus = exception.getStatus();
    } else if (exception instanceof QueryFailedError) {
      errorResponse = this.handleDatabaseException(exception, metadata);
      httpStatus = HttpStatus.BAD_REQUEST;
    } else if (this.isValidationError(exception)) {
      errorResponse = this.handleValidationException(
        exception as any,
        metadata,
      );
      httpStatus = HttpStatus.BAD_REQUEST;
    } else {
      errorResponse = this.handleGenericException(exception, metadata);
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    // Log the error
    this.logError(exception, request, httpStatus);

    // Send the standardized error response
    response.status(httpStatus).json(errorResponse);
  }

  /**
   * Handle HTTP exceptions (BadRequestException, NotFoundException, etc.)
   */
  private handleHttpException(
    exception: HttpException,
    metadata: any,
  ): ErrorResponseDto | ValidationErrorResponseDto {
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Handle validation errors from NestJS validation pipe
    if (
      status === HttpStatus.BAD_REQUEST &&
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'message' in exceptionResponse &&
      Array.isArray((exceptionResponse as any).message)
    ) {
      return this.handleNestJSValidationError(
        exceptionResponse as any,
        metadata,
      );
    }

    // Handle regular HTTP exceptions
    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as any)?.message || exception.message;

    const errorCode = this.getErrorCodeFromStatus(status);

    return ResponseBuilder.error(
      errorCode,
      message,
      this.getErrorDetails(exceptionResponse),
      [message],
      metadata,
    );
  }

  /**
   * Handle NestJS validation pipe errors
   */
  private handleNestJSValidationError(
    exceptionResponse: any,
    metadata: any,
  ): ValidationErrorResponseDto {
    const validationErrors: ValidationFieldErrorDto[] = [];

    if (Array.isArray(exceptionResponse.message)) {
      for (const error of exceptionResponse.message) {
        if (typeof error === 'string') {
          // Simple string error message
          validationErrors.push({
            field: 'unknown',
            message: error,
            constraints: [],
          });
        } else if (typeof error === 'object' && error.property) {
          // Class-validator error object
          const constraints = error.constraints
            ? Object.keys(error.constraints)
            : [];
          const message = error.constraints
            ? Object.values(error.constraints).join(', ')
            : 'Validation failed';

          validationErrors.push({
            field: error.property,
            message: message,
            value: error.value,
            constraints,
          });
        }
      }
    }

    return ResponseBuilder.validationError(
      validationErrors,
      [MESSAGES.ERROR.VALIDATION_FAILED],
      metadata,
    );
  }

  /**
   * Handle database exceptions (TypeORM)
   */
  private handleDatabaseException(
    exception: QueryFailedError,
    metadata: any,
  ): ErrorResponseDto {
    let message: string = MESSAGES.ERROR.DATABASE_ERROR;
    let code = 'DATABASE_ERROR';
    const details: Record<string, unknown> = {
      query: exception.query,
      parameters: exception.parameters,
    };

    // Handle specific database errors
    if (exception.message.includes('duplicate key')) {
      message = MESSAGES.ERROR.DUPLICATE_ENTRY;
      code = 'DUPLICATE_ENTRY';
    } else if (exception.message.includes('foreign key constraint')) {
      message = MESSAGES.ERROR.FOREIGN_KEY_VIOLATION;
      code = 'FOREIGN_KEY_VIOLATION';
    } else if (exception.message.includes('not null constraint')) {
      message = MESSAGES.ERROR.NOT_NULL_VIOLATION;
      code = 'NOT_NULL_VIOLATION';
    }

    return ResponseBuilder.error(code, message, details, [message], metadata);
  }

  /**
   * Handle class-validator validation errors
   */
  private handleValidationException(
    exception: ValidationError[],
    metadata: any,
  ): ValidationErrorResponseDto {
    const validationErrors: ValidationFieldErrorDto[] = exception.map(
      (error) => ({
        field: error.property,
        message: error.constraints
          ? Object.values(error.constraints).join(', ')
          : MESSAGES.ERROR.VALIDATION_FAILED,
        value: error.value,
        constraints: error.constraints ? Object.keys(error.constraints) : [],
      }),
    );

    return ResponseBuilder.validationError(
      validationErrors,
      [MESSAGES.ERROR.VALIDATION_FAILED],
      metadata,
    );
  }

  /**
   * Handle generic/unknown exceptions
   */
  private handleGenericException(
    exception: unknown,
    metadata: any,
  ): ErrorResponseDto {
    const message =
      exception instanceof Error
        ? exception.message
        : MESSAGES.ERROR.INTERNAL_SERVER_ERROR;

    const details: Record<string, unknown> = {};

    // Add stack trace in development
    if (process.env.NODE_ENV === 'development' && exception instanceof Error) {
      details.stackTrace = exception.stack;
    }

    return ResponseBuilder.error(
      'INTERNAL_SERVER_ERROR',
      message,
      details,
      [message],
      metadata,
    );
  }

  /**
   * Check if exception is a validation error
   */
  private isValidationError(exception: unknown): boolean {
    return (
      Array.isArray(exception) &&
      exception.length > 0 &&
      exception[0] instanceof ValidationError
    );
  }

  /**
   * Get error code from HTTP status
   */
  private getErrorCodeFromStatus(status: HttpStatus): string {
    const statusDescription: Record<number, string> = {
      [HttpStatus.BAD_REQUEST]: 'BAD_REQUEST',
      [HttpStatus.UNAUTHORIZED]: 'UNAUTHORIZED',
      [HttpStatus.FORBIDDEN]: 'FORBIDDEN',
      [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
      [HttpStatus.CONFLICT]: 'CONFLICT',
      [HttpStatus.UNPROCESSABLE_ENTITY]: 'UNPROCESSABLE_ENTITY',
      [HttpStatus.TOO_MANY_REQUESTS]: 'TOO_MANY_REQUESTS',
      [HttpStatus.INTERNAL_SERVER_ERROR]: 'INTERNAL_SERVER_ERROR',
      [HttpStatus.BAD_GATEWAY]: 'BAD_GATEWAY',
      [HttpStatus.SERVICE_UNAVAILABLE]: 'SERVICE_UNAVAILABLE',
    };

    return statusDescription[status] ?? `HTTP_${status}`;
  }

  /**
   * Extract error details from exception response
   */
  private getErrorDetails(
    exceptionResponse: any,
  ): Record<string, unknown> | undefined {
    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const { message, error, ...details } = exceptionResponse;
      return Object.keys(details).length > 0 ? details : undefined;
    }
    return undefined;
  }

  /**
   * Log the error with appropriate level
   */
  private logError(
    exception: unknown,
    request: Request,
    httpStatus: number,
  ): void {
    const message =
      exception instanceof Error ? exception.message : 'Unknown error';
    const stack = exception instanceof Error ? exception.stack : undefined;

    const logContext = {
      url: request.url,
      method: request.method,
      userAgent: request.headers['user-agent'],
      ip: request.ip,
      requestId: request.headers['x-request-id'],
      httpStatus,
    };

    if (httpStatus >= 500) {
      this.logger.error(`${message}`, stack, JSON.stringify(logContext));
    } else if (httpStatus >= 400) {
      this.logger.warn(`${message}`, JSON.stringify(logContext));
    } else {
      this.logger.log(`${message}`, JSON.stringify(logContext));
    }
  }
}
