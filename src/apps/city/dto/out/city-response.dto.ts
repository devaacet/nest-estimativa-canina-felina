import { ApiProperty } from '@nestjs/swagger';

export class CityResponseDto {
  @ApiProperty({
    description: 'ID da cidade',
    example: 'uuid-string',
  })
  id: string;

  @ApiProperty({
    description: 'Nome da cidade',
    example: 'São Paulo',
  })
  name: string;

  @ApiProperty({
    description: 'Ano da pesquisa',
    example: 2024,
  })
  year: number;

  @ApiProperty({
    description: 'Status ativo da cidade',
    example: true,
  })
  active: boolean;

  @ApiProperty({
    description: 'Data e hora de criação',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;
}

export class CityQuestionResponseDto {
  @ApiProperty({
    description: 'ID da pergunta',
    example: 'uuid-string',
  })
  id: string;

  @ApiProperty({
    description: 'Texto da pergunta',
    example: 'Qual é a sua opinião sobre a castração de animais?',
  })
  questionText: string;

  @ApiProperty({
    description: 'Se esta pergunta é obrigatória',
    example: true,
  })
  isRequired: boolean;

  @ApiProperty({
    description: 'Ordem de exibição da pergunta',
    example: 1,
  })
  displayOrder: number;
}

export class CityDetailsResponseDto extends CityResponseDto {
  @ApiProperty({
    description: 'Lista de perguntas para esta cidade',
    type: [CityQuestionResponseDto],
  })
  questions: CityQuestionResponseDto[];
}
