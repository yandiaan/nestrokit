/**
 * Cache Module
 *
 * Provides Redis-based caching for the application.
 */

import { Global, Module } from '@nestjs/common';
import { CacheService } from './cache.service';

@Global()
@Module({
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
