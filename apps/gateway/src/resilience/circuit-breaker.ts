// // apps/gateway/src/resilience/circuit-breaker.ts

// import CircuitBreaker from 'opossum';
// import logger from '@org/shared-logger';

// export interface CircuitBreakerOptions {
//   timeout?: number;
//   errorThresholdPercentage?: number;
//   resetTimeout?: number;
// }

// export const createCircuitBreaker = (
//   action: (...args: any[]) => Promise<any>,
//   serviceName: string,
//   options: CircuitBreakerOptions = {}
// ) => {
//   const breaker = new CircuitBreaker(action, {
//     timeout: options.timeout || 8000,
//     errorThresholdPercentage: options.errorThresholdPercentage || 50,
//     resetTimeout: options.resetTimeout || 15000,
//     rollingCountTimeout: 10000,
//     rollingCountBuckets: 10,
//   });

//   // Logging Events
//   breaker.on('open', () => {
//     logger.warn(`🟢 Circuit Breaker OPENED for ${serviceName} - failing fast now`);
//   });

//   breaker.on('halfOpen', () => {
//     logger.info(`Circuit Breaker HALF-OPEN for ${serviceName} - testing recovery`);
//   });

//   breaker.on('close', () => {
//     logger.info(`Circuit Breaker CLOSED for ${serviceName} - service recovered`);
//   });

//   breaker.on('fallback', () => {
//     logger.warn(`Circuit Breaker fallback triggered for ${serviceName}`);
//   });

//   // Default Fallback Response
//   breaker.fallback(() => ({
//     success: false,
//     fallback: true,
//     service: serviceName,
//     message: `${serviceName} is temporarily unavailable. Please try again later.`,
//   }));

//   return breaker;
// };


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