import { EventPipeline } from 'src/pipeline/compose';
import { createConsumer, runConsumer } from '../client/consumer';

import { dlqMiddleware } from 'src/pipeline/middlewares/dlq.middleware';
import { idempotencyMiddleware } from 'src/pipeline/middlewares/idempotency.middleware';
import { loggingMiddleware } from 'src/pipeline/middlewares/logging.middleware';
import { retryMiddleware } from 'src/pipeline/middlewares/retry.middleware';
import { tracingMiddleware } from 'src/pipeline/middlewares/tracing.middleware';

export const subscribe = async (
  config: {
    groupId: string;
    topics: string[];
    serviceName: string;
  },
  handler: (ctx: any) => Promise<void>
) => {
  const consumer = createConsumer(config);

  const pipeline = new EventPipeline()
    .use(tracingMiddleware)
    .use(loggingMiddleware)
    .use(idempotencyMiddleware)
    .use(retryMiddleware)
    .use(dlqMiddleware);

  await runConsumer(consumer, config, async (rawEvent: any) => {
    const ctx = {
      event: rawEvent,
      topic: rawEvent?.topic || config.topics[0],
      eventId: rawEvent?.metadata?.eventId || rawEvent?.eventId,
      serviceName: config.serviceName,

      retryCount: rawEvent?.metadata?.retryCount || 0,
      maxRetries: 5,

      headers: rawEvent?.headers || {},
      receivedAt: Date.now(),
    };

    await pipeline.execute(ctx, async (ctx) => {
      await handler(ctx);
    });
  });
};