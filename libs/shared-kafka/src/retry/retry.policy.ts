export interface RetryPolicy {
  maxRetries: number;
  initialDelay: number;   // ms
  factor: number;         // exponential growth
  maxDelay: number;       // cap delay
}

export const DEFAULT_RETRY_POLICY: RetryPolicy = {
  maxRetries: 3,
  initialDelay: 500,     // 0.5s
  factor: 2,             // exponential
  maxDelay: 10000,       // max 10s
};

/**
 * Exponential backoff calculation
 */
export const calculateDelay = (
  retryCount: number,
  policy: RetryPolicy = DEFAULT_RETRY_POLICY
): number => {
  const delay = policy.initialDelay * Math.pow(policy.factor, retryCount);
  return Math.min(delay, policy.maxDelay);
};