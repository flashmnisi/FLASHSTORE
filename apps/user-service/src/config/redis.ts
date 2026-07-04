// apps/user-service/src/config/redis.ts

import { getRedis as connectSharedRedis, disconnectRedis } from '@org/shared-redis';
import logger from '@org/shared-logger';
import { cacheService } from '../infrastructure/cache/cache.service';

/**
 * Connect to Redis using the CacheService
 */
export const connectRedis = async (): Promise<void> => {
  try {
    await connectSharedRedis();
    await cacheService.get('health-check'); 

    logger.info('✅ Redis connected successfully via CacheService');
  } catch (error: any) {
    logger.error('❌ Failed to connect to Redis', { 
      error: error.message 
    });
    throw error;
  }
};

/**
 * Graceful shutdown - disconnect Redis
 */
export const disconnectRedisConnection = async (): Promise<void> => {
  try {
    await disconnectRedis();
    await cacheService.disconnect();
    logger.info('🔌 Redis connection closed gracefully');
  } catch (error: any) {
    logger.warn('Error while closing Redis connection', { 
      error: error.message 
    });
  }
};