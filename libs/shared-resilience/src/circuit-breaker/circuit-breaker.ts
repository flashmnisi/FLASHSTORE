import { getCircuitBreaker } from './breaker-manager.js';
import { CircuitBreakerOptions } from './breaker.types.js';

export const withCircuitBreaker = <T>(
  action: (...args: any[]) => Promise<T>,
  serviceName: string,
  operation: string = 'default',
  options: CircuitBreakerOptions = {}
) => {

  const breaker = getCircuitBreaker(
    action,
    serviceName,
    operation,
    options
  );

  return async (...args: any[]): Promise<T> => {
    return await breaker.fire(...args) as T;
  };
};