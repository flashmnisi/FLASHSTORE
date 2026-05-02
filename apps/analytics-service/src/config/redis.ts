// apps/analytics-service/src/config/redis.ts

import { getRedis as connectSharedRedis, disconnectRedis } from '@org/shared-redis';
import logger from '@org/shared-logger';

export const connectRedis = async (): Promise<void> => {
  try {
    await connectSharedRedis();
    logger.info('✅ Redis connected successfully');
  } catch (error: any) {
    logger.error('❌ Redis connection failed', { error: error.message });
    throw error;
  }
};

export const disconnectRedisConnection = async (): Promise<void> => {
  try {
    await disconnectRedis();
    logger.info('✅ Redis disconnected');
  } catch (error: any) {
    logger.warn('Failed to disconnect Redis gracefully', { error: error.message });
  }
};