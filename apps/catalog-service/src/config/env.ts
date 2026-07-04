// apps/catalog-service/src/config/env.ts

import dotenv from 'dotenv';
dotenv.config();

export default {
  // Server
  PORT: process.env.PORT ,
  NODE_ENV: process.env.NODE_ENV,

  // MongoDB
  MONGO_URI: process.env.MONGO_URI,

  // Kafka
  KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID,
  KAFKA_BROKERS: process.env.KAFKA_BROKERS,

  // Redis (for caching)
  REDIS_URL: process.env.REDIS_URL,

  // Elasticsearch
  ELASTICSEARCH_URL: process.env.ELASTICSEARCH_URL,
  ELASTICSEARCH_USERNAME: process.env.ELASTICSEARCH_USERNAME,
  ELASTICSEARCH_PASSWORD: process.env.ELASTICSEARCH_PASSWORD,

  // Image Upload
  IMAGE_BASE_URL: process.env.IMAGE_BASE_URL,
  UPLOAD_DIR: process.env.UPLOAD_DIR,

  // JWT 
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL,
};