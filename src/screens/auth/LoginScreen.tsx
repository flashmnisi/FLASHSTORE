import {View, Text, Image, TouchableOpacity, Alert} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import InputFields from '../../Items/AuthItems/InputFields';
import CustomButton from '../../Items/AuthItems/CustomButton';
import GoogleLogin from '../../Items/AuthItems/GoogleLogin';
import {useDispatch, useSelector} from 'react-redux';
import {login} from '../../redux/slices/AuthSlice';
import {AppDispatch, RootState} from '../../redux/store';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../Navigations/RootNav';

type SignUpNavigationProp = NativeStackNavigationProp<RootStackParamList>;

type Props = {
  navigation: SignUpNavigationProp;
};

const LoginScreen = ({navigation}: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const loading = useSelector((state: RootState) => state.auth.login.loading);
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Email and password are required');
      return;
    }

    try {
      const result = await dispatch(login({email, password}));

      if (login.fulfilled.match(result)) {
        Alert.alert('Success', 'Login successful', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('TabStack', {screen: 'Home'}),
          },
        ]);
      } else {
        Alert.alert('Login Failed', result.payload as string);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <>
      <View className=" w-full">
        <Image
          source={require('../../images/colections/front1.jpg')}
          className="object-contain w-full h-[300]"
        />
      </View>

      <View className="flex-1 bg-slate-100 -translate-y-5 rounded-t-3xl">
        <View className="p-4 h-full">
          <View className="items-center justify-center p-4">
            <Text className="text-2xl font-semibold text-sky-800">
              Login to Continue
            </Text>
          </View>

          <InputFields
            label="Email"
            label2="Forget Password:"
            placeholder="Enter Your Email"
            value={email}
            onChangeText={setEmail}
            autoCorrect={false}
  autoComplete="off"
            icon={
              <Fontisto
                name="email"
                size={20}
                style={{margin: 10, color: '#075985'}}
              />
            }
          />
          <InputFields
            label="Password"
            placeholder="Enter Your Password"
            onChangeText={setPassword}
            value={password}
            autoCorrect={false}
  autoComplete="off"
            icon={
              <Icon
                name="lock"
                size={20}
                style={{margin: 10, color: '#075985'}}
              />
            }
            secureTextEntry={true}
          />

          <CustomButton
            title={loading ? 'Logging in...' : 'Log In'}
            onPress={handleLogin}
            loading={loading}
            accessibilityLabel=""
          />
          <GoogleLogin
            title="Google Log In"
            icon={
              <SimpleLineIcons
                name="social-google"
                size={20}
                style={{margin: 10}}
              />
            }
            onPress={() => console.log('Google button pressed')}
          />
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('AuthStack', {screen: 'SignUp'});
            }}
            className="items-center">
            <View className="mt-5 flex-row">
              <Text className="text-black text-base opacity-60">
                Don't Have an Account ?{' '}
              </Text>
              <Text className="text-blue-800 text-base opacity-60">
                Sign Up
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default LoginScreen;
