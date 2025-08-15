import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateAnimalAbsenceDto {
  @ApiProperty({
    description: 'Form ID that this record belongs to',
    example: 'uuid-string',
  })
  @IsUUID(4, { message: 'Form ID deve ser um UUID válido' })
  @IsNotEmpty({ message: 'Form ID é obrigatório' })
  form_id: string;

  @ApiProperty({
    description: 'Indicates if there are no animals currently',
    example: true,
  })
  @IsBoolean({ message: 'Ausência de animais deve ser booleano' })
  @IsNotEmpty({ message: 'Ausência de animais é obrigatória' })
  no_animals_currently: boolean;

  @ApiProperty({
    description: 'Reason for not having animals',
    example: 'Recent loss of pet',
    required: false,
  })
  @IsString({ message: 'Motivo deve ser uma string' })
  @IsOptional()
  reason?: string;

  @ApiProperty({
    description: 'Plans to acquire animals in the future',
    example: 'Planning to adopt a dog next year',
    required: false,
  })
  @IsString({ message: 'Planos futuros devem ser uma string' })
  @IsOptional()
  future_plans?: string;

  @ApiProperty({
    description: 'Date when last animal was lost/given away',
    example: '2023-12-01',
    required: false,
  })
  @IsDateString(
    {},
    { message: 'Data da última perda deve ser uma data válida' },
  )
  @IsOptional()
  last_animal_date?: string;

  @ApiProperty({
    description: 'Previous experience with animals',
    example: 'Had dogs for 10 years',
    required: false,
  })
  @IsString({ message: 'Experiência anterior deve ser uma string' })
  @IsOptional()
  previous_experience?: string;

  @ApiProperty({
    description: 'Additional observations',
    example: 'Family is currently traveling frequently',
    required: false,
  })
  @IsString({ message: 'Observações devem ser uma string' })
  @IsOptional()
  observations?: string;
}
