import { Request, Response } from 'express';
import { SearchOrchestrator } from '../../application/orchestration/search.orchestrator';
import { SuggestService } from '../../application/services/suggest.service';
import { TrendingService } from '../../application/services/trending.service';
import { SearchAnalyticsService } from '../../infrastructure/analytics/search-analytics.service';
import { getElasticClient } from '../../config/elastic';

const orchestrator = new SearchOrchestrator(/* repo injected */);
const suggestService = new SuggestService(getElasticClient());
const trendingService = new TrendingService();
const analytics = new SearchAnalyticsService();

export const searchController = {
  async search(req: Request, res: Response) {
    const result = await orchestrator.search(req.query as any, (req as any).user);

    // 🔥 track search
    if (req.query.q) {
      await analytics.trackSearch(String(req.query.q));
    }

    res.json({ success: true, data: result });
  },

  async suggest(req: Request, res: Response) {
    const q = String(req.query.q || '');

    const suggestions = await suggestService.suggest(q);

    res.json({ success: true, data: suggestions });
  },

  async trending(req: Request, res: Response) {
    const data = await trendingService.getTrending(10);

    res.json({ success: true, data });
  },

  async click(req: Request, res: Response) {
    const { productId } = req.body;

    await analytics.trackClick(productId);

    res.json({ success: true });
  },
};