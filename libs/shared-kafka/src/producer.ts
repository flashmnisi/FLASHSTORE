import { Producer, ProducerRecord } from 'kafkajs';
import { getKafkaClient } from './kafka.js';
import { PublishOptions } from './types.js';

let producer: Producer | null = null;

export const getProducer = async (): Promise<Producer> => {
  if (!producer) {
    const kafka = getKafkaClient();
    producer = kafka.producer({
      allowAutoTopicCreation: true,
      transactionTimeout: 30000,
    });

    await producer.connect();
    console.log('🚀 Kafka Producer connected successfully');
  }
  return producer;
};

export const publish = async (options: PublishOptions): Promise<void> => {
  try {
    const prod = await getProducer();

    const record: ProducerRecord = {
      topic: options.topic,
      messages: [
        {
          key: options.key,
          value: typeof options.message === 'string'
            ? options.message
            : JSON.stringify(options.message),
          headers: { service: 'gateway' },
        },
      ],
    };

    await prod.send(record);

    console.log(`📤 Message published to ${options.topic}`, { key: options.key });
  } catch (error: any) {
    console.error(`❌ Failed to publish message to ${options.topic}`, error.message);
    throw error;
  }
};

// import { Producer, ProducerRecord } from 'kafkajs';
// import { getKafkaClient } from './kafka.js';
// //import { logger } from '../../shared-logger/src/index.js';
// import { PublishOptions } from './types.js';

// let producer: Producer | null = null;

// export const getProducer = async (): Promise<Producer> => {
//   if (!producer) {
//     const kafka = getKafkaClient();
//     producer = kafka.producer({
//       allowAutoTopicCreation: true,
//       transactionTimeout: 30000,
//     });

//     await producer.connect();
//     //logger.info('🚀 Kafka Producer connected successfully');
//     console.log('🚀 Kafka Producer connected successfully')
//   }
//   return producer;
// };

// export const publish = async (options: PublishOptions): Promise<void> => {
//   try {
//     const prod = await getProducer();

//     const record: ProducerRecord = {
//       topic: options.topic,
//       messages: [
//         {
//           key: options.key,
//           value: typeof options.message === 'string'
//             ? options.message
//             : JSON.stringify(options.message),
//           headers: { service: 'gateway' },
//         },
//       ],
//     };

//     await prod.send(record);

//     // ✅ Fixed Pino logging: object first, then message
//     console.info(
//       { 
//         topic: options.topic, 
//         key: options.key 
//       },
//       `📤 Message published to ${options.topic}`
//     );
//   } catch (error: any) {
//     console.error(
//       { 
//         topic: options.topic, 
//         error: error.message 
//       },
//       `❌ Failed to publish message to ${options.topic}`
//     );
//     throw error;
//   }
// };