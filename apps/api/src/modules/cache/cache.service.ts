/**
 * Cache Service
 *
 * Redis-based caching with ioredis.
 * Provides type-safe caching operations with TTL support.
 */

import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export interface CacheOptions {
  /** Time to live in seconds */
  ttl?: number;
  /** Key prefix for namespacing */
  prefix?: string;
}

const DEFAULT_TTL = 3600; // 1 hour
const DEFAULT_PREFIX = 'cache:';

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(CacheService.name);
  private client: Redis | null = null;
  private readonly defaultTtl: number;
  private readonly keyPrefix: string;

  constructor(private readonly configService: ConfigService) {
    this.defaultTtl = configService.get<number>('REDIS_CACHE_TTL', DEFAULT_TTL);
    this.keyPrefix = configService.get<string>('REDIS_CACHE_PREFIX', DEFAULT_PREFIX);
  }

  async onModuleInit() {
    const redisUrl = this.configService.get<string>('REDIS_URL', 'redis://localhost:6379');

    try {
      this.client = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
          if (times > 3) {
            this.logger.warn('Redis connection failed, caching disabled');
            return null; // Stop retrying
          }
          return Math.min(times * 200, 1000);
        },
        lazyConnect: true,
      });

      await this.client.connect();
      this.logger.log('Redis cache connected');
    } catch (error) {
      this.logger.warn('Redis connection failed, caching disabled', error);
      this.client = null;
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit();
      this.logger.log('Redis cache disconnected');
    }
  }

  /**
   * Check if cache is available
   */
  isAvailable(): boolean {
    return this.client !== null && this.client.status === 'ready';
  }

  /**
   * Get a value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    if (!this.isAvailable()) return null;

    try {
      const value = await this.client!.get(this.prefixKey(key));
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      this.logger.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set a value in cache
   */
  async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
    if (!this.isAvailable()) return;

    try {
      const ttl = options?.ttl ?? this.defaultTtl;
      const serialized = JSON.stringify(value);

      if (ttl > 0) {
        await this.client!.setex(this.prefixKey(key), ttl, serialized);
      } else {
        await this.client!.set(this.prefixKey(key), serialized);
      }
    } catch (error) {
      this.logger.error(`Cache set error for key ${key}:`, error);
    }
  }

  /**
   * Delete a value from cache
   */
  async del(key: string): Promise<void> {
    if (!this.isAvailable()) return;

    try {
      await this.client!.del(this.prefixKey(key));
    } catch (error) {
      this.logger.error(`Cache del error for key ${key}:`, error);
    }
  }

  /**
   * Delete multiple keys matching a pattern
   */
  async delPattern(pattern: string): Promise<void> {
    if (!this.isAvailable()) return;

    try {
      const keys = await this.client!.keys(this.prefixKey(pattern));
      if (keys.length > 0) {
        await this.client!.del(...keys);
      }
    } catch (error) {
      this.logger.error(`Cache delPattern error for pattern ${pattern}:`, error);
    }
  }

  /**
   * Get or set a value (cache-aside pattern)
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    options?: CacheOptions,
  ): Promise<T> {
    // Try to get from cache
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Generate value and cache it
    const value = await factory();
    await this.set(key, value, options);
    return value;
  }

  /**
   * Clear all cache keys with our prefix
   */
  async clear(): Promise<void> {
    if (!this.isAvailable()) return;

    try {
      const keys = await this.client!.keys(`${this.keyPrefix}*`);
      if (keys.length > 0) {
        await this.client!.del(...keys);
      }
      this.logger.log('Cache cleared');
    } catch (error) {
      this.logger.error('Cache clear error:', error);
    }
  }

  /**
   * Health check for Redis connection
   */
  async healthCheck(): Promise<boolean> {
    if (!this.isAvailable()) return false;

    try {
      const pong = await this.client!.ping();
      return pong === 'PONG';
    } catch {
      return false;
    }
  }

  /**
   * Add prefix to key
   */
  private prefixKey(key: string): string {
    return `${this.keyPrefix}${key}`;
  }
}
