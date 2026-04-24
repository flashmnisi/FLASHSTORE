// apps/cart-service/src/utils/logger.ts

import pino from 'pino';

const isDev = process.env.NODE_ENV !== 'production';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  base: {
    service: 'cart-service',
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  transport: isDev
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
        },
      }
    : undefined,
});

// 🔥 Context logger (VERY useful for tracing)
logger.withContext = (context: Record<string, any>) => {
  return logger.child(context);
};

export default logger;