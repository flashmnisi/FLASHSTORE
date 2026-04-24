import logger from 'src/utils/logger';
import { publish } from '../client/producer';
//import logger from '@org/shared-logger';
import { DEFAULT_RETRY_POLICY } from './retry.policy';

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

  const nextRetry = retryCount + 1;

  if (nextRetry <= policy.maxRetries) {
    logger.warn('🔁 Sending message to retry queue', {
      topic,
      retryCount: nextRetry,
      maxRetries: policy.maxRetries,
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

    return;
  }

  logger.error('💀 Max retries exceeded → sending to DLQ', {
    topic,
    retryCount,
  });

  await publish({
    topic: `${topic}.dlq`,
    message,
    key: message?.id,
    headers,
  });
};