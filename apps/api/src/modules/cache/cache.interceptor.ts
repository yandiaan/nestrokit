/**
 * Cache Interceptor
 *
 * Automatically caches GET request responses.
 * Use @CacheKey() and @CacheTTL() decorators to customize.
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import type { Request } from 'express';

import { CacheService } from './cache.service';

export const CACHE_KEY_METADATA = 'cache_key';
export const CACHE_TTL_METADATA = 'cache_ttl';
export const NO_CACHE_METADATA = 'no_cache';

/**
 * Set custom cache key for a route
 */
export const CacheKey = (key: string) => SetMetadata(CACHE_KEY_METADATA, key);

/**
 * Set custom TTL for a route (in seconds)
 */
export const CacheTTL = (ttl: number) => SetMetadata(CACHE_TTL_METADATA, ttl);

/**
 * Disable caching for a route
 */
export const NoCache = () => SetMetadata(NO_CACHE_METADATA, true);

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(
    private readonly cacheService: CacheService,
    private readonly reflector: Reflector,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    // Only cache GET requests
    const request = context.switchToHttp().getRequest<Request>();
    if (request.method !== 'GET') {
      return next.handle();
    }

    // Check if caching is disabled for this route
    const noCache = this.reflector.getAllAndOverride<boolean>(NO_CACHE_METADATA, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (noCache) {
      return next.handle();
    }

    // Skip if cache is not available
    if (!this.cacheService.isAvailable()) {
      return next.handle();
    }

    // Get cache key
    const customKey = this.reflector.getAllAndOverride<string>(CACHE_KEY_METADATA, [
      context.getHandler(),
      context.getClass(),
    ]);

    const cacheKey = customKey || this.generateCacheKey(request);

    // Try to get from cache
    const cachedResponse = await this.cacheService.get(cacheKey);
    if (cachedResponse !== null) {
      return of(cachedResponse);
    }

    // Get TTL
    const ttl = this.reflector.getAllAndOverride<number>(CACHE_TTL_METADATA, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Execute handler and cache response
    return next.handle().pipe(
      tap(async (response) => {
        await this.cacheService.set(cacheKey, response, { ttl });
      }),
    );
  }

  /**
   * Generate cache key from request
   */
  private generateCacheKey(request: Request): string {
    const { url, query } = request;
    const queryString = Object.keys(query).length
      ? `:${JSON.stringify(query)}`
      : '';
    return `route:${url}${queryString}`;
  }
}
