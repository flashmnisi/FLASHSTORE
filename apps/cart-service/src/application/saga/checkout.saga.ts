import { ISagaRepository } from '../interfaces/saga.repository';
import { IOrderClient } from '../interfaces/order.client';
import { IPaymentClient } from '../interfaces/payment.client';
import { CartEntity } from '../../domain/entities/cart.entity';
import logger from '@org/shared-logger';

export class CheckoutSaga {
  constructor(
    private readonly sagaRepo: ISagaRepository,
    private readonly orderClient: IOrderClient,
    private readonly paymentClient: IPaymentClient
  ) {}

  // =====================================================
  // 🚀 START SAGA
  // =====================================================
  async start(userId: string, cart: CartEntity) {
    const saga = await this.sagaRepo.create(
      new (class {
        constructor(
          public id = '',
          public userId = userId,
          public orderId = null,
          public paymentId = null,
          public status: any = 'CREATED',
          public payload = { cart }
        ) {}
      })()
    );

    return this.executeStep1(saga);
  }

  // =====================================================
  // STEP 1: CREATE ORDER
  // =====================================================
  private async executeStep1(saga: any) {
    try {
      const order = await this.orderClient.createOrder({
        userId: saga.userId,
        items: saga.payload.cart.items,
        totalAmount: saga.payload.cart.totalAmount,
      });

      saga.markOrderCreated(order.orderId);
      await this.sagaRepo.update(saga);

      return this.executeStep2(saga);
    } catch (error: any) {
      saga.fail(error.message);
      await this.sagaRepo.update(saga);
      throw error;
    }
  }

  // =====================================================
  // STEP 2: PAYMENT
  // =====================================================
  private async executeStep2(saga: any) {
    try {
      const payment = await this.paymentClient.processPayment({
        orderId: saga.orderId,
        userId: saga.userId,
        amount: saga.payload.cart.totalAmount,
      });

      saga.markPaymentInitiated(payment.paymentId);
      await this.sagaRepo.update(saga);

      return {
        orderId: saga.orderId,
        paymentId: payment.paymentId,
        clientSecret: payment.clientSecret,
      };
    } catch (error: any) {
      saga.fail(error.message);
      await this.sagaRepo.update(saga);

      await this.compensate(saga);

      throw error;
    }
  }

  // =====================================================
  // COMPENSATION
  // =====================================================
  private async compensate(saga: any) {
    try {
      if (saga.orderId) {
        await this.orderClient.cancelOrder(saga.orderId);
        logger.warn('Order compensated', { orderId: saga.orderId });
      }
    } catch (error: any) {
      logger.error('Compensation failed', { error: error.message });
    }
  }

  // =====================================================
  // EVENT: PAYMENT SUCCESS (from Kafka)
  // =====================================================
  async onPaymentSuccess(sagaId: string) {
    const saga = await this.sagaRepo.findById(sagaId);
    if (!saga) return;

    saga.markPaymentSuccess();
    saga.complete();

    await this.sagaRepo.update(saga);

    logger.info('Saga completed successfully', { sagaId });
  }
}