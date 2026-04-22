import { ProductIndexEntity } from '../../domain/entities/product-index.entity';
import { IIndexerProvider } from '../interfaces/indexer.provider';
import logger from '../../utils/logger';

export class IndexService {
  constructor(private readonly indexer: IIndexerProvider) {}

  async indexProduct(product: ProductIndexEntity): Promise<void> {
    try {
      await this.indexer.indexProduct(product.toSearchDocument());

      logger.info('Product indexed', {
        productId: product.id,
      });
    } catch (error: any) {
      logger.error('Failed to index product', {
        productId: product.id,
        error: error.message,
      });
      throw error;
    }
  }

  async bulkIndex(products: ProductIndexEntity[]): Promise<void> {
    try {
      const docs = products.map(p => p.toSearchDocument());

      await this.indexer.bulkIndex(docs);

      logger.info('Bulk indexing completed', {
        count: products.length,
      });
    } catch (error: any) {
      logger.error('Bulk indexing failed', {
        error: error.message,
      });
      throw error;
    }
  }
}