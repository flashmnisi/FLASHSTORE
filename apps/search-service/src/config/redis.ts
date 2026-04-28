import { createClient, RedisClientType } from 'redis';
import logger from '@org/shared-logger';

let client: RedisClientType | null = null;

export const connectRedis = async (): Promise<RedisClientType> => {
  try {
    if (client) return client;

    client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });

    client.on('error', (err) => {
      logger.error('🔴 Redis error', { error: err.message });
    });

    client.on('connect', () => {
      logger.info('🟡 Redis connecting...');
    });

    client.on('ready', () => {
      logger.info('🟢 Redis ready');
    });

    await client.connect();

    return client;

  } catch (error: any) {
    logger.error('🔴 Redis connection failed', {
      error: error.message,
    });

    process.exit(1);
  }
};

/**
 * Reuse existing connection
 */
export const getRedisClient = (): RedisClientType => {
  if (!client) {
    throw new Error('Redis not initialized. Call connectRedis first.');
  }
  return client;
};