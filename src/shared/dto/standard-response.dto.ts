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
    description: 'Timestamp da resposta',
    example: '2024-08-16T10:30:00.000Z',
  })
  @IsOptional()
  @IsString()
  timestamp?: string;

  @ApiPropertyOptional({
    description: 'ID de rastreamento da requisição',
    example: 'req-12345-abcde',
  })
  @IsOptional()
  @IsString()
  requestId?: string;

  @ApiPropertyOptional({
    description: 'Versão da API',
    example: 'v1.0.0',
  })
  @IsOptional()
  @IsString()
  version?: string;

  @ApiPropertyOptional({
    description: 'Tempo de execução da requisição em milissegundos',
    example: 150,
  })
  @IsOptional()
  executionTime?: number;
}

export class StandardResponseDto<T> {
  @ApiProperty({
    description: 'Indica se a operação foi bem-sucedida',
    example: true,
  })
  @IsBoolean()
  success: boolean;

  @ApiProperty({
    description: 'Dados de resposta',
  })
  data: T;

  @ApiProperty({
    description: 'Array de mensagens relacionadas à operação',
    type: [String],
    example: ['Operação concluída com sucesso'],
  })
  @IsArray()
  @IsString({ each: true })
  messages: string[];

  @ApiPropertyOptional({
    description: 'Metadados adicionais sobre a resposta',
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
    description: 'Identificador do código de erro',
    example: 'VALIDATION_ERROR',
  })
  @IsString()
  code: string;

  @ApiProperty({
    description: 'Mensagem de erro legível',
    example: 'Validação falhou para os dados fornecidos',
  })
  @IsString()
  message: string;

  @ApiPropertyOptional({
    description: 'Detalhes adicionais do erro',
    example: { field: 'email', constraint: 'isEmail' },
  })
  @IsOptional()
  details?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'Stack trace (apenas em desenvolvimento)',
  })
  @IsOptional()
  @IsString()
  stackTrace?: string;
}

export class ValidationFieldErrorDto {
  @ApiProperty({
    description: 'Nome do campo que falhou na validação',
    example: 'email',
  })
  @IsString()
  field: string;

  @ApiProperty({
    description: 'Mensagem de erro de validação',
    example: 'Email deve ter um formato válido',
  })
  @IsString()
  message: string;

  @ApiPropertyOptional({
    description: 'Valor que falhou na validação',
    example: 'email-inválido',
  })
  @IsOptional()
  value?: unknown;

  @ApiPropertyOptional({
    description: 'Lista de restrições de validação',
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
    description: 'Número da página atual',
    example: 1,
    minimum: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Número de itens por página',
    example: 10,
    minimum: 1,
  })
  limit: number;

  @ApiProperty({
    description: 'Número total de itens',
    example: 100,
    minimum: 0,
  })
  total: number;

  @ApiProperty({
    description: 'Número total de páginas',
    example: 10,
    minimum: 0,
  })
  totalPages: number;

  @ApiProperty({
    description: 'Se existe uma próxima página',
    example: true,
  })
  hasNext: boolean;

  @ApiProperty({
    description: 'Se existe uma página anterior',
    example: false,
  })
  hasPrevious: boolean;
}

export class PaginatedDataDto<T> {
  @ApiProperty({
    description: 'Array de itens para a página atual',
    isArray: true,
  })
  items: T[];

  @ApiProperty({
    description: 'Informações de paginação',
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
    description: 'Dados paginados com itens e informações de paginação',
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
