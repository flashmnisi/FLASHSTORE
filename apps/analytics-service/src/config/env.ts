// // apps/analytics-service/src/config/env.ts

// import dotenv from 'dotenv';
// dotenv.config();

// export default {
//   // Server
//   PORT: process.env.PORT,
//   NODE_ENV: process.env.NODE_ENV,

//   // MongoDB
//   MONGO_URI: process.env.MONGO_URI,

//   // Kafka
//   KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID,
//   KAFKA_BROKERS: process.env.KAFKA_BROKERS,

//   // Redis
//   REDIS_URL: process.env.REDIS_URL,

//   // JWT (for protected routes)
//   JWT_SECRET: process.env.JWT_SECRET,

//   // Logging
//   LOG_LEVEL: process.env.LOG_LEVEL,
// };

const mongoHost = process.env.MONGO_HOST || 'localhost';
const mongoPort = process.env.MONGO_PORT || '27017';
const mongoDb =
  process.env.ANALYTICS_MONGO_DB ||
  process.env.MONGO_DB ||
  'flashstore-analytics';

const mongoUser = process.env.MONGO_ROOT_USERNAME || '';
const mongoPassword = process.env.MONGO_ROOT_PASSWORD || '';

export default {
  PORT: Number(process.env.PORT) || 3006,
  NODE_ENV: process.env.NODE_ENV || 'development',

  MONGO_URI:
    process.env.MONGO_URI ||
    (mongoUser && mongoPassword
      ? `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoDb}?authSource=admin`
      : `mongodb://${mongoHost}:${mongoPort}/${mongoDb}`),

  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',

  KAFKA_BROKERS:
    process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],

  KAFKA_CLIENT_ID:
    process.env.ANALYTICS_KAFKA_CLIENT_ID ||
    process.env.KAFKA_CLIENT_ID ||
    'analytics-service',

  JWT_SECRET: process.env.JWT_SECRET || '',

  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};