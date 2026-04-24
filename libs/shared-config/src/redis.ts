import Redis from 'ioredis';
import { env } from './env';

export const redis = new Redis(env.REDIS_URL);

export const connectRedis = async () => {
  return new Promise<void>((resolve, reject) => {
    redis.on('connect', () => {
      console.log('[shared-config] Redis connected');
      resolve();
    });

    redis.on('error', reject);
  });
};