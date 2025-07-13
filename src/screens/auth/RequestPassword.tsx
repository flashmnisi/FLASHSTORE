import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useDispatch, useSelector} from 'react-redux';
import {
  forgotPassword,
  clearForgotPassword,
} from '../../redux/slices/AuthSlice';
import {RootState, AppDispatch} from '../../redux/store';

type RootStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  Otp: {email: string};
  ResetPassword: {email: string};
  TabStack: undefined;
};

type ForgotPasswordNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

const RequestPassword = () => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const forgotState = useSelector(
    (state: RootState) => state.auth.forgotPassword,
  );
  const navigation = useNavigation<ForgotPasswordNavigationProp>();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleForgotPassword = () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }
    console.log('Requesting OTP for email:', email);
    dispatch(forgotPassword(email.trim().toLowerCase()));
  };

  useEffect(() => {
    if (forgotState.success) {
      console.log('OTP sent successfully, navigating to Otp');
      Alert.alert(
        'Success',
        'A password reset OTP has been sent to your email.',
        [{text: 'OK', onPress: () => navigation.navigate('Otp', {email})}],
      );
      dispatch(clearForgotPassword());
    }
    if (forgotState.error) {
      console.error('ForgotPassword error:', forgotState.error);
      Alert.alert('Error', forgotState.error);
      dispatch(clearForgotPassword());
    }
  }, [forgotState.success, forgotState.error, navigation, dispatch, email]);

  useEffect(() => {
    return () => {
      console.log('Cleaning up RequestPassword');
      dispatch(clearForgotPassword());
    };
  }, [dispatch]);

  return (
    <SafeAreaView className="flex-1 p-4 bg-white">
      <View className="m-2">
        <Text className="text-2xl font-bold mb-4 text-cyan-800">
          Forgot Password
        </Text>
        <Text className="mb-4 text-gray-600">
          Enter your email to receive a password reset OTP.
        </Text>
        <TextInput
          className="border border-gray-300 p-2 mb-4 rounded"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!forgotState.loading}
        />
        <TouchableOpacity
          className={`bg-cyan-800 p-3 rounded ${
            forgotState.loading ? 'opacity-50' : ''
          }`}
          onPress={handleForgotPassword}
          disabled={forgotState.loading}>
          <Text className="text-white text-center font-semibold">
            {forgotState.loading ? 'Sending...' : 'Send Reset OTP'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="mt-4"
          onPress={() => navigation.navigate('Login')}
          disabled={forgotState.loading}>
          <Text className="text-blue-600 text-center">Back to Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RequestPassword;
