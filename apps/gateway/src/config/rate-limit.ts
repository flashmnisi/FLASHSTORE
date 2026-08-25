import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';

import { getRedis } from '@org/shared-redis';
import logger from '@org/shared-logger';

import env from './env';

let redisStore: RedisStore | undefined;

/**
 * Safely get the client IP.
 *
 * ipKeyGenerator() is required by express-rate-limit
 * for IPv6-safe rate limiting.
 */
const getClientIp = (req: any): string => {
  const forwarded = req.headers['x-forwarded-for'];

  const ip =
    typeof forwarded === 'string'
      ? forwarded.split(',')[0].trim()
      : req.ip;

  return ipKeyGenerator(ip || 'anonymous');
};

/**
 * Safely extract user identifier from JWT payload.
 */
const getUserId = (user: any): string | null => {
  if (!user) {
    return null;
  }

  return (
    user.userId ||
    user.id ||
    user.sub ||
    user._id ||
    null
  );
};

/**
 * Initialize Redis-backed rate limiting.
 *
 * This must be called during application bootstrap.
 */
export const initRateLimiter = async (): Promise<void> => {
  try {
    const redisClient = await getRedis();

    redisStore = new RedisStore({
      sendCommand: (...args: string[]) =>
        redisClient.sendCommand(args),
    });

    logger.info(
      '✅ Redis Rate Limiter Store initialized successfully',
    );
  } catch (error: any) {
    redisStore = undefined;

    logger.error(
      '❌ Failed to initialize Redis Rate Limiter',
      {
        error: error?.message ?? String(error),
      },
    );

    logger.warn(
      '⚠️ Falling back to in-memory rate limiting',
    );
  }
};

/**
 * =========================================================
 * GLOBAL RATE LIMITER
 * =========================================================
 */
export const globalRateLimit = rateLimit({
  windowMs:
    env.RATE_LIMIT_WINDOW_MS ||
    15 * 60 * 1000,

  max:
    env.RATE_LIMIT_MAX ||
    100,

  standardHeaders: true,
  legacyHeaders: false,

  /**
   * IMPORTANT:
   *
   * redisStore is initialized before the application
   * imports the routes because main.ts bootstraps it first.
   */
  store: redisStore,

  keyGenerator: (req: any) => {
    const userId = getUserId(req.user);

    if (userId) {
      return `user:${userId}`;
    }

    return `ip:${getClientIp(req)}`;
  },

  skip: (req) =>
    req.path === '/health' ||
    req.path === '/healthz',

  message: {
    success: false,
    message:
      'Too many requests, please try again later.',
  },
});

/**
 * =========================================================
 * AUTH RATE LIMITER
 * =========================================================
 */
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 10,

  standardHeaders: true,
  legacyHeaders: false,

  store: redisStore,

  keyGenerator: (req: any) => {
    const email = req.body?.email;

    if (email) {
      return `auth:email:${String(email).toLowerCase()}`;
    }

    const userId = getUserId(req.user);

    if (userId) {
      return `auth:user:${userId}`;
    }

    return `auth:ip:${getClientIp(req)}`;
  },

  message: {
    success: false,
    message:
      'Too many authentication attempts. Please try again later.',
  },
});

/**
 * =========================================================
 * STRICT RATE LIMITER
 * =========================================================
 */
export const strictRateLimit = rateLimit({
  windowMs: 60 * 1000,

  max: 5,

  standardHeaders: true,
  legacyHeaders: false,

  store: redisStore,

  keyGenerator: (req: any) => {
    const userId = getUserId(req.user);

    if (userId) {
      return `strict:user:${userId}`;
    }

    return `strict:ip:${getClientIp(req)}`;
  },

  message: {
    success: false,
    message:
      'Too many requests to this sensitive endpoint.',
  },
});