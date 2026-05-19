export interface ResilienceOptions {
  retries?: number;
  timeoutMs?: number;
  circuitBreaker?: {
    failureThreshold?: number;
    resetTimeoutMs?: number;
    halfOpenAfter?: number;
  };
  bulkhead?: {
    maxConcurrent?: number;
    maxQueueSize?: number;
  };
}

export interface ResilienceContext {
  serviceName: string;
  operation: string;
  requestId?: string;
  correlationId?: string;
}