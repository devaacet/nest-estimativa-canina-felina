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
      'Login response data containing user info. Authentication tokens are set as HTTP-only cookies.',
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
    description: 'Forgot password response data',
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
    description: 'Reset password response data',
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
    description: 'Always null for logout',
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
    description: 'New access token',
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
