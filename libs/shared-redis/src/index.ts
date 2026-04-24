//export * from './lib/shared-redis.js';
// Main entry point for @org/shared-redis

export * from './client/redis.client';
export * from './config/redis.config';
// export * from './types/redis.types';     // uncomment when you create this file

// Optional: Re-export commonly used functions for convenience
// packages/shared-redis/src/index.ts

// ======================
// 🔌 CLIENT API (PUBLIC)
// ======================
export {
  getRedis,
  disconnectRedis,
  setWithExpiry,
  getJson,
  del,
  exists,
  getRawClient,
} from './client/redis.client';

// ======================
// ⚙️ CONFIG (OPTIONAL EXPORT)
// ======================
export { redisConfig } from './config/redis.config';

// ======================
// 🧠 TYPES (future safe)
// ======================
// export * from './types/redis.types';