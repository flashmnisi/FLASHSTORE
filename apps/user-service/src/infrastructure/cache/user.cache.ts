import { CacheService } from './cache.service';

export class UserCache {
  private readonly PREFIX = 'user';

  constructor(private readonly cacheService: CacheService) {}

  async getUser(userId: string) {
    return this.cacheService.get(`${this.PREFIX}:${userId}`);
  }

  async setUser(userId: string, user: any, ttl = 300) {  // 5 minutes
    return this.cacheService.set(`${this.PREFIX}:${userId}`, user, ttl);
  }

  async invalidateUser(userId: string) {
    return this.cacheService.flushUserCache(userId);
  }
}