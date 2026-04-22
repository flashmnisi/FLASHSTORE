import { ProductIndexEntity } from '../../../domain/entities/product-index.entity';
import { IndexService } from '../../../application/services/index.service';
import { ElasticIndexer } from '../../indexer/indexer.service';
import logger from '../../../utils/logger';

const indexService = new IndexService(new ElasticIndexer());

export const handleProductCreated = async (event: any) => {
  try {
    const data = event.data;

    const product = new ProductIndexEntity(
      data.id,
      data.name,
      data.description,
      data.price,
      data.currency,
      data.category,
      data.brand,
      data.tags,
      data.images,
      data.inStock,
      data.rating,
      data.reviewCount
    );

    await indexService.indexProduct(product);

    logger.info('✅ Product indexed from Kafka', {
      productId: data.id,
    });

  } catch (error: any) {
    logger.error('❌ Product index failed', {
      error: error.message,
      event,
    });

    throw error; // important for retry/DLQ
  }
};