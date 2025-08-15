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

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() credentials: LoginDto, @Response() res: Res) {
    const result = await this.authService.login(credentials);

    // Set HTTP-only cookies
    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      path: '/auth',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(HttpStatus.OK).json({
      success: true,
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role,
          active: result.user.active,
          lastLoginAt: result.user.last_login_at,
        },
        permissions: this.getUserPermissions(result.user.role),
      },
    });
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refresh(@Request() req: IRequest, @Response() res: Res) {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        error: 'Refresh token not provided',
      });
    }

    const tokens = await this.authService.refreshTokens(refreshToken);

    res.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    return res.status(HttpStatus.OK).json({
      success: true,
    });
  }

  @Post('logout')
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  logout(@Response() res: Res) {
    // Clear cookies
    res.clearCookie('access_token');
    res.clearCookie('refresh_token', { path: '/auth' });

    return res.status(HttpStatus.OK).json({
      success: true,
      data: {
        loggedOut: true,
      },
    });
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 200, description: 'Password reset email sent' })
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    void this.authService.requestPasswordReset(forgotPasswordDto.email);

    return {
      success: true,
      data: {
        message:
          'Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha.',
      },
    };
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
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
    };
  }

  private getUserPermissions(role: string): string[] {
    const permissions: Record<string, string[]> = {
      pesquisador: ['forms:create', 'forms:edit_own', 'exports:generate'],
      gerente: [
        'forms:create',
        'forms:edit_own',
        'forms:view_all',
        'users:manage_team',
        'exports:generate',
      ],
      administrador: ['*'],
      cliente: ['forms:view_own', 'exports:generate'],
    };

    return permissions[role] || [];
  }
}
