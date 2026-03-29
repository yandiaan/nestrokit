/**
 * Prisma Error Mapping
 *
 * Maps Prisma errors to domain errors for consistent error handling.
 */

import { Prisma } from '@prisma/client';
import {
  DomainError,
  NotFoundError,
  ConflictError,
  ValidationError,
  InternalError,
} from '@repo/core/errors';

/**
 * Known Prisma error codes
 * @see https://www.prisma.io/docs/reference/api-reference/error-reference
 */
export const PrismaErrorCode = {
  // Common errors
  UNIQUE_CONSTRAINT: 'P2002',
  FOREIGN_KEY_CONSTRAINT: 'P2003',
  RECORD_NOT_FOUND: 'P2025',
  REQUIRED_RELATION: 'P2014',
  INVALID_ID: 'P2023',
  
  // Query errors
  INVALID_DATA: 'P2000',
  VALUE_TOO_LONG: 'P2001',
  NULL_CONSTRAINT: 'P2011',
  MISSING_REQUIRED: 'P2012',
  
  // Connection errors
  CONNECTION_ERROR: 'P1001',
  CONNECTION_TIMEOUT: 'P1002',
  DB_NOT_FOUND: 'P1003',
  
  // Migration errors
  MIGRATION_ERROR: 'P3000',
} as const;

/**
 * Map Prisma error to domain error
 */
export const mapPrismaError = (error: unknown): DomainError => {
  // Handle Prisma known errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return mapKnownError(error);
  }

  // Handle validation errors
  if (error instanceof Prisma.PrismaClientValidationError) {
    return new ValidationError(
      { prisma: [error.message] },
      'Database validation error'
    );
  }

  // Handle initialization errors
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return new InternalError(
      'Database connection failed',
      error
    );
  }

  // Handle Rust panic errors
  if (error instanceof Prisma.PrismaClientRustPanicError) {
    return new InternalError(
      'Critical database error',
      error
    );
  }

  // Handle unknown errors
  if (error instanceof Error) {
    return InternalError.fromError(error);
  }

  return new InternalError(String(error));
};

/**
 * Map known Prisma errors to domain errors
 */
const mapKnownError = (
  error: Prisma.PrismaClientKnownRequestError
): DomainError => {
  switch (error.code) {
    // Unique constraint violation
    case PrismaErrorCode.UNIQUE_CONSTRAINT: {
      const target = error.meta?.['target'] as string[] | undefined;
      const field = target?.[0] ?? 'field';
      return ConflictError.alreadyExists('Record', field);
    }

    // Record not found
    case PrismaErrorCode.RECORD_NOT_FOUND: {
      const modelName = error.meta?.['modelName'] as string | undefined;
      return new NotFoundError(modelName ?? 'Record');
    }

    // Foreign key constraint
    case PrismaErrorCode.FOREIGN_KEY_CONSTRAINT: {
      const fieldName = error.meta?.['field_name'] as string | undefined;
      return new ValidationError(
        { [fieldName ?? 'relation']: ['Related record not found'] },
        'Foreign key constraint violation'
      );
    }

    // Null constraint violation
    case PrismaErrorCode.NULL_CONSTRAINT: {
      const target = error.meta?.['target'] as string[] | undefined;
      const field = target?.[0] ?? 'field';
      return new ValidationError(
        { [field]: ['This field is required'] },
        'Required field missing'
      );
    }

    // Value too long
    case PrismaErrorCode.VALUE_TOO_LONG: {
      const column = error.meta?.['column_name'] as string | undefined;
      return new ValidationError(
        { [column ?? 'field']: ['Value is too long'] },
        'Value exceeds maximum length'
      );
    }

    // Connection errors
    case PrismaErrorCode.CONNECTION_ERROR:
    case PrismaErrorCode.CONNECTION_TIMEOUT:
    case PrismaErrorCode.DB_NOT_FOUND:
      return new InternalError('Database connection error', error);

    // Default: wrap as internal error
    default:
      return new InternalError(
        `Database error: ${error.code}`,
        error
      );
  }
};

/**
 * Check if error is a Prisma error
 */
export const isPrismaError = (error: unknown): boolean =>
  error instanceof Prisma.PrismaClientKnownRequestError ||
  error instanceof Prisma.PrismaClientValidationError ||
  error instanceof Prisma.PrismaClientInitializationError ||
  error instanceof Prisma.PrismaClientRustPanicError;

/**
 * Check if error is a unique constraint violation
 */
export const isUniqueConstraintError = (error: unknown): boolean =>
  error instanceof Prisma.PrismaClientKnownRequestError &&
  error.code === PrismaErrorCode.UNIQUE_CONSTRAINT;

/**
 * Check if error is a not found error
 */
export const isNotFoundError = (error: unknown): boolean =>
  error instanceof Prisma.PrismaClientKnownRequestError &&
  error.code === PrismaErrorCode.RECORD_NOT_FOUND;
