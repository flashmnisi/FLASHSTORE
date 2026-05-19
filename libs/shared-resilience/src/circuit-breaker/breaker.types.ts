export interface CircuitBreakerOptions {
  timeout?: number;
  errorThresholdPercentage?: number;
  resetTimeout?: number;
  rollingCountTimeout?: number;
  rollingCountBuckets?: number;
  serviceName?: string;
}

export interface CircuitBreakerContext {
  serviceName: string;
  operation: string;
  requestId?: string;
}