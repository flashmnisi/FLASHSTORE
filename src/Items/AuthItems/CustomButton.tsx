import {Text, TouchableOpacity, ActivityIndicator, View} from 'react-native';
import React from 'react';

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
  rightIcon?: React.JSX.Element;
};

const CustomButton = ({
  title,
  onPress,
  loading,
  disabled,
  accessibilityLabel,
  rightIcon,
}: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`h-12 rounded-lg bg-sky-800 items-center justify-center mt-7 ${
        loading || disabled ? 'opacity-50' : ''
      }`}
      disabled={loading || disabled}
      accessibilityLabel={accessibilityLabel}>
      <Text className="text-white text-lg font-semibold">{title}</Text>
      {rightIcon && <View className="ml-2">{rightIcon}</View>}
    </TouchableOpacity>
  );
};

export default CustomButton;
