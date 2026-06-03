// apps/analytics-service/src/container.ts

import logger from '@org/shared-logger';

// ====================== REPOSITORIES ======================

import { AnalyticsRepositoryImpl } from './infrastructure/persistance/mongoose/repositories/analytics.repository.impl';

import { AnalyticsModel } from './infrastructure/persistance/mongoose/models/analytics.model';
import { MetricModel } from './infrastructure/persistance/mongoose/models/metric.model';

// ====================== SERVICES ======================

import { AnalyticsService } from './application/services/analytics.service';
import { MetricsService } from './application/services/metrics.service';
import { DashboardService } from './application/services/dashboard.service';

// ====================== CONSUMER ======================

import { AnalyticsConsumer } from './infrastructure/kafka/consumers/consumer';

// ====================== USE CASES ======================

import { TrackUserRegistrationUseCase } from './application/use-cases/track-user-registration.usecase';

import { TrackOrderCreatedUseCase } from './application/use-cases/track-order-created.usecase';

import { TrackPaymentSuccessUseCase } from './application/use-cases/track-payment-success.usecase';

import { TrackProductViewUseCase } from './application/use-cases/track-product-view.usecase';

// NEW USE CASES

import { TrackProductEventUseCase } from './application/use-cases/track-product-event.usecase';

import { TrackCategoryEventUseCase } from './application/use-cases/track-category-event.usecase';

import { TrackCartEventUseCase } from './application/use-cases/track-cart-event.usecase';

import { TrackInventoryEventUseCase } from './application/use-cases/track-inventory-event.usecase';

// ======================================================
// REPOSITORIES
// ======================================================

const analyticsRepository =
  new AnalyticsRepositoryImpl(
    AnalyticsModel,
    MetricModel
  );

// ======================================================
// USE CASES
// ======================================================

const trackUserRegistration =
  new TrackUserRegistrationUseCase(
    analyticsRepository
  );

const trackOrderCreated =
  new TrackOrderCreatedUseCase(
    analyticsRepository
  );

const trackPaymentSuccess =
  new TrackPaymentSuccessUseCase(
    analyticsRepository
  );

const trackProductView =
  new TrackProductViewUseCase(
    analyticsRepository
  );

// ======================================================
// NEW ANALYTICS USE CASES
// ======================================================

const trackProductEvent =
  new TrackProductEventUseCase(
    analyticsRepository
  );

const trackCategoryEvent =
  new TrackCategoryEventUseCase(
    analyticsRepository
  );

const trackCartEvent =
  new TrackCartEventUseCase(
    analyticsRepository
  );

const trackInventoryEvent =
  new TrackInventoryEventUseCase(
    analyticsRepository
  );

// ======================================================
// CONSUMER
// ======================================================

export const analyticsConsumer =
  new AnalyticsConsumer(
    trackUserRegistration,
    trackOrderCreated,
    trackPaymentSuccess,
    trackProductView,
    trackProductEvent,
    trackCategoryEvent,
    trackCartEvent,
    trackInventoryEvent
  );

// ======================================================
// SERVICES
// ======================================================

export const analyticsService =
  new AnalyticsService(
    analyticsRepository
  );

export const metricsService =
  new MetricsService(
    analyticsRepository
  );

export const dashboardService =
  new DashboardService(
    metricsService
  );

// ======================================================
// LOGGER
// ======================================================

logger.info(
  '✅ Analytics Service Container initialized successfully'
);
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