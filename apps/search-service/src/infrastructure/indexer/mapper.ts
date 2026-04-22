import { ProductIndexEntity } from '../../domain/entities/product-index.entity';

/**
 * 🔥 Maps domain product → Elasticsearch document
 */
export class ProductIndexMapper {
  static toElastic(product: ProductIndexEntity) {
    return {
      id: product.id,

      // =========================
      // CORE SEARCH FIELDS
      // =========================
      name: product.name,
      name_raw: product.name, // keyword sorting
      name_normalized: this.normalize(product.name),

      description: product.description,
      description_normalized: this.normalize(product.description),

      category: product.category,
      category_raw: product.category,

      brand: product.brand,
      brand_raw: product.brand,

      // =========================
      // AUTOCOMPLETE 🔥
      // =========================
      name_suggest: {
        input: this.buildSuggestInputs(product),
      },

      // =========================
      // NUMERIC FIELDS
      // =========================
      price: product.price,
      currency: product.currency,
      rating: product.rating,
      reviewCount: product.reviewCount,

      // =========================
      // FILTERING
      // =========================
      inStock: product.inStock,
      tags: product.tags,

      // =========================
      // MEDIA
      // =========================
      images: product.images,

      // =========================
      // METADATA
      // =========================
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,

      // =========================
      // SEARCH BOOST FIELDS 🔥
      // =========================
      popularityScore: this.calculatePopularity(product),

      // Future-ready dynamic signals
      clickScore: 0,
      purchaseScore: 0,
    };
  }

  /**
   * 🔥 Normalize text for better matching
   */
  private static normalize(text?: string): string {
    if (!text) return '';

    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, ''); // remove special chars
  }

  /**
   * 🔥 Autocomplete inputs
   */
  private static buildSuggestInputs(product: ProductIndexEntity): string[] {
    return [
      product.name,
      ...(product.tags || []),
      product.brand || '',
      product.category,
    ].filter(Boolean);
  }

  /**
   * 🔥 Ranking base score
   */
  private static calculatePopularity(product: ProductIndexEntity): number {
    const ratingWeight = product.rating * 2;

    const reviewWeight = Math.log10(product.reviewCount + 1) * 3;

    const stockBoost = product.inStock ? 1 : -2;

    const recencyBoost =
      (Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24) < 7
        ? 2
        : 0;

    return ratingWeight + reviewWeight + stockBoost + recencyBoost;
  }
}