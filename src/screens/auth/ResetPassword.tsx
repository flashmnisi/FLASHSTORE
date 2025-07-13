import React, {useEffect, useState} from 'react';
import {View, Text, Alert, TouchableOpacity, SafeAreaView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {resetPassword, clearResetPassword} from '../../redux/slices/AuthSlice';
import {AppDispatch, RootState} from '../../redux/store';
import {useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../Navigations/AuthNav';
import InputFields from '../../Items/AuthItems/InputFields';
import CustomButton from '../../Items/AuthItems/CustomButton';
import Icon from 'react-native-vector-icons/Feather';

type ResetPasswordNavigationProp =
  NativeStackNavigationProp<AuthStackParamList>;

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<ResetPasswordNavigationProp>();
  const route = useRoute<any>();
  const {email} = route.params || {};
  const resetPasswordState = useSelector(
    (state: RootState) => state.auth.resetPassword,
  );

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Email is missing. Please start over.');
      return;
    }
    if (!newPassword) {
      Alert.alert('Validation Error', 'New password is required');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters');
      return;
    }
    console.log('Resetting password for email:', email);
    try {
      const result = await dispatch(
        resetPassword({email, newPassword}),
      ).unwrap();
      console.log('ResetPassword result:', result);
      navigation.navigate('Login');
    } catch (error: any) {
      console.error('ResetPassword error:', error);
      Alert.alert('Error', error.message || 'Failed to reset password');
    }
  };

  useEffect(() => {
    if (resetPasswordState.success) {
      console.log('Password reset success, navigating to Login');
      navigation.navigate('Login');
      dispatch(clearResetPassword());
    }
    if (resetPasswordState.error) {
      console.error('ResetPassword error:', resetPasswordState.error);
      Alert.alert('Error', resetPasswordState.error);
      dispatch(clearResetPassword());
    }
  }, [
    resetPasswordState.success,
    resetPasswordState.error,
    navigation,
    dispatch,
  ]);

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <View className="m-2">
        <Text className="text-2xl font-semibold text-cyan-800 mb-4">
          Reset Password
        </Text>
        <InputFields
          label="Email"
          placeholder="Your Email"
          value={email}
          editable={false}
          icon={
            <Icon
              name="mail"
              size={20}
              style={{margin: 10, color: '#075985'}}
            />
          }
        />
        <InputFields
          label="New Password"
          placeholder="Enter New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          icon={
            <Icon
              name="lock"
              size={20}
              style={{margin: 10, color: '#075985'}}
            />
          }
          secureTextEntry
          editable={!resetPasswordState.loading}
        />
        <CustomButton
          title={resetPasswordState.loading ? 'Resetting...' : 'Reset Password'}
          onPress={handleResetPassword}
          loading={resetPasswordState.loading}
          accessibilityLabel="Reset Password Button"
        />
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          className="items-center mt-4"
          disabled={resetPasswordState.loading}>
          <Text className="text-blue-800">Back to Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ResetPassword;
