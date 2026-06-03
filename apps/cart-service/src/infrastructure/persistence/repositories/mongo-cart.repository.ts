//apps/cart-service/src/infrastructure/repositories/mongo-cart.repository.ts

import { ICartRepository } from "../../../application/interfaces/cart.repository";
import { CartItemEntity } from "../../../domain/entities/cart-item.entity";
import { CartEntity } from "../../../domain/entities/cart.entity";
import { CartModel } from "../models/cart.model";

export class MongoCartRepository
  implements ICartRepository {

  /**
   * =====================================
   * FIND CART BY USER ID
   * =====================================
   */
  async findByUserId(
    userId: string
  ): Promise<CartEntity | null> {

    const cart =
      await CartModel.findOne({
        userId,
      }).lean();

    if (!cart) {
      return null;
    }

    return new CartEntity(
      cart._id.toString(),
      cart.userId,
      cart.items.map(
        (item: any) =>
          new CartItemEntity(
            item.productId,
            item.quantity,
            item.price,
            item.name,
            item.image
          )
      ),
      new Date(cart.createdAt),
      new Date(cart.updatedAt)
    );
  }

  /**
   * =====================================
   * SAVE CART
   * =====================================
   */
  async save(
    cart: CartEntity
  ): Promise<CartEntity> {

    const updated =
      await CartModel.findOneAndUpdate(
        {
          userId: cart.userId,
        },
        {
          userId: cart.userId,

          items: cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
            image: item.image,
          })),

          updatedAt: new Date(),
        },
        {
          upsert: true,
          returnDocument: 'after',
          setDefaultsOnInsert: true,
        }
      );

    return new CartEntity(
      updated._id.toString(),
      updated.userId,
      updated.items.map(
        (item: any) =>
          new CartItemEntity(
            item.productId,
            item.quantity,
            item.price,
            item.name,
            item.image
          )
      ),
      new Date(updated.createdAt),
      new Date(updated.updatedAt)
    );
  }

  /**
   * =====================================
   * DELETE CART
   * =====================================
   */
  async delete(
    userId: string
  ): Promise<void> {

    await CartModel.deleteOne({
      userId,
    });
  }
}