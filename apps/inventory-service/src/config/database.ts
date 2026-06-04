// apps/inventory-service/src/config/database.ts

import mongoose from 'mongoose';
import env from './env';
import logger from '@org/shared-logger';

export const connectDatabase = async () => {
  try {
    await mongoose.connect(env.MONGO_URI, {
      autoIndex: true,
    });

    logger.info('🟢 inventory Service MongoDB connected');
  } catch (error: any) {
    logger.error('🔴 MongoDB connection failed', {
      error: error.message,
    });

    process.exit(1);
  }
};

export const disconnectDatabase = async () => {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected');
};