/**
 * Date utility functions
 * Uses date-fns as the foundation
 * All functions are pure - no side effects
 */

// Re-export commonly used date-fns functions for direct access
export {
  // Formatting
  format,
  formatDistance,
  formatDistanceToNow,
  formatRelative,
  formatDuration,
  formatISO,
  formatRFC3339,
  // Parsing
  parse,
  parseISO,
  parseJSON,
  isValid,
  // Comparison
  isAfter,
  isBefore,
  isEqual,
  isSameDay,
  isSameMonth,
  isSameYear,
  isWithinInterval,
  compareAsc,
  compareDesc,
  // Manipulation
  add,
  sub,
  addDays,
  addWeeks,
  addMonths,
  addYears,
  addHours,
  addMinutes,
  subDays,
  subWeeks,
  subMonths,
  subYears,
  // Start/End of
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  // Getters
  getYear,
  getMonth,
  getDate,
  getDay,
  getHours,
  getMinutes,
  getSeconds,
  // Setters
  setYear,
  setMonth,
  setDate,
  setHours,
  setMinutes,
  setSeconds,
  // Intervals
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  // Misc
  max,
  min,
  clamp,
  closestTo,
  isToday,
  isTomorrow,
  isYesterday,
  isPast,
  isFuture,
  isWeekend,
} from 'date-fns';

import {
  format,
  formatDistanceToNow,
  parseISO as dfParseISO,
  isValid,
} from 'date-fns';

// ============================================
// Custom utilities built on top of date-fns
// ============================================

/**
 * Parse date from various formats
 * Returns null if invalid
 */
export const safeParse = (value: string | Date | number | null | undefined): Date | null => {
  if (value === null || value === undefined) return null;
  if (value instanceof Date) return isValid(value) ? value : null;
  if (typeof value === 'number') {
    const date = new Date(value);
    return isValid(date) ? date : null;
  }
  const parsed = dfParseISO(value);
  return isValid(parsed) ? parsed : null;
};

/**
 * Format date or return fallback if invalid
 * @example formatSafe(new Date(), "yyyy-MM-dd", "-") // "2024-01-15"
 * @example formatSafe(null, "yyyy-MM-dd", "-") // "-"
 */
export const formatSafe = (
  date: Date | string | number | null | undefined,
  formatStr: string,
  fallback = '-'
): string => {
  const parsed = safeParse(date);
  return parsed ? format(parsed, formatStr) : fallback;
};

/**
 * Human-readable relative time
 * @example timeAgo(new Date(Date.now() - 3600000)) // "about 1 hour ago"
 */
export const timeAgo = (date: Date | string, addSuffix = true): string => {
  const parsed = safeParse(date);
  if (!parsed) return '';
  return formatDistanceToNow(parsed, { addSuffix });
};

/**
 * Get date range as human-readable string
 * @example dateRange(start, end) // "Jan 15 - Jan 20, 2024"
 */
export const dateRange = (start: Date, end: Date, formatStr = 'MMM d'): string => {
  const startFormatted = format(start, formatStr);
  const endFormatted = format(end, `${formatStr}, yyyy`);
  return `${startFormatted} - ${endFormatted}`;
};

/**
 * Get business days between dates (excludes weekends)
 */
export const businessDaysBetween = (start: Date, end: Date): number => {
  let count = 0;
  const current = new Date(start.getTime());
  while (current <= end) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) count++;
    current.setDate(current.getDate() + 1);
  }
  return count;
};

/**
 * Get duration in human-readable format
 * @example humanDuration(3661000) // "1h 1m 1s"
 */
export const humanDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours % 24 > 0) parts.push(`${hours % 24}h`);
  if (minutes % 60 > 0) parts.push(`${minutes % 60}m`);
  if (seconds % 60 > 0 || parts.length === 0) parts.push(`${seconds % 60}s`);

  return parts.join(' ');
};

/**
 * Check if date is between two dates (inclusive)
 */
export const isBetween = (date: Date, start: Date, end: Date): boolean =>
  date >= start && date <= end;

/**
 * Get age from birthdate
 */
export const getAge = (birthDate: Date, referenceDate = new Date()): number => {
  let age = referenceDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = referenceDate.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

/**
 * Create Date from parts (more readable than new Date(y, m, d))
 * Month is 1-indexed (1 = January) unlike native Date
 */
export const createDate = (
  year: number,
  month: number,
  day: number,
  hours = 0,
  minutes = 0,
  seconds = 0
): Date => new Date(year, month - 1, day, hours, minutes, seconds);

/**
 * Get current timestamp in seconds (useful for JWT, APIs)
 */
export const nowInSeconds = (): number => Math.floor(Date.now() / 1000);

/**
 * Common date format presets
 */
export const DATE_FORMATS = {
  /** 2024-01-15 */
  ISO_DATE: 'yyyy-MM-dd',
  /** 2024-01-15T10:30:00 */
  ISO_DATETIME: "yyyy-MM-dd'T'HH:mm:ss",
  /** Jan 15, 2024 */
  READABLE: 'MMM d, yyyy',
  /** January 15, 2024 */
  LONG: 'MMMM d, yyyy',
  /** 01/15/2024 */
  US: 'MM/dd/yyyy',
  /** 15/01/2024 */
  EU: 'dd/MM/yyyy',
  /** 15 Jan 2024, 10:30 */
  DATETIME: 'd MMM yyyy, HH:mm',
  /** 10:30 AM */
  TIME: 'h:mm a',
  /** 10:30:45 */
  TIME_24H: 'HH:mm:ss',
  /** Mon, Jan 15 */
  SHORT_DAY: 'EEE, MMM d',
  /** Monday, January 15, 2024 */
  FULL: 'EEEE, MMMM d, yyyy',
} as const;
