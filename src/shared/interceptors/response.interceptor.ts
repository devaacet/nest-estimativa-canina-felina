/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';
import { ApiMetadataDto, StandardResponseDto } from '../dto';
import { ResponseBuilder } from '../utils';
import { MESSAGES } from '../constants/messages';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((data) => {
        const executionTime = Date.now() - startTime;

        // Skip transformation if response is already in standard format
        if (this.isStandardResponse(data)) {
          this.addMetadataIfMissing(data, request, executionTime);
          return data;
        }

        // Skip transformation for specific response types that shouldn't be wrapped
        if (this.shouldSkipTransformation(data, response)) {
          return data;
        }

        // Transform raw data into standard response format
        return this.transformToStandardResponse(data, request, executionTime);
      }),
    );
  }

  /**
   * Check if the response is already in standard format
   */
  private isStandardResponse(data: any): boolean {
    return (
      data &&
      typeof data === 'object' &&
      typeof data.success === 'boolean' &&
      data.hasOwnProperty('data') &&
      Array.isArray(data.messages)
    );
  }

  /**
   * Check if response transformation should be skipped
   */
  private shouldSkipTransformation(data: any, response: Response): boolean {
    // Skip for file downloads, streams, etc.
    const contentType = response.getHeader('content-type');

    if (typeof contentType === 'string') {
      // Skip for non-JSON responses
      if (
        contentType.includes('application/octet-stream') ||
        contentType.includes('text/html') ||
        contentType.includes('text/plain') ||
        contentType.includes('image/') ||
        contentType.includes('application/pdf')
      ) {
        return true;
      }
    }

    // Skip for null/undefined responses (like 204 No Content)
    if (data === null || data === undefined) {
      return true;
    }

    // Skip for primitive types (strings, numbers, booleans) that might be intentional
    if (typeof data !== 'object') {
      return false; // Actually, we want to wrap primitives too
    }

    return false;
  }

  /**
   * Transform raw data into standard response format
   */
  private transformToStandardResponse(
    data: any,
    request: any,
    executionTime: number,
  ): StandardResponseDto<any> {
    const metadata = this.createMetadata(request, executionTime);

    // Handle different data types
    if (data === null || data === undefined) {
      return ResponseBuilder.success(
        null,
        [MESSAGES.SUCCESS.OPERATION_COMPLETED],
        metadata,
      );
    }

    // Check if it's a legacy response format that needs conversion
    if (this.isLegacyResponse(data)) {
      return this.convertLegacyResponse(data, metadata);
    }

    // For regular data, wrap it in success response
    return ResponseBuilder.success(
      data,
      [MESSAGES.SUCCESS.DATA_RETRIEVED],
      metadata,
    );
  }

  /**
   * Check if response is in legacy format
   */
  private isLegacyResponse(data: any): boolean {
    return (
      data &&
      typeof data === 'object' &&
      typeof data.success === 'boolean' &&
      data.hasOwnProperty('data') &&
      !Array.isArray(data.messages) // Legacy has message or error, not messages array
    );
  }

  /**
   * Convert legacy response to standard format
   */
  private convertLegacyResponse(
    data: any,
    metadata: ApiMetadataDto,
  ): StandardResponseDto<any> {
    const messages: string[] = [];

    if (data.message) {
      messages.push(data.message);
    }

    if (data.error) {
      messages.push(data.error);
    }

    if (messages.length === 0) {
      messages.push(
        data.success ? MESSAGES.SUCCESS.OPERATION_COMPLETED : MESSAGES.ERROR.OPERATION_FAILED,
      );
    }

    return new StandardResponseDto(data.data, messages, data.success, metadata);
  }

  /**
   * Add metadata to existing standard response if missing
   */
  private addMetadataIfMissing(
    data: any,
    request: any,
    executionTime: number,
  ): void {
    if (!data.metadata) {
      data.metadata = this.createMetadata(request, executionTime);
    } else {
      // Update execution time if not set
      if (!data.metadata.executionTime) {
        data.metadata.executionTime = executionTime;
      }
      // Add timestamp if not set
      if (!data.metadata.timestamp) {
        data.metadata.timestamp = new Date().toISOString();
      }
    }
  }

  /**
   * Create metadata for the response
   */
  private createMetadata(request: any, executionTime: number): ApiMetadataDto {
    return {
      timestamp: new Date().toISOString(),
      requestId: request.headers['x-request-id'] || this.generateRequestId(),
      version: 'v1.0.0',
      executionTime,
    };
  }

  /**
   * Generate a simple request ID if none exists
   */
  private generateRequestId(): string {
    return `req-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  }
}
