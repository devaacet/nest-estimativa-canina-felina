import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class QuestionOrderDto {
  @ApiProperty({
    description: 'Question ID',
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

export class ReorderQuestionsDto {
  @ApiProperty({
    description: 'Array of question orders',
    type: [QuestionOrderDto],
  })
  @IsArray({ message: 'Ordens das perguntas deve ser um array' })
  @ValidateNested({ each: true })
  @Type(() => QuestionOrderDto)
  questionOrders: QuestionOrderDto[];
}
