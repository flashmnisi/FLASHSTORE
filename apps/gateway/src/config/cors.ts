// apps/gateway/src/config/cors.ts
// apps/gateway/src/config/cors.ts

import cors, { CorsOptions } from 'cors';
import env from './env';
import logger from '@org/shared-logger';

const allowedOrigins = new Set(env.ALLOWED_ORIGINS);

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // 1. Allow non-browser clients (Postman, mobile apps, curl)
    if (!origin) {
      return callback(null, true);
    }

    // 2. Normalize origin (important for trailing slashes)
    const normalizedOrigin = origin.replace(/\/$/, '');

    // 3. Check whitelist
    if (allowedOrigins.has(normalizedOrigin)) {
      return callback(null, true);
    }

    // 4. Log blocked origin (VERY useful in production)
    logger.warn('❌ CORS blocked request', {
      origin: normalizedOrigin,
    });

    return callback(new Error('Not allowed by CORS'));
  },

  credentials: true,

  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],

  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-Correlation-Id', // 🔥 important for tracing
  ],

  exposedHeaders: [
    'X-Total-Count',
    'X-Correlation-Id', // 🔥 allow frontend to read it
  ],

  maxAge: 86400, // 24 hours (preflight cache)
};

export const corsConfig = cors(corsOptions);