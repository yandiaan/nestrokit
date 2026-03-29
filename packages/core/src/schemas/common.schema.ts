/**
 * Common Schemas
 *
 * Shared Zod schemas used across the application.
 */

import { z } from 'zod';

// ============================================
// Pagination schemas
// ============================================

/**
 * Base pagination query
 */
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

/**
 * Pagination meta information
 */
export const paginationMetaSchema = z.object({
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  totalPages: z.number().int().nonnegative(),
});

export type PaginationMeta = z.infer<typeof paginationMetaSchema>;

/**
 * Create paginated response schema
 */
export const createPaginatedSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    meta: paginationMetaSchema,
  });

// ============================================
// ID schemas
// ============================================

/**
 * UUID schema
 */
export const uuidSchema = z.string().uuid('Invalid UUID format');

/**
 * ID parameter schema
 */
export const idParamSchema = z.object({
  id: uuidSchema,
});

export type IdParam = z.infer<typeof idParamSchema>;

// ============================================
// Search & Sort schemas
// ============================================

/**
 * Sort order enum
 */
export const SortOrder = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];

export const sortOrderSchema = z.enum([SortOrder.ASC, SortOrder.DESC]);

/**
 * Search query schema
 */
export const searchQuerySchema = z.object({
  q: z.string().min(1).max(255).optional(),
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;

// ============================================
// API Response schemas
// ============================================

/**
 * Success response wrapper
 */
export const successResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
  });

/**
 * Error response schema
 */
export const errorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.record(z.unknown()).optional(),
  }),
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;

/**
 * API response union type
 */
export const createApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.union([successResponseSchema(dataSchema), errorResponseSchema]);

// ============================================
// Date schemas
// ============================================

/**
 * Date range schema
 */
export const dateRangeSchema = z
  .object({
    from: z.coerce.date(),
    to: z.coerce.date(),
  })
  .refine((data) => data.from <= data.to, {
    message: 'Start date must be before or equal to end date',
    path: ['from'],
  });

export type DateRange = z.infer<typeof dateRangeSchema>;

/**
 * Optional date range schema
 */
export const optionalDateRangeSchema = z.object({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

export type OptionalDateRange = z.infer<typeof optionalDateRangeSchema>;
