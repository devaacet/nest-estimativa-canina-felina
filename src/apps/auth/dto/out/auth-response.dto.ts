import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../../shared/enums';

export class UserProfileDto {
  @ApiProperty({
    description: 'ID do usuário',
    example: 'uuid-string',
  })
  id: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'usuario@exemplo.com',
  })
  email: string;

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva',
  })
  name: string;

  @ApiProperty({
    description: 'Função do usuário no sistema',
    enum: UserRole,
    example: UserRole.RESEARCHER,
  })
  role: UserRole;

  @ApiProperty({
    description: 'Número de telefone do usuário',
    example: '+55 11 99999-9999',
    required: false,
  })
  phone?: string;

  @ApiProperty({
    description: 'Status ativo do usuário',
    example: true,
  })
  active: boolean;

  @ApiProperty({
    description: 'Data e hora do último login',
    example: '2024-01-01T00:00:00.000Z',
    required: false,
  })
  lastLoginAt?: Date;
}

export class ForgotPasswordResponseDto {
  @ApiProperty({
    description: 'Mensagem de confirmação',
    example:
      'Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha.',
  })
  message: string;
}

export class ResetPasswordResponseDto {
  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Senha redefinida com sucesso.',
  })
  message: string;
}
