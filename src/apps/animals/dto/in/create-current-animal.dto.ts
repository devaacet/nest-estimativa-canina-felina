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

export class CreateCurrentAnimalDto {
  @ApiProperty({
    description: 'Form ID that this animal belongs to',
    example: 'uuid-string',
  })
  @IsUUID(4, { message: 'Form ID deve ser um UUID válido' })
  @IsNotEmpty({ message: 'Form ID é obrigatório' })
  form_id: string;

  @ApiProperty({
    description: 'Animal name',
    example: 'Rex',
  })
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @ApiProperty({
    description: 'Animal species',
    example: 'Cachorro',
  })
  @IsString({ message: 'Espécie deve ser uma string' })
  @IsNotEmpty({ message: 'Espécie é obrigatória' })
  species: string;

  @ApiProperty({
    description: 'Animal breed',
    example: 'Labrador',
    required: false,
  })
  @IsString({ message: 'Raça deve ser uma string' })
  @IsOptional()
  breed?: string;

  @ApiProperty({
    description: 'Animal sex',
    example: 'M',
  })
  @IsString({ message: 'Sexo deve ser uma string' })
  @IsNotEmpty({ message: 'Sexo é obrigatório' })
  sex: string;

  @ApiProperty({
    description: 'Animal age',
    example: 3,
    required: false,
  })
  @IsNumber({}, { message: 'Idade deve ser um número' })
  @IsOptional()
  age?: number;

  @ApiProperty({
    description: 'Animal age unit',
    example: 'anos',
    required: false,
  })
  @IsString({ message: 'Unidade de idade deve ser uma string' })
  @IsOptional()
  age_unit?: string;

  @ApiProperty({
    description: 'Animal weight in kg',
    example: 25.5,
    required: false,
  })
  @IsNumber({}, { message: 'Peso deve ser um número' })
  @IsOptional()
  weight_kg?: number;

  @ApiProperty({
    description: 'Animal castration status',
    example: true,
    required: false,
  })
  @IsBoolean({ message: 'Status de castração deve ser booleano' })
  @IsOptional()
  is_castrated?: boolean;

  @ApiProperty({
    description: 'Animal vaccination status',
    example: true,
    required: false,
  })
  @IsBoolean({ message: 'Status de vacinação deve ser booleano' })
  @IsOptional()
  is_vaccinated?: boolean;

  @ApiProperty({
    description: 'Last vaccination date',
    example: '2024-01-01',
    required: false,
  })
  @IsDateString(
    {},
    { message: 'Data da última vacinação deve ser uma data válida' },
  )
  @IsOptional()
  last_vaccination_date?: string;

  @ApiProperty({
    description: 'Animal health status',
    example: 'Saudável',
    required: false,
  })
  @IsString({ message: 'Status de saúde deve ser uma string' })
  @IsOptional()
  health_status?: string;

  @ApiProperty({
    description: 'Animal temperament',
    example: 'Dócil',
    required: false,
  })
  @IsString({ message: 'Temperamento deve ser uma string' })
  @IsOptional()
  temperament?: string;

  @ApiProperty({
    description: 'Animal physical description',
    example: 'Pelagem dourada, porte médio',
    required: false,
  })
  @IsString({ message: 'Descrição física deve ser uma string' })
  @IsOptional()
  physical_description?: string;

  @ApiProperty({
    description: 'Additional observations',
    example: 'Animal muito carinhoso',
    required: false,
  })
  @IsString({ message: 'Observações devem ser uma string' })
  @IsOptional()
  observations?: string;

  @ApiProperty({
    description: 'Display order',
    example: 1,
    required: false,
  })
  @IsNumber({}, { message: 'Ordem deve ser um número' })
  @IsOptional()
  display_order?: number;

  @ApiProperty({
    description: 'Card minimized state',
    example: false,
    required: false,
  })
  @IsBoolean({ message: 'Estado minimizado deve ser booleano' })
  @IsOptional()
  is_card_minimized?: boolean;
}
