import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ApiMetadataDto {
  @ApiPropertyOptional({
    description: 'Response timestamp',
    example: '2024-08-16T10:30:00.000Z',
  })
  @IsOptional()
  @IsString()
  timestamp?: string;

  @ApiPropertyOptional({
    description: 'Request tracking ID',
    example: 'req-12345-abcde',
  })
  @IsOptional()
  @IsString()
  requestId?: string;

  @ApiPropertyOptional({
    description: 'API version',
    example: 'v1.0.0',
  })
  @IsOptional()
  @IsString()
  version?: string;

  @ApiPropertyOptional({
    description: 'Request execution time in milliseconds',
    example: 150,
  })
  @IsOptional()
  executionTime?: number;
}

export class StandardResponseDto<T> {
  @ApiProperty({
    description: 'Indicates if the operation was successful',
    example: true,
  })
  @IsBoolean()
  success: boolean;

  @ApiProperty({
    description: 'Response data payload',
  })
  data: T;

  @ApiProperty({
    description: 'Array of messages related to the operation',
    type: [String],
    example: ['Operation completed successfully'],
  })
  @IsArray()
  @IsString({ each: true })
  messages: string[];

  @ApiPropertyOptional({
    description: 'Additional metadata about the response',
    type: ApiMetadataDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ApiMetadataDto)
  metadata?: ApiMetadataDto;

  constructor(
    data: T,
    messages: string[] = [],
    success: boolean = true,
    metadata?: ApiMetadataDto,
  ) {
    this.success = success;
    this.data = data;
    this.messages = messages;
    this.metadata = metadata;
  }
}

export class ApiErrorDto {
  @ApiProperty({
    description: 'Error code identifier',
    example: 'VALIDATION_ERROR',
  })
  @IsString()
  code: string;

  @ApiProperty({
    description: 'Human-readable error message',
    example: 'Validation failed for the provided data',
  })
  @IsString()
  message: string;

  @ApiPropertyOptional({
    description: 'Additional error details',
    example: { field: 'email', constraint: 'isEmail' },
  })
  @IsOptional()
  details?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'Stack trace (only in development)',
  })
  @IsOptional()
  @IsString()
  stackTrace?: string;
}

export class ValidationFieldErrorDto {
  @ApiProperty({
    description: 'Field name that failed validation',
    example: 'email',
  })
  @IsString()
  field: string;

  @ApiProperty({
    description: 'Validation error message',
    example: 'Email must be a valid email address',
  })
  @IsString()
  message: string;

  @ApiPropertyOptional({
    description: 'Value that failed validation',
    example: 'invalid-email',
  })
  @IsOptional()
  value?: unknown;

  @ApiPropertyOptional({
    description: 'List of validation constraints',
    type: [String],
    example: ['isEmail'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  constraints?: string[];
}

export class ValidationErrorDto extends ApiErrorDto {
  @ApiProperty({
    description: 'Error code for validation errors',
    example: 'VALIDATION_ERROR',
    default: 'VALIDATION_ERROR',
  })
  declare code: 'VALIDATION_ERROR';

  @ApiProperty({
    description: 'Array of field validation errors',
    type: [ValidationFieldErrorDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ValidationFieldErrorDto)
  validationErrors: ValidationFieldErrorDto[];
}

export class ErrorResponseDto extends StandardResponseDto<null> {
  @ApiProperty({
    description: 'Indicates the operation failed',
    example: false,
    default: false,
  })
  declare success: false;

  @ApiProperty({
    description: 'Always null for error responses',
    example: null,
    default: null,
  })
  declare data: null;

  @ApiProperty({
    description: 'Error information',
    type: ApiErrorDto,
  })
  @ValidateNested()
  @Type(() => ApiErrorDto)
  error: ApiErrorDto;

  constructor(
    error: ApiErrorDto,
    messages: string[] = [],
    metadata?: ApiMetadataDto,
  ) {
    super(null, messages, false, metadata);
    this.error = error;
  }
}

export class ValidationErrorResponseDto extends ErrorResponseDto {
  @ApiProperty({
    description: 'Validation error information',
    type: ValidationErrorDto,
  })
  @ValidateNested()
  @Type(() => ValidationErrorDto)
  declare error: ValidationErrorDto;

  constructor(
    validationError: ValidationErrorDto,
    messages: string[] = [],
    metadata?: ApiMetadataDto,
  ) {
    super(validationError, messages, metadata);
  }
}

export class PaginationInfoDto {
  @ApiProperty({
    description: 'Current page number',
    example: 1,
    minimum: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of items',
    example: 100,
    minimum: 0,
  })
  total: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 10,
    minimum: 0,
  })
  totalPages: number;

  @ApiProperty({
    description: 'Whether there is a next page',
    example: true,
  })
  hasNext: boolean;

  @ApiProperty({
    description: 'Whether there is a previous page',
    example: false,
  })
  hasPrevious: boolean;
}

export class PaginatedDataDto<T> {
  @ApiProperty({
    description: 'Array of items for the current page',
    isArray: true,
  })
  items: T[];

  @ApiProperty({
    description: 'Pagination information',
    type: PaginationInfoDto,
  })
  @ValidateNested()
  @Type(() => PaginationInfoDto)
  pagination: PaginationInfoDto;

  constructor(items: T[], total: number, limit: number, page: number) {
    const totalPages = Math.ceil(total / limit);
    this.items = items;
    this.pagination = {
      hasNext: page < totalPages,
      hasPrevious: page > 1,
      page,
      limit,
      total,
      totalPages,
    };
  }
}

export class PaginatedResponseDto<T> extends StandardResponseDto<
  PaginatedDataDto<T>
> {
  @ApiProperty({
    description: 'Paginated data with items and pagination info',
  })
  declare data: PaginatedDataDto<T>;

  constructor(
    items: T[],
    pagination: PaginationInfoDto,
    messages: string[] = [],
    metadata?: ApiMetadataDto,
  ) {
    const paginatedData = new PaginatedDataDto(
      items,
      pagination.total,
      pagination.limit,
      pagination.page,
    );
    super(paginatedData, messages, true, metadata);
  }
}
