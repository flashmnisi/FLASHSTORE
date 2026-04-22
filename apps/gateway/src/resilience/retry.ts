import logger from '@org/shared-logger';

export const retry = async <T>(
  fn: () => Promise<T>,
  retries: number = 2,
  baseDelay: number = 300,
  requestId?: string
): Promise<T> => {
  let lastError: any;

  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // ❌ DO NOT retry client errors
      if (error?.status && error.status < 500) {
        throw error;
      }

      if (attempt > retries) break;

      const delay = baseDelay * Math.pow(2, attempt); // 🔥 exponential backoff

      logger.warn({
        message: 'Retry attempt failed',
        attempt,
        retries,
        delay,
        error: error.message,
        requestId,
      });

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};