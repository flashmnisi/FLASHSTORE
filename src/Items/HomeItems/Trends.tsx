import React from 'react';
import {View, Text, Image, TouchableOpacity, Alert} from 'react-native';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ProductParams} from '../../type/Params';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../Navigations/RootNav';
import {useNavigation} from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

type Props = {
  item: ProductParams;
  onAddToCart?: (item: ProductParams) => void;
};

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'DetailScreen'
>;
const Trends = ({item, onAddToCart}: Props) => {

    const product = item;
    const navigation = useNavigation<NavigationProp>();
    const cartItems = useSelector((state: RootState) => state.cart?.items);
    const alreadyInCart = cartItems?.some((item) => item.product._id === product._id);

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('DetailScreen', {id: item._id})}
      className="m-2 p-2 w-[150] h-[160] border rounded-lg border-slate-300 bg-white">
      <View>
        <Image
          source={{uri: item.images[0] || 'https://via.placeholder.com/150'}}
          style={{resizeMode: 'contain'}}
          className="w-full h-[80]"
        />
        {item.oldPrice && (
          <View className="size-12 bg-cyan-600 items-center justify-center rounded-lg absolute top-2 right-2">
            <Text className="text-white text-xs">Save</Text>
            <Text className="text-white text-xs">
              {Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100)}
              %
            </Text>
          </View>
        )}
        <Text className="font-bold p-1 px-3 text-[12px]">{item.name}</Text>
        <View className="flex-row items-center justify-between bg-slate-200 rounded-lg p-2">
          <View className="flex-row items-end gap-1">
            <Text className="font-semibold text-lg">
              R{item.price.toLocaleString()}
            </Text>
            {item.oldPrice && (
              <Text className="text-gray-700 line-through text-sm">
                R{item.oldPrice.toLocaleString()}
              </Text>
            )}
          </View>
          <TouchableOpacity onPress={() => onAddToCart?.(item)}>
            <Icons 
            name={alreadyInCart ? 'cart-check' : 'cart-plus'} 
            size={20} color="#075985" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Trends;
