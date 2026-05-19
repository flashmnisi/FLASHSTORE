// // apps/analytics-service/src/infrastructure/kafka/consumers/index.ts

// import logger from '@org/shared-logger';
// import { UserEventsConsumer } from './user.consumer';
// import { OrderEventsConsumer } from './order.consumer';
// import { PaymentEventsConsumer } from './payment.consumer';
// import { ProductEventsConsumer } from './product.consumer';

// export class AnalyticsConsumers {
//   constructor(
//     private readonly userConsumer: UserEventsConsumer,
//     private readonly orderConsumer: OrderEventsConsumer,
//     private readonly paymentConsumer: PaymentEventsConsumer,
//     private readonly productConsumer: ProductEventsConsumer
//   ) {}

//   async start() {
//     const consumers = [
//       { name: 'User', start: () => this.userConsumer.start() },
//       { name: 'Order', start: () => this.orderConsumer.start() },
//       { name: 'Payment', start: () => this.paymentConsumer.start() },
//       { name: 'Product', start: () => this.productConsumer.start() },
//     ];

//     for (const consumer of consumers) {
//       try {
//         await this.startWithRetry(consumer.name, consumer.start);
//       } catch (error: any) {
//         logger.error(`Failed to start ${consumer.name} consumer after retries`, {
//           error: error.message,
//         });
//       }
//     }

//     logger.info('✅ All Analytics Consumers started successfully');
//   }

//   private async startWithRetry(name: string, startFn: () => Promise<void>, maxRetries = 6) {
//     for (let attempt = 1; attempt <= maxRetries; attempt++) {
//       try {
//         await startFn();
//         logger.info(`✅ ${name} Events Consumer started`);
//         return;
//       } catch (error: any) {
//         if (error.message?.includes('group coordinator') || error.message?.includes('topic-partition')) {
//           logger.warn(`⚠️ ${name} consumer retry ${attempt}/${maxRetries} (Kafka not ready yet)`);
//           await new Promise(r => setTimeout(r, 3000 * attempt)); // exponential backoff
//         } else {
//           throw error;
//         }
//       }
//     }
//     throw new Error(`Failed to start ${name} consumer after ${maxRetries} attempts`);
//   }
// }