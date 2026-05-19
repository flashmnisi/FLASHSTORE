// // apps/gateway/src/core/bootstrap.ts

// import logger from '@org/shared-logger';
// import env from '../config/env';
// import { initRateLimiter } from '../config/rate-limit';
// import { connectRedis } from '../config/redis';
// import { initKafka } from '../config/kafka';

// /**
//  * Bootstrap Phase - Runs before the server starts
//  * Initialize all core dependencies here
//  */
// export const bootstrap = async (): Promise<void> => {
//   try {
//     logger.info('🚀 Starting Gateway Bootstrap Sequence...');

//     // ====================== ENVIRONMENT CHECK ======================
//     logger.info(`Environment : ${env.NODE_ENV}`);
//     logger.info(`Port        : ${env.PORT}`);
//     logger.info(`Service     : ${env.SERVICE_NAME || 'api-gateway'}`);

//     // ====================== CORE DEPENDENCIES ======================

//     // 1. Connect to Redis
//     logger.info('Connecting to Redis...');
//     await connectRedis();

//     // 2. Initialize Redis-backed Rate Limiter
//     logger.info('Initializing Rate Limiter...');
//     await initRateLimiter();

//     // 3. Initialize Kafka (for publishing events)
//     logger.info('Initializing Kafka...');
//     await initKafka();

//     logger.info('✅ Gateway Bootstrap completed successfully');
//     logger.info('🔧 All core dependencies initialized');

//   } catch (error: any) {
//     logger.error('❌ Gateway Bootstrap failed', {
//       error: error.message,
//       stack: error.stack,
//     });
//     throw error; // Let main.ts catch and exit
//   }
// };

// import logger from '@org/shared-logger';
// import env from '../config/env';

// /**
//  * Bootstrap Phase - Runs before the server starts
//  * Use this for async initialization of external dependencies
//  */
// export const bootstrap = async (): Promise<void> => {
//   try {
//     logger.info('🚀 Starting Gateway Bootstrap Sequence...');

//     // ====================== ENVIRONMENT CHECK ======================
//     logger.info(`Environment: ${env.NODE_ENV}`);
//     logger.info(`Port: ${env.PORT}`);

//     ====================== FUTURE EXTENSIONS ======================
//     Add any async initialization here:

//     1. Redis connection (if you add rate limiting with Redis)
//     await initRedis();

//     2. Kafka producer (if gateway needs to publish events)
//     await initKafkaProducer();

//     3. OpenTelemetry / Tracing setup
//     await initTracing();

//     4. Feature flags or configuration service
//     await initConfigService();

//     5. Database health check (if gateway needs direct DB access)
//     await checkDatabaseConnection();

//     logger.info('✅ Gateway Bootstrap completed successfully');
//     logger.info('🔧 All core dependencies initialized');

//   } catch (error: any) {
//     logger.error('❌ Gateway Bootstrap failed', {
//       error: error.message,
//       stack: error.stack,
//     });
//     throw error; // Let main.ts catch and exit gracefully
//   }
// };