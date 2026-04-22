import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  base: null,
  timestamp: pino.stdTimeFunctions.isoTime,
});

/**
 * Attach context (requestId, correlationId)
 */
export const withContext = (context: Record<string, any>) => {
  return logger.child(context);
};

export default logger;