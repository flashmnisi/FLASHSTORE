import { redis } from '../../../../../libs/shared-redis/src';

export class TrendingService {
  async getTrending(limit = 10) {
    const results = await redis.zrevrange(
      'search:trending',
      0,
      limit - 1,
      'WITHSCORES'
    );

    const trending: { query: string; score: number }[] = [];

    for (let i = 0; i < results.length; i += 2) {
      trending.push({
        query: results[i],
        score: Number(results[i + 1]),
      });
    }

    return trending;
  }
}