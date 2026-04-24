import dotenv from 'dotenv';
dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 4000,

  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/cart',

  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',

  KAFKA_BROKERS: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),

  ORDER_SERVICE_URL: process.env.ORDER_SERVICE_URL || 'http://localhost:5001',
  PAYMENT_SERVICE_URL: process.env.PAYMENT_SERVICE_URL || 'http://localhost:5002',
};