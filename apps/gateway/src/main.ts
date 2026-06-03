// apps/gateway/src/main.ts

import dotenv from 'dotenv';

dotenv.config();

import logger from '@org/shared-logger';

import app from './app';

import env from './config/env';

const startGateway = async () => {

  try {

    logger.info(
      '🚀 Starting Flashstore API Gateway...'
    );

    const PORT =
      env.PORT || 3000;

    const server =
      app.listen(PORT, () => {

        logger.info(
          '✅ Flashstore Gateway is running successfully'
        );

        logger.info(
          `📡 Listening on http://localhost:${PORT}`
        );

        logger.info(
          `🌍 Environment: ${env.NODE_ENV}`
        );

        logger.info(
          `🕒 Timestamp: ${new Date().toISOString()}`
        );

      });

    /**
     * ======================
     * GRACEFUL SHUTDOWN
     * ======================
     */
    const gracefulShutdown = (
      signal: string
    ) => {

      logger.warn(
        `⚠️ Received ${signal}. Shutting down Gateway gracefully...`
      );

      server.close(() => {

        logger.info(
          '✅ HTTP server closed'
        );

        process.exit(0);

      });

      setTimeout(() => {

        logger.error(
          '❌ Force shutting down'
        );

        process.exit(1);

      }, 10000);

    };

    process.on(
      'SIGTERM',
      () => gracefulShutdown('SIGTERM')
    );

    process.on(
      'SIGINT',
      () => gracefulShutdown('SIGINT')
    );

  } catch (error: any) {

    logger.error(
      '❌ Failed to start Flashstore Gateway',
      {
        error: error.message,
        stack: error.stack,
      }
    );

    process.exit(1);

  }

};

startGateway();