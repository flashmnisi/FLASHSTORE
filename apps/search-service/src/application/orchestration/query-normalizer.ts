export class QueryNormalizer {
  /**
   * Normalize search query for consistent searching and caching
   */
  normalize(input?: string): string {
    if (!input) return '';

    return input
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * 🔥 Build a stable, deterministic cache key
   */
  buildCacheKey(params: {
    query?: string;
    page: number;
    limit: number;
    sort: string;
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    tags?: string[];
    inStock?: boolean;
  }): string {
    const normalizedQuery = this.normalize(params.query);

    const parts: string[] = [
      `q=${normalizedQuery}`,
      `p=${params.page}`,
      `l=${params.limit}`,
      `s=${params.sort || 'relevance'}`,
    ];

    // Add filters in a deterministic way
    if (params.category) parts.push(`cat=${params.category}`);
    if (params.brand) parts.push(`brand=${params.brand}`);
    if (params.minPrice !== undefined) parts.push(`minp=${params.minPrice}`);
    if (params.maxPrice !== undefined) parts.push(`maxp=${params.maxPrice}`);
    if (params.inStock !== undefined) parts.push(`instock=${params.inStock}`);

    if (params.tags && params.tags.length > 0) {
      parts.push(`tags=${params.tags.sort().join(',')}`);
    }

    return parts.join('|');
  }

  /**
   * Generate a simple cache key for suggestions/autocomplete
   */
  buildSuggestKey(query: string): string {
    return `suggest:${this.normalize(query)}`;
  }
}
