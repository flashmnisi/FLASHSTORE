// apps/user-service/src/application/services/cache.service.ts

import Redis from 'ioredis';
import logger from '@org/shared-logger';
import env from '../../config/env';

export class CacheService {
  private client: Redis;

  constructor() {
    this.client = new Redis(env.REDIS_URL, {
      retryStrategy: (times: number) => {
        if (times > 10) {
          logger.error('Redis connection failed after multiple retries');
          return null; // stop retrying
        }
        const delay = Math.min(times * 100, 3000);
        return delay;
      },
      maxRetriesPerRequest: 3,
    });

    this.client.on('connect', () => {
      logger.info('✅ Redis connected successfully');
    });

    this.client.on('error', (err) => {
      logger.error('❌ Redis connection error', { error: err.message });
    });

    this.client.on('reconnecting', () => {
      logger.warn('🔄 Redis reconnecting...');
    });
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.client.get(key);
      if (!data) return null;

      return JSON.parse(data) as T;
    } catch (error: any) {
      logger.error('Failed to get from cache', { key, error: error.message });
      return null;
    }
  }

  /**
   * Set value in cache with optional TTL (in seconds)
   */
  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value);

      if (ttlSeconds) {
        await this.client.set(key, serialized, 'EX', ttlSeconds);
      } else {
        await this.client.set(key, serialized);
      }
    } catch (error: any) {
      logger.error('Failed to set cache', { key, error: error.message });
    }
  }

  /**
   * Delete a key from cache
   */
  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error: any) {
      logger.error('Failed to delete from cache', { key, error: error.message });
    }
  }

  /**
   * Clear all user-related cache
   */
  async flushUserCache(userId: string): Promise<void> {
    try {
      const keys = await this.client.keys(`user:${userId}:*`);
      if (keys.length > 0) {
        await this.client.del(keys);
      }
      await this.del(`user:${userId}`);
      await this.del(`user:email:${userId}`);

      logger.info('🧹 User cache flushed', { userId });
    } catch (error: any) {
      logger.warn('Failed to flush user cache', { userId, error: error.message });
    }
  }

  /**
   * Graceful shutdown
   */
  async disconnect(): Promise<void> {
    try {
      await this.client.quit();
      logger.info('🔌 Redis connection closed');
    } catch (error: any) {
      logger.error('Error closing Redis connection', { error: error.message });
    }
  }
}

// Singleton instance
export const cacheService = new CacheService();