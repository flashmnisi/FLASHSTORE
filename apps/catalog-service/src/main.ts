import dotenv from 'dotenv';
import logger from '@org/shared-logger';
import { connectDB } from './config/db';
import app from './app';

dotenv.config();

const PORT = process.env.PORT || 3002;

const startServer = async () => {
  try {
    
    await connectDB();

    // Start the server
    app.listen(PORT, () => {
      logger.info(`🚀 Catalog Service running on http://localhost:${PORT}`);
    });
  } catch (error: any) {
    logger.error(
      { error: error.message },
      'Failed to start Catalog Service'
    );
    process.exit(1);
  }
};

startServer();