import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../../../shared/enums';

export class UserResponseDto {
  @ApiProperty({
    description: 'Identificador único do usuário',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Endereço de email do usuário',
    example: 'usuario@exemplo.com',
  })
  email: string;

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva',
  })
  name: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiProperty({
    description: 'Função do usuário no sistema',
    enum: UserRole,
    example: UserRole.RESEARCHER,
  })
  role: UserRole;

  @ApiProperty({
    description: 'Instituição do usuário',
    example: 'Universidade Federal de São Paulo',
    nullable: true,
  })
  institution?: string;

  @ApiProperty({
    description: 'Se o usuário está ativo',
    example: true,
  })
  active: boolean;

  @ApiProperty({
    description: 'Se o email do usuário foi verificado',
    example: false,
  })
  emailVerified: boolean;

  @ApiProperty({
    description: 'Data e hora do último login',
    example: '2024-01-15T10:30:00Z',
    nullable: true,
  })
  lastLoginAt?: Date;

  @ApiProperty({
    description: 'Nomes das cidades que o usuário tem acesso',
    nullable: true,
  })
  cityNames?: string[];
}
