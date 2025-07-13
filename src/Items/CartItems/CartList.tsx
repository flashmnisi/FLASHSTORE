import React from 'react';
import {View, Text, Image, TouchableOpacity, Alert} from 'react-native';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import {changeCount, updateCartItem} from '../../redux/slices/CartSlice';
import {CartItem} from '../../redux/types';

type Props = {
  CartItem: CartItem;
};

const CartList = ({CartItem}: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth?.user);

  const handleChangeCount = (amount: number) => {
    const newCount = CartItem.count + amount;
    if (newCount < 0) return;
    console.log('handleChangeCount:', {
      productId: CartItem.product._id,
      newCount,
    });
    if (user) {
      dispatch(
        updateCartItem({productId: CartItem.product._id, count: newCount}),
      )
        .unwrap()
        .catch(error => {
          console.error('updateCartItem error:', error);
          Alert.alert('Error', error || 'Failed to update cart');
        });
    } else {
      dispatch(changeCount({productId: CartItem.product._id, amount}));
    }
  };

  const handleRemove = () => {
    console.log('handleRemove:', {productId: CartItem.product._id});
    if (user) {
      dispatch(updateCartItem({productId: CartItem.product._id, count: 0}))
        .unwrap()
        .catch(error => {
          console.error('updateCartItem error:', error);
          Alert.alert('Error', error || 'Failed to remove item');
        });
    } else {
      dispatch(
        changeCount({productId: CartItem.product._id, amount: -CartItem.count}),
      );
    }
  };

  return (
    <View className="m-2 bg-white rounded-lg p-4 shadow-md">
      <View className="flex-row">
        <View className="w-[40%] items-center justify-center pr-2">
          <Image
            source={{
              uri:
                CartItem.product.images?.[0] ||
                'https://via.placeholder.com/150',
            }}
            className="w-full h-[100px] rounded-md"
            resizeMode="contain"
          />
        </View>

        <View className="w-[60%] justify-between">
          <Text className="font-bold text-lg">{CartItem.product.name}</Text>
          <Text className="text-sm text-slate-500">
            {CartItem.product.brand}
          </Text>
          <Text className="text-sm text-slate-600" numberOfLines={2}>
            {CartItem.product.description}
          </Text>
          <Text className="text-cyan-700 font-semibold mt-1">
            R{(CartItem.product.price * CartItem.count).toFixed(2)}
          </Text>

          <View className="flex-row items-center justify-between mt-2">
            <View className="flex-row items-center gap-2">
              <TouchableOpacity
                onPress={() => handleChangeCount(-1)}
                disabled={CartItem.count <= 1}>
                <Icons
                  name="minus-circle"
                  size={35}
                  color={CartItem.count <= 1 ? '#d3d3d3' : '#075985'}
                />
              </TouchableOpacity>
              <Text className="font-semibold">{CartItem.count}</Text>
              <TouchableOpacity onPress={() => handleChangeCount(1)}>
                <Icons name="plus-circle" size={35} color="#075985" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleRemove}>
              <Icons name="trash-can-outline" size={26} color="#ff0000" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CartList;
