import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { PaymentMethodProps } from '../../type/Params';
import { PAYMENT_OPTIONS } from './Constant';

const PaymentMethod = ({
  paymentMethod,
  setPaymentMethod,
  orderStatus,
  onPay,
  onNext,
}:PaymentMethodProps) => {
  return (
    <View className="">
      <Text className="text-xl font-bold mb-2.5 text-cyan-800">Payment</Text>

      <View className="bg-white p-2 border border-gray-300 mt-2.5 rounded-lg">
        <Text className="text-base mb-2">Select payment method:</Text>
        {PAYMENT_OPTIONS.map((option) => (
          <Pressable
            key={option.id}
            onPress={() => setPaymentMethod(option.id)}
            className={`p-2 mb-2 rounded border ${
              paymentMethod === option.id
                ? 'bg-cyan-800 border-cyan-800'
                : 'bg-gray-100 border-gray-300'
            }`}
            accessibilityLabel={`Select ${option.title} payment`}
          >
            <Text
              className={`text-base ${
                paymentMethod === option.id ? 'text-white' : 'text-black'
              }`}
            >
              {option.title}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={paymentMethod === 'card' ? onPay : onNext}
        disabled={orderStatus === 'loading'}
        className={`p-3 rounded-lg justify-center items-center mt-5 ${
          orderStatus === 'loading' ? 'bg-gray-300' : 'bg-cyan-800'
        }`}
        accessibilityLabel="Continue to next step"
      >
        <Text className="text-base text-white">
          {orderStatus === 'loading'
            ? 'Processing...'
            : paymentMethod === 'card'
            ? 'Pay with Card'
            : 'Continue'}
        </Text>
      </Pressable>
    </View>
  );
};

export default React.memo(PaymentMethod);