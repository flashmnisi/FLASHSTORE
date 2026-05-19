/**
 * Exponential Backoff with Jitter Strategy
 */
export const exponentialBackoff = (
  attempt: number,
  baseDelay: number = 300,
  maxDelay: number = 3000,
  jitter: boolean = true
): number => {
  const delay = Math.min(
    baseDelay * Math.pow(2, attempt - 1),
    maxDelay
  );

  if (!jitter) return delay;

  // Full jitter (recommended)
  return Math.floor(Math.random() * (delay + 1));
};