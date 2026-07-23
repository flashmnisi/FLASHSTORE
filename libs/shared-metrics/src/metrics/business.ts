// libs/shared-metrics/src/metrics/business.ts

import { Counter } from 'prom-client';
import { register } from '../registry';

/**
 * Total registered users.
 */
export const userRegistrationsTotal = new Counter({
  name: 'flashstore_users_registered_total',
  help: 'Total registered users',
  labelNames: ['service'],
  registers: [register],
});

/**
 * successful login.
 */

export const userLoginsTotal = new Counter({
  name: 'flashstore_user_logins_total',
  help: 'Total successful user logins',
  labelNames: ['service'],
  registers: [register],
});

/**
 * failed login.
 */

export const userLoginFailuresTotal = new Counter({
  name: 'flashstore_user_login_failures_total',
  help: 'Total failed login attempts',
  labelNames: ['service'],
  registers: [register],
});

 /**
 * otp email.
 */

export const otpEmailsTotal = new Counter({
  name: 'flashstore_otp_emails_total',
  help: 'OTP emails sent',
  labelNames: ['service', 'provider'],
  registers: [register],
});

/**
 * oupons.
 */

export const couponsUsedTotal = new Counter({
  name: 'flashstore_coupons_used_total',
  help: 'Coupons redeemed',
  labelNames: ['service', 'type'],
  registers: [register],
});


/**
 * Refunds.
 */

export const refundsTotal = new Counter({
  name: 'flashstore_refunds_total',
  help: 'Refunds processed',
  labelNames: ['service'],
  registers: [register],
});

/**
 * Orders created.
 */
export const ordersCreatedTotal = new Counter({
  name: 'flashstore_orders_created_total',
  help: 'Total orders created',
  labelNames: ['service', 'status'],
  registers: [register],
});

/**
 * Orders completed.
 */
export const ordersCompletedTotal = new Counter({
  name: 'flashstore_orders_completed_total',
  help: 'Total completed orders',
  labelNames: ['service'],
  registers: [register],
});

/**
 * Orders cancelled.
 */
export const ordersCancelledTotal = new Counter({
  name: 'flashstore_orders_cancelled_total',
  help: 'Total cancelled orders',
  labelNames: ['service', 'reason'],
  registers: [register],
});

/**
 * Payments processed.
 */
export const paymentsTotal = new Counter({
  name: 'flashstore_payments_total',
  help: 'Payments processed',
  labelNames: ['service', 'provider', 'status'],
  registers: [register],
});

/**
 * Payment failures.
 */
export const paymentFailuresTotal = new Counter({
  name: 'flashstore_payment_failures_total',
  help: 'Failed payment attempts',
  labelNames: ['service', 'provider'],
  registers: [register],
});

/**
 * Products viewed.
 */
export const productViewsTotal = new Counter({
  name: 'flashstore_product_views_total',
  help: 'Product views',
  labelNames: ['service', 'productId', 'category'],
  registers: [register],
});

/**
 * Shopping carts created.
 */
export const cartsCreatedTotal = new Counter({
  name: 'flashstore_carts_created_total',
  help: 'Shopping carts created',
  labelNames: ['service'],
  registers: [register],
});

/**
 * Completed checkouts.
 */
export const checkoutsTotal = new Counter({
  name: 'flashstore_checkouts_total',
  help: 'Completed checkouts',
  labelNames: ['service'],
  registers: [register],
});

/**
 * Emails sent.
 */
export const emailsSentTotal = new Counter({
  name: 'flashstore_emails_sent_total',
  help: 'Emails sent',
  labelNames: ['service', 'type'],
  registers: [register],
});

/**
 * Inventory updates.
 */
export const inventoryUpdatesTotal = new Counter({
  name: 'flashstore_inventory_updates_total',
  help: 'Inventory updates',
  labelNames: ['service', 'operation'],
  registers: [register],
});

/**
 * Search queries.
 */
export const searchQueriesTotal = new Counter({
  name: 'flashstore_search_queries_total',
  help: 'Search queries executed',
  labelNames: ['service'],
  registers: [register],
});