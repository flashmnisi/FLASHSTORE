import { publish } from '../client/producer';
import logger from '@org/shared-logger';
import { DEFAULT_RETRY_POLICY } from './retry.policy';
import { sendToDLQ } from 'src/dlq/dlq.handler';

interface RetryOptions {
  topic: string;
  message: any;
  headers?: Record<string, any>;
  policy?: typeof DEFAULT_RETRY_POLICY;
}

export const handleRetry = async ({
  topic,
  message,
  headers = {},
  policy = DEFAULT_RETRY_POLICY,
}: RetryOptions) => {
  const retryCount = parseInt(headers['x-retry-count'] || '0');

  if (retryCount < policy.maxRetries) {
    const nextRetry = retryCount + 1;

    logger.warn(`🔁 Retrying message`, {
      topic,
      retryCount: nextRetry,
      maxRetries: policy.maxRetries,
    });

    await sendToDLQ({
  topic,
  message,
  key: message?.id,
  headers,
  error: 'Max retries exceeded',
});

    await publish({
      topic: `${topic}.retry`,
      message,
      key: message?.id,
      headers: {
        ...headers,
        'x-retry-count': String(nextRetry),
      },
    });

  } else {
    logger.error(`💀 Sending message to DLQ`, {
      topic,
      retries: retryCount,
    });

    await publish({
      topic: `${topic}.dlq`,
      message,
      key: message?.id,
      headers,
    });
  }
};