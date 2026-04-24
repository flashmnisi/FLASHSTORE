import mongoose from 'mongoose';
import { env } from './env';
import logger from '../utils/logger';

export const connectDatabase = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);

    logger.info('MongoDB connected', {
      uri: env.MONGO_URI,
    });
  } catch (error: any) {
    logger.error('MongoDB connection failed', {
      error: error.message,
    });

    process.exit(1);
  }
};