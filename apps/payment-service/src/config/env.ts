// apps/payment-service/src/config/env.ts

import dotenv from 'dotenv';
dotenv.config();

const env = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,

  // DB
  MONGO_URI: process.env.MONGO_URI!,

  // Kafka
  KAFKA_BROKERS: process.env.KAFKA_BROKERS,
  KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID,

  // Stripe

  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,

  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,

  // Security
  INTERNAL_API_KEY: process.env.INTERNAL_API_KEY || '',
  
};


export default env;
