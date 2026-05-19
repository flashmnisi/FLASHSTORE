import CircuitBreaker from 'opossum';
import logger from '@org/shared-logger';
import { CircuitBreakerOptions } from './breaker.types.js';

const breakers = new Map<string, CircuitBreaker>();

export const getCircuitBreaker = (
  action: (...args: any[]) => Promise<any>,
  serviceName: string,
  operation: string = 'default',
  options: CircuitBreakerOptions = {}
): CircuitBreaker => {
  const key = `${serviceName}:${operation}`;

  if (breakers.has(key)) {
    return breakers.get(key)!;
  }

  const breaker = new CircuitBreaker(action, {
    timeout: options.timeout || 8000,
    errorThresholdPercentage: options.errorThresholdPercentage || 50,
    resetTimeout: options.resetTimeout || 15000,
    rollingCountTimeout: options.rollingCountTimeout || 10000,
    rollingCountBuckets: options.rollingCountBuckets || 10,
  });

  // Logging
  breaker.on('open', () => {
    logger.warn(`🟡 Circuit Breaker OPENED for ${serviceName}:${operation}`);
  });

  breaker.on('halfOpen', () => {
    logger.info(`🔄 Circuit Breaker HALF-OPEN for ${serviceName}:${operation}`);
  });

  breaker.on('close', () => {
    logger.info(`🟢 Circuit Breaker CLOSED for ${serviceName}:${operation}`);
  });

  breaker.on('fallback', () => {
    logger.warn(`⚠️ Circuit Breaker fallback triggered for ${serviceName}:${operation}`);
  });

  breaker.on('success', () => {
  logger.info(`Breaker success`, {
    service: serviceName,
    operation,
    stats: breaker.stats,
  });
});

  breaker.on('failure', (err) => {
  logger.error(`Breaker failure`, {
    service: serviceName,
    operation,
    error: err.message,
    stats: breaker.stats,
  });
});

  // Default fallback
  breaker.fallback(() => ({
    success: false,
    fallback: true,
    service: serviceName,
    operation,
    message: `${serviceName} is temporarily unavailable. Please try again later.`,
  }));

  breakers.set(key, breaker);
  return breaker;
};