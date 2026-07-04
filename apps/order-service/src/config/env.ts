import dotenv from 'dotenv';

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV,

  PORT: process.env.PORT,

  MONGO_URI: process.env.MONGO_URI || 'MONGO_URI is required',

  KAFKA_BROKERS: process.env.KAFKA_BROKERS || '',
  KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID,

  JWT_SECRET: process.env.JWT_SECRET,
};

export default env;