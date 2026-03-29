/**
 * Database Module
 *
 * Provides Prisma client to the entire application
 */

import { Global, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { prisma, connect, disconnect, healthCheck, type PrismaClient } from '@repo/database';

/**
 * Database service wrapping Prisma client
 */
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  readonly client: PrismaClient = prisma;

  async onModuleInit() {
    await connect();
  }

  async onModuleDestroy() {
    await disconnect();
  }

  async healthCheck(): Promise<boolean> {
    return healthCheck();
  }
}

@Global()
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
