import mongoose from 'mongoose';
import logger from '@org/shared-logger';
import env from './env';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGO_URI);
    logger.info('✅ Payment Service connected to MongoDB');
  } catch (error: any) {
    logger.error({ error: error.message }, '❌ MongoDB connection failed in payment-service');
    process.exit(1);
  }
};