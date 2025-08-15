import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../../shared/enums';

export class UserProfileDto {
  @ApiProperty({
    description: 'User ID',
    example: 'uuid-string',
  })
  id: string;

  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User full name',
    example: 'João Silva',
  })
  name: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    example: UserRole.PESQUISADOR,
  })
  role: UserRole;

  @ApiProperty({
    description: 'User phone number',
    example: '+55 11 99999-9999',
    required: false,
  })
  phone?: string;

  @ApiProperty({
    description: 'User active status',
    example: true,
  })
  active: boolean;

  @ApiProperty({
    description: 'Last login timestamp',
    example: '2024-01-01T00:00:00.000Z',
    required: false,
  })
  lastLoginAt?: Date;
}

export class RefreshResponseDto {
  @ApiProperty({
    description: 'Indicates if token was refreshed',
    example: true,
  })
  tokenRefreshed: boolean;

  @ApiProperty({
    description: 'Token expiration timestamp',
    example: '2024-01-01T00:15:00.000Z',
  })
  expiresAt: string;
}

export class LogoutResponseDto {
  @ApiProperty({
    description: 'Indicates if user was logged out',
    example: true,
  })
  loggedOut: boolean;
}

export class ForgotPasswordResponseDto {
  @ApiProperty({
    description: 'Confirmation message',
    example:
      'Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha.',
  })
  message: string;
}

export class ResetPasswordResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Senha redefinida com sucesso.',
  })
  message: string;
}
