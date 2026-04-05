import { Consumer } from 'kafkajs';
import { getKafkaClient } from './kafka.js';
import { ConsumerConfig } from './types.js';

export const createConsumer = (config: ConsumerConfig): Consumer => {
  const kafka = getKafkaClient();
  const consumer = kafka.consumer({
    groupId: config.groupId,
    retry: { retries: 5 },
  });

  console.log(`👥 Consumer created for group: ${config.groupId}`);
  return consumer;
};

export const runConsumer = async (
  consumer: Consumer, 
  config: ConsumerConfig,
  messageHandler: (message: any) => Promise<void>
) => {
  await consumer.connect();
  await consumer.subscribe({ 
    topics: config.topics, 
    fromBeginning: config.fromBeginning ?? false 
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const value = message.value ? JSON.parse(message.value.toString()) : null;
        
        console.log(`📥 Received message from ${topic}`, { 
          partition, 
          offset: message.offset 
        });

        await messageHandler(value);
      } catch (error: any) {
        console.error(`❌ Error processing message from ${topic}`, error.message);
      }
    },
  });
};