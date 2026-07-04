// apps/inventory-service/src/infrastructure/persistence/models/warehouse.model.ts

import { Schema, model, Document } from 'mongoose';

export interface WarehouseDocument extends Document {
  name: string;

  code: string;

  address: string;

  city: string;

  country: string;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const WarehouseSchema = new Schema<WarehouseDocument>(
  {
    name: {
      type: String,
      required: true,
    },

    code: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    address: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const WarehouseModel = model<WarehouseDocument>(
  'Warehouse',
  WarehouseSchema
);
