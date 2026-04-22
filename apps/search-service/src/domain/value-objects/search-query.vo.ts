export class SearchQueryVO {
  constructor(
    public readonly query: string = '',
    public readonly filters: Record<string, any> = {},

    public readonly sort:
      | 'relevance'
      | 'price_asc'
      | 'price_desc'
      | 'newest' = 'relevance',

    public readonly page: number = 1,
    public readonly limit: number = 20,

    public readonly minPrice?: number,
    public readonly maxPrice?: number,
    public readonly categories?: string[],
  ) {}

  get offset(): number {
    return (this.page - 1) * this.limit;
  }

  /**
   * 🔥 Elasticsearch filter builder helper
   */
  toFilters() {
    const filters: any[] = [];

    if (this.categories?.length) {
      filters.push({ terms: { category: this.categories } });
    }

    if (this.minPrice !== undefined || this.maxPrice !== undefined) {
      filters.push({
        range: {
          price: {
            gte: this.minPrice,
            lte: this.maxPrice,
          },
        },
      });
    }

    return filters;
  }
}