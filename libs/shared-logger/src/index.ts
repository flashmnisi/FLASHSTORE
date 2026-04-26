import pino from 'pino';

const isDev = process.env.NODE_ENV !== 'production';

const baseLogger = pino({
  level: process.env.LOG_LEVEL || 'info',
  timestamp: pino.stdTimeFunctions.isoTime,
  transport: isDev
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
});

// Create a clean logger interface
const logger = {
  info: (msg: string, meta?: Record<string, unknown>) => 
    baseLogger.info(meta ?? {}, msg),

  warn: (msg: string, meta?: Record<string, unknown>) => 
    baseLogger.warn(meta ?? {}, msg),

  error: (msg: string, meta?: Record<string, unknown>) => 
    baseLogger.error(meta ?? {}, msg),

  debug: (msg: string, meta?: Record<string, unknown>) => 
    baseLogger.debug(meta ?? {}, msg),
};

// Export both default and named for flexibility
export default logger;
export { logger };