import mongoose, {Document, Types} from 'mongoose';
export type carouselParams = {
  name: string;
  images: string[];
  isActive: boolean;
};
export type categoryParams = {
  name: string;
  images: string[];
};

export type ProductProps = {
  name: string;
  brand?: string;
  images: string[];
  price: number;
  oldPrice?: number;
  quantity: number;
  category?: string;
  inStock?: boolean;
  description?: string;
  trends?: boolean;
  sale?: boolean;
};

export type CartItem = {
  product: {
    _id: string;
    name: string;
    price: number;
    images: string;
    quantity: number;
  };
  count: number;
};
export type Address = {
  name: string;
  surname?: string;
  phone: string;
  city: string;
  houseNo: string;
  streetName: string;
  postalCode: string;
  country: string;
};

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  address?: Address[];
  orders?: mongoose.Types.ObjectId[];
  isAdmin: boolean;
  cart: {
    items: {
      product: mongoose.Types.ObjectId;
      count: number;
    }[];
  };
  resetOtp?: {
    code: string;
    expiresAt: number;
    isVerified?: boolean;
  };
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IOrder extends Document {
  user: Types.ObjectId;
  orderItems: {
    product: Types.ObjectId;
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }[];
  shippingAddress: {
    name: string;
    surname?: string;
    phone: string;
    city: string;
    houseNo: string;
    streetName: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
  deliveryOption: string;
  paymentData?: {
    paymentIntentId: string;
  };
  paymentStatus?: string;
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
