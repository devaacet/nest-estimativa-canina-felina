import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFormResponseDto {
  @ApiProperty({
    description: 'Question ID this response belongs to',
    example: 'uuid-string',
  })
  @IsUUID()
  questionId: string;

  @ApiProperty({
    description: 'Text response to the question',
    example: 'Sim, considero muito importante',
    required: false,
  })
  @IsOptional()
  @IsString()
  responseText?: string;
}
