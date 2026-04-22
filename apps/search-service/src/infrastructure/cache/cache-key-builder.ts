// infrastructure/cache/cache-key-builder.ts

import crypto from 'crypto';

export class CacheKeyBuilder {
  /**
   * 🔍 Search cache key
   */
  static search(params: Record<string, any>): string {
    const normalized = this.normalize(params);
    const hash = this.hash(normalized);

    return `search:${hash}`;
  }

  /**
   * ⚡ Suggest cache key
   */
  static suggest(query: string): string {
    return `suggest:${query.toLowerCase().trim()}`;
  }

  /**
   * 🔥 Trending cache key
   */
  static trending(): string {
    return 'search:trending';
  }

  /**
   * Normalize params (important!)
   */
  private static normalize(params: Record<string, any>) {
    return JSON.stringify(
      Object.keys(params)
        .sort()
        .reduce((acc: any, key) => {
          acc[key] = params[key];
          return acc;
        }, {})
    );
  }

  /**
   * Hash to keep keys short
   */
  private static hash(input: string): string {
    return crypto.createHash('md5').update(input).digest('hex');
  }
}