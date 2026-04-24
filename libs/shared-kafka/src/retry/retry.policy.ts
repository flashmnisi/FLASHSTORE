export interface RetryPolicy {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
  factor: number; // exponential multiplier
  jitter: boolean;
}

/**
 * Default retry policy (production-safe)
 */
export const DEFAULT_RETRY_POLICY: RetryPolicy = {
  maxRetries: 5,
  baseDelayMs: 500,       // start small
  maxDelayMs: 30_000,     // cap at 30s
  factor: 2,              // exponential backoff
  jitter: true,           // avoid thundering herd
};

/**
 * Calculate retry delay with exponential backoff
 */
export const calculateDelay = (
  retryCount: number,
  policy: RetryPolicy = DEFAULT_RETRY_POLICY
): number => {
  const exponential = policy.baseDelayMs * Math.pow(policy.factor, retryCount);

  let delay = Math.min(exponential, policy.maxDelayMs);

  // Add jitter (randomness to avoid retry storms)
  if (policy.jitter) {
    const jitter = Math.random() * 0.3 * delay; // up to 30%
    delay = delay + jitter;
  }

  return Math.floor(delay);
};

/**
 * Check if retry is allowed
 */
export const canRetry = (
  retryCount: number,
  policy: RetryPolicy = DEFAULT_RETRY_POLICY
): boolean => {
  return retryCount < policy.maxRetries;
};