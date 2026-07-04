// apps/user-service/src/config/env.ts

import dotenv from 'dotenv';
dotenv.config();

const env = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  
  // MongoDB
  MONGO_URI: process.env.MONGO_URI ||'',
  
  // Redis
  REDIS_URL: process.env.REDIS_URL || '',
  
  // Kafka
  KAFKA_BROKERS: process.env.KAFKA_BROKERS,
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || '',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || '',
  
  // Email (for password reset)
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: process.env.EMAIL_PORT,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
};

export default env;