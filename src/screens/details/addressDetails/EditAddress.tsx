import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import { RootStackParamList } from '../../../Navigations/RootNav';
import { updateAddress } from '../../../redux/slices/AuthSlice';

const EditAddress = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { index } = route.params as { index: number };

  const address = useSelector((state: RootState) => state.auth.address[index]);
  const addressStatus = useSelector((state: RootState) => state.auth.addressStatus);
  const addressError = useSelector((state: RootState) => state.auth.addressError);

  const [form, setForm] = useState({
    name: '',
    surname: '',
    phone: '',
    city: '',
    country: '',
    houseNo: '',
    streetName: '',
    postalCode: '',
  });

  useEffect(() => {
    if (address) {
      setForm({
        name: address.name || '',
        surname: address.surname || '',
        phone: address.phone || '',
        city: address.city || '',
        country: address.country || '',
        houseNo: address.houseNo || '',
        streetName: address.streetName || '',
        postalCode: address.postalCode || '',
      });
    }
  }, [address]);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const validateForm = () => {
    const { name, phone, city, country, houseNo, streetName, postalCode } = form;
    if (!name || !phone || !city || !country || !houseNo || !streetName || !postalCode) {
      Alert.alert('Error', 'All required fields must be filled');
      return false;
    }

    const phoneRegex = /^\d{9,11}$/;
    if (!phoneRegex.test(phone)) {
      Alert.alert('Error', 'Please enter a valid phone number (9 - 11 digits)');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await dispatch(
        updateAddress({
          index: index.toString(),
          name: form.name,
          surname: form.surname || undefined,
          phone: form.phone,
          city: form.city,
          country: form.country,
          houseNo: form.houseNo,
          streetName: form.streetName,
          postalCode: form.postalCode,
        }),
      ).unwrap();

      Alert.alert('Success', 'Address updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      console.error('EditAddressScreen error:', error);
      Alert.alert('Error', addressError || 'Failed to update address');
    }
  };

  return (
    <SafeAreaView className="flex-1 p-4 bg-white">
      <View className="m-2">
        <Text className="text-lg font-bold mb-4 text-cyan-600">Edit Address</Text>

        <TextInput
          className="border p-2 mb-2 rounded"
          placeholder="Name *"
          value={form.name}
          onChangeText={(value) => handleChange('name', value)}
          editable={addressStatus !== 'loading'}
        />
        <TextInput
          className="border p-2 mb-2 rounded"
          placeholder="Surname"
          value={form.surname}
          onChangeText={(value) => handleChange('surname', value)}
          editable={addressStatus !== 'loading'}
        />
        <TextInput
          className="border p-2 mb-2 rounded"
          placeholder="Phone *"
          value={form.phone}
          keyboardType="numeric"
          onChangeText={(value) => handleChange('phone', value)}
          editable={addressStatus !== 'loading'}
        />
        <TextInput
          className="border p-2 mb-2 rounded"
          placeholder="City *"
          value={form.city}
          onChangeText={(value) => handleChange('city', value)}
          editable={addressStatus !== 'loading'}
        />
        <TextInput
          className="border p-2 mb-2 rounded"
          placeholder="Country *"
          value={form.country}
          onChangeText={(value) => handleChange('country', value)}
          editable={addressStatus !== 'loading'}
        />
        <TextInput
          className="border p-2 mb-2 rounded"
          placeholder="House No *"
          value={form.houseNo}
          onChangeText={(value) => handleChange('houseNo', value)}
          editable={addressStatus !== 'loading'}
        />
        <TextInput
          className="border p-2 mb-2 rounded"
          placeholder="Street Name *"
          value={form.streetName}
          onChangeText={(value) => handleChange('streetName', value)}
          editable={addressStatus !== 'loading'}
        />
        <TextInput
          className="border p-2 mb-2 rounded"
          placeholder="Postal Code *"
          value={form.postalCode}
          onChangeText={(value) => handleChange('postalCode', value)}
          editable={addressStatus !== 'loading'}
        />

        <TouchableOpacity
          className={`bg-cyan-600 p-3 rounded-lg mt-4 flex-row justify-center items-center ${
            addressStatus === 'loading' ? 'opacity-50' : ''
          }`}
          onPress={handleSubmit}
          disabled={addressStatus === 'loading'}
        >
          {addressStatus === 'loading' ? (
            <ActivityIndicator size="small" color="#ffffff" className="mr-2" />
          ) : null}
          <Text className="text-white text-center">
            {addressStatus === 'loading' ? '' : 'Update Address'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default EditAddress;