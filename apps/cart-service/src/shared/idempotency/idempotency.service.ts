// apps/cart-service/src/utils/idempotency.service.ts

import redis from '../infrastructure/cache/redis.client';
import logger from './logger';

const DEFAULT_TTL = 60 * 10; // 10 minutes
const LOCK_TTL = 30; // 30 seconds

export class IdempotencyService {

  /**
   * 🔑 Build key
   */
  private buildKey(key: string) {
    return `idempotency:${key}`;
  }

  /**
   * 🔒 Acquire lock (prevent concurrent execution)
   */
  async acquireLock(key: string): Promise<boolean> {
    const lockKey = `${this.buildKey(key)}:lock`;

    const result = await redis.set(lockKey, 'locked', 'NX', 'EX', LOCK_TTL);

    return result === 'OK';
  }

  /**
   * 🔓 Release lock
   */
  async releaseLock(key: string): Promise<void> {
    const lockKey = `${this.buildKey(key)}:lock`;
    await redis.del(lockKey);
  }

  /**
   * 📦 Get stored result (if already processed)
   */
  async getResult<T = any>(key: string): Promise<T | null> {
    const data = await redis.get(this.buildKey(key));

    if (!data) return null;

    return JSON.parse(data);
  }

  /**
   * 💾 Store result
   */
  async storeResult(key: string, value: any, ttl = DEFAULT_TTL): Promise<void> {
    await redis.set(
      this.buildKey(key),
      JSON.stringify(value),
      'EX',
      ttl
    );
  }

  /**
   * 🔥 MAIN WRAPPER (recommended usage)
   */
  async execute<T>(
    key: string,
    handler: () => Promise<T>
  ): Promise<T> {

    const log = logger.withContext({ idempotencyKey: key });

    // =============================
    // 1. Check existing result
    // =============================
    const existing = await this.getResult<T>(key);

    if (existing) {
      log.info('Idempotent hit (cached result)');
      return existing;
    }

    // =============================
    // 2. Acquire lock
    // =============================
    const lockAcquired = await this.acquireLock(key);

    if (!lockAcquired) {
      log.warn('Duplicate request in progress');

      // Optional: wait & retry
      await this.sleep(300);

      const retry = await this.getResult<T>(key);

      if (retry) return retry;

      throw new Error('Request already being processed');
    }

    try {
      // =============================
      // 3. Execute handler
      // =============================
      const result = await handler();

      // =============================
      // 4. Store result
      // =============================
      await this.storeResult(key, result);

      return result;

    } catch (error) {
      log.error('Idempotent execution failed', {
        error: (error as any).message,
      });
      throw error;

    } finally {
      // =============================
      // 5. Release lock
      // =============================
      await this.releaseLock(key);
    }
  }

  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const idempotencyService = new IdempotencyService();