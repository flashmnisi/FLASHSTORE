// apps/analytics-service/src/application/use-cases/track-category-event.usecase.ts

import logger from '@org/shared-logger';

export class TrackCategoryEventUseCase {
  constructor(
    private readonly analyticsRepository: any
  ) {}

  async execute(data: {
    eventType: string;
    categoryId: string;
    name?: string;
    slug?: string;
  }) {
    try {

      await this.analyticsRepository.saveEvent({
        type: data.eventType,
        entity: 'category',
        entityId: data.categoryId,
        metadata: {
          name: data.name,
          slug: data.slug,
        },
        createdAt: new Date(),
      });

      logger.info('📂 Category analytics tracked', {
        categoryId: data.categoryId,
        eventType: data.eventType,
      });

    } catch (error: any) {

      logger.error('❌ Failed to track category event', {
        error: error.message,
        categoryId: data.categoryId,
      });

      throw error;
    }
  }
}