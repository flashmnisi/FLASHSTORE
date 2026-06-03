// shared-kafka/src/dlq/dlq.handler.ts

import { publish } from '../client/producer';
import logger from '@org/shared-logger';

export interface DLQOptions {
  topic: string;
  event: string;
  payload: any;

  key?: string;

  error: string;

  retryCount?: number;

  correlationId?: string;

  traceId?: string;

  serviceName?: string;

  headers?: Record<string, any>;
}

export const sendToDLQ = async ({
  topic,
  event,
  payload,
  key,
  error,
  retryCount = 0,
  correlationId,
  traceId,
  serviceName,
  headers = {},
}: DLQOptions) => {
  const dlqTopic = `${topic}.dlq`;

  const dlqPayload = {
    originalTopic: topic,

    originalEvent: event,

    originalKey: key,

    originalPayload: payload,

    metadata: {
      retryCount,

      correlationId,

      traceId,

      serviceName,

      failedAt: new Date().toISOString(),
    },

    error: {
      message: error,
    },
  };

  try {
    await publish({
      topic: dlqTopic,

      key,

      message: dlqPayload,

      headers: {
        ...headers,

        'x-retry-count': String(retryCount),

        'x-correlation-id': correlationId || '',

        'x-trace-id': traceId || '',

        'x-failed-reason': error,
      },
    });

    logger.error('💀 Message sent to DLQ', {
      dlqTopic,
      originalTopic: topic,
      event,
      key,
      retryCount,
      correlationId,
      traceId,
      serviceName,
    });
  } catch (err: any) {
    logger.error('🚨 CRITICAL: Failed to send message to DLQ', {
      originalTopic: topic,
      event,
      key,
      error: err.message,
    });

    /**
     * Future Enterprise Upgrades
     *
     * 1. Write to Mongo fallback collection
     * 2. Write to Redis emergency queue
     * 3. Send Slack alert
     * 4. Send PagerDuty alert
     * 5. Send email to DevOps
     */
  }
};