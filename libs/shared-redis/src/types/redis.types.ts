export interface RedisSetOptions {
  ttlSeconds?: number;
}

export interface CacheEntry<T> {
  data: T;
  createdAt: number;
  ttl?: number;
}