// apps/inventory-service/src/infrastructure/persistence/models/inventory.model.ts

import { Schema, model, Document } from 'mongoose';

export interface InventoryDocument extends Document {
  productId: string;
  warehouseId: string;

  quantity: number;
  reserved: number;

  lastUpdated: Date;

  createdAt: Date;
  updatedAt: Date;
}

const InventorySchema = new Schema<InventoryDocument>(
  {
    productId: {
      type: String,
      required: true,
      index: true,
    },

    warehouseId: {
      type: String,
      required: true,
      index: true,
    },

    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    reserved: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

InventorySchema.index({
  productId: 1,
  warehouseId: 1,
}, {
  unique: true,
});

export const InventoryModel =
  model<InventoryDocument>(
    'Inventory',
    InventorySchema
  );