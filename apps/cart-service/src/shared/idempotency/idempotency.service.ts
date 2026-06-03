// apps/cart-service/src/shared/idempotency/idempotency.service.ts

import logger from '@org/shared-logger';
import { getRedis } from '@org/shared-redis';

const DEFAULT_TTL = 60 * 10; // 10 minutes
const LOCK_TTL = 30;         // 30 seconds

export class IdempotencyService {
  private redisClient: any = null;

  private async getClient() {
    if (!this.redisClient) {
      this.redisClient = await getRedis();
    }
    return this.redisClient;
  }

  private buildKey(key: string): string {
    return `idempotency:${key}`;
  }

  /**
   * 🔒 Acquire distributed lock
   */
  async acquireLock(key: string): Promise<boolean> {
    const lockKey = `${this.buildKey(key)}:lock`;

    try {
      const client = await this.getClient();
      const result = await client.set(
        lockKey, 
        'locked', 
        'NX', 
        'EX', 
        LOCK_TTL
      );

      return result === 'OK';
    } catch (error: any) {
      logger.error('Failed to acquire lock', { 
        lockKey, 
        error: error.message 
      });
      return false;
    }
  }

  /**
   * 🔓 Release lock
   */
  async releaseLock(key: string): Promise<void> {
    const lockKey = `${this.buildKey(key)}:lock`;
    try {
      const client = await this.getClient();
      await client.del(lockKey);
    } catch (error: any) {
      logger.warn('Failed to release lock', { lockKey });
    }
  }

  /**
   * 📦 Get stored result
   */
  async getResult<T = any>(key: string): Promise<T | null> {
    try {
      const client = await this.getClient();
      const data = await client.get(this.buildKey(key));
      if (!data) return null;

      return JSON.parse(data) as T;
    } catch (error) {
      logger.error('Failed to parse cached result', { key });
      return null;
    }
  }

  /**
   * 💾 Store result with TTL
   */
  async storeResult(key: string, value: any, ttl = DEFAULT_TTL): Promise<void> {
    try {
      const client = await this.getClient();
      await client.set(this.buildKey(key), JSON.stringify(value), 'EX', ttl);
    } catch (error: any) {
      logger.error('Failed to store idempotency result', { key });
    }
  }

  /**
   * 🔥 MAIN IDEMPOTENCY WRAPPER
   */
  async execute<T>(
    key: string,
    handler: () => Promise<T>
  ): Promise<T> {
    const existing = await this.getResult<T>(key);
    if (existing !== null) {
      logger.info('Idempotent hit - returning cached result', { idempotencyKey: key });
      return existing;
    }

    const lockAcquired = await this.acquireLock(key);

    if (!lockAcquired) {
      logger.warn('Duplicate request in progress', { idempotencyKey: key });
      await this.sleep(500);

      const retryResult = await this.getResult<T>(key);
      if (retryResult !== null) return retryResult;

      throw new Error('Request is already being processed by another instance');
    }

    try {
      const result = await handler();
      await this.storeResult(key, result);

      logger.info('Idempotent execution completed successfully', { idempotencyKey: key });
      return result;

    } catch (error: any) {
      logger.error('Idempotent execution failed', {
        idempotencyKey: key,
        error: error.message,
      });
      throw error;

    } finally {
      await this.releaseLock(key);
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const idempotencyService = new IdempotencyService();