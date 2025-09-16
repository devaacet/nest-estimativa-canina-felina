import { ApiProperty } from '@nestjs/swagger';

export class CityListBasicResponseDto {
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
}
