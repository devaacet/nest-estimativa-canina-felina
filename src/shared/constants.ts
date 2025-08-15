import { IsStrongPasswordOptions } from 'class-validator';

export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'default',
  expiresIn: process.env.JWT_EXPIRES_IN || '60s',
  refreshTokenExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || '7d',
};
export const passwordValidation: IsStrongPasswordOptions = {
  minLength: 8,
  minNumbers: 1,
  minSymbols: 1,
  minLowercase: 1,
  minUppercase: 1,
};
