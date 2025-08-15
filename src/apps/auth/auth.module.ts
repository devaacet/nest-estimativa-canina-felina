import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordReset } from './entities/password-reset.entity';
import { UserRepository } from '../user/repositories/user.repository';
import { PasswordResetRepository } from './repositories/password-reset.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([PasswordReset]),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET', 'your-secret-key'),
        signOptions: {
          expiresIn: configService.get('JWT_ACCESS_EXPIRATION', '15m'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, PasswordResetRepository],
  exports: [
    AuthService,
    UserRepository,
    PasswordResetRepository,
    TypeOrmModule,
  ],
})
export class AuthModule {}
