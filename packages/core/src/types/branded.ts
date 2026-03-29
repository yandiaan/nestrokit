/**
 * Branded Types
 *
 * Branded types add compile-time safety by creating distinct types
 * that are structurally the same but nominally different.
 *
 * This prevents mixing up different IDs or values of the same primitive type.
 *
 * @example
 * const userId = UserId('user_123'); // Type: UserId
 * const postId = PostId('post_456'); // Type: PostId
 * // userId = postId; // ❌ TypeScript error!
 */

/**
 * Brand symbol for creating branded types
 */
declare const brand: unique symbol;

/**
 * Base branded type
 */
export type Brand<T, B> = T & { readonly [brand]: B };

/**
 * Create a branded type constructor
 */
export const createBrand = <T, B extends string>() => {
  return (value: T): Brand<T, B> => value as Brand<T, B>;
};

// ============================================
// Common Branded Types
// ============================================

/**
 * User ID branded type
 */
export type UserId = Brand<string, 'UserId'>;
export const UserId = createBrand<string, 'UserId'>();

/**
 * Email branded type - represents a validated email
 */
export type Email = Brand<string, 'Email'>;
export const Email = createBrand<string, 'Email'>();

/**
 * UUID branded type
 */
export type UUID = Brand<string, 'UUID'>;
export const UUID = createBrand<string, 'UUID'>();

/**
 * Positive integer branded type
 */
export type PositiveInt = Brand<number, 'PositiveInt'>;
export const PositiveInt = (value: number): PositiveInt => {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`Value must be a positive integer, got: ${value}`);
  }
  return value as PositiveInt;
};

/**
 * Non-empty string branded type
 */
export type NonEmptyString = Brand<string, 'NonEmptyString'>;
export const NonEmptyString = (value: string): NonEmptyString => {
  if (value.trim().length === 0) {
    throw new Error('Value must be a non-empty string');
  }
  return value as NonEmptyString;
};

/**
 * URL branded type
 */
export type UrlString = Brand<string, 'UrlString'>;
export const UrlString = (value: string): UrlString => {
  if (!/^https?:\/\//i.test(value)) {
    throw new Error(`Invalid URL: ${value}`);
  }
  return value as UrlString;
};

/**
 * Timestamp branded type (milliseconds since epoch)
 */
export type Timestamp = Brand<number, 'Timestamp'>;
export const Timestamp = createBrand<number, 'Timestamp'>();

/**
 * ISO date string branded type
 */
export type ISODateString = Brand<string, 'ISODateString'>;
export const ISODateString = createBrand<string, 'ISODateString'>();

// ============================================
// Utility types for extracting underlying type
// ============================================

/**
 * Extract the underlying type from a branded type
 */
export type Unbrand<T> = T extends Brand<infer U, unknown> ? U : T;

/**
 * Check if a value is a branded type (runtime - always true, compile-time check matters)
 */
export const isBranded = <T>(_value: T): _value is T => true;
