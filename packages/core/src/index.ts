/**
 * @repo/core
 *
 * Shared core package containing:
 * - Branded types for type-safe IDs
 * - Domain error types
 * - Zod schemas for validation
 *
 * Note: Domain logic (services, repositories) lives in apps/api
 */

// Types
export * from './types';

// Errors
export * from './errors';

// Schemas
export * from './schemas';
