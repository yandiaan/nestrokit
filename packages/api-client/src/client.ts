/**
 * Custom Fetch Client
 *
 * Configured fetch instance with:
 * - Base URL configuration
 * - Auth token injection
 * - Response error handling
 */

export interface FetchConfig {
  baseUrl?: string;
  getToken?: () => string | null | Promise<string | null>;
  onUnauthorized?: () => void;
}

let config: FetchConfig = {
  baseUrl: '',
};

/**
 * Configure the fetch client
 */
export function configureFetch(newConfig: FetchConfig): void {
  config = { ...config, ...newConfig };
}

/**
 * Get the current configuration
 */
export function getFetchConfig(): FetchConfig {
  return config;
}

export interface CustomFetchOptions extends RequestInit {
  /** Skip authentication for this request */
  skipAuth?: boolean;
}

/**
 * Custom fetch function for orval-generated API client
 */
export async function customFetch<T>(
  url: string,
  options: CustomFetchOptions = {},
): Promise<T> {
  const { skipAuth, ...fetchOptions } = options;

  // Build full URL
  const fullUrl = url.startsWith('http') ? url : `${config.baseUrl}${url}`;

  // Build headers
  const headers = new Headers(fetchOptions.headers);

  // Add content-type if not set and body exists
  if (fetchOptions.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Add auth token if available and not skipped
  if (!skipAuth && config.getToken) {
    const token = await config.getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  // Make request
  const response = await fetch(fullUrl, {
    ...fetchOptions,
    headers,
  });

  // Handle 401 Unauthorized
  if (response.status === 401 && config.onUnauthorized) {
    config.onUnauthorized();
  }

  // Parse response
  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');

  let data: unknown;
  if (isJson) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  // Handle error responses
  if (!response.ok) {
    const error = new ApiError(
      response.status,
      response.statusText,
      data as Record<string, unknown>,
    );
    throw error;
  }

  return data as T;
}

/**
 * API Error class
 */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    public readonly data?: Record<string, unknown>,
  ) {
    const message = (data as { message?: string })?.message || statusText;
    super(message);
    this.name = 'ApiError';
  }

  /**
   * Check if this is a validation error
   */
  isValidationError(): boolean {
    return this.status === 400;
  }

  /**
   * Check if this is an authentication error
   */
  isAuthError(): boolean {
    return this.status === 401;
  }

  /**
   * Check if this is a forbidden error
   */
  isForbiddenError(): boolean {
    return this.status === 403;
  }

  /**
   * Check if this is a not found error
   */
  isNotFoundError(): boolean {
    return this.status === 404;
  }

  /**
   * Get error details from response
   */
  getDetails(): Record<string, unknown> | undefined {
    return (this.data as { error?: { details?: Record<string, unknown> } })?.error?.details;
  }
}

export default customFetch;
