import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class AnimalOrderDto {
  @ApiProperty({
    description: 'Animal ID',
    example: 'uuid-string',
  })
  @IsUUID(4, { message: 'ID deve ser um UUID válido' })
  id: string;

  @ApiProperty({
    description: 'New display order',
    example: 1,
  })
  @IsNumber({}, { message: 'Ordem deve ser um número' })
  order: number;
}

export class ReorderAnimalsDto {
  @ApiProperty({
    description: 'Array of animal orders',
    type: [AnimalOrderDto],
  })
  @IsArray({ message: 'Ordens dos animais deve ser um array' })
  @ValidateNested({ each: true })
  @Type(() => AnimalOrderDto)
  animalOrders: AnimalOrderDto[];
}
