import mongoose from 'mongoose';
import logger from '@org/shared-logger';
import env from '../../config/env';

const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5s

export const connectDB = async (retries = MAX_RETRIES): Promise<void> => {
  try {
    await mongoose.connect(env.MONGO_URI, {
      autoIndex: true,
    });

    logger.info('✅ MongoDB connected successfully');
  } catch (error: any) {
    logger.error(
      {
        error: error.message,
        retriesLeft: retries,
      },
      '❌ MongoDB connection failed'
    );

    if (retries > 0) {
      logger.warn(`Retrying MongoDB connection in ${RETRY_DELAY / 1000}s...`);
      setTimeout(() => connectDB(retries - 1), RETRY_DELAY);
    } else {
      logger.error('❌ MongoDB connection failed after retries. Exiting...');
      process.exit(1);
    }
  }
};