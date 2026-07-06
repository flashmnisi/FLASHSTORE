// // apps/user-service/src/config/env.ts

// import dotenv from 'dotenv';
// dotenv.config();

// const env = {
//   PORT: process.env.PORT,
//   NODE_ENV: process.env.NODE_ENV,
  
//   // MongoDB
//   MONGO_URI: process.env.MONGO_URI ||'',
  
//   // Redis
//   REDIS_URL: process.env.REDIS_URL || '',
  
//   // Kafka
//   KAFKA_BROKERS: process.env.KAFKA_BROKERS,
  
//   // JWT
//   JWT_SECRET: process.env.JWT_SECRET || '',
//   JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || '',
  
//   // Email (for password reset)
//   EMAIL_HOST: process.env.EMAIL_HOST,
//   EMAIL_PORT: process.env.EMAIL_PORT,
//   EMAIL_USER: process.env.EMAIL_USER,
//   EMAIL_PASS: process.env.EMAIL_PASS,
// };

// export default env;

// apps/user-service/src/config/env.ts

import dotenv from 'dotenv';

dotenv.config();

const mongoHost = process.env.MONGO_HOST || 'localhost';
const mongoPort = process.env.MONGO_PORT || '27017';
const mongoDb = process.env.MONGO_DB || 'flashstore';

const mongoUser =
  process.env.MONGO_ROOT_USERNAME ||
  process.env.MONGO_USERNAME ||
  '';

const mongoPassword =
  process.env.MONGO_ROOT_PASSWORD ||
  process.env.MONGO_PASSWORD ||
  '';

const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT || '6379';
const redisPassword = process.env.REDIS_PASSWORD || '';

const env = {
  PORT: Number(process.env.PORT) || 3001,

  NODE_ENV: process.env.NODE_ENV || 'development',

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

  // ==========================
  // Redis
  // ==========================

  REDIS_HOST: redisHost,
  REDIS_PORT: Number(redisPort),

  REDIS_PASSWORD: redisPassword,

  REDIS_URL:
    process.env.REDIS_URL ||
    (redisPassword
      ? `redis://:${redisPassword}@${redisHost}:${redisPort}`
      : `redis://${redisHost}:${redisPort}`),

  // ==========================
  // Kafka
  // ==========================

  KAFKA_BROKERS:
    process.env.KAFKA_BROKERS?.split(',') || ['kafka:9092'],

  // ==========================
  // JWT
  // ==========================

  JWT_SECRET: process.env.JWT_SECRET || '',

  JWT_REFRESH_SECRET:
    process.env.JWT_REFRESH_SECRET || '',

  // ==========================
  // Email
  // ==========================

  EMAIL_HOST: process.env.EMAIL_HOST,

  EMAIL_PORT: Number(process.env.EMAIL_PORT) || 587,

  EMAIL_USER: process.env.EMAIL_USER,

  EMAIL_PASS: process.env.EMAIL_PASS,
};

export default env;