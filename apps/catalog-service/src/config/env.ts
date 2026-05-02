// apps/catalog-service/src/config/env.ts

import dotenv from 'dotenv';
dotenv.config();

export default {
  // Server
  PORT: process.env.PORT || 3002,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // MongoDB
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/flashstore-catalog',

  // Kafka
  KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID || 'catalog-service',
  KAFKA_BROKERS: process.env.KAFKA_BROKERS || 'localhost:9092',

  // Redis (for caching)
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',

  // Elasticsearch
  ELASTICSEARCH_URL: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
  ELASTICSEARCH_USERNAME: process.env.ELASTICSEARCH_USERNAME,
  ELASTICSEARCH_PASSWORD: process.env.ELASTICSEARCH_PASSWORD,

  // Image Upload
  IMAGE_BASE_URL: process.env.IMAGE_BASE_URL || 'http://localhost:8080/assets/',
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads/products',

  // JWT (if needed for protect middleware)
  JWT_SECRET: process.env.JWT_SECRET || 'your-jwt-secret-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};