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
      },
    });

    logger.error(`💀 Message sent to DLQ`, {
      topic: dlqTopic,
      key,
      retryCount,
      correlationId,
    });

  } catch (err: any) {
    logger.error(`🚨 CRITICAL: Failed to send message to DLQ`, {
      originalTopic: topic,
      key,
      error: err.message,
    });

    /**
     * 🔥 EXTREME CASE HANDLING
     * If DLQ fails → this is system-level failure
     * You SHOULD:
     * - send alert (Slack / email)
     * - persist locally (file / fallback DB)
     */
  }
};