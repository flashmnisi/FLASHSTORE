import { buildHeaders } from 'src/utils/header';
import { publish } from '../../messaging/publish';
import { DLQEvent } from './dlq.types';
//import { buildHeaders } from '../../headers';

export const sendToDLQ = async (event: DLQEvent) => {
  const dlqTopic = `${event.topic}.dlq`;

  const enrichedEvent = {
    ...event,
    metadata: {
      ...event.metadata,
      failedAt: new Date().toISOString(),
      originalTopic: event.topic,
      reason: event.error?.message || 'Unknown error',
    },
  };

  await publish({
    topic: dlqTopic,
    event: 'dlq.message',
    data: enrichedEvent,

    // 🔥 preserve trace context
    headers: buildHeaders({
      requestId: event.metadata?.requestId,
      correlationId: event.metadata?.correlationId,
      retryCount: Number(event.metadata?.retryCount || 0),
    }),
  });
};