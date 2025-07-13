import React from 'react';
import { View, Text, Pressable } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const deliveryOptionsData = [
  { id: 'standard', title: 'Standard Delivery', desc: 'Delivery within 3-5 business days R350', fee: 350 },
  { id: 'express', title: 'Express Delivery', desc: 'Get it by tomorrow for R50 extra', fee: 400 },
  { id: 'sameDay', title: 'Same-Day Delivery', desc: 'Get it today by 9pm for R100 extra', fee: 450 },
];

interface DeliveryOptionsProps {
  deliveryOption: string | null;
  setDeliveryOption: (option: string) => void;
  setDeliveryFee: (fee: number) => void;
  onNext: () => void;
}

const DeliveryOptions = ({
  deliveryOption,
  setDeliveryOption,
  setDeliveryFee,
  onNext,
}:DeliveryOptionsProps) => {
  const handleSelectOption = (id: string, fee: number) => {
    console.log('Selected delivery:', { id, fee });
    setDeliveryOption(id);
    setDeliveryFee(fee);
  };

  return (
    <View className="">
      <Text className="text-xl font-bold mb-2.5 text-cyan-800">Choose your delivery options</Text>
      {deliveryOptionsData.map(option => (
        <View
          key={option.id}
          className="flex-row items-center bg-white p-2 gap-2 border border-gray-300 mt-2.5 rounded-lg mb-3"
        >
          <FontAwesome5
            name={deliveryOption === option.id ? 'dot-circle' : 'circle'}
            size={20}
            color={deliveryOption === option.id ? '#075985' : 'gray'}
            onPress={() => handleSelectOption(option.id, option.fee)}
          />
          <Text className="flex-1 text-base">
            <Text className="text-green-500 font-medium">{option.title}</Text> - {option.desc}
          </Text>
        </View>
      ))}
      <Pressable
        onPress={() => deliveryOption && onNext()}
        disabled={!deliveryOption}
        className={`p-2.5 rounded-lg justify-center items-center mt-3.75 ${
          deliveryOption ? 'bg-cyan-800' : 'bg-gray-300'
        }`}
        accessibilityLabel="Continue to payment"
      >
        <Text className="text-base text-white">Continue</Text>
      </Pressable>
    </View>
  );
};

export default React.memo(DeliveryOptions);