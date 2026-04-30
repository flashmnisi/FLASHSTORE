// apps/user-service/src/config/redis.ts

//import { cacheService } from '../application/services/cache.service';
import logger from '@org/shared-logger';
import { cacheService } from '../infrastructure/cache/cache.service';

/**
 * Connect to Redis using the CacheService
 */
export const connectRedis = async (): Promise<void> => {
  try {
    // The CacheService constructor already handles connection
    // We just trigger it here to ensure it's initialized
    await cacheService.get('health-check'); // Simple ping to verify connection

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
export const disconnectRedis = async (): Promise<void> => {
  try {
    await cacheService.disconnect();
    logger.info('🔌 Redis connection closed gracefully');
  } catch (error: any) {
    logger.warn('Error while closing Redis connection', { 
      error: error.message 
    });
  }
};