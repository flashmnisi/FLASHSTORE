import { CartService }
from '../../application/services/cart.service';

import { CouponService }
from '../../application/services/coupon.service';

/**
 * Controllers
 */
import { CartController }
from '../../presentation/controllers/cart.controller';

/**
 * Repositories
 */
// import { MongoCartRepository }
// from '../../repositories/mongo-cart.repository';

import { RedisCartCacheRepository }
from '../cache/redis-cart-cache.repository';


/**
 * Clients
 */
import { ProductClient }
from '../client/product.client';

import { OrderClient }
from '../client/order.client';

import { PaymentClient }
from '../client/payment.client';

/**
 * Providers
 */
import { PromotionProvider }
from '../providers/promotion.provider';

import { PricingProvider }
from '../providers/pricing.provider';

/**
 * Checkout
 */
import { CartCheckoutOrchestrator }
from '../checkout/cart-checkout.orchestrator';
import { MongoCartRepository } from '../persistence/repositories/mongo-cart.repository';
import { InMemoryCouponRepository } from '../persistence/repositories/in-memory-coupon.repository';
import { OutboxService } from '../outbox/outbox.service';
import { OutboxRepository } from '../outbox/outbox.epository';

/**
 * =====================================================
 * REPOSITORIES
 * =====================================================
 */
const cartRepository =
  new MongoCartRepository();

const cartCache =
  new RedisCartCacheRepository();

const couponRepository =
  new InMemoryCouponRepository();

  const outboxRepository = new OutboxRepository();

/**
 * =====================================================
 * CLIENTS
 * =====================================================
 */
const productClient =
  new ProductClient();

const orderClient =
  new OrderClient();

const paymentClient =
  new PaymentClient();

/**
 * =====================================================
 * PROVIDERS
 * =====================================================
 */
const promotionProvider =
  new PromotionProvider();

const pricingProvider =
  new PricingProvider();

/**
 * =====================================================
 * SERVICES
 * =====================================================
 */
const couponService =
  new CouponService(
    couponRepository
  );

/**
 * =====================================================
 * ORCHESTRATOR
 * =====================================================
 */
const orchestrator =
  new CartCheckoutOrchestrator(
    orderClient,
    paymentClient,
    cartRepository,
    cartCache,
    couponService
  );

/**
 * =====================================================
 * CART SERVICE
 * =====================================================
 */

export const outboxService = new OutboxService(outboxRepository);

const cartService =
  new CartService(
    cartRepository,
    cartCache,
    productClient,
    promotionProvider,
    pricingProvider,
    orchestrator,
    outboxService
  );

/**
 * =====================================================
 * CONTROLLER
 * =====================================================
 */
const cartController =
  new CartController(
    cartService
  );

export {
  cartService,
  cartController,
};