import { ProductIndexEntity } from '../../../domain/entities/product-index.entity';
//import { IndexerService } from '../../../application/services/indexer.service';
import logger from '@org/shared-logger';
//import { ProductKafkaEvent } from '../types/product.events';
import { IndexerService } from '../../indexer/indexer.service';
import { ProductKafkaEvent } from '../../../types/product.event';

const indexer = new IndexerService();

export const handleProductEvent = async (event: ProductKafkaEvent) => {
  try {
    const { event: eventType, data } = event;

    // 🔐 Basic validation
    if (!data?.id) {
      throw new Error('Invalid event payload: missing product id');
    }

    logger.info('📥 Processing product event', {
      eventType,
      productId: data.id,
    });

    switch (eventType) {
      case 'product.created':
      case 'product.updated': {
        const product = new ProductIndexEntity(
          data.id,
          data.name,
          data.description || '',
          data.price,
          data.currency,
          data.category || '',
          data.brand,
          data.tags || [],
          data.images || [],
          data.inStock,
          data.rating || 0,
          data.reviewCount || 0
        );

        await indexer.indexProduct(product);

        logger.info('✅ Product indexed', {
          productId: data.id,
          eventType,
        });
        break;
      }

      case 'product.deleted': {
        await indexer.deleteProduct(data.id);

        logger.info('🗑️ Product removed from index', {
          productId: data.id,
        });
        break;
      }

      default:
        logger.warn('⚠️ Unknown product event type', { eventType });
    }

  } catch (error: any) {
    logger.error('❌ Product event processing failed', {
      error: error.message,
      event,
    });

    // 🔥 IMPORTANT → let Kafka retry / DLQ handle it
    throw error;
  }
};