import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { OrderSummaryProps } from '../../type/Params';
import { PAYMENT_OPTIONS } from './Constant';

const OrderSummary = ({
  selectedAddress,
  cartItems,
  subtotal,
  deliveryFee,
  paymentMethod,
  deliveryOption,
  orderStatus,
  onPlaceOrder,
}:OrderSummaryProps) => {
  const deliveryOptionTitle = (() => {
    switch (deliveryOption) {
      case 'standard':
        return 'Standard Delivery';
      case 'express':
        return 'Express Delivery';
      case 'sameDay':
        return 'Same-Day Delivery';
      default:
        return 'Not selected';
    }
  })();

  const paymentOptionTitle =
    PAYMENT_OPTIONS.find(option => option.id === paymentMethod)?.title || 'Not selected';

  return (
    <View className="">
      <Text className="text-xl font-bold mb-2.5 text-cyan-800">Order Now</Text>

      <View className="bg-white p-2 border border-gray-300 mt-2.5 rounded-lg">
        <Text className="text-base">
          Shipping to {selectedAddress?.name || 'Not selected'}
        </Text>
        <Text className="text-base mt-1">
          Delivery Option: {deliveryOptionTitle}
        </Text>

        <View className="flex-row items-center justify-between mt-2">
          <Text className="text-base font-medium text-gray-500">Items</Text>
          <Text className="text-base text-gray-500">{cartItems?.length || 0}</Text>
        </View>

        <View className="flex-row items-center justify-between mt-2">
          <Text className="text-base font-medium text-gray-500">Delivery</Text>
          <Text className="text-base text-gray-500">R{deliveryFee}</Text>
        </View>

        <View className="flex-row items-center justify-between mt-2">
          <Text className="text-xl font-bold">Order Total</Text>
          <Text className="text-lg font-bold text-red-600">
            R{(subtotal + deliveryFee).toFixed(2)}
          </Text>
        </View>
      </View>

      <View className="bg-white p-2 border border-gray-300 mt-2.5 rounded-lg">
        <Text className="text-base text-gray-500">Pay With</Text>
        <Text className="text-base font-semibold mt-1.75">
          {paymentOptionTitle}
        </Text>
      </View>

      <Pressable
        onPress={onPlaceOrder}
        disabled={orderStatus === 'loading'}
        className={`p-3 rounded-lg justify-center items-center mt-5 ${
          orderStatus === 'loading' ? 'bg-gray-300' : 'bg-cyan-800'
        }`}
        accessibilityLabel="Place your order"
      >
        <Text className="text-base text-white">
          {orderStatus === 'loading' ? 'Placing Order...' : 'Place your order'}
        </Text>
      </Pressable>
    </View>
  );
};

export default React.memo(OrderSummary);
