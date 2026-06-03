// apps/payment-service/src/config/env.ts

import dotenv from 'dotenv';
dotenv.config();

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3005,

  // DB
  MONGO_URI: process.env.MONGO_URI!,

  // Kafka
  KAFKA_BROKERS: process.env.KAFKA_BROKERS || 'kafka:9092',
  KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID || 'payment-service',

  // Stripe

  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ||'REMOVED_STRIPE_SECRET',
//STRIPE_PUBLISHABLE_KEY='pk_test_51RgUSoRp4dw6XYPJK0YpRwf08s0KBmNYTtIl0H8X7MidsW2cj55ADZtAu7fjALoe3LsfnBDj9MiRGfuktKGdXt6E00UlN7YqB0'
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || 'pk_test_51RgUSoRp4dw6XYPJK0YpRwf08s0KBmNYTtIl0H8X7MidsW2cj55ADZtAu7fjALoe3LsfnBDj9MiRGfuktKGdXt6E00UlN7YqB0',

  // Security
  INTERNAL_API_KEY: process.env.INTERNAL_API_KEY || '',
};

function assertEnv(value: any, name: string) {
  if (!value) {
    throw new Error(`❌ Missing environment variable: ${name}`);
  }
}

assertEnv(env.MONGO_URI, 'MONGO_URI');
assertEnv(env.STRIPE_SECRET_KEY, 'STRIPE_SECRET_KEY');
assertEnv(env.STRIPE_WEBHOOK_SECRET, 'STRIPE_WEBHOOK_SECRET');

export default env;