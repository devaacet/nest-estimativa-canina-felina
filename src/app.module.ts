import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createTypeOrmConfig } from './shared/database/typeorm.config';
import {
  GlobalExceptionFilter,
  ResponseInterceptor,
  RolesGuard,
  minsToMs,
} from './shared';

// Domain Modules
import { AuthModule } from './apps/auth/auth.module';
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
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get<number>('THROTTLE_TTL_LIMIT_IN_MS', minsToMs(10)),
          limit: config.get('THROTTLE_REQUEST_LIMIT', 10),
        },
      ],
    }),

    // Domain Modules
    AuthModule,
    // CityModule,
    // FormModule,
    // AnimalsModule,
    // AuditModule,
    UserModule,
  ],
  controllers: [],
  providers: [
    // Global Response Interceptor
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    // Global Exception Filter
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    // Global Roles Guard for authentication and authorization
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
