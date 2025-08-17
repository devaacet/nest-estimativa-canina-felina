import { UserRole } from 'src/shared';

export interface IAccessTokenPayload {
  sub: string;
  email: string;
  role: UserRole;
  cityIds: string[];
}

export interface IRefreshTokenPayload {
  sub: string;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}
