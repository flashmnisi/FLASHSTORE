import { Kafka } from 'kafkajs';
import { env } from './env';

export const kafka = new Kafka({
  clientId: 'monorepo-platform',
  brokers: env.KAFKA_BROKERS,
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: 'global-group' });

export const connectKafka = async () => {
  await producer.connect();
  await consumer.connect();

  console.log('[shared-config] Kafka connected');
};