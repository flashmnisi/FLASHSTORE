import mongoose from 'mongoose';
import env from './env';
import logger from '@org/shared-logger';

export const connectDatabase = async () => {
  try {
    if (!env.MONGO_URI) {
      logger.warn('⚠️ MONGO_URI not provided — skipping DB connection');
      return;
    }

    await mongoose.connect(env.MONGO_URI);

    logger.info('🟢 MongoDB connected (search service auxiliary DB)');
  } catch (error: any) {
    logger.error('🔴 MongoDB connection failed', {
      error: error.message,
    });

    process.exit(1);
  }
};