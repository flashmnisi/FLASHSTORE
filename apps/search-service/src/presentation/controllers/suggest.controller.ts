import { Request, Response } from 'express';
import { SuggestService } from '../../application/services/suggest.service';
//import { TrendingService } from '../../analytics/trending.service';
import { getElasticClient } from '../../config/elastic';
import logger from '@org/shared-logger';
import { TrendingService } from '../../application/services/trending.service';

const suggestService = new SuggestService(getElasticClient());
const trendingService = new TrendingService();

export const suggestController = {
  /**
   * 🔥 Autocomplete suggestions
   * GET /api/search/suggest?q=iph
   */
  async suggest(req: Request, res: Response) {
    try {
      const query = String(req.query.q || '').trim();

      if (!query) {
        return res.json({
          success: true,
          data: [],
        });
      }

      const suggestions = await suggestService.suggest(query);

      return res.json({
        success: true,
        data: suggestions,
      });
    } catch (error: any) {
      logger.error('Suggest failed', { error: error.message });

      return res.status(500).json({
        success: false,
        message: 'Failed to fetch suggestions',
      });
    }
  },

  /**
   * 🔥 Trending search queries
   * GET /api/search/trending?limit=10
   */
  async trending(req: Request, res: Response) {
    try {
      const limit = Number(req.query.limit) || 10;

      const trending = await trendingService.getTrending(limit);

      return res.json({
        success: true,
        data: trending,
      });
    } catch (error: any) {
      logger.error('Trending suggestions failed', {
        error: error.message,
      });

      return res.status(500).json({
        success: false,
        message: 'Failed to fetch trending searches',
      });
    }
  },
};
