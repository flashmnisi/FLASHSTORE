// apps/catalog-service/src/config/env.ts

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

export default {
  // Server
  PORT: process.env.PORT ,
  NODE_ENV: process.env.NODE_ENV,

  // MongoDB
   MONGO_URI:
    process.env.MONGO_URI ||
    (mongoUser && mongoPassword
      ? `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoDb}?authSource=admin`
      : `mongodb://${mongoHost}:${mongoPort}/${mongoDb}`),

  // Kafka
  KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID,
  KAFKA_BROKERS: process.env.KAFKA_BROKERS,

  // Redis (for caching)
  REDIS_URL: process.env.REDIS_URL,

  // Elasticsearch
  ELASTIC_UR: process.env.ELASTIC_UR,
  ELASTIC_USERNAME: process.env.ELASTIC_USERNAME || '',
  ELASTIC_PASSWORD: process.env.ELASTIC_PASSWORD || '',

  // Image Upload
  IMAGE_BASE_URL: process.env.IMAGE_BASE_URL,
  UPLOAD_DIR: process.env.UPLOAD_DIR,

  // JWT 
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL,
};