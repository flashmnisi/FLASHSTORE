import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import React from 'react';

type Props = {
  title: string;
  icon: React.ReactNode;
  onPress: () => void;
};
const GoogleLogin = ({title, icon, onPress}: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="h-12 rounded-lg bg-white border-2 border-slate-500 items-center justify-center mt-7 flex-row">
      {icon}
      <Text className=" text-gray-500 text-lg font-semibold ">{title}</Text>
    </TouchableOpacity>
  );
};

export default GoogleLogin;
