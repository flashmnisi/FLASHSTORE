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
  PORT: Number(process.env.PORT),

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

  // =========================
  // ELASTICSEARCH
  // =========================
  ELASTIC_URL: process.env.ELASTIC_URL,
  ELASTIC_USERNAME: process.env.ELASTIC_USERNAME || '',
  ELASTIC_PASSWORD: process.env.ELASTIC_PASSWORD || '',

  // =========================
  // SECURITY
  // =========================
  JWT_SECRET: process.env.JWT_SECRET,

  // =========================
  // LOGGING
  // =========================
  LOG_LEVEL: process.env.LOG_LEVEL,
};

export default env;