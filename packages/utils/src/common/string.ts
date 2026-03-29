/**
 * String utility functions
 * Uses change-case for case transformations
 * All functions are pure - no side effects
 */

// Re-export all change-case functions for direct access
export {
  camelCase,
  capitalCase,
  constantCase,
  dotCase,
  kebabCase,
  noCase,
  pascalCase,
  pascalSnakeCase,
  pathCase,
  sentenceCase,
  snakeCase,
  trainCase,
} from 'change-case';

import { kebabCase } from 'change-case';

// ============================================
// Custom utilities
// ============================================

/**
 * Create URL-friendly slug from string
 * @example slugify("Hello World!") // "hello-world"
 */
export const slugify = (str: string): string =>
  kebabCase(str.replace(/[^\w\s-]/g, ''));

/**
 * Capitalize first letter only
 * @example capitalize("hello") // "Hello"
 */
export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Truncate string with ellipsis
 * @example truncate("Hello World", 8) // "Hello..."
 */
export const truncate = (str: string, maxLength: number, suffix = '...'): string =>
  str.length <= maxLength ? str : str.slice(0, maxLength - suffix.length) + suffix;

/**
 * Remove whitespace from both ends and collapse internal whitespace
 * @example normalizeWhitespace("  hello   world  ") // "hello world"
 */
export const normalizeWhitespace = (str: string): string =>
  str.trim().replace(/\s+/g, ' ');

/**
 * Check if string is empty or only whitespace
 */
export const isBlank = (str: string | null | undefined): boolean =>
  str === null || str === undefined || str.trim().length === 0;

/**
 * Check if string is non-empty and not only whitespace
 */
export const isNotBlank = (str: string | null | undefined): str is string =>
  !isBlank(str);

/**
 * Pad string to specified length
 */
export const padStart = (str: string, length: number, char = ' '): string =>
  str.padStart(length, char);

export const padEnd = (str: string, length: number, char = ' '): string =>
  str.padEnd(length, char);

/**
 * Generate random string (useful for IDs, tokens)
 * @example randomString(8) // "a1b2c3d4"
 */
export const randomString = (
  length: number,
  charset = 'abcdefghijklmnopqrstuvwxyz0123456789'
): string =>
  Array.from({ length }, () =>
    charset.charAt(Math.floor(Math.random() * charset.length))
  ).join('');

/**
 * Extract initials from name
 * @example initials("John Doe") // "JD"
 */
export const initials = (name: string, maxLength = 2): string =>
  name
    .split(/\s+/)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .slice(0, maxLength)
    .join('');

/**
 * Pluralize word based on count
 * @example pluralize(1, "item", "items") // "item"
 * @example pluralize(5, "item", "items") // "items"
 */
export const pluralize = (count: number, singular: string, plural: string): string =>
  count === 1 ? singular : plural;

/**
 * Mask sensitive string (e.g., email, phone)
 * @example mask("john@example.com", 4) // "john***********"
 */
export const mask = (str: string, visibleStart = 4, maskChar = '*'): string =>
  str.slice(0, visibleStart) + maskChar.repeat(Math.max(0, str.length - visibleStart));

/**
 * Check if string matches email pattern
 * Basic validation only - not RFC compliant
 */
export const isEmail = (str: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);

/**
 * Check if string matches URL pattern
 * Basic validation - checks for protocol and domain
 */
export const isUrl = (str: string): boolean =>
  /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(str);

/**
 * Strip HTML tags from string
 * @example stripHtml("<p>Hello</p>") // "Hello"
 */
export const stripHtml = (str: string): string =>
  str.replace(/<[^>]*>/g, '');

/**
 * Escape HTML special characters
 */
export const escapeHtml = (str: string): string =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

/**
 * Template literal tag for joining lines (removes extra whitespace)
 * @example dedent`
 *   Hello
 *   World
 * ` // "Hello\nWorld"
 */
export const dedent = (strings: TemplateStringsArray, ...values: unknown[]): string => {
  const raw = strings.reduce(
    (acc, str, i) => acc + str + (values[i] ?? ''),
    ''
  );
  const lines = raw.split('\n');
  const minIndent = lines
    .filter((line) => line.trim())
    .reduce((min, line) => {
      const indent = line.match(/^\s*/)?.[0].length ?? 0;
      return Math.min(min, indent);
    }, Infinity);
  return lines
    .map((line) => line.slice(minIndent))
    .join('\n')
    .trim();
};
