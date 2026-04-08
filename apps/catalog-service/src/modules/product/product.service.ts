import { Product } from './product.model';
import { CreateProductDto } from './product.dto';
import logger from '@org/shared-logger';
import { publish } from '@org/shared-kafka';

export class ProductService {
  async createProduct(dto: CreateProductDto, images: string[]) {
    try {
      const product = await Product.create({
        ...dto,
        images,
      });

      await publish({
        topic: 'flashstore.products',
        message: {
          event: 'product.created',
          data: {
            productId: product._id,
            name: product.name,
            price: product.price,
            category: product.category,
            images: product.images,
          },
          source: 'catalog-service',
        },
        key: String(product._id),
      });

      logger.info({ productId: product._id, name: product.name }, 'Product created with images');
      return product;
    } catch (error: any) {
      logger.error({ error: error.message }, 'Failed to create product');
      throw error;
    }
  }

  async getAllProducts() {
    return Product.find().sort({ createdAt: -1 });
  }
}

export const productService = new ProductService();