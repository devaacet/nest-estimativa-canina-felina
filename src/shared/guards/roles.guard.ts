/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserRole } from '../enums';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { IAccessTokenPayload } from '../../apps/auth/interfaces/token.interface';

/**
 * Extended Request interface to include user data
 */
export interface AuthenticatedRequest extends Request {
  user: IAccessTokenPayload;
}

/**
 * Guard that handles both authentication and role-based authorization
 *
 * This guard:
 * 1. Checks if the route is marked as @Public() and skips authentication if so
 * 2. Extracts JWT token from 'accessToken' cookie
 * 3. Validates the JWT token
 * 4. Checks if user has required roles (if @Roles() decorator is present)
 * 5. Attaches user data to request object for use in controllers
 */
@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      this.logger.debug('Public route accessed, skipping authentication');
      return true;
    }

    const token = this.extractTokenFromCookie(request);
    if (!token) {
      this.logger.warn('Access token not found in cookies');
      throw new UnauthorizedException('Access token not found');
    }

    let payload: IAccessTokenPayload;
    try {
      payload = await this.jwtService.verifyAsync<IAccessTokenPayload>(token);
      this.logger.debug(`Token validated for user: ${payload.email}`);
    } catch (error) {
      this.logger.warn(`Invalid token: ${error?.message}`);
      throw new UnauthorizedException('Invalid or expired token');
    }

    request.user = payload;

    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      this.logger.debug('No specific roles required, access granted');
      return true;
    }

    const userRole = payload.role;
    const hasRequiredRole = requiredRoles.some((role) => role === userRole);

    if (!hasRequiredRole) {
      this.logger.warn(
        `Access denied. User role: ${userRole}, Required roles: ${requiredRoles.join(', ')}`,
      );
      throw new ForbiddenException(
        `Access denied. Required roles: ${requiredRoles.join(', ')}`,
      );
    }

    this.logger.debug(
      `Access granted. User role: ${userRole} matches required roles: ${requiredRoles.join(', ')}`,
    );
    return true;
  }

  /**
   * Extracts JWT token from 'access_token' cookie
   */
  private extractTokenFromCookie(request: Request): string | undefined {
    const cookies = request.cookies;
    if (!cookies || !cookies.access_token) {
      return undefined;
    }
    return cookies.access_token;
  }
}
