import { ApiProperty } from '@nestjs/swagger';
import { FormStatus } from '../../../../shared/enums';

export class FormListResponseDto {
  @ApiProperty({
    description: 'Form ID',
    example: 'uuid-string',
  })
  id: string;

  @ApiProperty({
    description: 'Form status',
    enum: FormStatus,
    example: FormStatus.DRAFT,
  })
  status: FormStatus;

  @ApiProperty({
    description:
      'Progress percentage based on current step relative to total steps (8)',
    example: 37.5,
    minimum: 0,
    maximum: 100,
  })
  progress: number;

  @ApiProperty({
    description: 'Name of the interviewer',
    example: 'João Silva',
    nullable: true,
  })
  interviewerName: string | null;

  @ApiProperty({
    description: 'Interview date',
    example: '2024-01-01',
    nullable: true,
  })
  interviewDate: string | null;

  @ApiProperty({
    description: 'Census sector code',
    example: '123456789',
    nullable: true,
  })
  censusSectorCode: string | null;

  @ApiProperty({
    description: 'City name where the form was conducted',
    example: 'São Paulo',
  })
  cityName: string;

  @ApiProperty({
    description: 'Street address',
    example: 'Rua das Flores',
    nullable: true,
  })
  address: string | null;

  @ApiProperty({
    description: 'Address number',
    example: '123',
    nullable: true,
  })
  number: string | null;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
