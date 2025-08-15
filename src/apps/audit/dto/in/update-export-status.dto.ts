import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateExportStatusDto {
  @ApiProperty({
    description: 'New status of the export request',
    example: 'completed',
  })
  @IsString({ message: 'Status deve ser uma string' })
  @IsNotEmpty({ message: 'Status é obrigatório' })
  status: string;

  @ApiProperty({
    description: 'Additional metadata for the status update',
    example: {
      fileSize: 1024000,
      recordsExported: 500,
      errorDetails: null,
    },
    required: false,
  })
  @IsObject({ message: 'Metadados devem ser um objeto' })
  @IsOptional()
  metadata?: Record<string, any>;
}
