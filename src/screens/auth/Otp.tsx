import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useDispatch, useSelector} from 'react-redux';
import {
  verifyResetOtp,
  clearVerifyResetOtp,
  forgotPassword,
  clearForgotPassword,
} from '../../redux/slices/AuthSlice';
import {AppDispatch, RootState} from '../../redux/store';
import {AuthStackParamList} from '../../Navigations/AuthNav';

type ForgotPasswordNavigationProp =
  NativeStackNavigationProp<AuthStackParamList>;

const Otp = () => {
  const route = useRoute<any>();
  const {email} = route.params || {};
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<ForgotPasswordNavigationProp>();
  const verifyState = useSelector(
    (state: RootState) =>
      state.auth.verifyResetOtp ?? {
        loading: false,
        error: null,
        success: false,
      },
  );
  const forgotState = useSelector(
    (state: RootState) =>
      state.auth.forgotPassword ?? {
        loading: false,
        error: null,
        success: false,
      },
  );
  const inputsRef = useRef<Array<TextInput | null>>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < otp.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      Alert.alert('Error', 'Please enter a 6-digit OTP.');
      return;
    }
    if (!email) {
      Alert.alert('Error', 'Email is missing. Please start over.');
      return;
    }
    console.log('Verifying OTP for email:', email, 'OTP:', otpCode);
    try {
      const result = await dispatch(
        verifyResetOtp({email, otp: otpCode}),
      ).unwrap();
      console.log('Dispatch result:', result);
      navigation.navigate('ResetPassword', {email});
    } catch (error: any) {
      console.error('Dispatch error:', error);
      Alert.alert('Error', error.message || 'Failed to verify OTP');
    }
  };

  const handleResendOtp = () => {
    if (!email) {
      Alert.alert('Error', 'Email is missing. Please start over.');
      return;
    }

    dispatch(forgotPassword(email.trim().toLowerCase()));
  };

  useEffect(() => {
    console.log('verifyState:', verifyState);
    if (verifyState.success) {
      
      navigation.navigate('ResetPassword', {email});
      dispatch(clearVerifyResetOtp());
    }
    if (verifyState.error) {
     
      Alert.alert('Error', verifyState.error);
      dispatch(clearVerifyResetOtp());
    }
  }, [verifyState.success, verifyState.error, navigation, dispatch, email]);

  useEffect(() => {
    if (forgotState.success) {
      
      Alert.alert('Success', 'A new OTP has been sent to your email.');
      dispatch(clearForgotPassword());
    }
    if (forgotState.error) {
      console.error('Resend OTP error:', forgotState.error);
      Alert.alert('Error', forgotState.error);
      dispatch(clearForgotPassword());
    }
  }, [forgotState.success, forgotState.error, dispatch]);

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-slate-100">
      <View className="items-center justify-center mb-4">
        <Text className="text-xl font-bold text-cyan-800">
          OTP Verification
        </Text>
        <Text className="text-lg text-cyan-600">
          Please type the verification code sent to
        </Text>
        <Text className="text-gray-600">{email}</Text>
        <Text className="text-cyan-600">The OTP will expire in 10m</Text>
      </View>
      <View className="flex-row mb-4">
        {otp.map((digit, i) => (
          <TextInput
            key={i}
            ref={(el: TextInput | null) => {
              inputsRef.current[i] = el;
            }}
            value={digit}
            onChangeText={value => handleChange(value, i)}
            onKeyPress={e => handleKeyPress(e, i)}
            keyboardType="numeric"
            maxLength={1}
            className="border-2 border-cyan-800 rounded size-12 text-center mx-1 bg-white text-lg items-center justify-center"
            editable={!verifyState.loading}
          />
        ))}
      </View>
      <TouchableOpacity
        className={`bg-cyan-800 p-3 rounded w-3/4 ${
          verifyState.loading ? 'opacity-50' : ''
        }`}
        onPress={handleVerifyOtp}
        disabled={verifyState.loading}>
        <Text className="text-white text-center font-semibold">
          {verifyState.loading ? 'Verifying...' : 'Verify OTP'}
        </Text>
      </TouchableOpacity>
      <View className="mt-4 flex-row">
        <Text className="text-gray-600">Didn't receive code? </Text>
        <TouchableOpacity
          onPress={handleResendOtp}
          disabled={verifyState.loading || forgotState.loading}>
          <Text className="text-red-700">Request again</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Otp;
