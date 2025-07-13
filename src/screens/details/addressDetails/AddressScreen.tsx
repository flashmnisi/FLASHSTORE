import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import React, { useEffect } from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';  
import { AppDispatch, RootState } from '../../../redux/store';
import { RootStackParamList } from '../../../Navigations/RootNav';
import { deleteAddress, fetchAddresses } from '../../../redux/slices/AuthSlice';

const AddressScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const user = useSelector((state: RootState) => state.auth?.user);
  const addressList = useSelector((state: RootState) => state.auth?.address || []);
  const addressStatus = useSelector((state: RootState) => state.auth?.addressStatus || 'idle');
  const addressError = useSelector((state: RootState) => state.auth?.addressError);

  useEffect(() => {
    console.log('AddressScreen state:', { user, addressList, addressStatus, addressError });
    if (!user?._id) {
      navigation.navigate('AuthStack',{screen:'Login'});
      return;
    }
    dispatch(fetchAddresses());
  }, [dispatch, user?._id, navigation]);

  const handleDeleteAddress = (index: number) => {
    Alert.alert('Delete Address', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await dispatch(deleteAddress(index.toString()));
          dispatch(fetchAddresses());
        },
      },
    ]);
  };

  return (
    <>
      <SafeAreaView className="bg-sky-800">
        <View className="pl-5 pr-5">
          <View className="flex-row justify-between items-center">
            <Entypo name="location" size={25} color="#fff" />
            <Text className="text-white font-semibold text-lg">{user?.name}</Text>
            <TouchableOpacity
              onPress={navigation.goBack}
              className="items-center justify-center border-2 m-2 p-2 border-white size-12 rounded-full"
            >
              <Icons name="arrow-right" size={25} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <View>
        <View className="bg-slate-300 w-full h-10 justify-center">
          <Text className="font-bold text-xl pl-3 text-cyan-600 capitalize">
            Select Your Address Below
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('AddAddress')}
          className="flex-row border-b-2 m-2 p-2 justify-between items-center bg-cyan-400"
        >
          <Text className="text-white">Add New Address</Text>
          <Icons name="arrow-right" size={25} color="#fff" />
        </TouchableOpacity>

        <ScrollView>
          {addressStatus === 'loading' && (
            <Text className="text-center text-gray-500 mt-4">Loading addresses...</Text>
          )}
          {addressError && (
            <Text className="text-center text-red-500 mt-4">{addressError}</Text>
          )}
          {addressList.length === 0 && addressStatus !== 'loading' && (
            <Text className="text-center text-gray-500 mt-4">
              No addresses found. Add a new address.
            </Text>
          )}
          {addressList.map((addr, index) => (
            <View
              key={index}
              className="border m-2 p-3 bg-white rounded-lg shadow"
            >
              <Text className="font-bold text-cyan-600">
                {addr.name} {addr.surname || ''}
              </Text>
              <Text>{addr.city}, {addr.country}</Text>
              <Text>{addr.phone}</Text>
              <Text>{addr.houseNo}, {addr.streetName}, {addr.postalCode}</Text>

              <View className="flex-row justify-end mt-2 gap-2">
                <TouchableOpacity
                  onPress={() => navigation.navigate('EditAddress',{index})}
                  className="px-3 py-1 bg-cyan-600 rounded-md"
                >
                  <Text className="text-white text-sm">Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteAddress(index)}
                  className="px-3 py-1 bg-red-600 rounded-md"
                >
                  <Text className="text-white text-sm">Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </>
  );
};

export default AddressScreen;