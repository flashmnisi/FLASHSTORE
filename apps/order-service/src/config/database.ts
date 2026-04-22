import mongoose from 'mongoose';
import env from './env';
import logger from '../utils/logger';

export const connectDatabase = async () => {
  try {
    mongoose.set('strictQuery', true);

    await mongoose.connect(env.MONGO_URI, {
      autoIndex: true,
    });

    logger.info('🟢 Order Service MongoDB connected');
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