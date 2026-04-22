import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Security
  INTERNAL_API_KEY: process.env.INTERNAL_API_KEY || 'change-this-in-production',
  ALLOWED_IPS: process.env.ALLOWED_IPS || '127.0.0.1,::1',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production',

  // Redis (for rate limiting)
  REDIS_URL: process.env.REDIS_URL || 'redis://redis:6379',

  // Logging level
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};

export default env;

// import dotenv from 'dotenv';
// dotenv.config();

// export const config = {
//   port: process.env.PORT || 3000,
//   kafkaBrokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
//   environment: process.env.NODE_ENV || 'development',
//   // Add more later: redis, db, jwt secret, etc.
// };

// export default config;