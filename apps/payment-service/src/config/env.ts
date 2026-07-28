// apps/payment-service/src/config/env.ts

import dotenv from 'dotenv';
dotenv.config();

const mongoHost = process.env.MONGO_HOST;
const mongoPort = process.env.MONGO_PORT;
const mongoDb = process.env.MONGO_DB || 'flashstore';

const mongoUser =
  process.env.MONGO_ROOT_USERNAME ||
  process.env.MONGO_USERNAME ||
  '';

const mongoPassword =
  process.env.MONGO_ROOT_PASSWORD ||
  process.env.MONGO_PASSWORD ||
  '';

const env = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,

  // ==========================
  // MongoDB
  // ==========================

  MONGO_HOST: mongoHost,
  MONGO_PORT: mongoPort,
  MONGO_DB: mongoDb,

  MONGO_ROOT_USERNAME: mongoUser,
  MONGO_ROOT_PASSWORD: mongoPassword,

  MONGO_URI:
    process.env.MONGO_URI ||
    (mongoUser && mongoPassword
      ? `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoDb}?authSource=admin`
      : `mongodb://${mongoHost}:${mongoPort}/${mongoDb}`),

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
