import { ApiProperty } from '@nestjs/swagger';

export class CityListBasicResponseDto {
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
}
