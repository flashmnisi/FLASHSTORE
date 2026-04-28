import { getRedis } from '@org/shared-redis';

export class TrendingService {

  async getTrending(limit = 10) {
    const redis = await getRedis();

    const [h1, h24] = await Promise.all([
      redis.zRangeWithScores('search:trending:1h', 0, limit - 1, { REV: true }),
      redis.zRangeWithScores('search:trending:24h', 0, limit - 1, { REV: true }),
    ]);

    const map = new Map<string, number>();

    this.merge(map, h24, 1); // long-term
    this.merge(map, h1, 3);  // recent boost

    return Array.from(map.entries())
      .map(([query, score]) => ({
        query: decodeURIComponent(query),
        score,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  private merge(
    map: Map<string, number>,
    data: { value: string; score: number }[],
    weight: number
  ) {
    for (const item of data) {
      const current = map.get(item.value) || 0;
      map.set(item.value, current + item.score * weight);
    }
  }
}