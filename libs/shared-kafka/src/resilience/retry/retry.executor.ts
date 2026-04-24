import { getBackoffDelay } from './retry.strategy';

export const retryExecutor = async (
  fn: () => Promise<void>,
  maxRetries = 3
) => {
  let lastError: any;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;

      const delay = getBackoffDelay(attempt);

      await new Promise(res => setTimeout(res, delay));
    }
  }

  throw lastError;
};