// apps/gateway/src/main.ts

import 'dotenv/config';

import {
  setupTelemetry,
  shutdownTelemetry,
} from '@org/shared-telemetry';

import type { Express } from 'express';

/**
 * =====================================================
 * TELEMETRY
 * =====================================================
 *
 * Must initialize before importing the application
 * modules that create HTTP/Express/Mongo/etc clients.
 */
setupTelemetry({
  serviceName:
    process.env.OTEL_SERVICE_NAME ?? 'gateway',

  serviceVersion: '1.0.0',

  environment:
    process.env.NODE_ENV ?? 'development',
});

async function main() {
  /**
   * ===================================================
   * RATE LIMITER
   * ===================================================
   */
  const {
    initRateLimiter,
  } = await import('./config/rate-limit.js');

  await initRateLimiter();

  /**
   * ===================================================
   * APPLICATION
   * ===================================================
   */
  const appModule = await import('./app.js');

  const app =
    appModule.default as unknown as Express;

  /**
   * ===================================================
   * LOGGER
   * ===================================================
   */
  const {
    logger,
  } = await import('@org/shared-logger');

  /**
   * ===================================================
   * PORT
   * ===================================================
   */
  const parsedPort = Number.parseInt(
    process.env.PORT ?? '3000',
    10,
  );

  const PORT =
    Number.isInteger(parsedPort) &&
    parsedPort >= 0 &&
    parsedPort < 65536
      ? parsedPort
      : 3000;

  /**
   * ===================================================
   * SERVER
   * ===================================================
   */
  const server = app.listen(PORT, () => {
    logger.info(
      '✅ FlashStore Gateway is running successfully',
    );

    logger.info(
      `📡 Listening on http://localhost:${PORT}`,
    );
  });

  /**
   * ===================================================
   * GRACEFUL SHUTDOWN
   * ===================================================
   */
  const shutdown = async (signal: string) => {
    logger.warn(
      `Received ${signal}, shutting down...`,
    );

    server.close(async () => {
      await shutdownTelemetry();

      process.exit(0);
    });

    setTimeout(() => {
      process.exit(1);
    }, 10_000);
  };

  process.on(
    'SIGTERM',
    () => void shutdown('SIGTERM'),
  );

  process.on(
    'SIGINT',
    () => void shutdown('SIGINT'),
  );
}

main().catch((error) => {
  console.error(
    '❌ Gateway failed to start:',
    error,
  );

  process.exit(1);
});