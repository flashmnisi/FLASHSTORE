import mongoose from 'mongoose';
import logger from '@org/shared-logger';
import env from './env';

export const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    logger.info('✅ Analytics Service connected to MongoDB');
  } catch (error: any) {
    logger.error({ error: error.message }, '❌ MongoDB connection failed in analytics-service');
    process.exit(1);
  }
};