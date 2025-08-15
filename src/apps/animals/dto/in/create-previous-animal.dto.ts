import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreatePreviousAnimalDto {
  @ApiProperty({
    description: 'Form ID that this animal belongs to',
    example: 'uuid-string',
  })
  @IsUUID(4, { message: 'Form ID deve ser um UUID válido' })
  @IsNotEmpty({ message: 'Form ID é obrigatório' })
  form_id: string;

  @ApiProperty({
    description: 'Animal name',
    example: 'Buddy',
  })
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @ApiProperty({
    description: 'Animal species',
    example: 'Gato',
  })
  @IsString({ message: 'Espécie deve ser uma string' })
  @IsNotEmpty({ message: 'Espécie é obrigatória' })
  species: string;

  @ApiProperty({
    description: 'Animal breed',
    example: 'Siamês',
    required: false,
  })
  @IsString({ message: 'Raça deve ser uma string' })
  @IsOptional()
  breed?: string;

  @ApiProperty({
    description: 'Animal sex',
    example: 'F',
  })
  @IsString({ message: 'Sexo deve ser uma string' })
  @IsNotEmpty({ message: 'Sexo é obrigatório' })
  sex: string;

  @ApiProperty({
    description: 'Animal acquisition date',
    example: '2020-01-01',
    required: false,
  })
  @IsDateString({}, { message: 'Data de aquisição deve ser uma data válida' })
  @IsOptional()
  acquisition_date?: string;

  @ApiProperty({
    description: 'Animal loss date',
    example: '2023-01-01',
    required: false,
  })
  @IsDateString({}, { message: 'Data de perda deve ser uma data válida' })
  @IsOptional()
  loss_date?: string;

  @ApiProperty({
    description: 'Reason for animal loss',
    example: 'Natural death',
    required: false,
  })
  @IsString({ message: 'Motivo da perda deve ser uma string' })
  @IsOptional()
  loss_reason?: string;

  @ApiProperty({
    description: 'Animal lifespan in years',
    example: 3,
    required: false,
  })
  @IsNumber({}, { message: 'Tempo de vida deve ser um número' })
  @IsOptional()
  lifespan_years?: number;

  @ApiProperty({
    description: 'Animal castration status',
    example: true,
    required: false,
  })
  @IsBoolean({ message: 'Status de castração deve ser booleano' })
  @IsOptional()
  was_castrated?: boolean;

  @ApiProperty({
    description: 'Animal vaccination status',
    example: true,
    required: false,
  })
  @IsBoolean({ message: 'Status de vacinação deve ser booleano' })
  @IsOptional()
  was_vaccinated?: boolean;

  @ApiProperty({
    description: 'Animal health status',
    example: 'Saudável',
    required: false,
  })
  @IsString({ message: 'Status de saúde deve ser uma string' })
  @IsOptional()
  health_status?: string;

  @ApiProperty({
    description: 'Additional observations',
    example: 'Animal muito querido pela família',
    required: false,
  })
  @IsString({ message: 'Observações devem ser uma string' })
  @IsOptional()
  observations?: string;
}
