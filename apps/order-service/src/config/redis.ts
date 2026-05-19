// apps/order-service/src/config/redis.ts

import {
  getRedis as connectSharedRedis,
  disconnectRedis,
} from '@org/shared-redis';

import logger from '@org/shared-logger';

//import { cacheService } from '../infrastructure/cache/cache.service';

/**
 * CONNECT REDIS
 */
export const connectRedis =
  async (): Promise<void> => {
    try {

      await connectSharedRedis();

    //   await cacheService.get(
    //     'health-check'
    //   );

      logger.info(
        '✅ Redis connected successfully'
      );

    } catch (error: any) {

      logger.error(
        '❌ Failed to connect Redis',
        {
          error: error.message,
        }
      );

      throw error;
    }
  };

/**
 * DISCONNECT
 */
export const disconnectRedisConnection =
  async (): Promise<void> => {
    try {

      await disconnectRedis();

      logger.info(
        '🔌 Redis disconnected'
      );

    } catch (error: any) {

      logger.warn(
        'Redis disconnect error',
        {
          error: error.message,
        }
      );
    }
  };