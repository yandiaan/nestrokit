/**
 * @repo/database
 *
 * Database package with Prisma ORM.
 * Provides:
 * - Prisma client singleton
 * - Repository pattern with fp-ts TaskEither
 * - Error mapping to domain errors
 */

// Client
export {
  prisma,
  connect,
  disconnect,
  healthCheck,
  type PrismaClient,
} from './client';

// Errors
export { mapPrismaError, isPrismaError, PrismaErrorCode } from './errors';

// Repositories
export * from './repositories';

// Re-export Prisma types
export { UserRole } from '@prisma/client';
export type { User, RefreshToken, Prisma } from '@prisma/client';
