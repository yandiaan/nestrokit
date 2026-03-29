/**
 * Public Decorator
 *
 * Marks a route as public (no authentication required).
 * Use on controller methods or entire controllers.
 */

import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Mark route as public (skip JWT authentication)
 *
 * @example
 * ```ts
 * @Public()
 * @Get('public-endpoint')
 * publicMethod() { ... }
 * ```
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
