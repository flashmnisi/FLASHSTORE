import {StyleProp, TextInputProps, ViewStyle} from 'react-native';

export type categoryParams = {
  _id: string;
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

export type FetchCategories = {
  data: {
    respond: categoryParams[];
  };
};

export type ProductParams = {
  _id: string;
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

export type FetchProducts = {
  data: {
    respond: ProductParams[];
  };
};

export type ProductsProps = {
  setProducts: (products: ProductParams[]) => void;
  onError?: (message: string) => void;
};
export interface InputFieldsProps extends Omit<TextInputProps, 'style'>  {
  label: string;
  label2?: string;
  placeholder: string;
  value: string;
  onChangeText?: (text: string) => void;
  icon?: React.ReactNode;
  secureTextEntry?: boolean;
  style?: StyleProp<ViewStyle>;
  editable?: boolean;
};

export interface Address {
  _id?:string;
  name: string;
  surname?: string;
  city: string;
  phone: string;
  country: string;
  streetName: string;
  houseNo: string;
  postalCode: string;
}

export type Order = {
  _id: string;
  user: string;
  orderItems: {
    product: string | {_id: string; name: string; price: number; image: string};
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  shippingAddress: {
    name: string;
    surname?: string;
    phone?: string;
    city: string;
    houseNo?: string;
    streetName: string;
    postalCode?: string;
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
  createdAt: Date;
};

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

export type ProductProps = {
  _id: string;
  name?: string;
  images: string[];
  category?: string;
  quantity: number;
  inStock?: boolean;
  length?: boolean;
};

export type CartItemProps = {
  cart: ProductProps[];
};

export type CartStateProps = {
  cart: {
    cart: ProductProps[];
    length: number;
  };
};

export type carouselParams = {
  _id?: string;
  id?: string;
  images: string[];
};

export type FetchCarousel = {
  data: {
    Carousels: carouselParams[];
    results: carouselParams[];
  };
};

export interface CartItem {
  product: { _id: string; price: number; name?: string; image?: string; images?: string | string[]; [key: string]: any };
  count: number;
  price: number | undefined;
}


export interface OrderSummaryProps {
  selectedAddress: Address | null;
  cartItems: CartItem[];
  subtotal: number;
  deliveryFee: number;
  paymentMethod: string;
  deliveryOption: string | null;
  orderStatus: string;
  onPlaceOrder: () => void;
}
export interface PaymentMethodProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  orderStatus: string;
  deliveryOption: string | null;
  setDeliveryOption: (option: string) => void;
  deliveryFee: number;
  setDeliveryFee: (fee: number) => void;
  onPay: () => void;
  onNext: () => void;
}


