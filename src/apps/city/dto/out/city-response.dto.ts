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
    description: 'Research year',
    example: 2024,
  })
  year: number;

  @ApiProperty({
    description: 'City active status',
    example: true,
  })
  active: boolean;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;
}

export class CityQuestionResponseDto {
  @ApiProperty({
    description: 'Question ID',
    example: 'uuid-string',
  })
  id: string;

  @ApiProperty({
    description: 'Question text',
    example: 'Qual é a sua opinião sobre a castração de animais?',
  })
  questionText: string;

  @ApiProperty({
    description: 'Whether this question is required',
    example: true,
  })
  isRequired: boolean;

  @ApiProperty({
    description: 'Display order of the question',
    example: 1,
  })
  displayOrder: number;
}

export class CityDetailsResponseDto extends CityResponseDto {
  @ApiProperty({
    description: 'List of questions for this city',
    type: [CityQuestionResponseDto],
  })
  questions: CityQuestionResponseDto[];
}
