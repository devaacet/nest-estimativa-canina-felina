export interface IRequest extends Request {
  cookies: { access_token?: string; refresh_token?: string };
}
