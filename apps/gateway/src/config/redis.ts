// apps/gateway/src/config/redis.ts

import { 
  getRedis as connectSharedRedis, 
  disconnectRedis as disconnectSharedRedis 
} from '@org/shared-redis';
import logger from '@org/shared-logger';

let isConnected = false;

/**
 * Initialize Redis connection for Gateway
 */
export const connectRedis = async (): Promise<void> => {
  try {
    if (isConnected) return;

    await connectSharedRedis();
    isConnected = true;

    logger.info('✅ Redis connected successfully (Gateway)');
  } catch (error: any) {
    logger.error('❌ Redis connection failed', {
      error: error.message,
    });
    throw error;
  }
};

/**
 * Disconnect Redis gracefully
 */
export const disconnectRedis = async (): Promise<void> => {
  try {
    if (isConnected) {
      await disconnectSharedRedis();
      isConnected = false;
      logger.info('✅ Redis disconnected');
    }
  } catch (error: any) {
    logger.warn('Failed to disconnect Redis', { 
      error: error.message 
    });
  }
};

/**
 * Health check for Redis
 */
export const checkRedisHealth = async (): Promise<boolean> => {
  try {
    const redis = await connectSharedRedis();
    await redis.ping();
    return true;
  } catch {
    return false;
  }
};