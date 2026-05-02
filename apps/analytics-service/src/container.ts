// apps/analytics-service/src/container.ts

import logger from '@org/shared-logger';

// ====================== REPOSITORIES ======================

// ====================== SERVICES ======================
import { AnalyticsService } from './application/services/analytics.service';
import { MetricsService } from './application/services/metrics.service';
import { DashboardService } from './application/services/dashboard.service';

// ====================== USE CASES ======================
import { TrackUserRegistrationUseCase } from './application/use-cases/track-user-registration.usecase';
import { TrackOrderCreatedUseCase } from './application/use-cases/track-order-created.usecase';
import { TrackPaymentSuccessUseCase } from './application/use-cases/track-payment-success.usecase';
//import { TrackProductViewUseCase } from './application/use-cases/track-product-view.usecase';

// ====================== KAFKA CONSUMERS ======================
import { UserEventsConsumer } from './infrastructure/kafka/consumers/user.consumer';
import { OrderEventsConsumer } from './infrastructure/kafka/consumers/order.consumer';
import { PaymentEventsConsumer } from './infrastructure/kafka/consumers/payment.consumer';

// ====================== SCHEDULERS ======================
import { AggregationJob } from './infrastructure/schedulers/aggregation.job';
import { CleanupJob } from './infrastructure/schedulers/cleanup.job';

// ====================== DEPENDENCY INJECTION ======================

// Repositories
const analyticsRepository = new AnalyticsRepositoryImpl();
const eventLogRepository = new EventLogRepositoryImpl();

// Use Cases
const trackUserRegistration = new TrackUserRegistrationUseCase(analyticsRepository);
const trackOrderCreated = new TrackOrderCreatedUseCase(analyticsRepository);
const trackPaymentSuccess = new TrackPaymentSuccessUseCase(analyticsRepository);
//const trackProductView = new TrackProductViewUseCase(analyticsRepository); // ← Kept for future use

// Services
export const analyticsService = new AnalyticsService(analyticsRepository);
export const metricsService = new MetricsService(analyticsRepository);
export const dashboardService = new DashboardService(metricsService);

// Kafka Consumers
export const userEventsConsumer = new UserEventsConsumer(trackUserRegistration);
export const orderEventsConsumer = new OrderEventsConsumer(trackOrderCreated);
export const paymentEventsConsumer = new PaymentEventsConsumer(trackPaymentSuccess);

// Schedulers
export const aggregationJob = new AggregationJob(analyticsRepository);
export const cleanupJob = new CleanupJob(eventLogRepository);

// Analytics Consumers Group
import { AnalyticsConsumers } from './infrastructure/kafka/consumers/index';
import { AnalyticsRepositoryImpl } from './infrastructure/persistance/mongoose/repositories/analytics.repository.impl';
import { EventLogRepositoryImpl } from './infrastructure/persistance/mongoose/repositories/event-log.repository.impl';

export const analyticsConsumers = new AnalyticsConsumers(
  userEventsConsumer,
  orderEventsConsumer,
  paymentEventsConsumer
);

logger.info('✅ Analytics Service Container initialized successfully');