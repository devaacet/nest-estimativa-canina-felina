import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFormResponseDto {
  @ApiProperty({
    description: 'ID da pergunta à qual esta resposta pertence',
    example: 'uuid-string',
  })
  @IsUUID()
  questionId: string;

  @ApiProperty({
    description: 'Resposta em texto para a pergunta',
    example: 'Sim, considero muito importante',
    required: false,
  })
  @IsOptional()
  @IsString()
  responseText?: string;
}
