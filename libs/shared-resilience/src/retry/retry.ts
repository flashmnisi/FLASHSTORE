import logger from '@org/shared-logger';
import { exponentialBackoff } from './retry.strategy.js';
import { RetryOptions } from './retry.types.js';

export const retry = async <T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> => {
  const {
    retries = 3,
    baseDelay = 300,
    maxDelay = 5000,
    jitter = true,
    retryCondition,
    serviceName = 'unknown',
    operation = 'unknown',
    requestId,
  } = options;

  let lastError: any;

  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      const shouldRetry = retryCondition
        ? retryCondition(error)
        : (!error?.status || error.status >= 500);

      if (!shouldRetry || attempt > retries) {
        break;
      }

      const delay = exponentialBackoff(attempt, baseDelay, maxDelay, jitter);

        logger.warn(`🔄 Retry attempt ${attempt}/${retries + 1}`, {
        service: serviceName,
        operation,
        attempt,
        delayMs: delay,
        error: error.message,
        requestId,
      });

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  logger.error(`❌ All retries failed`, {
    service: serviceName,
    operation,
    attempts: retries + 1,
    lastError: lastError?.message,
    requestId,
  });

  throw lastError;
};