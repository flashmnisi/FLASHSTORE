import React from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import { Address } from '../../type/Params';

interface AddressSelectionProps {
  addressList: Address[] | undefined;
  addressStatus: string;
  selectedAddress: Address | null;
  setSelectedAddress: (address: Address) => void;
  onNext: () => void;
}

const AddressSelection = ({
  addressList,
  addressStatus,
  selectedAddress,
  setSelectedAddress,
  onNext,
}:AddressSelectionProps) => {
  const isSelected = (item: Address, index: number) =>
    selectedAddress?._id === (item._id || index.toString());

  if (addressStatus === 'loading') {
    return (
      <View className="mx-5 my-5">
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (addressStatus === 'failed') {
    return (
      <View className="mx-5 my-5">
        <Text className="text-red-500 text-base">
          Failed to load addresses. Please try again.
        </Text>
      </View>
    );
  }

  if (!Array.isArray(addressList) || addressList.length === 0) {
    return (
      <View className="mx-5 my-5">
        <Text className="text-base">No addresses found.</Text>
      </View>
    );
  }

  return (
    <View className="mx-1">
      <Text className="text-xl font-bold mb-2.5 text-cyan-800">Select Delivery</Text>

      {addressList.map((item, index) => (
        <Pressable
          key={item._id || index.toString()}
          onPress={() =>
            setSelectedAddress({ ...item, _id: item._id || index.toString() })
          }
          className={`border p-2.5 flex-row items-center my-1.5 rounded-lg ${
            isSelected(item, index) ? 'border-cyan-800 bg-cyan-50' : 'border-gray-300'
          }`}
          accessibilityLabel={`Select address for ${item.name}`}
        >
        

          <View className="ml-2 flex-1">
            <View className="flex-row items-center">
              <Text className="text-base font-bold">{item.name}</Text>
              <Entypo name="location" size={20} color="gray" className="ml-1" />
            </View>

            <Text className="text-base text-gray-600">
              {item.name} {item.surname || ''}
            </Text>
            <Text className="text-base text-gray-600">{item.phone}</Text>
            <Text className="text-base text-gray-600">
              {item.houseNo}, {item.streetName}, {item.city},{' '}
              {item.postalCode}, {item.country}
            </Text>

            {isSelected(item, index) && (
              <Pressable
                onPress={onNext}
                className="bg-cyan-800 p-2 rounded-lg justify-center items-center mt-2"
                accessibilityLabel="Deliver to this address"
              >
                <Text className="text-white text-base">
                  Deliver to this Address
                </Text>
              </Pressable>
            )}
          </View>
        </Pressable>
      ))}
    </View>
  );
};

export default React.memo(AddressSelection);
