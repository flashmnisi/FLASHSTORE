import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { redis } from '../config/redis';
import logger from '@org/shared-logger';

const redisStore = new RedisStore({
  sendCommand: (...args: string[]) => redis.call(...args),
});

export const globalLimiter = rateLimit({
  store: redisStore,
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req) => {
    // ✅ Trust Express proxy config instead
    return req.ip || 'unknown-ip';
  },

  handler: (req: any, res) => {
    logger.warn({
      message: 'Global rate limit exceeded',
      ip: req.ip,
      path: req.originalUrl,
      requestId: req.id, // ✅ FIXED
    });

    res.status(429).json({
      success: false,
      message: 'Too many requests. Please try again later.',
      requestId: req.id, // 🔥 consistent response
    });
  },
});

export const authLimiter = rateLimit({
  store: redisStore,
  windowMs: 10 * 60 * 1000,
  max: 10,

  keyGenerator: (req: any) => {
    const email = req.body?.email?.toLowerCase().trim();

    // ✅ Combine IP + email (stronger protection)
    return email ? `${email}:${req.ip}` : req.ip || 'unknown';
  },

  handler: (req: any, res) => {
    logger.warn({
      message: 'Auth rate limit exceeded',
      email: req.body?.email,
      ip: req.ip,
      requestId: req.id,
    });

    res.status(429).json({
      success: false,
      message: 'Too many login attempts. Please try again later.',
      requestId: req.id,
    });
  },
});