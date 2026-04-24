import Redis from 'ioredis';
import { env } from './env';
import logger from '../utils/logger';

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
});

export const connectRedis = async () => {
  return new Promise<void>((resolve, reject) => {
    redis.on('connect', () => {
      logger.info('Redis connected');
      resolve();
    });

    redis.on('error', (err) => {
      logger.error('Redis connection error', { error: err.message });
      reject(err);
    });
  });
};

export default redis;