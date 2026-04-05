import { Request, Response } from 'express';
import logger from '@org/shared-logger';
import { analyticsService } from '../services/analytics.service';

export const getRecentEvents = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 100;
    const events = await analyticsService.getRecentEvents(limit);

    res.json({
      success: true,
      count: events.length,
      events
    });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to fetch analytics events');
    res.status(500).json({ success: false, message: 'Server error' });
  }
};