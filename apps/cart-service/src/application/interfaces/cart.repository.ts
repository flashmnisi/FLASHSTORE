import { CartEntity } from '../../domain/entities/cart.entity';

export interface ICartRepository {
  findByUserId(userId: string): Promise<CartEntity | null>;

  save(cart: CartEntity): Promise<CartEntity>;

  delete(userId: string): Promise<void>;
}