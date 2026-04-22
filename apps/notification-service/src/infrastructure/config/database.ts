import mongoose from 'mongoose';
import logger from '@org/shared-logger';
import env from '../../config/env';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGO_URI);
    logger.info('✅ MongoDB connected successfully to notification service');
  } catch (error: any) {
    logger.error('❌ MongoDB connection failed', { 
      error: error.message,
      mongoUri: env.MONGO_URI 
    });
    process.exit(1);
  }
};