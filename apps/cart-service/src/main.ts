import dotenv from 'dotenv';
import logger from '@org/shared-logger';
import { connectDB } from './config/db';
import app from './app';
import env from './config/env';

dotenv.config();

const PORT = env.PORT;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    logger.info(`🚀 Cart Service running on http://localhost:${PORT}`);
  });
};

startServer();