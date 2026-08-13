// libs/shared-metrics/src/metrics/business.ts

import { Counter, Gauge } from 'prom-client';
import { register } from '../registry';

// ═══════════════════════════════════════════════════════════
// USERS
// ═══════════════════════════════════════════════════════════

export const userRegistrationsTotal = new Counter({
  name: 'flashstore_users_registered_total',
  help: 'Total registered users',
  labelNames: ['service'],
  registers: [register],
});

export const userLoginsTotal = new Counter({
  name: 'flashstore_user_logins_total',
  help: 'Total successful user logins',
  labelNames: ['service'],
  registers: [register],
});

export const userLoginFailuresTotal = new Counter({
  name: 'flashstore_user_login_failures_total',
  help: 'Total failed login attempts',
  labelNames: ['service'],
  registers: [register],
});

// ═══════════════════════════════════════════════════════════
// ORDERS
// ═══════════════════════════════════════════════════════════

export const ordersCreatedTotal = new Counter({
  name: 'flashstore_orders_created_total',
  help: 'Total orders created',
  labelNames: ['service', 'status'],
  registers: [register],
});

export const ordersCompletedTotal = new Counter({
  name: 'flashstore_orders_completed_total',
  help: 'Total completed orders',
  labelNames: ['service'],
  registers: [register],
});

export const ordersCancelledTotal = new Counter({
  name: 'flashstore_orders_cancelled_total',
  help: 'Total cancelled orders',
  labelNames: ['service', 'reason'],
  registers: [register],
});

// ═══════════════════════════════════════════════════════════
// REVENUE & PAYMENTS
// ═══════════════════════════════════════════════════════════

/** Count money only on confirmed success (webhook / paid). */
export const revenueTotal = new Counter({
  name: 'flashstore_revenue_total',
  help: 'Total confirmed revenue',
  labelNames: ['service', 'currency'],
  registers: [register],
});

export const paymentsTotal = new Counter({
  name: 'flashstore_payments_total',
  help: 'Payments processed',
  labelNames: ['service', 'provider', 'status'],
  registers: [register],
});

export const paymentFailuresTotal = new Counter({
  name: 'flashstore_payment_failures_total',
  help: 'Failed payment attempts',
  labelNames: ['service', 'provider'],
  registers: [register],
});

export const paymentAmountTotal = new Counter({
  name: 'flashstore_payment_amount_total',
  help: 'Sum of payment amounts by status',
  labelNames: ['service', 'provider', 'status', 'currency'],
  registers: [register],
});

export const refundsTotal = new Counter({
  name: 'flashstore_refunds_total',
  help: 'Refunds processed',
  labelNames: ['service'],
  registers: [register],
});

// ═══════════════════════════════════════════════════════════
// PRODUCTS & SEARCH
// ═══════════════════════════════════════════════════════════

export const productsCreatedTotal = new Counter({
  name: 'flashstore_products_created_total',
  help: 'Products created',
  labelNames: ['service'],
  registers: [register],
});

/**
 * Prefer category over productId for lower cardinality.
 * If you keep productId, expect many series.
 */
export const productViewsTotal = new Counter({
  name: 'flashstore_product_views_total',
  help: 'Product views',
  labelNames: ['service', 'category'],
  registers: [register],
});

export const searchQueriesTotal = new Counter({
  name: 'flashstore_search_queries_total',
  help: 'Search queries executed',
  labelNames: ['service'],
  registers: [register],
});

// ═══════════════════════════════════════════════════════════
// CART & CHECKOUT
// ═══════════════════════════════════════════════════════════

export const cartsCreatedTotal = new Counter({
  name: 'flashstore_carts_created_total',
  help: 'Shopping carts created',
  labelNames: ['service'],
  registers: [register],
});

export const cartAdditionsTotal = new Counter({
  name: 'flashstore_cart_additions_total',
  help: 'Items added to cart',
  labelNames: ['service'],
  registers: [register],
});

export const checkoutsStartedTotal = new Counter({
  name: 'flashstore_checkouts_started_total',
  help: 'Checkout flows started',
  labelNames: ['service'],
  registers: [register],
});

export const checkoutsTotal = new Counter({
  name: 'flashstore_checkouts_total',
  help: 'Completed checkouts',
  labelNames: ['service'],
  registers: [register],
});

/** Increment from domain logic (TTL job / abandoned state), not random HTTP. */
export const cartsAbandonedTotal = new Counter({
  name: 'flashstore_carts_abandoned_total',
  help: 'Carts marked as abandoned',
  labelNames: ['service'],
  registers: [register],
});

// ═══════════════════════════════════════════════════════════
// INVENTORY (gauges = current state)
// ═══════════════════════════════════════════════════════════

export const inventoryUpdatesTotal = new Counter({
  name: 'flashstore_inventory_updates_total',
  help: 'Inventory updates',
  labelNames: ['service', 'operation'],
  registers: [register],
});

export const inventoryProductsGauge = new Gauge({
  name: 'flashstore_inventory_products',
  help: 'Current product count in inventory',
  labelNames: ['service'],
  registers: [register],
});

export const inventoryOutOfStockGauge = new Gauge({
  name: 'flashstore_inventory_out_of_stock',
  help: 'Current out-of-stock count',
  labelNames: ['service'],
  registers: [register],
});

export const inventoryLowStockGauge = new Gauge({
  name: 'flashstore_inventory_low_stock',
  help: 'Current low-stock count',
  labelNames: ['service'],
  registers: [register],
});

// ═══════════════════════════════════════════════════════════
// OTHER
// ═══════════════════════════════════════════════════════════

export const otpEmailsTotal = new Counter({
  name: 'flashstore_otp_emails_total',
  help: 'OTP emails sent',
  labelNames: ['service', 'provider'],
  registers: [register],
});

export const couponsUsedTotal = new Counter({
  name: 'flashstore_coupons_used_total',
  help: 'Coupons redeemed',
  labelNames: ['service', 'type'],
  registers: [register],
});

export const emailsSentTotal = new Counter({
  name: 'flashstore_emails_sent_total',
  help: 'Emails sent',
  labelNames: ['service', 'type'],
  registers: [register],
});