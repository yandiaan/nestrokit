/**
 * @repo/api-client
 *
 * Type-safe API client generated from OpenAPI spec.
 *
 * Usage:
 * 1. Start the API server: pnpm --filter @repo/api dev
 * 2. Generate client: pnpm --filter @repo/api-client generate
 * 3. Import and use:
 *
 * ```ts
 * import { configureFetch, api } from '@repo/api-client';
 *
 * // Configure the client
 * configureFetch({
 *   baseUrl: 'http://localhost:3001/api',
 *   getToken: () => localStorage.getItem('accessToken'),
 *   onUnauthorized: () => {
 *     // Handle token expiry
 *   },
 * });
 *
 * // Use the API
 * const { data } = await api.getUsers();
 * ```
 */

// Re-export client utilities
export {
  configureFetch,
  getFetchConfig,
  customFetch,
  ApiError,
  type FetchConfig,
  type CustomFetchOptions,
} from './client';

// Re-export generated API (will be available after running 'generate')
// export * from './generated/api';
// export * from './generated/schemas';

/**
 * Placeholder types until API is generated
 * These will be replaced by actual types from orval generation
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    timestamp: string;
  };
}
