import { ApiProperty } from '@nestjs/swagger';
import { StandardResponseDto } from '../../../../shared/dto';
import {
  ForgotPasswordResponseDto,
  ResetPasswordResponseDto,
} from './auth-response.dto';
import { LoginResponseDataDto } from './login.response.dto';

export class LoginStandardResponseDto extends StandardResponseDto<LoginResponseDataDto> {
  @ApiProperty({
    description:
      'Dados de resposta do login contendo informações do usuário. Tokens de autenticação são definidos como cookies HTTP-only.',
    type: LoginResponseDataDto,
  })
  declare data: LoginResponseDataDto;

  constructor(
    data: LoginResponseDataDto,
    messages: string[] = ['Login successful'],
  ) {
    super(data, messages);
  }
}

export class ForgotPasswordStandardResponseDto extends StandardResponseDto<ForgotPasswordResponseDto> {
  @ApiProperty({
    description: 'Dados de resposta para esqueceu a senha',
    type: ForgotPasswordResponseDto,
  })
  declare data: ForgotPasswordResponseDto;

  constructor(
    data: ForgotPasswordResponseDto,
    messages: string[] = ['Password reset email sent'],
  ) {
    super(data, messages);
  }
}

export class ResetPasswordStandardResponseDto extends StandardResponseDto<ResetPasswordResponseDto> {
  @ApiProperty({
    description: 'Dados de resposta para redefinir senha',
    type: ResetPasswordResponseDto,
  })
  declare data: ResetPasswordResponseDto;

  constructor(
    data: ResetPasswordResponseDto,
    messages: string[] = ['Password reset successful'],
  ) {
    super(data, messages);
  }
}

export class LogoutStandardResponseDto extends StandardResponseDto<null> {
  @ApiProperty({
    description: 'Sempre null para logout',
    example: null,
  })
  declare data: null;

  constructor(messages: string[] = ['Logout successful']) {
    super(null, messages);
  }
}

export class RefreshTokenStandardResponseDto extends StandardResponseDto<{
  accessToken: string;
}> {
  @ApiProperty({
    description: 'Novo token de acesso',
    type: Object,
    example: {
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
  })
  declare data: { accessToken: string };

  constructor(
    accessToken: string,
    messages: string[] = ['Token refreshed successfully'],
  ) {
    super({ accessToken }, messages);
  }
}
