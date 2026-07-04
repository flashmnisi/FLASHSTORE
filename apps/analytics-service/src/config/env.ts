// apps/analytics-service/src/config/env.ts

import dotenv from 'dotenv';
dotenv.config();

export default {
  // Server
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,

  // MongoDB
  MONGO_URI: process.env.MONGO_URI,

  // Kafka
  KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID,
  KAFKA_BROKERS: process.env.KAFKA_BROKERS,

  // Redis
  REDIS_URL: process.env.REDIS_URL,

  // JWT (for protected routes)
  JWT_SECRET: process.env.JWT_SECRET,

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL,
};