// apps/gateway/src/config/env.ts

import dotenv from 'dotenv';
dotenv.config();

export default {
  // Server
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  SERVICE_NAME: 'api-gateway',

  // =========================
  // MICRO SERVICES URLs
  // =========================
  USER_SERVICE_URL: process.env.USER_SERVICE_URL || 'http://user-service:3001',
  CATALOG_SERVICE_URL: process.env.CATALOG_SERVICE_URL || 'http://catalog-service:3002',
  CART_SERVICE_URL: process.env.CART_SERVICE_URL || 'http://cart-service:3003',
  ORDER_SERVICE_URL: process.env.ORDER_SERVICE_URL || 'http://order-service:3004',
  PAYMENT_SERVICE_URL: process.env.PAYMENT_SERVICE_URL || 'http://payment-service:3005',
  ANALYTICS_SERVICE_URL: process.env.ANALYTICS_SERVICE_URL || 'http://analytics-service:3006',
  SEARCH_SERVICE_URL: process.env.SEARCH_SERVICE_URL || 'http://search-service:4005',
  NOTIFICATION_SERVICE_URL: process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:3007',

  // =========================
  // SECURITY
  // =========================
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',

  // =========================
  // RATE LIMITING
  // =========================
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '100'),
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes

  // =========================
  // CORS
  // =========================
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : ['http://localhost:3000', 'http://localhost:8080', 'http://localhost:5173'],

  // =========================
  // REDIS
  // =========================
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',

  // =========================
  // LOGGING
  // =========================
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',

  // Kafka
KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID || 'api-gateway',
KAFKA_BROKERS: process.env.KAFKA_BROKERS || 'localhost:9092',
};