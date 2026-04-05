import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  kafkaBrokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
  environment: process.env.NODE_ENV || 'development',
  // Add more later: redis, db, jwt secret, etc.
};

export default config;