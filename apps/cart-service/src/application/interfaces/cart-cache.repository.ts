import { CartEntity } from '../../domain/entities/cart.entity';

export interface ICartCacheRepository {
  get(userId: string): Promise<CartEntity | null>;

  save(cart: CartEntity): Promise<void>;

  delete(userId: string): Promise<void>;
}