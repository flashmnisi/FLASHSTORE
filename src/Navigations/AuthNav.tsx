import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import {CompositeScreenProps} from '@react-navigation/native';
import {RootStakeScreenProps} from './RootNav';
import ResetPassword from '../screens/auth/ResetPassword';
import RequestPassword from '../screens/auth/RequestPassword';
import Otp from '../screens/auth/Otp';
export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ResetPassword: {email: string};
  Otp: { email: string };
  RequestPassword: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
export type AuthScreenProps<T extends keyof AuthStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<AuthStackParamList, T>,
    RootStakeScreenProps<'AuthStack'>
  >;

const AuthNav = () => {
  return (  
    <AuthStack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="Login">
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="SignUp" component={SignupScreen} />
      <AuthStack.Screen name="ResetPassword" component={ResetPassword} />
      <AuthStack.Screen name="RequestPassword" component={RequestPassword} /> 
      <AuthStack.Screen name="Otp" component={Otp} />
    </AuthStack.Navigator>
  );
};

export default AuthNav;
