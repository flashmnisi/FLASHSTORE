import mongoose from 'mongoose';
import logger from '@org/shared-logger';
import env from './env';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGO_URI);
    logger.info('✅ MongoDB connected successfully');
  } catch (error: any) {
    logger.error(
      { 
        error: error.message,
        mongoUri: env.MONGO_URI 
      },
      '❌ MongoDB connection failed'
    );
    process.exit(1);
  }
};