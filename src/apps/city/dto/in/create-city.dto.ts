import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCityDto {
  @ApiProperty({
    description: 'City name',
    example: 'São Paulo',
  })
  @IsString({ message: 'Nome da cidade deve ser uma string' })
  @IsNotEmpty({ message: 'Nome da cidade é obrigatório' })
  name: string;

  @ApiProperty({
    description: 'State or region',
    example: 'SP',
  })
  @IsString({ message: 'Estado deve ser uma string' })
  @IsNotEmpty({ message: 'Estado é obrigatório' })
  state: string;

  @ApiProperty({
    description: 'Country',
    example: 'Brasil',
  })
  @IsString({ message: 'País deve ser uma string' })
  @IsNotEmpty({ message: 'País é obrigatório' })
  country: string;

  @ApiProperty({
    description: 'Research year',
    example: 2024,
  })
  @IsNumber({}, { message: 'Ano deve ser um número' })
  @IsNotEmpty({ message: 'Ano é obrigatório' })
  year: number;

  @ApiProperty({
    description: 'City population',
    example: 12000000,
    required: false,
  })
  @IsNumber({}, { message: 'População deve ser um número' })
  @IsOptional()
  population?: number;

  @ApiProperty({
    description: 'Geographic region',
    example: 'Sudeste',
    required: false,
  })
  @IsString({ message: 'Região deve ser uma string' })
  @IsOptional()
  region?: string;

  @ApiProperty({
    description: 'City active status',
    example: true,
    required: false,
  })
  @IsBoolean({ message: 'Status ativo deve ser booleano' })
  @IsOptional()
  active?: boolean;

  @ApiProperty({
    description: 'Additional observations about the city',
    example: 'Major metropolitan area',
    required: false,
  })
  @IsString({ message: 'Observações devem ser uma string' })
  @IsOptional()
  observations?: string;
}
