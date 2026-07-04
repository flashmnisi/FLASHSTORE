// apps/analytics-service/src/container.ts

import logger from '@org/shared-logger';

// ====================== REPOSITORIES ======================
import { AnalyticsRepositoryImpl } from './infrastructure/persistance/mongoose/repositories/analytics.repository.impl';
import { AnalyticsModel } from './infrastructure/persistance/mongoose/models/analytics.model';
import { MetricModel } from './infrastructure/persistance/mongoose/models/metric.model';

// ====================== USE CASES ======================
import { TrackUserRegistrationUseCase } from './application/use-cases/track-user-registration.usecase';

// ====================== HANDLERS ======================

import { CartHandler } from './infrastructure/kafka/consumers/handlers/cart.handler';
import { CategoryHandler } from './infrastructure/kafka/consumers/handlers/category.handler';
import { InventoryHandler } from './infrastructure/kafka/consumers/handlers/inventory.handler';
import { OrderHandler } from './infrastructure/kafka/consumers/handlers/order.handler';
import { PaymentHandler } from './infrastructure/kafka/consumers/handlers/payment.handler';
import { ProductHandler } from './infrastructure/kafka/consumers/handlers/product.handler';
import { UserHandler } from './infrastructure/kafka/consumers/handlers/user.handler';

// ====================== CONSUMER ======================
import { AnalyticsConsumer } from './infrastructure/kafka/consumers';

// ====================== SERVICES ======================
import { AnalyticsService } from './application/services/analytics.service';
import { MetricsService } from './application/services/metrics.service';
import { DashboardService } from './application/services/dashboard.service';
import { NotificationHandler } from './infrastructure/kafka/consumers/handlers/notification.handler';


// ====================== REPOSITORY ======================
const analyticsRepository = new AnalyticsRepositoryImpl(
  AnalyticsModel,
  MetricModel
);

// ====================== USE CASES ======================
const trackUserRegistration = new TrackUserRegistrationUseCase(analyticsRepository);

// ====================== HANDLERS ======================
const userHandler = new UserHandler(trackUserRegistration);
const orderHandler = new OrderHandler();
const paymentHandler = new PaymentHandler();
const productHandler = new ProductHandler();
const categoryHandler = new CategoryHandler();
const cartHandler = new CartHandler();
const inventoryHandler = new InventoryHandler();
const notificationHandler = new NotificationHandler ()

// ====================== CONSUMER ======================
export const analyticsConsumer = new AnalyticsConsumer(
  userHandler,
  orderHandler,
  paymentHandler,
  productHandler,
  categoryHandler,
  cartHandler,
  inventoryHandler,
  notificationHandler
);

// ====================== SERVICES ======================
export const analyticsService = new AnalyticsService(analyticsRepository);
export const metricsService = new MetricsService(analyticsRepository);
export const dashboardService = new DashboardService(metricsService);

logger.info('✅ Analytics Service Container initialized successfully');