import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCityQuestionDto {
  @ApiProperty({
    description: 'Texto da pergunta',
    example: 'Qual é a sua opinião sobre a castração de animais?',
  })
  @IsString({ message: 'Texto da pergunta deve ser uma string' })
  @IsNotEmpty({ message: 'Texto da pergunta é obrigatório' })
  questionText: string;

  @ApiProperty({
    description: 'Ordem da pergunta',
    example: 1,
  })
  @IsNumber({}, { message: 'Ordem da pergunta deve ser um número' })
  @IsNotEmpty({ message: 'Ordem da pergunta é obrigatória' })
  questionOrder: number;

  @ApiProperty({
    description: 'Se esta pergunta é obrigatória',
    example: true,
    required: false,
  })
  @IsBoolean({ message: 'Campo obrigatório deve ser booleano' })
  @IsOptional()
  required?: boolean;
}

export class CreateCityDto {
  @ApiProperty({
    description: 'Nome da cidade',
    example: 'São Paulo',
  })
  @IsString({ message: 'Nome da cidade deve ser uma string' })
  @IsNotEmpty({ message: 'Nome da cidade é obrigatório' })
  name: string;

  @ApiProperty({
    description: 'Ano da pesquisa',
    example: 2024,
  })
  @IsNumber({}, { message: 'Ano deve ser um número' })
  @IsNotEmpty({ message: 'Ano é obrigatório' })
  year: number;

  @ApiProperty({
    description: 'Status ativo da cidade',
    example: true,
    required: false,
  })
  @IsBoolean({ message: 'Status ativo deve ser booleano' })
  @IsOptional()
  active?: boolean;

  @ApiProperty({
    description: 'Perguntas da cidade',
    type: [CreateCityQuestionDto],
    required: false,
  })
  @IsArray({ message: 'Perguntas devem ser um array' })
  @ValidateNested({ each: true })
  @Type(() => CreateCityQuestionDto)
  questions: CreateCityQuestionDto[];
}
