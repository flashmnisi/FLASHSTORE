import logger from '@org/shared-logger';
import { AnalyticsEvent } from '../models/analytics-model';

export class AnalyticsService {
  async storeEvent(eventData: any) {
    try {
      const event = new AnalyticsEvent({
        event: eventData.event,
        userId: eventData.userId || eventData.data?.userId,
        service: eventData.service || eventData.source || 'unknown',
        metadata: eventData.metadata || eventData.data || {},
        ip: eventData.ip,
        userAgent: eventData.userAgent,
      });

      await event.save();

      logger.info('Analytics event stored successfully',
        { event: eventData.event, userId: eventData.userId }
      );
    } catch (error: any) {
      logger.error('Failed to store analytics event',
        { error: error.message, event: eventData.event },
      );
    }
  }

  async getRecentEvents(limit = 100) {
    return AnalyticsEvent.find().sort({ timestamp: -1 }).limit(limit);
  }
}

export const analyticsService = new AnalyticsService();