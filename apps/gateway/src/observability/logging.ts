import logger from '@org/shared-logger';

// Centralized logging configuration helper
export const setupLogging = () => {
  logger.info('📊 Observability logging initialized', {
    environment: process.env.NODE_ENV,
    service: 'gateway',
  });

  // You can add custom transports or child loggers here if needed
};

// Request context logger (for structured logging with correlation ID)
export const createRequestLogger = (req: any) => {
  return logger.child({
    correlationId: req.correlationId,
    userId: req.user?.userId,
    ip: req.ip,
  });
};

export default setupLogging;