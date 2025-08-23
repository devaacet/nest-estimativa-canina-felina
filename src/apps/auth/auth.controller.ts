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
import { ConfigService } from '@nestjs/config';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Post('login')
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
    });
  }

  @Post('refresh')
  async refresh(@Request() req: IRequest, @Response() res: Res) {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        error: 'Refresh token not provided',
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
    });
  }

  @Post('logout')
  @ApiOperation({
    summary: 'User logout',
    description: 'Clears authentication cookies from the browser',
  })
  @ApiResponse({
    status: 200,
    description: 'Logout successful. Authentication cookies are cleared.',
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
    });
  }

  @Public()
  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({
    status: 200,
    description: 'Password reset email sent',
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
    };
  }

  @Public()
  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully',
    type: ResetPasswordStandardResponseDto,
  })
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
}
