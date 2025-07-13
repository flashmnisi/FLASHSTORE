import React from 'react';
import { View, Text, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../Navigations/RootNav';
import { ProductParams } from '../../type/Params';
import { useDispatch, useSelector } from 'react-redux';
import { addToLoved, removeFromLoved } from '../../redux/slices/LovedSlice';
import { RootState, AppDispatch } from '../../redux/Store';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'DetailScreen'>;

type Props = {
  item: ProductParams;
  onAddToCart?: (product: ProductParams) => void;
  displayMode?: 'grid' | 'list';
};

const Market = ({ item, onAddToCart, displayMode = 'grid' }: Props) => {

  const product = item;
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const isLoved = useSelector((state: RootState) => state.loved.items.includes(item._id));
  const lovedLoading = useSelector((state: RootState) => state.loved.loading);
  const cartItems = useSelector((state: RootState) => state.cart?.items);
  const alreadyInCart = cartItems?.some((item) => item.product._id === product._id);

  const toggleLoved = () => {
    if (!user?.token) {
      Alert.alert('Login Required', 'Please log in to add items to your loved list.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Login', onPress: () => navigation.navigate('AuthStack', { screen: 'Login' }) },
      ]);
      return;
    }

    if (!item._id) {
      Alert.alert('Error', 'Invalid product data');
      return;
    }

    if (isLoved) {
      dispatch(removeFromLoved(item._id))
        .unwrap()
        .then(() => Alert.alert('Success', 'Removed from loved items!'))
        .catch((error: any) => Alert.alert('Error', error?.message || 'Failed to remove item'));
    } else {
      dispatch(addToLoved(item._id))
        .unwrap()
        .then(() => Alert.alert('Success', 'Added to loved items!'))
        .catch((error: any) => Alert.alert('Error', error?.message || 'Failed to add item'));
    }
  };

  return (
   <TouchableOpacity
      onPress={() => navigation.navigate('DetailScreen', { id: item._id })}
      className={displayMode === 'grid' ? 'w-[185]' : 'w-full'}
    >
      <View className="m-2 p-2 border rounded-lg border-slate-300 bg-white">
        <Image
          source={{ uri: item.images[0] || 'https://via.placeholder.com/150' }}
          style={{ resizeMode: 'contain' }}
          className={displayMode === 'grid' ? 'w-full h-[130]' : 'w-full h-[100]'}
        />
        <View className="flex-row justify-between">
          <Text
            className={`font-bold bg-emerald-500 p-1 px-3 text-[12px] ${
              displayMode === 'grid' ? 'w-[80%]' : 'w-[90%]'
            } justify-center`}
          >
            {item.name}
          </Text>
          <TouchableOpacity
            onPress={toggleLoved}
            disabled={lovedLoading}
            className="bg-red-500 rounded p-1"
          >
            {lovedLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Icons
                name={isLoved ? 'cards-heart' : 'cards-heart-outline'}
                size={20}
                color="#fff"
              />
            )}
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-between mt-3">
          <View>
            <Text className="text-lg font-semibold">
              {item.brand || 'Unknown Brand'}
            </Text>
            <View className="flex-row w-full justify-between">
              <View className="flex-row gap-1 items-center">
                <Text className="font-bold text-cyan-700 text-xl">
                  R{item.price.toLocaleString()}
                </Text>
                {item.oldPrice && (
                  <Text className="text-slate-400 line-through text-sm">
                    R{item.oldPrice.toLocaleString()}
                  </Text>
                )}
              </View>

              <TouchableOpacity onPress={() => onAddToCart?.(item)}>
                <Icons
                 name={alreadyInCart ? 'cart-check' : 'cart-plus'}
                 size={25} color="#075985" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {item.oldPrice && (
          <View className="size-12 bg-red-400 items-center justify-center rounded-lg absolute top-2 right-2">
            <Text className="text-white text-xs">Save</Text>
            <Text className="text-white text-xs">
              {Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100)}%
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default Market;