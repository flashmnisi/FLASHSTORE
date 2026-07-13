import dotenv from 'dotenv';
dotenv.config();

const mongoHost = process.env.MONGO_HOST;
const mongoPort = process.env.MONGO_PORT;
const mongoDb =
  process.env.ANALYTICS_MONGO_DB ||
  process.env.MONGO_DB ||
  'flashstore-analytics';

const mongoUser = process.env.MONGO_ROOT_USERNAME || '';
const mongoPassword = process.env.MONGO_ROOT_PASSWORD || '';

export default {
  PORT: Number(process.env.PORT),
  NODE_ENV: process.env.NODE_ENV,

  MONGO_URI:
    process.env.MONGO_URI ||
    (mongoUser && mongoPassword
      ? `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoDb}?authSource=admin`
      : `mongodb://${mongoHost}:${mongoPort}/${mongoDb}`),

  REDIS_URL: process.env.REDIS_URL,

  KAFKA_BROKERS:
    process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],

  KAFKA_CLIENT_ID:
    process.env.ANALYTICS_KAFKA_CLIENT_ID ||
    process.env.KAFKA_CLIENT_ID,

  JWT_SECRET: process.env.JWT_SECRET || '',

  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};