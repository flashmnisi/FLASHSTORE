import { IOrderClient } from '../../application/interfaces/order.client';
import { IPaymentClient } from '../../application/interfaces/payment.client';
import { ICartCacheRepository } from '../../application/interfaces/cart-cache.repository';
import { ICartRepository } from '../../application/interfaces/cart.repository';
import { CouponService } from '../../application/services/coupon.service';
import { CartEntity } from '../../domain/entities/cart.entity';
import logger from '@org/shared-logger';
import { idempotencyService } from '../../shared/idempotency/idempotency.service';

type CheckoutResult = {
  orderId: string;
  paymentId: string;
  clientSecret: string;
  status: string;
  discountAmount?: number;
  couponCode?: string;
};

export class CartCheckoutOrchestrator {
  constructor(
    private readonly orderClient: IOrderClient,
    private readonly paymentClient: IPaymentClient,
    private readonly cartRepo: ICartRepository,      // ← Now used
    private readonly cartCache: ICartCacheRepository, // ← Now used
    private readonly couponService: CouponService
  ) {}

  /**
   * 🔥 MAIN CHECKOUT with Coupon Support
   */
  async checkout(
    userId: string, 
    cart: CartEntity, 
    couponCode?: string,
    idempotencyKey?: string
  ): Promise<CheckoutResult> {
    const key = idempotencyKey || `checkout:${userId}:${Date.now()}`;
    const correlationId = key;

    return idempotencyService.execute<CheckoutResult>(key, async () => {
      let orderId: string | null = null;
      let appliedDiscount = 0;
      let appliedCouponCode: string | undefined = undefined;

      try {
        if (!cart.items || cart.items.length === 0) {
          throw new Error('Cart is empty');
        }

        logger.info('Starting checkout saga', {
          correlationId,
          userId,
          totalAmount: cart.totalAmount,
          couponCode,
        });

        // 1. Apply Coupon (if provided)
        if (couponCode) {
          const couponResult = await this.couponService.validateAndApply(
            couponCode,
            cart.totalAmount,
            userId
          );

          if (couponResult.success && couponResult.coupon) {
            appliedDiscount = couponResult.discountAmount;
            appliedCouponCode = couponCode;
            logger.info('Coupon applied successfully', { 
              couponCode, 
              discountAmount: appliedDiscount 
            });
          }
        }

        const finalAmount = Math.max(0, cart.totalAmount - appliedDiscount);

        // 2. Create Order
        const order = await this.orderClient.createOrder({
          userId,
          items: cart.items.map(i => ({
            productId: i.productId,
            quantity: i.quantity,
            price: i.price,
          })),
          totalAmount: finalAmount,
          idempotencyKey: key,
          correlationId,
        });

        orderId = order.orderId;

        // 3. Process Payment
        const payment = await this.paymentClient.processPayment({
          orderId,
          userId,
          amount: finalAmount,
          idempotencyKey: key,
          correlationId,
        });

        logger.info('Checkout completed - payment initiated', {
          correlationId,
          orderId,
          finalAmount,
          discountApplied: appliedDiscount,
        });

        return {
          orderId,
          paymentId: payment.paymentId,
          clientSecret: payment.clientSecret,
          status: 'pending_payment',
          discountAmount: appliedDiscount,
          couponCode: appliedCouponCode,
        };

      } catch (error: any) {
        logger.error('Checkout saga failed', {
          correlationId,
          error: error.message,
        });

        if (orderId) {
          await this.compensate(orderId, correlationId);
        }

        throw error;
      }
    });
  }

  /**
   * 🔥 Compensation (Rollback)
   */
  private async compensate(orderId: string, correlationId: string) {
    const compensationKey = `compensate:${orderId}`;

    await idempotencyService.execute(compensationKey, async () => {
      try {
        await this.orderClient.cancelOrder(orderId);
        logger.warn('Compensation: Order cancelled', { correlationId, orderId });
      } catch (e: any) {
        logger.error('Compensation failed', { correlationId, orderId, error: e.message });
      }
    });
  }

  /**
   * 🔥 Handle Payment Success - Clear Cart
   */
  async handlePaymentSuccess(userId: string, orderId?: string) {
    try {
      const cart = await this.cartRepo.findByUserId(userId);
      if (!cart) return;

      cart.clear();

      await this.cartRepo.save(cart);
      await this.cartCache.save(cart);     // ← Now used

      logger.info('Cart cleared after successful payment', { userId, orderId });
    } catch (error: any) {
      logger.error('Failed to clear cart after payment success', {
        userId,
        orderId,
        error: error.message,
      });
    }
  }

  /**
   * 🔥 Handle Payment Failure
   */
  async handlePaymentFailure(orderId: string) {
    try {
      await this.orderClient.cancelOrder(orderId);
      logger.warn('Order cancelled after payment failure', { orderId });
    } catch (error: any) {
      logger.error('Failed to cancel order after payment failure', {
        orderId,
        error: error.message,
      });
    }
  }
}