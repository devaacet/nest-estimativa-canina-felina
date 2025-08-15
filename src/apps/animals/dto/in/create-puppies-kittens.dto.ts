import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreatePuppiesKittensDto {
  @ApiProperty({
    description: 'Form ID that this record belongs to',
    example: 'uuid-string',
  })
  @IsUUID(4, { message: 'Form ID deve ser um UUID válido' })
  @IsNotEmpty({ message: 'Form ID é obrigatório' })
  form_id: string;

  @ApiProperty({
    description: 'Species (puppies or kittens)',
    example: 'puppies',
  })
  @IsString({ message: 'Espécie deve ser uma string' })
  @IsNotEmpty({ message: 'Espécie é obrigatória' })
  species: string;

  @ApiProperty({
    description: 'Number of births in last 12 months',
    example: 2,
    required: false,
  })
  @IsNumber({}, { message: 'Número de partos deve ser um número' })
  @IsOptional()
  births_last_12_months?: number;

  @ApiProperty({
    description: 'Total number born',
    example: 8,
    required: false,
  })
  @IsNumber({}, { message: 'Total nascidos deve ser um número' })
  @IsOptional()
  total_born?: number;

  @ApiProperty({
    description: 'Number that survived',
    example: 7,
    required: false,
  })
  @IsNumber({}, { message: 'Número de sobreviventes deve ser um número' })
  @IsOptional()
  survived?: number;

  @ApiProperty({
    description: 'Number that died',
    example: 1,
    required: false,
  })
  @IsNumber({}, { message: 'Número de mortos deve ser um número' })
  @IsOptional()
  died?: number;

  @ApiProperty({
    description: 'Number given away',
    example: 5,
    required: false,
  })
  @IsNumber({}, { message: 'Número doados deve ser um número' })
  @IsOptional()
  given_away?: number;

  @ApiProperty({
    description: 'Number sold',
    example: 2,
    required: false,
  })
  @IsNumber({}, { message: 'Número vendidos deve ser um número' })
  @IsOptional()
  sold?: number;

  @ApiProperty({
    description: 'Number kept',
    example: 0,
    required: false,
  })
  @IsNumber({}, { message: 'Número mantidos deve ser um número' })
  @IsOptional()
  kept?: number;

  @ApiProperty({
    description: 'Date of last birth',
    example: '2024-01-01',
    required: false,
  })
  @IsDateString(
    {},
    { message: 'Data do último parto deve ser uma data válida' },
  )
  @IsOptional()
  last_birth_date?: string;

  @ApiProperty({
    description: 'Castration plans',
    example: 'Planned for next month',
    required: false,
  })
  @IsString({ message: 'Planos de castração devem ser uma string' })
  @IsOptional()
  castration_plans?: string;

  @ApiProperty({
    description: 'Additional observations',
    example: 'All puppies were healthy',
    required: false,
  })
  @IsString({ message: 'Observações devem ser uma string' })
  @IsOptional()
  observations?: string;
}
