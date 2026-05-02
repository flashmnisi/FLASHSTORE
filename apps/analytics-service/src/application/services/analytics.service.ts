// apps/analytics-service/src/application/services/analytics.service.ts

import { AnalyticsEntity } from '../../domain/entities/analytics.entity';
import { IAnalyticsRepository } from '../../domain/repositories/analytics.repository';
import { TrackUserRegistrationUseCase } from '../use-cases/track-user-registration.usecase';
import { TrackOrderCreatedUseCase } from '../use-cases/track-order-created.usecase';
import { TrackPaymentSuccessUseCase } from '../use-cases/track-payment-success.usecase';
import { TrackProductViewUseCase } from '../use-cases/track-product-view.usecase';
import logger from '@org/shared-logger';

export class AnalyticsService {
  private readonly trackUserRegistrationUseCase: TrackUserRegistrationUseCase;
  private readonly trackOrderCreatedUseCase: TrackOrderCreatedUseCase;
  private readonly trackPaymentSuccessUseCase: TrackPaymentSuccessUseCase;
  private readonly trackProductViewUseCase: TrackProductViewUseCase;

  constructor(private readonly analyticsRepository: IAnalyticsRepository) {
    this.trackUserRegistrationUseCase = new TrackUserRegistrationUseCase(analyticsRepository);
    this.trackOrderCreatedUseCase = new TrackOrderCreatedUseCase(analyticsRepository);
    this.trackPaymentSuccessUseCase = new TrackPaymentSuccessUseCase(analyticsRepository);
    this.trackProductViewUseCase = new TrackProductViewUseCase(analyticsRepository);
  }

  // ==================== GENERIC EVENT TRACKING ====================

  async trackEvent(data: {
    eventType: string;
    userId?: string;
    productId?: string;
    orderId?: string;
    metadata?: Record<string, any>;
    timestamp?: string | Date;
  }) {
    try {
      const event = new AnalyticsEntity(
        '',
        data.eventType,
        data.userId,
        data.productId,
        data.orderId,
        data.metadata || {},
        data.timestamp ? new Date(data.timestamp) : new Date()   
      );

      const savedEvent = await this.analyticsRepository.saveEvent(event);

      logger.info('Generic event tracked', { 
        eventType: data.eventType, 
        userId: data.userId 
      });

      return savedEvent;
    } catch (error: any) {
      logger.error('Failed to track generic event', {
        eventType: data.eventType,
        error: error.message,
      });
      throw error;
    }
  }

  // ==================== SPECIFIC EVENT TRACKING ====================

  async trackUserRegistration(data: {
    userId: string;
    email: string;
    name?: string;
  }) {
    return this.trackUserRegistrationUseCase.execute(data);
  }

  async trackOrderCreated(data: {
    orderId: string;
    userId: string;
    totalAmount: number;
    itemCount: number;
  }) {
    return this.trackOrderCreatedUseCase.execute(data);
  }

  async trackPaymentSuccess(data: {
    paymentId: string;
    orderId: string;
    userId: string;
    amount: number;
  }) {
    return this.trackPaymentSuccessUseCase.execute(data);
  }

  async trackProductView(data: {
    productId: string;
    userId?: string;
  }) {
    return this.trackProductViewUseCase.execute(data);
  }

  // ==================== QUERY METHODS ====================

  async getEventsByUser(userId: string, limit = 50) {
    return this.analyticsRepository.findByUserId(userId, limit);
  }

  async getEventsByType(eventType: string, limit = 100) {
    return this.analyticsRepository.findByEventType(eventType, limit);
  }
}