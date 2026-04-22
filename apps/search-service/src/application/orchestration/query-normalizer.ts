export class QueryNormalizer {
  normalize(input?: string): string {
    if (!input) return '';

    return input
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, '')      // remove special chars
      .replace(/\s+/g, ' ');        // normalize spaces
  }

  /**
   * 🔥 Build stable cache key
   */
  buildCacheKey(params: {
    query?: string;
    page: number;
    limit: number;
    sort: string;
    filters?: Record<string, any>;
  }) {
    const base = this.normalize(params.query);

    return [
      base,
      `p=${params.page}`,
      `l=${params.limit}`,
      `s=${params.sort}`,
      JSON.stringify(params.filters || {}),
    ].join('|');
  }
}