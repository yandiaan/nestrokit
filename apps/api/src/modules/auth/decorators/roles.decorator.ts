/**
 * Roles Decorator
 *
 * Restricts access to specific user roles.
 * Must be used with RolesGuard.
 */

import { SetMetadata } from '@nestjs/common';
import type { UserRole } from '@repo/database';

export const ROLES_KEY = 'roles';

/**
 * Require specific roles to access a route
 *
 * @example
 * ```ts
 * @Roles('ADMIN')
 * @Get('admin-only')
 * adminMethod() { ... }
 * ```
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
