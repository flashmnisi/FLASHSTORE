import { subscribe } from '../../messaging/subscribe';

export const startDLQConsumer = () => {
  subscribe(
    {
      groupId: 'dlq-service',
      topics: ['*.dlq'],
      serviceName: 'dlq-service',
    },
    async (event) => {
      console.log('💀 DLQ Event received:', {
        topic: event.topic,
        error: event.error,
      });
    }
  );
};