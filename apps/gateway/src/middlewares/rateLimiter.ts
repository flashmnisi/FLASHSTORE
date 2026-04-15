import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { redis } from '../config/redis';

const redisStore = new RedisStore({
  sendCommand: (...args: any[]) => (redis as any).call(...args),
});

export const globalLimiter = rateLimit({
  store: redisStore,

  windowMs: 15 * 60 * 1000,
  max: 100,

  standardHeaders: true,
  legacyHeaders: false,

keyGenerator: (req) => {
  const forwarded = req.headers['x-forwarded-for'];

  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0];
  }

  return req.ip || 'unknown';
},
});

export const authLimiter = rateLimit({
  store: redisStore,

  windowMs: 10 * 60 * 1000,
  max: 10,

  keyGenerator: (req) =>
    req.body?.email || req.ip,

  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many login attempts. Try again later.',
    });
  },
});