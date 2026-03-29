/**
 * Prisma Client Singleton
 *
 * Ensures only one PrismaClient instance is created in development
 * to prevent connection exhaustion during hot reloading.
 */

import { PrismaClient, Prisma } from '@prisma/client';

// Extend the global type to include prisma
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

/**
 * Get log configuration based on environment
 */
const getLogConfig = (): Prisma.LogLevel[] => {
  const isDev = typeof globalThis.process !== 'undefined' 
    && globalThis.process.env?.['NODE_ENV'] === 'development';
  return isDev ? ['query', 'error', 'warn'] : ['error'];
};

/**
 * Check if we're in production
 */
const isProduction = (): boolean => {
  return typeof globalThis.process !== 'undefined'
    && globalThis.process.env?.['NODE_ENV'] === 'production';
};

/**
 * Create or reuse PrismaClient instance
 */
const createPrismaClient = (): PrismaClient => {
  return new PrismaClient({
    log: getLogConfig(),
  });
};

/**
 * Singleton Prisma client
 * In development, reuse the client to prevent connection exhaustion
 * In production, create a new client
 */
export const prisma: PrismaClient =
  globalThis.prisma ?? createPrismaClient();

// Save reference in development to prevent multiple instances
if (!isProduction()) {
  globalThis.prisma = prisma;
}

/**
 * Disconnect from database
 * Useful for graceful shutdown
 */
export const disconnect = async (): Promise<void> => {
  await prisma.$disconnect();
};

/**
 * Connect to database
 * Usually called at application startup
 */
export const connect = async (): Promise<void> => {
  await prisma.$connect();
};

/**
 * Health check - verify database connection
 */
export const healthCheck = async (): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
};

// Re-export Prisma types for convenience
export { PrismaClient } from '@prisma/client';
export type { User, RefreshToken, UserRole } from '@prisma/client';
