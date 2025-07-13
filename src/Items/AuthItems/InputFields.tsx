import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard,
  Platform,
  Pressable,
  Alert,
} from 'react-native';
import React from 'react';
import {InputFieldsProps} from '../../type/Params';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../Navigations/RootNav';
type SignUpNavigationProp = NativeStackNavigationProp<RootStackParamList>;

type Props = {
  navigation: SignUpNavigationProp;
};

const InputFields = ({
  label,
  label2,
  placeholder,
  icon,
  secureTextEntry = false,
  ...props
}: InputFieldsProps) => {
  const navigation = useNavigation<SignUpNavigationProp>();

  const handleForgetPassword = () => {
    Alert.alert('Reset Password', 'Do you want to reset your password?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Yes',
        onPress: () =>
          navigation.navigate('AuthStack', {
            screen: 'RequestPassword',
          }),
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="my-2 w-full">
          <View className="flex-row justify-between">
            <Text className="text-lg font-semibold">{label}:</Text>
            <Pressable onPress={handleForgetPassword}>
              <Text className="text-lg font-semibold color-blue-400">
                {label2}
              </Text>
            </Pressable>
          </View>
          <View className="flex flex-row justify-start items-center relative bg-neutral-100 border border-sky-800 rounded-lg focus:border-red-500">
            {icon}
            <TextInput
              className="rounded-full p-4 font-semibold text-[15px] flex-1"
              secureTextEntry={secureTextEntry}
              placeholder={placeholder}
              {...props}
              autoCapitalize="none"
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default InputFields;
