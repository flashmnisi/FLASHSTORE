import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * ===============================
 * ORDER ITEM INTERFACE
 * ===============================
 */
export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

/**
 * ===============================
 * ORDER INTERFACE
 * ===============================
 */
export interface IOrder extends Document {
  userId: string;

  items: IOrderItem[];

  totalAmount: number;

  currency: string;

  status:
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled';

  paymentStatus:
    | 'pending'
    | 'paid'
    | 'failed'
    | 'refunded';

  idempotencyKey: string;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * ===============================
 * ORDER ITEM SCHEMA
 * ===============================
 */
const orderItemSchema = new Schema<IOrderItem>(
  {
    productId: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    image: {
      type: String,
      default: '',
    },
  },
  {
    _id: false,
  }
);

/**
 * ===============================
 * ORDER SCHEMA
 * ===============================
 */
const orderSchema = new Schema<IOrder>(
  {
    /**
     * User from gateway header
     */
    userId: {
      type: String,
      required: true,
      index: true,
    },

    /**
     * Ordered products
     */
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items: IOrderItem[]) => items.length > 0,
        message: 'Order must contain at least one item',
      },
    },

    /**
     * Final total
     */
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    /**
     * Currency
     */
    currency: {
      type: String,
      default: 'ZAR',
      uppercase: true,
      trim: true,
    },

    /**
     * Order status
     */
    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
      ],
      default: 'pending',
      index: true,
    },

    /**
     * Payment status
     */
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },

    /**
     * Idempotency key (PREVENT DUPLICATES)
     */
    idempotencyKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/**
 * ===============================
 * INDEXES (CLEANED)
 * ===============================
 */

/**
 * User order history
 */
orderSchema.index({ userId: 1, createdAt: -1 });

/**
 * NOTE:
 * Removed duplicate index definitions
 * (status & paymentStatus already indexed inline)
 */

/**
 * ===============================
 * MODEL
 * ===============================
 */
export const OrderModel: Model<IOrder> =
  mongoose.model<IOrder>('Order', orderSchema);

// Invoke-WebRequest -Method POST `
//   -Uri "http://localhost:8080/api/orders" `
//   -Headers @{
//     "Content-Type" = "application/json"
//     "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTAwZTI4MmI4OTNhMDY5ZTM4MjFmOWQiLCJlbWFpbCI6InNlbGJ5QGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzc4NDkxNjI2LCJleHAiOjE3Nzg0OTI1MjZ9.czhm89LgKxLqhFujdu0SSs9mhelkgMWuyweRvrVjyv0"
//   } `
//   -Body '{
//     "orderItems": [
//       {
//         "product": "prod_001",
//         "qty": 1,
//         "price": 1299.99
//       }
//     ],
//     "shippingAddress": {
//       "name": "Flash Mnisi",
//       "phone": "0812345678",
//       "city": "Johannesburg",
//       "houseNo": "123",
//       "streetName": "Main Street",
//       "postalCode": "2001",
//       "country": "South Africa"
//     },
//     "paymentMethod": "card",
//     "itemsPrice": 1299.99,
//     "shippingPrice": 99.99,
//     "totalPrice": 1399.98,
//     "deliveryOption": "standard"
//   }' | Select-Object -ExpandProperty Content