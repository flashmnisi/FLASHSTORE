// apps/user-service/src/config/env.ts

import dotenv from 'dotenv';
dotenv.config();

export default {
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // MongoDB
  MONGO_URI: process.env.MONGO_URI || 'mongodb://mongo:27017/flashstore',
  
  // Redis
  REDIS_URL: process.env.REDIS_URL || 'redis://redis:6379',
  
  // Kafka
  KAFKA_BROKERS: process.env.KAFKA_BROKERS || 'kafka:9092',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production',
  
  // Email (for password reset later)
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: process.env.EMAIL_PORT,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
};

// import dotenv from 'dotenv';
// dotenv.config();

// export const env = {
//   PORT: Number(process.env.PORT) || 3001,
//   NODE_ENV: process.env.NODE_ENV || 'development',
//   MONGO_URI: process.env.MONGO_URI || 'mongodb://mongo:27017/flashstore',
//   KAFKA_BROKERS: process.env.KAFKA_BROKERS || 'kafka:9092',
//   JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
//   JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production',
// };

// export default env;