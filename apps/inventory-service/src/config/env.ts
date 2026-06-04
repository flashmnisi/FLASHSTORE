// apps/inventory-service/src/config/env.ts

import dotenv from 'dotenv';
dotenv.config();

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3008,

  // DB
  MONGO_URI: process.env.MONGO_URI!,

  // Kafka
  KAFKA_BROKERS: process.env.KAFKA_BROKERS || 'kafka:9092',
  KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID || 'inventory-service',

  INTERNAL_API_KEY: process.env.INTERNAL_API_KEY || '',
};

function assertEnv(value: any, name: string) {
  if (!value) {
    throw new Error(`❌ Missing environment variable: ${name}`);
  }
}

assertEnv(env.MONGO_URI, 'MONGO_URI');

export default env;