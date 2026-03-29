/**
 * Health Service
 *
 * Implements health check logic.
 */

import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.module';

export interface HealthCheckResult {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  checks?: Record<string, { status: 'ok' | 'error'; message?: string }>;
}

@Injectable()
export class HealthService {
  private readonly startTime = Date.now();

  constructor(private readonly db: DatabaseService) {}

  /**
   * Basic health check
   */
  check(): HealthCheckResult {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: this.getUptime(),
    };
  }

  /**
   * Liveness check - is the service running?
   */
  livenessCheck(): HealthCheckResult {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: this.getUptime(),
    };
  }

  /**
   * Readiness check - is the service ready to handle requests?
   * Checks database connectivity
   */
  async readinessCheck(): Promise<HealthCheckResult> {
    const checks: HealthCheckResult['checks'] = {};
    let allHealthy = true;

    // Database check
    try {
      const dbHealthy = await this.db.healthCheck();
      checks['database'] = dbHealthy
        ? { status: 'ok' }
        : { status: 'error', message: 'Database not responding' };
      if (!dbHealthy) allHealthy = false;
    } catch (error) {
      checks['database'] = {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
      allHealthy = false;
    }

    const result: HealthCheckResult = {
      status: allHealthy ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      uptime: this.getUptime(),
      checks,
    };

    if (!allHealthy) {
      throw new ServiceUnavailableException(result);
    }

    return result;
  }

  private getUptime(): number {
    return Math.floor((Date.now() - this.startTime) / 1000);
  }
}
