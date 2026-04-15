import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: Number(process.env.PORT) || 3005,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://mongo:27017/flashstore',
  KAFKA_BROKERS: process.env.KAFKA_BROKERS || 'kafka:9092',
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || 'aaajjjs122334567890-0987654',
};

export default env;