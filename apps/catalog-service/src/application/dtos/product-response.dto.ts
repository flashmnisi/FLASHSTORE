// apps/catalog-service/src/application/dtos/product-response.dto.ts

import { ProductEntity } from '../../domain/entities/product.entity';

export class ProductResponseDto {
  constructor(private readonly product: ProductEntity) {}

  toJSON() {
    return this.product.toJSON();
  }

  static fromEntity(product: ProductEntity) {
    return new ProductResponseDto(product);
  }

  static fromEntities(products: ProductEntity[]) {
    return products.map(p => ProductResponseDto.fromEntity(p));
  }
}