import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { AuditAction } from '../../../../shared/enums';

export class AuditFiltersDto {
  @ApiProperty({
    description: 'Número da página para paginação',
    example: 1,
    required: false,
  })
  @IsNumber({}, { message: 'Página deve ser um número' })
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  page?: number;

  @ApiProperty({
    description: 'Número de itens por página',
    example: 50,
    required: false,
  })
  @IsNumber({}, { message: 'Limite deve ser um número' })
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  limit?: number;

  @ApiProperty({
    description: 'ID do usuário para filtrar',
    example: 'uuid-string',
    required: false,
  })
  @IsUUID(4, { message: 'User ID deve ser um UUID válido' })
  @IsOptional()
  userId?: string;

  @ApiProperty({
    description: 'Tipo de ação para filtrar',
    enum: AuditAction,
    required: false,
  })
  @IsEnum(AuditAction, { message: 'Ação deve ser um valor válido' })
  @IsOptional()
  action?: AuditAction;

  @ApiProperty({
    description: 'Nome da tabela para filtrar',
    example: 'users',
    required: false,
  })
  @IsString({ message: 'Nome da tabela deve ser uma string' })
  @IsOptional()
  tableName?: string;

  @ApiProperty({
    description: 'Data de início para filtrar',
    example: '2024-01-01',
    required: false,
  })
  @IsDateString({}, { message: 'Data de início deve ser uma data válida' })
  @IsOptional()
  startDate?: string;

  @ApiProperty({
    description: 'Data de fim para filtrar',
    example: '2024-01-31',
    required: false,
  })
  @IsDateString({}, { message: 'Data de fim deve ser uma data válida' })
  @IsOptional()
  endDate?: string;
}
