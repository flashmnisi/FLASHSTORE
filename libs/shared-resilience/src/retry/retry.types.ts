export interface RetryOptions {
  retries?: number;
  baseDelay?: number;
  maxDelay?: number;
  jitter?: boolean;
  retryCondition?: (error: any) => boolean;
  serviceName?: string;
  operation?: string;
  requestId?: string;
}