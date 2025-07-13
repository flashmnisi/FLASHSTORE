import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../Navigations/RootNav';
import {categoryParams} from '../../type/Params';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CategoryScreen'
>;

type Props = {
  item: categoryParams;
};

const FutureCategories = ({item}: Props) => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <TouchableOpacity
      className="m-5 items-center"
      accessibilityRole="button"
      onPress={() =>
        navigation.navigate('CategoryScreen', {id: item._id, name: item.name})
      }>
      <View className="size-24 bg-white border-2 border-gray-400 items-center justify-center rounded-full">
        <Image
          source={{uri: item.images[0] || 'https://via.placeholder.com/56'}}
          style={{width: 56, height: 56}}
          resizeMode="cover"
        />
      </View>
      <Text className="mt-2 font-semibold text-center">{item.name}</Text>
    </TouchableOpacity>
  );
};

export default FutureCategories;
