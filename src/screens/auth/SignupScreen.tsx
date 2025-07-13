import {
  View,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import CustomButton from '../../Items/AuthItems/CustomButton';
import InputFields from '../../Items/AuthItems/InputFields';
import {useDispatch, useSelector} from 'react-redux';
import {register, clearRegister} from '../../redux/slices/AuthSlice';
import {AppDispatch, RootState} from '../../redux/store';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  ResetPassword: {email: string};
  TabStack: undefined;
};

type SignUpNavigationProp = NativeStackNavigationProp<RootStackParamList>;

type Props = {
  navigation: SignUpNavigationProp;
};

const SignupScreen = ({navigation}: Props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const registerState = useSelector(
    (state: RootState) =>
      state.auth?.register ?? {loading: false, error: null, success: false},
  );
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSignUp = async () => {
    if (!name) {
      Alert.alert('Validation Error', 'Name is required');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match');
      return;
    }

    try {
      const resultAction = await dispatch(register({name, email, password}));
      if (register.fulfilled.match(resultAction)) {
        Alert.alert('Success', 'Registration successful! Please log in.', [
          {text: 'OK', onPress: () => navigation.navigate('Login')},
        ]);
      } else {
        const errorMessage = resultAction.payload as string;
        Alert.alert(
          'Registration Error',
          errorMessage || 'Registration failed',
        );
      }
    } catch (err) {
      console.error('Registration error:', err);
      Alert.alert(
        'Registration Error',
        'Something went wrong. Check console for details.',
      );
    }
  };

  useEffect(() => {
    if (registerState.error) {
      Alert.alert('Registration Error', registerState.error);
      dispatch(clearRegister());
    }
  }, [registerState.error, dispatch]);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled">
        <View className="w-full">
          <Image
            source={require('../../images/colections/front2.webp')}
            className="object-contain w-full h-[300]"
          />
        </View>

        <View className="flex-1 bg-slate-100 -translate-y-5 rounded-t-3xl">
          <View className="p-4">
            <View className="items-center justify-center mb-4">
              <Text className="text-2xl font-semibold text-sky-800">
                WELCOME
              </Text>
            </View>

            <InputFields
              label="Name"
              placeholder="Enter Your Name"
              value={name}
              onChangeText={setName}
              autoCorrect={false}
  autoComplete="off"
              icon={
                <Icon
                  name="user"
                  size={20}
                  style={{margin: 10, color: '#075985'}}
                />
              }
              editable={!registerState.loading}
            />

            <InputFields
              label="Email"
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
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!registerState.loading}
            />

            <InputFields
              label="Password"
              placeholder="Enter Your Password"
              value={password}
              onChangeText={setPassword}
              icon={
                <Icon
                  name="lock"
                  size={20}
                  style={{margin: 10, color: '#075985'}}
                />
              }
              secureTextEntry
              editable={!registerState.loading}
            />

            <InputFields
              label="Confirm Password"
              placeholder="Confirm Your Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              icon={
                <Icon
                  name="lock"
                  size={20}
                  style={{margin: 10, color: '#075985'}}
                />
              }
              secureTextEntry
              editable={!registerState.loading}
            />

            {registerState.error ? (
              <Text className="text-red-600 text-center mb-4">
                {registerState.error}
              </Text>
            ) : null}

            <CustomButton
              title={registerState.loading ? 'Signing Up...' : 'Sign Up'}
              onPress={handleSignUp}
              loading={registerState.loading}
              accessibilityLabel="Sign Up Button"
            />

            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              className="items-center"
              disabled={registerState.loading}>
              <View className="mt-5 flex-row">
                <Text className="text-black text-base opacity-60">
                  Already Have an Account?{' '}
                </Text>
                <Text className="text-blue-800 text-base opacity-60">
                  Login
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;
