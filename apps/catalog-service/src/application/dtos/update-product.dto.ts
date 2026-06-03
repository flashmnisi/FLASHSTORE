// apps/catalog-service/src/application/dtos/update-product.dto.ts

// apps/catalog-service/src/application/dtos/update-product.dto.ts

export interface UpdateProductDto {
  name?: string;
  slug?: string;
  description?: string;

  price?: number;
  currency?: string;

  categoryId?: string;
  subCategory?: string;

  brand?: string;

  images?: string[];
  tags?: string[];

  // Marketing
  isFeatured?: boolean;
  isHotDeal?: boolean;
  isNewArrival?: boolean;

  discountPercentage?: number;

  // Inventory
  stockQuantity?: number;
  inStock?: boolean;

  isActive?: boolean;
};