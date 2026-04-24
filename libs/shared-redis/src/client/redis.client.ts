import { createClient, RedisClientType } from 'redis';
import  logger  from '@org/shared-logger';
import { redisConfig } from '../config/redis.config';
//import { redisConfig } from 'src/config/redis.config';

let client: RedisClientType | null = null;

/**
 * 🔥 Get Redis Singleton Client
 */
export const getRedis = async (): Promise<RedisClientType> => {
  if (!client) {
    client = createClient({
      url: redisConfig.url,
      socket: redisConfig.socket,
    });

    client.on('error', (err) => {
      logger.error(`❌ Redis Error: ${err.message}`);
    });

    client.on('connect', () => {
      logger.info('✅ Redis connected');
    });

    client.on('reconnecting', () => {
      logger.warn('🔁 Redis reconnecting...');
    });

    await client.connect();
  }

  return client;
};

/**
 * 🔌 Graceful Disconnect
 */
export const disconnectRedis = async (): Promise<void> => {
  if (client) {
    await client.quit();
    client = null;
    logger.info('🔌 Redis disconnected gracefully');
  }
};

/**
 * 🔥 Set value with TTL
 */
export const setWithExpiry = async (
  key: string,
  value: string | number | object,
  ttlSeconds: number = 3600
): Promise<void> => {
  const redis = await getRedis();

  const val: string =
    typeof value === 'object'
      ? JSON.stringify(value)
      : String(value);

  await redis.set(key, val, { EX: ttlSeconds });
};

/**
 * 🔥 Get value and parse JSON automatically
 */
export const getJson = async <T>(key: string): Promise<T | null> => {
  const redis = await getRedis();
  const value = await redis.get(key);

  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return value as unknown as T;
  }
};

/**
 * 🗑 Delete key
 */
export const del = async (key: string): Promise<number> => {
  const redis = await getRedis();
  return await redis.del(key);
};

/**
 * 🔍 Check if key exists
 */
export const exists = async (key: string): Promise<boolean> => {
  const redis = await getRedis();
  const count = await redis.exists(key);
  return count > 0;
};

/**
 * ⚠️ Raw client access (use carefully)
 */
export const getRawClient = (): RedisClientType | null => client;