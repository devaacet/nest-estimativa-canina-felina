import { applyDecorators } from '@nestjs/common';
import { ApiHeader, ApiResponse } from '@nestjs/swagger';

/**
 * Decorator to document that the endpoint sets authentication cookies
 */
export function ApiSetsCookies() {
  return applyDecorators(
    ApiHeader({
      name: 'Set-Cookie',
      description: 'Authentication cookies will be set in the response',
      required: false,
      schema: {
        type: 'string',
        example:
          'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=None; Max-Age=900',
      },
    }),
    ApiResponse({
      status: 200,
      description:
        'Sets the following HTTP-only cookies in the response headers:',
      headers: {
        'Set-Cookie': {
          description: 'Authentication cookies',
          schema: {
            type: 'array',
            items: {
              type: 'string',
            },
            example: [
              'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=None; Max-Age=900',
              'refresh_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=None; Path=/auth; Max-Age=604800',
            ],
          },
        },
      },
    }),
  );
}

/**
 * Decorator to document that the endpoint requires authentication cookies
 */
export function ApiRequiresCookies() {
  return applyDecorators(
    ApiHeader({
      name: 'Cookie',
      description: 'Authentication cookies are required',
      required: true,
      schema: {
        type: 'string',
        example:
          'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; refresh_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Authentication cookies missing or invalid',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          data: { type: 'null', example: null },
          messages: {
            type: 'array',
            items: { type: 'string' },
            example: ['Authentication required'],
          },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'UNAUTHORIZED' },
              message: {
                type: 'string',
                example: 'Access denied. Authentication required.',
              },
            },
          },
        },
      },
    }),
  );
}

/**
 * Decorator to document that the endpoint requires refresh token cookie
 */
export function ApiRequiresRefreshCookie() {
  return applyDecorators(
    ApiHeader({
      name: 'Cookie',
      description: 'Refresh token cookie is required',
      required: true,
      schema: {
        type: 'string',
        example: 'refresh_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Refresh token cookie missing or invalid',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          data: { type: 'null', example: null },
          messages: {
            type: 'array',
            items: { type: 'string' },
            example: ['Invalid refresh token'],
          },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'UNAUTHORIZED' },
              message: {
                type: 'string',
                example: 'Invalid or expired refresh token.',
              },
            },
          },
        },
      },
    }),
  );
}

/**
 * Decorator to document that the endpoint clears authentication cookies
 */
export function ApiClearsCookies() {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: 'Clears authentication cookies from the browser',
      headers: {
        'Set-Cookie': {
          description: 'Cookies are cleared by setting Max-Age=0',
          schema: {
            type: 'array',
            items: {
              type: 'string',
            },
            example: [
              'access_token=; HttpOnly; Secure; SameSite=None; Max-Age=0',
              'refresh_token=; HttpOnly; Secure; SameSite=None; Path=/auth; Max-Age=0',
            ],
          },
        },
      },
    }),
  );
}
