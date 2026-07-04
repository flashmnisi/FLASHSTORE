// apps/inventory-service/src/infrastructure/kafka/handlers/payment-failed.handler.ts

import { ReservationService } from '../../../application/services/reservation.service';
import logger from '@org/shared-logger';

export class PaymentFailedHandler {
  constructor(private readonly reservationService: ReservationService) {}

  async handle(event: any) {
    try {
      const payment = event.data;

      if (!payment?.items?.length) {
        logger.warn('Payment event contains no items', {
          orderId: payment?.orderId,
        });
        return;
      }

      for (const item of payment.items) {
        await this.reservationService.releaseStock({
          productId: item.productId,
          warehouseId: payment.warehouseId || 'default',
          quantity: item.quantity,
          orderId: payment.orderId,
          correlationId:
            event.correlationId ||
            event.metadata?.correlationId ||
            payment.orderId,

          referenceId: payment.orderId,

          reason: 'Payment failed',
        });
      }

      logger.info('✅ Reserved stock released', {
        orderId: payment.orderId,
      });
    } catch (error: any) {
      logger.error('❌ PaymentFailedHandler failed', {
        orderId: event.data?.orderId,
        error: error.message,
      });

      throw error;
    }
  }
}
