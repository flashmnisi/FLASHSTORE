// apps/analytics-service/src/config/env.ts

import dotenv from 'dotenv';
dotenv.config();

export default {
  // Server
  PORT: process.env.PORT || 3006,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // MongoDB
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/flashstore-analytics',

  // Kafka
  KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID || 'analytics-service',
  KAFKA_BROKERS: process.env.KAFKA_BROKERS || 'localhost:9092',

  // Redis
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',

  // JWT (for protected routes)
  JWT_SECRET: process.env.JWT_SECRET || 'your-jwt-secret-key',

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};