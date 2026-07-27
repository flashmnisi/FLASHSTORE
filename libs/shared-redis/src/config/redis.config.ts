// //libs/shared-redis/config/redis.config.ts

const host = process.env.REDIS_HOST || 'redis';
const port = process.env.REDIS_PORT || '6379';
const password = process.env.REDIS_PASSWORD;

export const redisConfig = {
  url:
    process.env.REDIS_URL ||
    (password
      ? `redis://:${password}@${host}:${port}`
      : `redis://${host}:${port}`),

  socket: {
    reconnectStrategy: (retries: number) => {
      if (retries > 10) {
        return new Error('Redis connection failed after multiple retries');
      }

      return Math.min(retries * 100, 3000);
    },
  },
};