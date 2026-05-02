// apps/analytics-service/src/infrastructure/kafka/consumers/index.ts

import { UserEventsConsumer } from './user.consumer';
import { OrderEventsConsumer } from './order.consumer';
import { PaymentEventsConsumer } from './payment.consumer';
import logger from '@org/shared-logger';
import { ProductEventsConsumer } from './product.consumer';

export class AnalyticsConsumers {
  constructor(
    private readonly userConsumer: UserEventsConsumer,
    private readonly orderConsumer: OrderEventsConsumer,
    private readonly paymentConsumer: PaymentEventsConsumer,
    private readonly productConsumer: ProductEventsConsumer
  ) {}

  async startAll() {
    try {
      await Promise.all([
        this.userConsumer.start(),
        this.orderConsumer.start(),
        this.paymentConsumer.start(),
        this.productConsumer.start(),
      ]);

      logger.info('✅ All Analytics Consumers started successfully');
    } catch (error: any) {
      logger.error('Failed to start analytics consumers', { error: error.message });
      throw error;
    }
  }
}