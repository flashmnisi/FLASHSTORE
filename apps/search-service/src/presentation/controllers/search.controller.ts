// apps/search-service/src/presentation/controllers/search.controller.ts

import { Request, Response } from 'express';
import { SearchOrchestrator } from '../../application/orchestration/search.orchestrator';
import { SuggestService } from '../../application/services/suggest.service';
import { TrendingService } from '../../application/services/trending.service';
import { SearchAnalyticsService } from '../../infrastructure/analytics/search-analytics.service';
import { searchCache } from '../../infrastructure/cache/search-cache';
import { SearchQueryVO } from '../../domain/value-objects/search-query.vo';
import logger from '@org/shared-logger';
import { getElasticClient } from '../../config/elastic';
import { ElasticSearchRepository } from '../../infrastructure/analytics/elasticsearch.repository';

// =============================
// 🔥 DEPENDENCIES
// =============================
const repository = new ElasticSearchRepository(getElasticClient());
const orchestrator = new SearchOrchestrator(repository);
const suggestService = new SuggestService(getElasticClient());
const trendingService = new TrendingService();
const analytics = new SearchAnalyticsService();

export const searchController = {
  /**
   * 🔍 MAIN SEARCH
   */
  async search(req: Request, res: Response) {
    try {
      const query = String(req.query.q || '').trim();
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const sort = String(req.query.sort || 'relevance') as any;
      const user = (req as any).user;

      if (!query) {
        return res.status(400).json({
          success: false,
          message: 'Search query (q) is required',
        });
      }

      // Build SearchQueryVO
      const searchVO = new SearchQueryVO(
        query,
        {
          category: req.query.category
            ? [String(req.query.category)]
            : undefined,
          brand: req.query.brand ? [String(req.query.brand)] : undefined,
          minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
          maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        },
        sort,
        page,
        limit
      );

      const cacheKey = `search:${query}:${page}:${limit}:${sort}`;

      // Cache check
      const cached = await searchCache.get(cacheKey);
      if (cached) {
        return res.json({
          success: true,
          data: cached,
          fromCache: true,
        });
      }

      // Execute search
      const result = await orchestrator.search(searchVO, user);

      // Cache result
      await searchCache.set(cacheKey, result);

      // Track analytics (non-blocking)
      analytics
        .trackSearch(query)
        .catch((err) =>
          logger.warn('Analytics trackSearch failed', { error: err.message })
        );

      return res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      logger.error('Search failed', {
        query: req.query.q,
        error: error.message,
      });

      return res.status(500).json({
        success: false,
        message: 'Search failed',
      });
    }
  },

  /**
   * 🔮 SUGGESTIONS
   */
  async suggest(req: Request, res: Response) {
    try {
      const q = String(req.query.q || '').trim();

      if (!q) {
        return res.json({ success: true, data: [] });
      }

      const suggestions = await suggestService.suggest(q);

      return res.json({
        success: true,
        data: suggestions,
      });
    } catch (error: any) {
      logger.error('Suggest failed', { error: error.message });
      return res.status(500).json({
        success: false,
        message: 'Failed to get suggestions',
      });
    }
  },

  /**
   * 🔥 TRENDING SEARCHES
   */
  async trending(req: Request, res: Response) {
    try {
      const limit = Number(req.query.limit) || 10;
      const data = await trendingService.getTrending(limit);

      return res.json({
        success: true,
        data,
      });
    } catch (error: any) {
      logger.error('Trending failed', { error: error.message });
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch trending',
      });
    }
  },

  /**
   * 👆 TRACK PRODUCT CLICK
   */
  async click(req: Request, res: Response) {
    try {
      const { productId } = req.body; // ← Fixed: only take productId

      if (!productId) {
        return res.status(400).json({
          success: false,
          message: 'productId is required',
        });
      }

      // Fixed: pass string, not object
      await analytics.trackClick(productId);

      return res.json({
        success: true,
        message: 'Click tracked',
      });
    } catch (error: any) {
      logger.error('Click tracking failed', { error: error.message });
      return res.status(500).json({
        success: false,
        message: 'Failed to track click',
      });
    }
  },
};
