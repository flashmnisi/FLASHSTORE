import dotenv from 'dotenv';

dotenv.config();

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 4005,

  // =========================
  // ELASTICSEARCH
  // =========================
  ELASTIC_URL: process.env.ELASTIC_URL || 'http://localhost:9200',
  ELASTIC_USERNAME: process.env.ELASTIC_USERNAME || '',
  ELASTIC_PASSWORD: process.env.ELASTIC_PASSWORD || '',

  // =========================
  // SECURITY
  // =========================
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret',

  // =========================
  // LOGGING
  // =========================
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};

export default env;