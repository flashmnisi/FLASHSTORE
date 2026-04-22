import { ProductIndexEntity } from './product-index.entity';

export class SearchResultEntity {
  constructor(
    public readonly products: ProductIndexEntity[],
    public readonly total: number,
    public readonly page: number,
    public readonly limit: number,
    public readonly totalPages: number,
    public readonly facets?: Record<string, any>,
  ) {}
}