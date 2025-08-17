import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../enums';

/**
 * Metadata key for roles
 */
export const ROLES_KEY = 'roles';

/**
 * Decorator to specify which roles can access a route
 * @param roles - Array of roles that can access the route
 *
 * @example
 * ```typescript
 * @Roles(Role.ADMINISTRATOR)
 * @Get('admin-only')
 * adminOnlyRoute() {
 *   return 'Only administrators can access this';
 * }
 *
 * @Roles(Role.ADMINISTRATOR, Role.MANAGER)
 * @Get('admin-or-manager')
 * adminOrManagerRoute() {
 *   return 'Administrators and managers can access this';
 * }
 * ```
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
