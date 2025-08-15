import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateCityQuestionDto {
  @ApiProperty({
    description: 'City ID that this question belongs to',
    example: 'uuid-string',
  })
  @IsUUID(4, { message: 'City ID deve ser um UUID válido' })
  @IsNotEmpty({ message: 'City ID é obrigatório' })
  city_id: string;

  @ApiProperty({
    description: 'Question text',
    example: 'Qual é a sua opinião sobre a castração de animais?',
  })
  @IsString({ message: 'Texto da pergunta deve ser uma string' })
  @IsNotEmpty({ message: 'Texto da pergunta é obrigatório' })
  question_text: string;

  @ApiProperty({
    description: 'Question type',
    example: 'text',
  })
  @IsString({ message: 'Tipo da pergunta deve ser uma string' })
  @IsNotEmpty({ message: 'Tipo da pergunta é obrigatório' })
  question_type: string;

  @ApiProperty({
    description: 'Whether this question is required',
    example: true,
    required: false,
  })
  @IsBoolean({ message: 'Campo obrigatório deve ser booleano' })
  @IsOptional()
  is_required?: boolean;

  @ApiProperty({
    description: 'Display order of the question',
    example: 1,
    required: false,
  })
  @IsNumber({}, { message: 'Ordem deve ser um número' })
  @IsOptional()
  display_order?: number;

  @ApiProperty({
    description: 'Additional options for multiple choice questions',
    example: 'Sim;Não;Talvez',
    required: false,
  })
  @IsString({ message: 'Opções devem ser uma string' })
  @IsOptional()
  options?: string;

  @ApiProperty({
    description: 'Help text or description for the question',
    example: 'Por favor, seja específico em sua resposta',
    required: false,
  })
  @IsString({ message: 'Texto de ajuda deve ser uma string' })
  @IsOptional()
  help_text?: string;

  @ApiProperty({
    description: 'Question category',
    example: 'Atitudes',
    required: false,
  })
  @IsString({ message: 'Categoria deve ser uma string' })
  @IsOptional()
  category?: string;
}
