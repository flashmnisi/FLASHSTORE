// apps/analytics-service/src/config/database.ts

import mongoose from 'mongoose';
import logger from '@org/shared-logger';
import env from './env';

export const connectDatabase = async (): Promise<void> => {
  try {
    if (!env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined');
    }

    await mongoose.connect(env.MONGO_URI);

    logger.info('✅ MongoDB connected successfully', {
      database: mongoose.connection.name,
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('❌ MongoDB disconnected');
    });

  } catch (error: any) {
    logger.error('❌ MongoDB connection failed', { error: error.message });
    throw error;
  }
};