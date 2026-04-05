import { Kafka } from 'kafkajs';

let kafkaInstance: Kafka | null = null;

export const getKafkaClient = (): Kafka => {
  if (!kafkaInstance) {
    const brokers = (process.env.KAFKA_BROKERS || 'localhost:9092')
      .split(',')
      .map((b) => b.trim());

    kafkaInstance = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID || 'flashstore-gateway',
      brokers,
      retry: {
        initialRetryTime: 300,
        retries: 8,
        maxRetryTime: 30000,
      },
      connectionTimeout: 10000,
      requestTimeout: 25000,
    });

    console.log(`✅ Kafka client initialized with brokers: ${brokers.join(', ')}`);
  }
  return kafkaInstance;
};

export const disconnectKafka = async () => {
  kafkaInstance = null;
  console.log('Kafka client disconnected');
};