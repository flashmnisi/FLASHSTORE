// apps/inventory-service/src/infrastructure/persistence/models/stock-movement.model.ts

import { Schema, model, Document } from 'mongoose';

export interface StockMovementDocument
  extends Document {

  productId: string;

  warehouseId: string;

  type:
    | 'IN'
    | 'OUT'
    | 'RESERVE'
    | 'RELEASE'
    | 'ADJUSTMENT';

  quantity: number;

  referenceId?: string;

  reason?: string;

  createdAt: Date;
}

const StockMovementSchema =
  new Schema<StockMovementDocument>(
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

      type: {
        type: String,
        required: true,
        enum: [
          'IN',
          'OUT',
          'RESERVE',
          'RELEASE',
          'ADJUSTMENT',
        ],
      },

      quantity: {
        type: Number,
        required: true,
      },

      referenceId: {
        type: String,
      },

      reason: {
        type: String,
      },
    },
    {
      timestamps: {
        createdAt: true,
        updatedAt: false,
      },
      versionKey: false,
    }
  );

export const StockMovementModel =
  model<StockMovementDocument>(
    'StockMovement',
    StockMovementSchema
  );