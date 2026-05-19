// apps/gateway/src/config/rate-limit.ts

import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { getRedis } from '@org/shared-redis';
import logger from '@org/shared-logger';
import env from './env';

let redisStore: RedisStore | null = null;

/**
 * Initialize Redis-backed rate limiter (Call this in bootstrap/main.ts)
 */
export const initRateLimiter = async (): Promise<void> => {
  try {
    const redisClient = await getRedis();

    redisStore = new RedisStore({
      sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    });

    logger.info('✅ Redis Rate Limiter Store initialized successfully');
  } catch (error: any) {
    logger.error('❌ Failed to initialize Redis Rate Limiter', {
      error: error.message,
    });
    logger.warn('Falling back to in-memory rate limiting');
  }
};

/**
 * Safely extract user identifier from JWT payload
 */
const getUserId = (user: any): string | null => {
  if (!user) return null;
  return user.userId || user.id || user.sub || user._id || null;
};

/**
 * Global Rate Limiter
 */
export const globalRateLimit = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000,
  max: env.RATE_LIMIT_MAX || 100,

  standardHeaders: true,
  legacyHeaders: false,

  // Use initialized Redis store if available
  store: redisStore 
    ? redisStore 
    : undefined,

  keyGenerator: (req: any) => {
    const userId = getUserId(req.user);

    if (userId) {
      return `user:${userId}`;
    }

    // Fallback to IP
    const ip = 
      req.headers['x-forwarded-for']?.toString().split(',')[0] ||
      req.headers['x-real-ip']?.toString() ||
      req.ip ||
      'anonymous';

    return `ip:${ip}`;
  },

  skip: (req) => req.path === '/health' || req.path === '/healthz',

  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
});

/**
 * Auth Rate Limiter (Login/Register)
 */
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,

  standardHeaders: true,
  legacyHeaders: false,

  store: redisStore ? redisStore : undefined,

  keyGenerator: (req: any) => {
    const identifier = req.body?.email || getUserId(req.user) || req.ip || 'anonymous';
    return `auth:${identifier}`;
  },

  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again later.',
  },
});

/**
 * Strict Rate Limiter (Sensitive endpoints)
 */
export const strictRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,

  standardHeaders: true,
  legacyHeaders: false,

  store: redisStore ? redisStore : undefined,

  keyGenerator: (req: any) => {
    const userId = getUserId(req.user);
    return `strict:${userId || req.ip || 'anonymous'}`;
  },

  message: {
    success: false,
    message: 'Too many requests to this sensitive endpoint.',
  },
});