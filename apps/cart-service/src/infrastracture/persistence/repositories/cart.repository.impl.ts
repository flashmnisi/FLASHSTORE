// apps/cart-service/src/infrastructure/persistence/repositories/cart.repository.impl.ts

import { ICartRepository } from '../../../application/interfaces/cart.repository';
import { CartEntity } from '../../../domain/entities/cart.entity';
import { CartItemEntity } from '../../../domain/entities/cart-item.entity';
import { CartModel } from '../models/cart.model';

export class CartRepositoryImpl implements ICartRepository {

  async findByUserId(userId: string): Promise<CartEntity | null> {
    const doc = await CartModel.findOne({ userId }).lean();

    if (!doc) return null;

    return new CartEntity(
      doc._id.toString(),
      doc.userId,
      doc.items.map(
        i => new CartItemEntity(i.productId, i.quantity, i.price, i.name, i.image)
      ),
      doc.createdAt,
      doc.updatedAt
    );
  }

  async save(cart: CartEntity): Promise<CartEntity> {
    const updated = await CartModel.findOneAndUpdate(
      { userId: cart.userId },
      {
        items: cart.items,
      },
      { upsert: true, new: true }
    );

    return new CartEntity(
      updated._id.toString(),
      updated.userId,
      updated.items.map(
        i => new CartItemEntity(i.productId, i.quantity, i.price, i.name, i.image)
      ),
      updated.createdAt,
      updated.updatedAt
    );
  }

  async delete(userId: string): Promise<void> {
    await CartModel.deleteOne({ userId });
  }
}