import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCurrentAnimalDto } from './create-current-animal.dto';

export class BulkCreateAnimalsDto {
  @ApiProperty({
    description: 'Form ID that these animals belong to',
    example: 'uuid-string',
  })
  @IsUUID(4, { message: 'Form ID deve ser um UUID válido' })
  @IsNotEmpty({ message: 'Form ID é obrigatório' })
  formId: string;

  @ApiProperty({
    description: 'Array of animal data to create',
    type: [CreateCurrentAnimalDto],
  })
  @IsArray({ message: 'Dados dos animais deve ser um array' })
  @ValidateNested({ each: true })
  @Type(() => CreateCurrentAnimalDto)
  animalsData: CreateCurrentAnimalDto[];
}
