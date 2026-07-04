import dotenv from 'dotenv';
dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,

  MONGO_URI: process.env.MONGO_URI,

  REDIS_URL: process.env.REDIS_URL,

  KAFKA_BROKERS: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),

  ORDER_SERVICE_URL: process.env.ORDER_SERVICE_URL,
  PAYMENT_SERVICE_URL: process.env.PAYMENT_SERVICE_URL,
};