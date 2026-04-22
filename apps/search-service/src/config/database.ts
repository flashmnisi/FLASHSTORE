import mongoose from 'mongoose';
import logger from '../utils/logger';
import env from './env';

export const connectDatabase = async () => {
  try {
    if (!env.MONGO_URI) return;

    await mongoose.connect(env.MONGO_URI);

    logger.info('🟢 MongoDB connected (search service auxiliary DB)');
  } catch (error: any) {
    logger.error('🔴 MongoDB connection failed', {
      error: error.message,
    });

    process.exit(1);
  }
};