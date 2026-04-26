import { IOrderClient } from '../../application/interfaces/order.client';
import { IPaymentClient } from '../../application/interfaces/payment.client';
import { ICartCacheRepository } from '../../application/interfaces/cart-cache.repository';
import { ICartRepository } from '../../application/interfaces/cart.repository';
import { CartEntity } from '../../domain/entities/cart.entity';
//import { idempotencyService } from '../../utils/idempotency.service';
import logger from '@org/shared-logger';
import { idempotencyService } from '../../shared/idempotency/idempotency.service';

type CheckoutResult = {
  orderId: string;
  paymentId: string;
  clientSecret: string;
  status: string;
};

export class CartCheckoutOrchestrator {
  constructor(
    private readonly orderClient: IOrderClient,
    private readonly paymentClient: IPaymentClient,
    private readonly cartRepo: ICartRepository,
    private readonly cartCache: ICartCacheRepository
  ) {}

  // =====================================================
  // 🔥 MAIN CHECKOUT (IDEMPOTENT SAGA)
  // =====================================================
  async checkout(userId: string, cart: CartEntity, idempotencyKey?: string) {
    const log = logger.withContext({ userId, flow: 'checkout' });

    const key = idempotencyKey || `checkout:${userId}:${Date.now()}`;

    return idempotencyService.execute<CheckoutResult>(key, async () => {
      let orderId: string | null = null;

      try {
        // =============================
        // 1. Validate cart
        // =============================
        if (!cart.items.length) {
          throw new Error('Cart is empty');
        }

        log.info('Starting checkout', {
          totalAmount: cart.totalAmount,
          totalItems: cart.totalItems,
        });

        // =============================
        // 2. CREATE ORDER (Saga Step 1)
        // =============================
        const order = await this.orderClient.createOrder({
          userId,
          items: cart.items.map(i => ({
            productId: i.productId,
            quantity: i.quantity,
            price: i.price,
          })),
          totalAmount: cart.totalAmount,
        });

        orderId = order.orderId;

        log.info('Order created', { orderId });

        // =============================
        // 3. START PAYMENT (Saga Step 2)
        // =============================
        const payment = await this.paymentClient.processPayment({
          orderId,
          userId,
          amount: cart.totalAmount,
        });

        log.info('Payment initiated', {
          orderId,
          paymentId: payment.paymentId,
        });

        // =============================
        // 4. RETURN (WAIT FOR EVENT)
        // =============================
        return {
          orderId,
          paymentId: payment.paymentId,
          clientSecret: payment.clientSecret,
          status: 'pending_payment',
        };
      } catch (error: any) {
        log.error('Checkout failed', { error: error.message });

        // =============================
        // 🔥 COMPENSATION (SAFE + IDEMPOTENT)
        // =============================
        await this.compensate(orderId, log);

        throw error;
      }
    });
  }

  // =====================================================
  // 🔥 COMPENSATION LOGIC (CLEAN SEPARATION)
  // =====================================================
  private async compensate(orderId: string | null, log: any) {
    if (!orderId) return;

    try {
      await this.orderClient.cancelOrder(orderId);

      log.warn('Order cancelled (compensation executed)', {
        orderId,
      });
    } catch (error: any) {
      log.error('Compensation failed', {
        orderId,
        error: error.message,
      });
    }
  }

  // =====================================================
  // 🔥 PAYMENT SUCCESS HANDLER (EVENT-DRIVEN)
  // =====================================================
  async handlePaymentSuccess(userId: string) {
    const log = logger.withContext({ userId });

    try {
      const cart = await this.cartRepo.findByUserId(userId);

      if (!cart) return;

      cart.clear();

      await this.cartRepo.save(cart);
      await this.cartCache.save(cart);

      log.info('Cart cleared after payment success');
    } catch (error: any) {
      log.error('Failed to clear cart', {
        error: error.message,
      });
    }
  }

  // =====================================================
  // 🔥 PAYMENT FAILURE HANDLER
  // =====================================================
  async handlePaymentFailure(orderId: string) {
    const log = logger.withContext({ orderId });

    try {
      await this.orderClient.cancelOrder(orderId);

      log.warn('Order cancelled after payment failure');
    } catch (error: any) {
      log.error('Payment failure compensation failed', {
        error: error.message,
      });
    }
  }
}