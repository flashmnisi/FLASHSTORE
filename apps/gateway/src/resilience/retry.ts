// // apps/gateway/src/resilience/retry.ts

// import logger from '@org/shared-logger';

// export interface RetryOptions {
//   retries?: number;
//   baseDelay?: number;
//   maxDelay?: number;
//   requestId?: string;
//   serviceName?: string;
// }

// /**
//  * Retry with exponential backoff + jitter
//  */
// export const retry = async <T>(
//   fn: () => Promise<T>,
//   options: RetryOptions = {}
// ): Promise<T> => {
//   const {
//     retries = 2,
//     baseDelay = 300,
//     maxDelay = 3000,
//     requestId,
//     serviceName = 'unknown',
//   } = options;

//   let lastError: any;

//   for (let attempt = 1; attempt <= retries + 1; attempt++) {
//     try {
//       return await fn();
//     } catch (error: any) {
//       lastError = error;

//       // Don't retry client errors (4xx)
//       if (error?.status && error.status < 500) {
//         throw error;
//       }

//       if (attempt > retries) break;

//       // Exponential backoff with jitter
//       const delay = Math.min(
//         baseDelay * Math.pow(2, attempt - 1) + Math.random() * 100,
//         maxDelay
//       );

//       // ✅ FIXED: Correct logger usage
//       logger.warn(`Retry attempt ${attempt}/${retries + 1} failed`, {
//         service: serviceName,
//         attempt,
//         retries: retries + 1,
//         delay,
//         error: error.message,
//         requestId,
//       });

//       await new Promise((resolve) => setTimeout(resolve, delay));
//     }
//   }

//   // Final error log
//   logger.error(`All retries failed for ${serviceName}`, {
//     requestId,
//     attempts: retries + 1,
//     lastError: lastError?.message,
//   });

//   throw lastError;
// };