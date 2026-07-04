// apps/gateway/src/config/env.ts

import dotenv from 'dotenv';
dotenv.config();

export default {
  // Server
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  SERVICE_NAME: process.env.SERVICE_NAME,

  // =========================
  // MICRO SERVICES URLs
  // =========================
  USER_SERVICE_URL: process.env.USER_SERVICE_URL,
  CATALOG_SERVICE_URL: process.env.CATALOG_SERVICE_URL,
  CART_SERVICE_URL: process.env.CART_SERVICE_URL,
  ORDER_SERVICE_URL: process.env.ORDER_SERVICE_URL,
  PAYMENT_SERVICE_URL: process.env.PAYMENT_SERVICE_URL,
  ANALYTICS_SERVICE_URL: process.env.ANALYTICS_SERVICE_URL,
  SEARCH_SERVICE_URL: process.env.SEARCH_SERVICE_URL,
  NOTIFICATION_SERVICE_URL: process.env.NOTIFICATION_SERVICE_URL,
  INENTORY_SERVICE_URL: process.env.INVENTORY_SERVICE_URL,

  // =========================
  // SECURITY
  // =========================
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,

  // =========================
  // RATE LIMITING
  // =========================
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '100'),
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),

  // =========================
  // CORS
  // =========================
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : ['http://localhost:3000', 'http://localhost:8080', 'http://localhost:5173'],

  // =========================
  // REDIS
  // =========================
  REDIS_URL: process.env.REDIS_URL,

  // =========================
  // LOGGING
  // =========================
  LOG_LEVEL: process.env.LOG_LEVEL,

  // Kafka
KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID,
KAFKA_BROKERS: process.env.KAFKA_BROKERS,
};