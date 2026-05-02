// apps/analytics-service/src/presentation/controllers/analytics.controller.ts

import { Request, Response } from 'express';
import { AnalyticsService } from '../../application/services/analytics.service';
import logger from '@org/shared-logger';
import { validators } from '../../utils/validators';

export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  /**
   * Track any custom event
   */
  trackEvent = async (req: Request, res: Response) => {
    try {
      const dto = validators.trackEvent.parse(req.body);
      
      await this.analyticsService.trackEvent(dto);

      return res.status(200).json({
        success: true,
        message: 'Event tracked successfully',
      });
    } catch (error: any) {
      logger.error('Track event failed', { error: error.message });
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to track event',
      });
    }
  };

  /**
   * Get events by user
   */
  getUserEvents = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;

      const events = await this.analyticsService.getEventsByUser(userId, limit);

      return res.json({
        success: true,
        data: events,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch user events',
      });
    }
  };

  /**
   * Get events by type
   */
  getEventsByType = async (req: Request, res: Response) => {
    try {
      const { eventType } = req.params;
      const limit = parseInt(req.query.limit as string) || 100;

      const events = await this.analyticsService.getEventsByType(eventType, limit);

      return res.json({
        success: true,
        data: events,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch events',
      });
    }
  };
}