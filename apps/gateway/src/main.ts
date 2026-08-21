import logger from '@org/shared-logger';
import { setupTelemetry, shutdownTelemetry } from '@org/shared-telemetry';
import dotenv from 'dotenv';
import { env } from 'process';
import app from './app';

dotenv.config();

setupTelemetry({
  serviceName: process.env.OTEL_SERVICE_NAME ?? 'gateway',
  serviceVersion: '1.0.0',
  environment: process.env.NODE_ENV ?? 'development',
});

// Dynamic import AFTER SDK start
async function main() {

  const PORT = env.PORT || 3000;

  const server = app.listen(PORT, () => {
    logger.info('✅ Flashstore Gateway is running successfully');
    logger.info(`📡 Listening on http://localhost:${PORT}`);
  });

  const shutdown = async (signal: string) => {
    logger.warn(`Received ${signal}, shutting down...`);
    server.close(async () => {
      await shutdownTelemetry();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000);
  };

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
