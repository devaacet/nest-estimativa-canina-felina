import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../user/repositories/user.repository';
import { PasswordResetRepository } from './repositories/password-reset.repository';
import { User } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/in';
import {
  IAccessTokenPayload,
  IRefreshTokenPayload,
  ITokens,
} from './interfaces/token.interface';
import { v6 } from 'uuid';
import { randomSleep } from 'src/shared/utils/sleep.util';
import {
  comparePasswordAndHash,
  hashPassword,
} from 'src/shared/utils/password-hash.util';
import { EmailService } from '../email/email.service';

export interface AuthResult {
  user: User;
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordResetRepository: PasswordResetRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async login(credentials: LoginDto): Promise<
    {
      user: {
        id: string;
        name: string;
        email: string;
        role: string;
      };
    } & ITokens
  > {
    const user = await this.validateUser(
      credentials.email,
      credentials.password,
    );
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    if (!user.active) {
      throw new UnauthorizedException('Conta desativada');
    }
    await this.userRepository.updateLastLogin(user.id);

    const tokens = this.generateTokens(user);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findByEmailWithPasswordHash(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await comparePasswordAndHash(
      password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  generateAccessToken(user: User): string {
    const payload: IAccessTokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      cityIds: user.cities.map((city) => city.id),
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION_IN_MS', '15m'),
    });

    return accessToken;
  }

  generateRefreshToken(user: User): string {
    const payload: IRefreshTokenPayload = {
      sub: user.id,
    };

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION_IN_MS', '7d'),
    });

    return refreshToken;
  }

  generateTokens(user: User): ITokens {
    return {
      accessToken: this.generateAccessToken(user),
      refreshToken: this.generateRefreshToken(user),
    };
  }

  async refreshTokens(refreshToken: string): Promise<
    {
      user: {
        id: string;
        name: string;
        email: string;
        role: string;
      };
    } & ITokens
  > {
    const payload = this.jwtService.verify<IRefreshTokenPayload>(refreshToken);
    const user = await this.userRepository.findById(payload.sub);

    if (!user || !user.active) {
      throw new UnauthorizedException('Token de refresh inválido');
    }

    const tokens = this.generateTokens(user);
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      // impede enumeração de e-mails por tempo de resposta quando um e-mail não existe
      await randomSleep(1000, 4000);
      return;
    }

    const token = this.generateRandomToken();
    const passwordResetTokenExpirationInMs: number = this.configService.get(
      'PASSWORD_RESET_TOKEN_EXPIRATION_IN_MS',
      60 * 60 * 1000,
    );
    const expiresAt = new Date(Date.now() + passwordResetTokenExpirationInMs);

    await this.passwordResetRepository.create({
      user,
      token,
      expiresAt,
    });

    try {
      const baseUrl = this.configService.get<string>(
        'FRONT_URL',
        'http://localhost:3001',
      );
      const resetUrl = `${baseUrl}/reset-password?token=${token}`;

      await this.emailService.sendPasswordResetEmail({
        name: user.name,
        email: user.email,
        resetUrl,
        resetToken: token,
      });

      this.logger.log(`Password reset email sent to: ${email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send password reset email to ${email}:`,
        error,
      );
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const passwordReset =
      await this.passwordResetRepository.findValidByToken(token);

    if (!passwordReset) {
      throw new BadRequestException('Token inválido ou expirado');
    }

    const hashedPassword = await hashPassword(newPassword);

    await this.userRepository.update(passwordReset.user.id, {
      passwordHash: hashedPassword,
    });

    await this.passwordResetRepository.delete(passwordReset.id);
  }

  private generateRandomToken(): string {
    return v6();
  }
}
