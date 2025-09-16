import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateExportStatusDto {
  @ApiProperty({
    description: 'Novo status da solicitação de exportação',
    example: 'completed',
  })
  @IsString({ message: 'Status deve ser uma string' })
  @IsNotEmpty({ message: 'Status é obrigatório' })
  status: string;

  @ApiProperty({
    description: 'Metadados adicionais para a atualização do status',
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
