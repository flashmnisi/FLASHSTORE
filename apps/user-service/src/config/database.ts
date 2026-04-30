// apps/user-service/src/config/database.ts

import mongoose from 'mongoose';
import logger from '@org/shared-logger';
import env from './env';

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGO_URI);

    logger.info('✅ MongoDB connected successfully', {
      database: 'flashstore',
      host: new URL(env.MONGO_URI).hostname,
    });

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error', { error: err.message });
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

  } catch (error: any) {
    logger.error('❌ Failed to connect to MongoDB', { error: error.message });
    throw error;
  }
};