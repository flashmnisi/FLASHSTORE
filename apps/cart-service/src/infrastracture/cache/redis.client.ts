// apps/cart-service/src/infrastructure/cache/redis.client.ts

import Redis from 'ioredis';
import logger from '../../utils/logger';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

redis.on('connect', () => logger.info('Redis connected'));
redis.on('error', err => logger.error('Redis error', { error: err.message }));

export default redis;