import dotenv from 'dotenv';
dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Database
  MONGO_URI: process.env.MONGO_URI || '',

  // Redis
  REDIS_URL: process.env.REDIS_URL || '',

  // Kafka
  KAFKA_BROKERS: (process.env.KAFKA_BROKERS || '').split(','),

  // Services
  ORDER_SERVICE_URL: process.env.ORDER_SERVICE_URL || '',
  PAYMENT_SERVICE_URL: process.env.PAYMENT_SERVICE_URL || '',
  SEARCH_SERVICE_URL: process.env.SEARCH_SERVICE_URL || '',
  CATALOG_SERVICE_URL: process.env.CATALOG_SERVICE_URL || '',
};