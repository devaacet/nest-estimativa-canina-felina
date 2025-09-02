/* eslint-disable @typescript-eslint/no-unsafe-return */

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { IAccessTokenPayload } from 'src/apps/auth/interfaces/token.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.access_token;
        },
      ]),
      secretOrKey: configService.get<string>('JWT_SECRET', 'your-secret-key'),
    });
  }

  validate(payload: IAccessTokenPayload) {
    return {
      id: payload.sub,
      role: payload.role,
      cityIds: payload.cityIds,
    };
  }
}
