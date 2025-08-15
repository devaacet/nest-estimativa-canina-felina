export interface IAccessTokenPayload {
  sub: string;
  email: string;
  role: string;
}

export interface IRefreshTokenPayload {
  sub: string;
}
