import CircuitBreaker from 'opossum';
import logger from '@org/shared-logger';

export const createCircuitBreaker = (
  action: Function,
  serviceName: string
) => {
  const breaker = new CircuitBreaker(action, {
    timeout: 8000,
    errorThresholdPercentage: 50,
    resetTimeout: 15000,
    rollingCountTimeout: 10000,
    rollingCountBuckets: 10,
  });

  // 🔥 Structured logs
  breaker.on('open', () => {
    logger.warn({
      message: 'Circuit opened',
      service: serviceName,
    });
  });

  breaker.on('halfOpen', () => {
    logger.info({
      message: 'Circuit half-open (testing)',
      service: serviceName,
    });
  });

  breaker.on('close', () => {
    logger.info({
      message: 'Circuit closed (recovered)',
      service: serviceName,
    });
  });

  breaker.on('fallback', () => {
    logger.warn({
      message: 'Circuit fallback triggered',
      service: serviceName,
    });
  });

  // 🔥 REAL fallback (important)
  breaker.fallback(() => {
    return {
      success: false,
      fallback: true,
      message: `${serviceName} temporarily unavailable`,
    };
  });

  return breaker;
};

// import CircuitBreaker from 'opossum';
// import logger from '@org/shared-logger';

// export const createCircuitBreaker = (action: Function, serviceName: string) => {
//   const breaker = new CircuitBreaker(action, {
//     timeout: 8000,                    // Fail if request takes longer than 8s
//     errorThresholdPercentage: 50,     // Open circuit if 50% of requests fail
//     resetTimeout: 15000,              // Try again after 15s when circuit is open
//     rollingCountTimeout: 10000,       // Window for error calculation
//     rollingCountBuckets: 10,
//   });

//   breaker.on('open', () => {
//     logger.warn(`🔴 CIRCUIT OPEN for ${serviceName} - stopping requests`);
//   });

//   breaker.on('halfOpen', () => {
//     logger.info(`🟡 CIRCUIT HALF-OPEN for ${serviceName} - testing recovery`);
//   });

//   breaker.on('close', () => {
//     logger.info(`🟢 CIRCUIT CLOSED for ${serviceName} - service recovered`);
//   });

//   breaker.on('fallback', () => {
//     logger.warn(`⚠️ Circuit Breaker fallback triggered for ${serviceName}`);
//   });

//   return breaker;
// };