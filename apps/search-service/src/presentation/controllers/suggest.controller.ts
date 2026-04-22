import { Request, Response } from 'express';
import { SuggestService } from '../../application/services/suggest.service';
import { getElasticClient } from '../../config/elastic';
import logger from '../../utils/logger';

const suggestService = new SuggestService(getElasticClient());

export const suggestController = {
  /**
   * 🔥 Autocomplete suggestions
   * GET /api/search/suggest?q=iph
   */
  async suggest(req: Request, res: Response) {
    try {
      const query = String(req.query.q || '');

      if (!query) {
        return res.json({
          success: true,
          data: [],
        });
      }

      const suggestions = await suggestService.suggest(query);

      res.json({
        success: true,
        data: suggestions,
      });
    } catch (error: any) {
      logger.error('Suggest failed', { error: error.message });

      res.status(500).json({
        success: false,
        message: 'Failed to fetch suggestions',
      });
    }
  },

  /**
   * 🔥 Optional: trending suggestions (quick access)
   */
  async trending(req: Request, res: Response) {
    try {
      // can reuse TrendingService here if you want
      res.json({
        success: true,
        data: [],
      });
    } catch (error: any) {
      logger.error('Trending suggestions failed', { error: error.message });

      res.status(500).json({
        success: false,
      });
    }
  },
};