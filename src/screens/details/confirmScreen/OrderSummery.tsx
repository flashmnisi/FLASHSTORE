import React from 'react';
import { View, Text, Pressable } from 'react-native';

interface Address {
  _id?: string;
  name: string;
  surname?: string;
  phone: string;
  city: string;
  houseNo: string;
  streetName: string;
  postalCode: string;
  country: string;
}

interface CartItem {
  product: { _id: string; price: number; [key: string]: any };
  count: number;
  price: number;
}

interface OrderSummaryProps {
  selectedAddress: Address | null;
  cartItems: CartItem[];
  subtotal: number;
  deliveryFee: number;
  paymentMethod: string;
  orderStatus: 'idle' | 'loading' | 'error';
  onPlaceOrder: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  selectedAddress,
  cartItems,
  subtotal,
  deliveryFee,
  paymentMethod,
  orderStatus,
  onPlaceOrder,
}) => {
  return (
    <View className="mx-5">
      <Text className="text-xl font-bold mb-2.5">Order Now</Text>
      <View className="bg-white p-2 border border-gray-300 mt-2.5 rounded-lg">
        <Text className="text-base">Shipping to {selectedAddress?.name}</Text>
        <View className="flex-row items-center justify-between mt-2">
          <Text className="text-base font-medium text-gray-500">Items</Text>
          <Text className="text-base text-gray-500">{cartItems?.length}</Text>
        </View>
        <View className="flex-row items-center justify-between mt-2">
          <Text className="text-base font-medium text-gray-500">Delivery</Text>
          <Text className="text-base text-gray-500">R{deliveryFee}</Text>
        </View>
        <View className="flex-row items-center justify-between mt-2">
          <Text className="text-xl font-bold">Order Total</Text>
          <Text className="text-lg font-bold text-red-600">R{subtotal}</Text>
        </View>
      </View>
      <View className="bg-white p-2 border border-gray-300 mt-2.5 rounded-lg">
        <Text className="text-base text-gray-500">Pay With</Text>
        <Text className="text-base font-semibold mt-1.75">
          Pay on delivery ({paymentMethod})
        </Text>
      </View>
      <Pressable
        onPress={onPlaceOrder}
        disabled={orderStatus === 'loading'}
        className={`p-2.5 rounded-lg justify-center items-center mt-5 ${
          orderStatus === 'loading' ? 'bg-gray-300' : 'bg-yellow-400'
        }`}
        accessibilityLabel="Place your order"
      >
        <Text className="text-base">
          {orderStatus === 'loading' ? 'Placing Order...' : 'Place your order'}
        </Text>
      </Pressable>
    </View>
  );
};

export default React.memo(OrderSummary);