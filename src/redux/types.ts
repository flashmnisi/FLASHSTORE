 import { PersistedState } from 'redux-persist';
import { categoryParams, ProductParams } from '../type/Params';

export interface CartItem {
  product: ProductParams;
  count: number;
  price: number | undefined;
}
 export type User = {
  _id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
  token?: string;
  address?: Address[];
};
export interface Address {
  name: string;
  surname?:string;
  city: string;
  phone: string;
  country:string;
  streetName:string;
  houseNo:string;
  postalCode:string;

}

export interface AuthState {
  user: User | null;
  address: Address[];
  loading: boolean;
  error: string | null;
  addressStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  addressError: string | null;
  register: { loading: boolean; error: string | null; success: boolean };
  forgotPassword: { loading: boolean; error: string | null; success: boolean };
  verifyResetOtp: { loading: boolean; error: string | null; success: boolean };
  resetPassword: { loading: boolean; error: string | null; success: boolean };
  login:{ loading: boolean, error: string | null, success: boolean },
}

export type Order = {
  _id: string;
  user: string;
  orderItems: {
    product: string;
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
  paymentStatus?: string;
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
  deliveryOption: string;
  paymentData?: {
    paymentIntentId: string;
  };
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
};
export interface OrderData {
  orderItems: { product: string; qty: number; price: number; name?: string; image?: string }[];
  shippingAddress: Address;
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
  deliveryOption: string;
  paymentData?: { paymentIntentId: string };
  isPaid: boolean;
}

export type OrderState = {
  orders: Order[];
  loading: boolean;
  error: string | null;
  createOrder: {
    loading: boolean;
    error: string | null;
    success: boolean;
    order?: Order;
  };
  fetchUserOrders: {
    loading: boolean;
    error: string | null;
  };
};


export interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  deliveryFee: number;
  freeDeliveryFrom: number;
  deliveryOption: string | null;
}

export interface ProductsState {
  products: ProductParams[];
  productDetails: ProductParams | null;
  loading: boolean;
  error: string | null;
}


export interface LovedState {
  items: string[];
  loading: boolean;
  error: string | null;
}
export interface FavoritesState {
  items: string[];
  loading: boolean;
  error: string | null;
}

export interface CategoryState {
  categories: categoryParams[];
  loading: boolean;
  error: string | null;
}

export interface ProductsState {
  products: ProductParams[];
  productDetails: ProductParams | null;
  loading: boolean;
  error: string | null;
}
export interface CombinedState {
  auth: AuthState;
  cart: CartState;
  order: OrderState;
  loved: LovedState;
  category: CategoryState;
  products: ProductsState;
  favorites: FavoritesState;
}

export interface RootState extends CombinedState {
  _persist: PersistedState;
}

export interface ProductState {
  products: ProductParams[];
  loading: boolean;
  error: string | null;
}
