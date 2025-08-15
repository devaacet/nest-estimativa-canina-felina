import { ApiProperty } from '@nestjs/swagger';

export class CityResponseDto {
  @ApiProperty({
    description: 'City ID',
    example: 'uuid-string',
  })
  id: string;

  @ApiProperty({
    description: 'City name',
    example: 'São Paulo',
  })
  name: string;

  @ApiProperty({
    description: 'State or region',
    example: 'SP',
  })
  state: string;

  @ApiProperty({
    description: 'Country',
    example: 'Brasil',
  })
  country: string;

  @ApiProperty({
    description: 'Research year',
    example: 2024,
  })
  year: number;

  @ApiProperty({
    description: 'City population',
    example: 12000000,
    required: false,
  })
  population?: number;

  @ApiProperty({
    description: 'Geographic region',
    example: 'Sudeste',
    required: false,
  })
  region?: string;

  @ApiProperty({
    description: 'City active status',
    example: true,
  })
  active: boolean;

  @ApiProperty({
    description: 'Additional observations about the city',
    example: 'Major metropolitan area',
    required: false,
  })
  observations?: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  updated_at: Date;
}

export class CityQuestionResponseDto {
  @ApiProperty({
    description: 'Question ID',
    example: 'uuid-string',
  })
  id: string;

  @ApiProperty({
    description: 'City ID that this question belongs to',
    example: 'uuid-string',
  })
  city_id: string;

  @ApiProperty({
    description: 'Question text',
    example: 'Qual é a sua opinião sobre a castração de animais?',
  })
  question_text: string;

  @ApiProperty({
    description: 'Question type',
    example: 'text',
  })
  question_type: string;

  @ApiProperty({
    description: 'Whether this question is required',
    example: true,
  })
  is_required: boolean;

  @ApiProperty({
    description: 'Display order of the question',
    example: 1,
  })
  display_order: number;

  @ApiProperty({
    description: 'Additional options for multiple choice questions',
    example: 'Sim;Não;Talvez',
    required: false,
  })
  options?: string;

  @ApiProperty({
    description: 'Help text or description for the question',
    example: 'Por favor, seja específico em sua resposta',
    required: false,
  })
  help_text?: string;

  @ApiProperty({
    description: 'Question category',
    example: 'Atitudes',
    required: false,
  })
  category?: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  updated_at: Date;
}

export class CityWithQuestionsResponseDto extends CityResponseDto {
  @ApiProperty({
    description: 'List of questions for this city',
    type: [CityQuestionResponseDto],
  })
  questions: CityQuestionResponseDto[];
}
