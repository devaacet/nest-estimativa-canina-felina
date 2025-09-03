import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordReset } from './entities/password-reset.entity';
import { PasswordResetRepository } from './repositories/password-reset.repository';
import { minsToMs } from 'src/shared';
import { JwtStrategy } from 'src/apps/auth/guards/jwt.strategy';
import { UserModule } from 'src/apps/user/user.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PasswordReset]),
    UserModule,
    EmailModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'your-secret-key'),
        signOptions: {
          expiresIn: configService.get<number>(
            'JWT_ACCESS_EXPIRATION_IN_MS',
            minsToMs(15),
          ),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PasswordResetRepository],
  exports: [AuthService, PasswordResetRepository],
})
export class AuthModule {}
