import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Request,
  Response,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ForgotPasswordDto, LoginDto, ResetPasswordDto } from './dto/in';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Response as Res } from 'express';
import type { IRequest } from 'src/shared/interfaces/request.interface';
import {
  ForgotPasswordStandardResponseDto,
  ResetPasswordStandardResponseDto,
} from './dto/out';
import {
  ApiClearsCookies,
  Public,
  StandardResponseDto,
  daysToMs,
  minsToMs,
} from 'src/shared';
import { MESSAGES } from 'src/shared/constants/messages';
import { ConfigService } from '@nestjs/config';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Post('login')
  @ApiOperation({
    summary: 'Login do usuário',
    description:
      'Autentica o usuário e define cookies HTTP-only com tokens de acesso e atualização',
  })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async login(@Body() credentials: LoginDto, @Response() res: Res) {
    const result = await this.authService.login(credentials);

    // Set HTTP-only cookies
    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: this.configService.get<number>(
        'JWT_ACCESS_EXPIRATION_IN_MS',
        minsToMs(15),
      ),
    });

    res.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: this.configService.get<number>(
        'JWT_REFRESH_EXPIRATION_IN_MS',
        daysToMs(7),
      ),
    });

    return res.status(HttpStatus.OK).json({
      success: true,
      data: {
        user: result.user,
      },
      messages: [MESSAGES.SUCCESS.LOGIN_SUCCESS],
    });
  }

  @Public()
  @Post('refresh')
  @ApiOperation({
    summary: 'Atualizar tokens',
    description:
      'Atualiza o token de acesso usando o token de atualização do cookie',
  })
  @ApiResponse({
    status: 200,
    description: 'Token atualizado com sucesso',
  })
  @ApiResponse({
    status: 401,
    description: 'Token de atualização inválido ou ausente',
  })
  async refresh(@Request() req: IRequest, @Response() res: Res) {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        error: 'Token de atualização não fornecido',
      });
    }

    const result = await this.authService.refreshTokens(refreshToken);

    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: this.configService.get<number>(
        'JWT_ACCESS_EXPIRATION_IN_MS',
        minsToMs(15),
      ),
    });

    return res.status(HttpStatus.OK).json({
      success: true,
      data: {
        user: result.user,
      },
      messages: [MESSAGES.SUCCESS.TOKEN_REFRESHED],
    });
  }

  @Post('logout')
  @ApiOperation({
    summary: 'Logout do usuário',
    description: 'Remove os cookies de autenticação do navegador',
  })
  @ApiResponse({
    status: 200,
    description:
      'Logout realizado com sucesso. Cookies de autenticação removidos.',
    type: StandardResponseDto<null>,
  })
  @ApiClearsCookies()
  logout(@Response() res: Res) {
    // Clear cookies
    res.clearCookie('access_token');
    res.clearCookie('refresh_token', { path: '/auth' });

    return res.status(HttpStatus.OK).json({
      success: true,
      data: {
        loggedOut: true,
      },
      messages: [MESSAGES.SUCCESS.LOGOUT_SUCCESS],
    });
  }

  @Public()
  @Post('forgot-password')
  @ApiOperation({ summary: 'Solicitar redefinição de senha' })
  @ApiResponse({
    status: 200,
    description: 'Email de redefinição de senha enviado',
    type: ForgotPasswordStandardResponseDto,
  })
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    void this.authService.requestPasswordReset(forgotPasswordDto.email);

    return {
      success: true,
      data: {
        message:
          'Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha.',
      },
      messages: [MESSAGES.SUCCESS.PASSWORD_RESET_REQUEST_SENT],
    };
  }

  @Public()
  @Post('reset-password')
  @ApiOperation({ summary: 'Redefinir senha com token' })
  @ApiResponse({
    status: 200,
    description: 'Senha redefinida com sucesso',
    type: ResetPasswordStandardResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Token inválido ou expirado' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    );

    return {
      success: true,
      data: {
        message: 'Senha redefinida com sucesso.',
      },
      messages: [MESSAGES.SUCCESS.PASSWORD_RESET_SUCCESS],
    };
  }
}
