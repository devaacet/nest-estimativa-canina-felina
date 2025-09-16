import { ApiProperty } from '@nestjs/swagger';
import { FormStatus } from '../../../../shared/enums';

export class FormListResponseDto {
  @ApiProperty({
    description: 'ID do formulário',
    example: 'uuid-string',
  })
  id: string;

  @ApiProperty({
    description: 'Status do formulário',
    enum: FormStatus,
    example: FormStatus.DRAFT,
  })
  status: FormStatus;

  @ApiProperty({
    description:
      'Porcentagem de progresso baseada na etapa atual em relação ao total de etapas (8)',
    example: 37.5,
    minimum: 0,
    maximum: 100,
  })
  progress: number;

  @ApiProperty({
    description: 'Nome do entrevistador',
    example: 'João Silva',
    nullable: true,
  })
  interviewerName: string | null;

  @ApiProperty({
    description: 'Data da entrevista',
    example: '2024-01-01',
    nullable: true,
  })
  interviewDate: string | null;

  @ApiProperty({
    description: 'Código do setor censitário',
    example: '123456789',
    nullable: true,
  })
  censusSectorCode: string | null;

  @ApiProperty({
    description: 'Nome da cidade onde o formulário foi conduzido',
    example: 'São Paulo',
  })
  cityName: string;

  @ApiProperty({
    description: 'Endereço da rua',
    example: 'Rua das Flores',
    nullable: true,
  })
  address: string | null;

  @ApiProperty({
    description: 'Número do endereço',
    example: '123',
    nullable: true,
  })
  number?: string | null;

  @ApiProperty({
    description: 'Data e hora de criação',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data e hora da última atualização',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
