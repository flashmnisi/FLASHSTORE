import { publish } from '../client/producer';
import logger from '@org/shared-logger';

interface DLQOptions {
  topic: string;
  message: any;
  key?: string;
  headers?: Record<string, any>;
  error?: string;
}

export const sendToDLQ = async ({
  topic,
  message,
  key,
  headers = {},
  error,
}: DLQOptions) => {
  const dlqTopic = `${topic}.dlq`;

  const retryCount = headers['x-retry-count'] || '0';
  const requestId = headers['x-request-id'];
  const correlationId = headers['x-correlation-id'];

  const dlqPayload = {
    originalTopic: topic,
    originalKey: key,
    originalMessage: message,

    metadata: {
      retryCount,
      requestId,
      correlationId,
      failedAt: new Date().toISOString(),
    },

    error: {
      message: error || 'Unknown error',
    },
  };

  try {
    await publish({
      topic: dlqTopic,
      message: dlqPayload,
      key,
      headers: {
        ...headers,
        'x-failed-reason': error || 'unknown',
        'x-retry-count': retryCount,
      },
    });

    // ✅ FIXED LOGGER
    logger.error(
      {
        topic: dlqTopic,
        key,
        retryCount,
        correlationId,
      },
      '💀 Message sent to DLQ'
    );

  } catch (err: any) {
    // ✅ FIXED LOGGER
    logger.error(
      {
        originalTopic: topic,
        key,
        error: err.message,
      },
      '🚨 CRITICAL: Failed to send message to DLQ'
    );

    /**
     * 🔥 PRODUCTION UPGRADE
     * If DLQ fails → fallback persistence
     */
    // TODO:
    // - write to local file
    // - send alert (Slack / PagerDuty)
  }
};