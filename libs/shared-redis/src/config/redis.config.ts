export const redisConfig = {
  url: process.env.REDIS_URL || 'redis://redis:6379',

  socket: {
    reconnectStrategy: (retries: number) => {
      if (retries > 10) {
        return new Error('❌ Redis connection failed after max retries');
      }

      // exponential backoff
      return Math.min(retries * 100, 3000);
    },
  },
};