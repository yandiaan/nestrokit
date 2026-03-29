/**
 * Domain Error Types
 *
 * Structured error types for domain-level error handling.
 * These errors are used throughout the application and can be
 * mapped to HTTP status codes at the API boundary.
 */

/**
 * Error codes for domain errors
 */
export const ErrorCode = {
  // Validation errors (400)
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  INVALID_FORMAT: 'INVALID_FORMAT',

  // Authentication errors (401)
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',

  // Authorization errors (403)
  FORBIDDEN: 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',

  // Not found errors (404)
  NOT_FOUND: 'NOT_FOUND',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  USER_NOT_FOUND: 'USER_NOT_FOUND',

  // Conflict errors (409)
  CONFLICT: 'CONFLICT',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',

  // Rate limiting errors (429)
  RATE_LIMITED: 'RATE_LIMITED',
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',

  // Server errors (500)
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',

  // Misc
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

/**
 * Base domain error class
 */
export class DomainError extends Error {
  readonly code: ErrorCode;
  readonly details: Record<string, unknown> | undefined;
  readonly timestamp: Date;
  readonly isOperational: boolean;

  constructor(
    code: ErrorCode,
    message: string,
    details?: Record<string, unknown>,
    isOperational = true
  ) {
    super(message);
    this.name = 'DomainError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date();
    this.isOperational = isOperational;

    // Maintain proper stack trace (V8 only)
    if ('captureStackTrace' in Error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      (Error as { captureStackTrace?: (target: object, constructor: Function) => void })
        .captureStackTrace?.(this, this.constructor);
    }
  }

  /**
   * Convert to plain object for serialization
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      details: this.details,
      timestamp: this.timestamp.toISOString(),
    };
  }

  /**
   * Get HTTP status code for this error
   */
  get httpStatus(): number {
    switch (this.code) {
      case ErrorCode.VALIDATION_ERROR:
      case ErrorCode.INVALID_INPUT:
      case ErrorCode.INVALID_FORMAT:
        return 400;

      case ErrorCode.UNAUTHORIZED:
      case ErrorCode.INVALID_CREDENTIALS:
      case ErrorCode.TOKEN_EXPIRED:
      case ErrorCode.TOKEN_INVALID:
        return 401;

      case ErrorCode.FORBIDDEN:
      case ErrorCode.INSUFFICIENT_PERMISSIONS:
        return 403;

      case ErrorCode.NOT_FOUND:
      case ErrorCode.RESOURCE_NOT_FOUND:
      case ErrorCode.USER_NOT_FOUND:
        return 404;

      case ErrorCode.CONFLICT:
      case ErrorCode.ALREADY_EXISTS:
      case ErrorCode.DUPLICATE_ENTRY:
        return 409;

      case ErrorCode.RATE_LIMITED:
      case ErrorCode.TOO_MANY_REQUESTS:
        return 429;

      case ErrorCode.INTERNAL_ERROR:
      case ErrorCode.DATABASE_ERROR:
      case ErrorCode.EXTERNAL_SERVICE_ERROR:
      case ErrorCode.UNKNOWN_ERROR:
      default:
        return 500;
    }
  }
}

// ============================================
// Specialized error classes
// ============================================

/**
 * Validation error with field-level details
 */
export class ValidationError extends DomainError {
  readonly fields: Record<string, string[]>;

  constructor(fields: Record<string, string[]>, message = 'Validation failed') {
    super(ErrorCode.VALIDATION_ERROR, message, { fields });
    this.name = 'ValidationError';
    this.fields = fields;
  }

  static fromZodError(zodError: { issues: Array<{ path: (string | number)[]; message: string }> }): ValidationError {
    const fields: Record<string, string[]> = {};
    for (const issue of zodError.issues) {
      const path = issue.path.join('.');
      if (!fields[path]) {
        fields[path] = [];
      }
      fields[path].push(issue.message);
    }
    return new ValidationError(fields);
  }
}

/**
 * Not found error
 */
export class NotFoundError extends DomainError {
  readonly resource: string;
  readonly identifier: string | undefined;

  constructor(resource: string, identifier?: string) {
    const message = identifier
      ? `${resource} with identifier '${identifier}' not found`
      : `${resource} not found`;
    super(ErrorCode.NOT_FOUND, message, { resource, identifier });
    this.name = 'NotFoundError';
    this.resource = resource;
    this.identifier = identifier;
  }
}

/**
 * Unauthorized error
 */
export class UnauthorizedError extends DomainError {
  constructor(message = 'Authentication required') {
    super(ErrorCode.UNAUTHORIZED, message);
    this.name = 'UnauthorizedError';
  }

  static invalidCredentials(): UnauthorizedError {
    const error = new UnauthorizedError('Invalid credentials');
    (error as { code: ErrorCode }).code = ErrorCode.INVALID_CREDENTIALS;
    return error;
  }

  static tokenExpired(): UnauthorizedError {
    const error = new UnauthorizedError('Token has expired');
    (error as { code: ErrorCode }).code = ErrorCode.TOKEN_EXPIRED;
    return error;
  }

  static tokenInvalid(): UnauthorizedError {
    const error = new UnauthorizedError('Invalid token');
    (error as { code: ErrorCode }).code = ErrorCode.TOKEN_INVALID;
    return error;
  }
}

/**
 * Forbidden error
 */
export class ForbiddenError extends DomainError {
  constructor(message = 'Access denied') {
    super(ErrorCode.FORBIDDEN, message);
    this.name = 'ForbiddenError';
  }

  static insufficientPermissions(required: string[]): ForbiddenError {
    const error = new ForbiddenError(`Insufficient permissions. Required: ${required.join(', ')}`);
    (error as { code: ErrorCode }).code = ErrorCode.INSUFFICIENT_PERMISSIONS;
    return error;
  }
}

/**
 * Conflict error (e.g., duplicates)
 */
export class ConflictError extends DomainError {
  readonly conflictField: string | undefined;

  constructor(message: string, conflictField?: string) {
    super(ErrorCode.CONFLICT, message, { conflictField });
    this.name = 'ConflictError';
    this.conflictField = conflictField;
  }

  static alreadyExists(resource: string, field?: string): ConflictError {
    const error = new ConflictError(
      field ? `${resource} with this ${field} already exists` : `${resource} already exists`,
      field
    );
    (error as { code: ErrorCode }).code = ErrorCode.ALREADY_EXISTS;
    return error;
  }
}

/**
 * Internal error (for unexpected issues)
 */
export class InternalError extends DomainError {
  readonly originalError: Error | undefined;

  constructor(message = 'An internal error occurred', originalError?: Error) {
    super(ErrorCode.INTERNAL_ERROR, message, undefined, false);
    this.name = 'InternalError';
    this.originalError = originalError;
  }

  static fromError(error: unknown): InternalError {
    if (error instanceof Error) {
      return new InternalError(error.message, error);
    }
    return new InternalError(String(error));
  }
}

// ============================================
// Error type guards
// ============================================

export const isDomainError = (error: unknown): error is DomainError =>
  error instanceof DomainError;

export const isValidationError = (error: unknown): error is ValidationError =>
  error instanceof ValidationError;

export const isNotFoundError = (error: unknown): error is NotFoundError =>
  error instanceof NotFoundError;

export const isUnauthorizedError = (error: unknown): error is UnauthorizedError =>
  error instanceof UnauthorizedError;

export const isForbiddenError = (error: unknown): error is ForbiddenError =>
  error instanceof ForbiddenError;

export const isConflictError = (error: unknown): error is ConflictError =>
  error instanceof ConflictError;

export const isInternalError = (error: unknown): error is InternalError =>
  error instanceof InternalError;
