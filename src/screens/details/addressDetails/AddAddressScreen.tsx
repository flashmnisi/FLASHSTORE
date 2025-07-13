import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AppDispatch, RootState} from '../../../redux/store';
import {RootStackParamList} from '../../../Navigations/RootNav';
import {addAddress} from '../../../redux/slices/AuthSlice';
import { AuthState } from '../../../redux/types';

const AddAddressScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const authState = useSelector(
    (state: RootState) =>
      state.auth ??
      ({
        addressStatus: 'idle',
        addressError: null,
      } as Partial<AuthState>),
  );
  const {addressStatus, addressError} = authState;

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

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm({...form, [key]: value});
  };

  const validateForm = () => {
    const {name, phone, city, country, houseNo, streetName, postalCode} = form;
    if (
      !name ||
      !phone ||
      !city ||
      !country ||
      !houseNo ||
      !streetName ||
      !postalCode
    ) {
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
        addAddress({
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

      Alert.alert('Success', 'Address added successfully', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (error: any) {
      console.error('AddAddressScreen error:', error);
      Alert.alert('Error', addressError || 'Failed to add address');
    }
  };

  return (
    <SafeAreaView className="flex-1 p-4 bg-white">
      <View className="m-2">
        <Text className="text-lg font-bold mb-4 text-cyan-600">
          Add New Address
        </Text>

        <TextInput
          className="border p-2 mb-2 rounded"
          placeholder="Name *"
          value={form.name}
          onChangeText={value => handleChange('name', value)}
        />
        <TextInput
          className="border p-2 mb-2 rounded"
          placeholder="Surname"
          value={form.surname}
          onChangeText={value => handleChange('surname', value)}
        />
        <TextInput
          className="border p-2 mb-2 rounded"
          placeholder="Phone *"
          value={form.phone}
          keyboardType="numeric"
          onChangeText={value => handleChange('phone', value)}
        />
        <TextInput
          className="border p-2 mb-2 rounded"
          placeholder="City *"
          value={form.city}
          onChangeText={value => handleChange('city', value)}
        />
        <TextInput
          className="border p-2 mb-2 rounded"
          placeholder="Country *"
          value={form.country}
          onChangeText={value => handleChange('country', value)}
        />
        <TextInput
          className="border p-2 mb-2 rounded"
          placeholder="House No *"
          value={form.houseNo}
          onChangeText={value => handleChange('houseNo', value)}
        />
        <TextInput
          className="border p-2 mb-2 rounded"
          placeholder="Street Name *"
          value={form.streetName}
          onChangeText={value => handleChange('streetName', value)}
        />
        <TextInput
          className="border p-2 mb-2 rounded"
          placeholder="Postal Code *"
          value={form.postalCode}
          onChangeText={value => handleChange('postalCode', value)}
        />
        <TouchableOpacity
          className="bg-cyan-600 p-3 rounded-lg mt-4 flex-row justify-center items-center"
          onPress={handleSubmit}
          disabled={addressStatus === 'loading'}>
          {addressStatus === 'loading' ? (
            <ActivityIndicator size="small" color="#ffffff" className="mr-2" />
          ) : null}
          <Text className="text-white text-center">
            {addressStatus === 'loading' ? '' : 'Add Address'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AddAddressScreen;
