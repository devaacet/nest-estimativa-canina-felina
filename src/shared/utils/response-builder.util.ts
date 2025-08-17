import {
  ApiErrorDto,
  ApiMetadataDto,
  ErrorResponseDto,
  PaginatedResponseDto,
  PaginationInfoDto,
  StandardResponseDto,
  ValidationErrorDto,
  ValidationErrorResponseDto,
  ValidationFieldErrorDto,
} from '../dto';

export class ResponseBuilder {
  /**
   * Create a successful response
   */
  static success<T>(
    data: T,
    messages: string[] = ['Operation completed successfully'],
    metadata?: ApiMetadataDto,
  ): StandardResponseDto<T> {
    return new StandardResponseDto(data, messages, true, metadata);
  }

  /**
   * Create a successful response with custom message
   */
  static successWithMessage<T>(
    data: T,
    message: string,
    metadata?: ApiMetadataDto,
  ): StandardResponseDto<T> {
    return new StandardResponseDto(data, [message], true, metadata);
  }

  /**
   * Create an error response
   */
  static error(
    code: string,
    message: string,
    details?: Record<string, unknown>,
    messages: string[] = [],
    metadata?: ApiMetadataDto,
  ): ErrorResponseDto {
    const error: ApiErrorDto = {
      code,
      message,
      details,
    };

    return new ErrorResponseDto(error, messages, metadata);
  }

  /**
   * Create a validation error response
   */
  static validationError(
    validationErrors: ValidationFieldErrorDto[],
    messages: string[] = ['Validation failed'],
    metadata?: ApiMetadataDto,
  ): ValidationErrorResponseDto {
    const validationError: ValidationErrorDto = {
      code: 'VALIDATION_ERROR',
      message: 'One or more validation errors occurred',
      validationErrors,
    };

    return new ValidationErrorResponseDto(validationError, messages, metadata);
  }

  /**
   * Create a paginated response
   */
  static paginated<T>(
    items: T[],
    page: number,
    limit: number,
    total: number,
    messages: string[] = ['Data retrieved successfully'],
    metadata?: ApiMetadataDto,
  ): PaginatedResponseDto<T> {
    const totalPages = Math.ceil(total / limit);
    const pagination: PaginationInfoDto = {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    };

    return new PaginatedResponseDto(items, pagination, messages, metadata);
  }

  /**
   * Create metadata with current timestamp and request ID
   */
  static createMetadata(
    requestId?: string,
    executionTime?: number,
  ): ApiMetadataDto {
    return {
      timestamp: new Date().toISOString(),
      requestId,
      version: 'v1.0.0',
      executionTime,
    };
  }

  /**
   * Common error responses
   */
  static notFound(
    resource: string = 'Resource',
    id?: string,
    metadata?: ApiMetadataDto,
  ): ErrorResponseDto {
    const message = id
      ? `${resource} with ID '${id}' not found`
      : `${resource} not found`;

    return this.error(
      'NOT_FOUND',
      message,
      { resource, id },
      [message],
      metadata,
    );
  }

  static unauthorized(
    message: string = 'Access denied. Authentication required.',
    metadata?: ApiMetadataDto,
  ): ErrorResponseDto {
    return this.error('UNAUTHORIZED', message, undefined, [message], metadata);
  }

  static forbidden(
    message: string = 'Access denied. Insufficient permissions.',
    metadata?: ApiMetadataDto,
  ): ErrorResponseDto {
    return this.error('FORBIDDEN', message, undefined, [message], metadata);
  }

  static badRequest(
    message: string = 'Invalid request data.',
    details?: Record<string, unknown>,
    metadata?: ApiMetadataDto,
  ): ErrorResponseDto {
    return this.error('BAD_REQUEST', message, details, [message], metadata);
  }

  static internalServerError(
    message: string = 'An internal server error occurred.',
    details?: Record<string, unknown>,
    metadata?: ApiMetadataDto,
  ): ErrorResponseDto {
    return this.error(
      'INTERNAL_SERVER_ERROR',
      message,
      details,
      [message],
      metadata,
    );
  }

  /**
   * Convert validation errors from class-validator
   */
  static fromValidationErrors(
    validationErrors: any[],
    metadata?: ApiMetadataDto,
  ): ValidationErrorResponseDto {
    const fieldErrors: ValidationFieldErrorDto[] = validationErrors.map(
      (error) => ({
        field: error.property,
        message: Object.values(error.constraints || {}).join(', '),
        value: error.value,
        constraints: Object.keys(error.constraints || {}),
      }),
    );

    return this.validationError(fieldErrors, ['Validation failed'], metadata);
  }

  /**
   * Create empty success response (for operations like delete)
   */
  static empty(
    message: string = 'Operation completed successfully',
    metadata?: ApiMetadataDto,
  ): StandardResponseDto<null> {
    return new StandardResponseDto(null, [message], true, metadata);
  }

  /**
   * Create response for created resources
   */
  static created<T>(
    data: T,
    message: string = 'Resource created successfully',
    metadata?: ApiMetadataDto,
  ): StandardResponseDto<T> {
    return new StandardResponseDto(data, [message], true, metadata);
  }

  /**
   * Create response for updated resources
   */
  static updated<T>(
    data: T,
    message: string = 'Resource updated successfully',
    metadata?: ApiMetadataDto,
  ): StandardResponseDto<T> {
    return new StandardResponseDto(data, [message], true, metadata);
  }

  /**
   * Create response for deleted resources
   */
  static deleted(
    message: string = 'Resource deleted successfully',
    metadata?: ApiMetadataDto,
  ): StandardResponseDto<null> {
    return new StandardResponseDto(null, [message], true, metadata);
  }
}
