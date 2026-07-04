import logger from '@org/shared-logger';
import { EventMiddleware } from '../middleware';

export const loggingMiddleware: EventMiddleware = async (ctx, next) => {
  const start = Date.now();

logger.info("📥 Event received", {
  event: ctx.event?.event,
  eventId: ctx.eventId,
  topic: ctx.topic,
  service: ctx.serviceName,
  retryCount: ctx.retryCount,
  correlationId: ctx.correlationId,
  traceId: ctx.traceId,
});

  try {
    await next();

    logger.info('✅ Event processed', {
      eventId: ctx.eventId,
      durationMs: Date.now() - start,
      traceId: ctx.traceId,
    });

  } catch (error: any) {
    logger.error('❌ Event failed in pipeline', {
      eventId: ctx.eventId,
      error: error.message,
      traceId: ctx.traceId,
      correlationId: ctx.correlationId,
    });

    throw error; 
  }
};