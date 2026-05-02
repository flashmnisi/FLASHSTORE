// apps/analytics-service/src/application/use-cases/track-user-registration.usecase.ts

import { AnalyticsEntity } from '../../domain/entities/analytics.entity';
import { IAnalyticsRepository } from '../../domain/repositories/analytics.repository';
import logger from '@org/shared-logger';

export class TrackUserRegistrationUseCase {
  constructor(private readonly analyticsRepository: IAnalyticsRepository) {}

  async execute(data: {
    userId: string;
    email: string;
    name?: string;
    timestamp?: Date;
  }) {
    try {
      const event = new AnalyticsEntity(
        '',
        'user.registered',
        data.userId,
        undefined,
        undefined,
        {
          email: data.email,
          name: data.name,
        },
        data.timestamp || new Date()
      );

      await this.analyticsRepository.saveEvent(event);

      logger.info('Tracked user registration', { 
        userId: data.userId 
      });

      return event;
    } catch (error: any) {
      logger.error('Failed to track user registration', {
        userId: data.userId,
        error: error.message,
      });
      throw error;
    }
  }
}