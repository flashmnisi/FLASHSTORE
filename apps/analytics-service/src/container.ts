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
// import logger from '@org/shared-logger';

// // ====================== REPOSITORIES ======================
// import { AnalyticsRepositoryImpl } from './infrastructure/persistance/mongoose/repositories/analytics.repository.impl';
// import { EventLogRepositoryImpl } from './infrastructure/persistance/mongoose/repositories/event-log.repository.impl';

// // ====================== SERVICES ======================
// import { AnalyticsService } from './application/services/analytics.service';
// import { MetricsService } from './application/services/metrics.service';
// import { DashboardService } from './application/services/dashboard.service';

// // ====================== USE CASES ======================
// import { TrackUserRegistrationUseCase } from './application/use-cases/track-user-registration.usecase';
// import { TrackOrderCreatedUseCase } from './application/use-cases/track-order-created.usecase';
// import { TrackPaymentSuccessUseCase } from './application/use-cases/track-payment-success.usecase';
// import { TrackProductViewUseCase } from './application/use-cases/track-product-view.usecase';

// // ====================== KAFKA CONSUMERS ======================
// import { UserEventsConsumer } from './infrastructure/kafka/consumers/user.consumer';
// import { OrderEventsConsumer } from './infrastructure/kafka/consumers/order.consumer';
// import { PaymentEventsConsumer } from './infrastructure/kafka/consumers/payment.consumer';
// import { ProductEventsConsumer } from './infrastructure/kafka/consumers/product.consumer'; 

// // ====================== SCHEDULERS ======================
 //import { AggregationJob } from './infrastructure/schedulers/aggregation.job';
// import { CleanupJob } from './infrastructure/schedulers/cleanup.job';

// // ====================== DEPENDENCY INJECTION ======================

// // Repositories
// const analyticsRepository = new AnalyticsRepositoryImpl();
// const eventLogRepository = new EventLogRepositoryImpl();

// // Use Cases
// const trackUserRegistration = new TrackUserRegistrationUseCase(analyticsRepository);
// const trackOrderCreated = new TrackOrderCreatedUseCase(analyticsRepository);
// const trackPaymentSuccess = new TrackPaymentSuccessUseCase(analyticsRepository);
// const trackProductView = new TrackProductViewUseCase(analyticsRepository);   // ← Now defined

// // Services
// export const analyticsService = new AnalyticsService(analyticsRepository);
// export const metricsService = new MetricsService(analyticsRepository);
// export const dashboardService = new DashboardService(metricsService);

// // Kafka Consumers
// export const authEventsConsumer = new AuthEventsConsumer(trackUserRegistration);
// export const userEventsConsumer = new UserEventsConsumer(trackUserRegistration);
// export const orderEventsConsumer = new OrderEventsConsumer(trackOrderCreated);
// export const paymentEventsConsumer = new PaymentEventsConsumer(trackPaymentSuccess);
// export const productEventsConsumer = new ProductEventsConsumer(trackProductView);   // ← Fixed

// // Schedulers
// export const aggregationJob = new AggregationJob(analyticsRepository);
// export const cleanupJob = new CleanupJob(eventLogRepository);

// // Analytics Consumers Group
// import { AnalyticsConsumers } from './infrastructure/kafka/consumers/index';
// import { AuthEventsConsumer } from './infrastructure/kafka/consumers/auth.consumer';

// export const analyticsConsumers = new AnalyticsConsumers(
//   authEventsConsumer,
//   userEventsConsumer,
//   orderEventsConsumer,
//   paymentEventsConsumer,
//   productEventsConsumer   
// );

// logger.info('✅ Analytics Service Container initialized successfully');c