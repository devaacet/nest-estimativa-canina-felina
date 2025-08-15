import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export enum ExportFormat {
  CSV = 'csv',
  XLSX = 'xlsx',
  JSON = 'json',
  PDF = 'pdf',
}

export enum ExportType {
  FORMS = 'forms',
  ANIMALS = 'animals',
  USERS = 'users',
  AUDIT_LOGS = 'audit_logs',
  STATISTICS = 'statistics',
}

export class CreateExportRequestDto {
  @ApiProperty({
    description: 'User ID who requested the export',
    example: 'uuid-string',
  })
  @IsUUID(4, { message: 'User ID deve ser um UUID válido' })
  @IsNotEmpty({ message: 'User ID é obrigatório' })
  user_id: string;

  @ApiProperty({
    description: 'Type of export',
    enum: ExportType,
    example: ExportType.FORMS,
  })
  @IsEnum(ExportType, { message: 'Tipo de exportação deve ser válido' })
  @IsNotEmpty({ message: 'Tipo de exportação é obrigatório' })
  export_type: ExportType;

  @ApiProperty({
    description: 'Export format',
    enum: ExportFormat,
    example: ExportFormat.CSV,
  })
  @IsEnum(ExportFormat, { message: 'Formato de exportação deve ser válido' })
  @IsNotEmpty({ message: 'Formato de exportação é obrigatório' })
  format: ExportFormat;

  @ApiProperty({
    description: 'Export description or title',
    example: 'Formulários de pesquisa - Janeiro 2024',
  })
  @IsString({ message: 'Descrição deve ser uma string' })
  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  description: string;

  @ApiProperty({
    description: 'Filters and parameters for the export',
    example: {
      dateRange: { start: '2024-01-01', end: '2024-01-31' },
      cityId: 'uuid-string',
      includeInactive: false,
    },
    required: false,
  })
  @IsObject({ message: 'Parâmetros devem ser um objeto' })
  @IsOptional()
  parameters?: Record<string, any>;

  @ApiProperty({
    description: 'Additional metadata',
    example: { requestedBy: 'Research Team', department: 'Biology' },
    required: false,
  })
  @IsObject({ message: 'Metadados devem ser um objeto' })
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiProperty({
    description: 'Priority level',
    example: 'normal',
    required: false,
  })
  @IsString({ message: 'Prioridade deve ser uma string' })
  @IsOptional()
  priority?: string;
}
