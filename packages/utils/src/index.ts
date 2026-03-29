/**
 * @repo/utils - Shared utility functions
 *
 * This package provides:
 * - fp-ts helpers for TaskEither and Option
 * - Common string utilities
 * - Common date utilities
 *
 * All functions are pure (no side effects) and tree-shakeable.
 *
 * @example
 * ```ts
 * // Import everything
 * import { slugify, pipe, TE } from '@repo/utils';
 *
 * // Import specific modules
 * import { slugify } from '@repo/utils/common';
 * import { unwrapOrThrow, pipe, TE } from '@repo/utils/fp';
 * ```
 */

// fp-ts utilities
export * from './fp';

// Common utilities
export * from './common';
