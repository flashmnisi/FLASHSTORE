import dotenv from 'dotenv';

dotenv.config();

const env = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: Number(process.env.PORT),

  // =========================
  // DATABASE
  // =========================
  MONGO_URI: process.env.MONGO_URI || '',

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