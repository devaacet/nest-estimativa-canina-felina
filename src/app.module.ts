import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createTypeOrmConfig } from './shared/database/typeorm.config';

// Domain Modules
import { AuthModule } from './apps/auth/auth.module';
import { CityModule } from './apps/city/city.module';
import { FormModule } from './apps/form/form.module';
import { AnimalsModule } from './apps/animals/animals.module';
import { AuditModule } from './apps/audit/audit.module';
import { UserModule } from './apps/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: createTypeOrmConfig,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET', 'your-secret-key'),
        signOptions: {
          expiresIn: configService.get('JWT_ACCESS_EXPIRATION', '15m'),
        },
        global: true,
      }),
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get('THROTTLE_TTL_LIMIT_IN_MS', 60000),
          limit: config.get('THROTTLE_REQUEST_LIMIT', 10),
        },
      ],
    }),

    // Domain Modules
    AuthModule,
    CityModule,
    FormModule,
    AnimalsModule,
    AuditModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
