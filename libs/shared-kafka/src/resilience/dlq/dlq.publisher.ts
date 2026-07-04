// apps/payment-service/src/infrastructure/outbox/dlq/dlq.publisher.ts

import { buildHeaders } from '../../utils/header';
import { publish } from '../../messaging/publish';
import { DLQEvent } from './dlq.types';
import logger from '@org/shared-logger';

/**
 * Send failed event to Dead Letter Queue (DLQ)
 */
export const sendToDLQ = async (input: {
  topic: string;
  event: string;
  payload: any;
  error: any;
  retryCount?: number;
  serviceName?: string;
  correlationId?: string;
  traceId?: string;
}) => {
  const dlqTopic = `${input.topic}.dlq`;

  try {
    const dlqEvent: DLQEvent = {
      topic: input.topic,
      dlqTopic: dlqTopic,

      eventId: `dlq-${Date.now()}-${Math.random().toString(36).substring(2)}`,
      originalEvent: input.event,

      error: {
        message: input.error?.message || input.error || 'Unknown error',
        stack: input.error?.stack,
        name: input.error?.name,
      },

      retryCount: input.retryCount || 0,
      serviceName: input.serviceName || 'payment-service',

      timestamp: new Date().toISOString(),
      failedAt: new Date().toISOString(),

      correlationId: input.correlationId,
      traceId: input.traceId,

      failureStage: 'handler',
      metadata: {
        originalPayload: input.payload,
      },
    };

    await publish({
      topic: dlqTopic,
      event: 'dlq.message',
      data: dlqEvent,
      headers: buildHeaders({
        requestId: input.payload?.metadata?.requestId,
        correlationId: dlqEvent.correlationId,
        retryCount: dlqEvent.retryCount,
      }),
    });

    logger.info('Message sent to DLQ', {
      originalTopic: input.topic,
      originalEvent: input.event,
      dlqTopic,
      retryCount: dlqEvent.retryCount,
    });
  } catch (dlqError: any) {
    logger.error('Failed to send message to DLQ', {
      originalTopic: input.topic,
      error: dlqError.message,
    });
  }
};
