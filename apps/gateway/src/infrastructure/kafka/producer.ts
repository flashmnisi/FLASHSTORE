// apps/gateway/src/infrastructure/kafka/producer.ts

import { publish } from '@org/shared-kafka';
import { TOPICS, EVENTS } from './topics';
import logger from '@org/shared-logger';

export class GatewayProducer {
  /**
   * Publish event when a request is made (optional analytics)
   */
  async publishRequestEvent(req: any, serviceName: string, status: number) {
    try {
      await publish({
        topic: TOPICS.GATEWAY,
        key: req.correlationId || 'unknown',
        message: {
          event: EVENTS.REQUEST_PROXIED,
          data: {
            service: serviceName,
            method: req.method,
            path: req.originalUrl,
            status,
            userId: req.user?.id || req.user?.userId,
            duration: Date.now() - (req.startTime || Date.now()),
          },
          metadata: {
            source: 'api-gateway',
            timestamp: new Date().toISOString(),
            correlationId: req.correlationId,
          },
        },
      });
    } catch (error: any) {
      logger.warn('Failed to publish gateway request event', {
        error: error.message,
        service: serviceName,
      });
    }
  }

  /**
   * Publish error events
   */
  async publishErrorEvent(req: any, serviceName: string, error: any) {
    try {
      await publish({
        topic: TOPICS.GATEWAY,
        key: req.correlationId || 'error',
        message: {
          event: EVENTS.GATEWAY_ERROR,
          data: {
            service: serviceName,
            path: req.originalUrl,
            error: error.message,
            status: error.status || 502,
          },
          metadata: {
            source: 'api-gateway',
            timestamp: new Date().toISOString(),
            correlationId: req.correlationId,
          },
        },
      });
    } catch (e) {
      // Silent fail - don't break the flow
    }
  }
}

// Singleton
export const gatewayProducer = new GatewayProducer();