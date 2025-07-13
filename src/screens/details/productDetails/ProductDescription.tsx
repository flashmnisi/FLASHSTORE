import React, { useEffect } from 'react';
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from 'react-native';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { ProductParams } from '../../../type/Params';
import { AppDispatch } from '../../../redux/store';
import { RootState} from '../../../redux/types'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../Navigations/RootNav';
import { useNavigation } from '@react-navigation/native';
import { addToCart } from '../../../redux/slices/CartSlice';
import { addToLoved, removeFromLoved, fetchLovedItems } from '../../../redux/slices/LovedSlice';

type Props = {
  Product: ProductParams;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProductDescription = ({ Product }: Props) => {
  const product = Product;
  const dispatch = useDispatch() as AppDispatch;
  const navigation = useNavigation<NavigationProp>();
  const user = useSelector((state: RootState) => state.auth.user);
  const cartItems = useSelector((state: RootState) => state.cart?.items);
  const isLoved = useSelector((state: RootState) => state.loved?.items.includes(product._id));
  const cartLoading = useSelector((state: RootState) => state.cart?.loading);
  const lovedLoading = useSelector((state: RootState) => state.loved?.loading);
  const lovedError = useSelector((state: RootState) => state.loved?.error);
  const alreadyInCart = cartItems?.some((item) => item.product._id === product._id);

  useEffect(() => {
    if (user?.token) {
      dispatch(fetchLovedItems());
    }
  }, [dispatch, user?.token]);

  const addMyCart = () => {
    console.log('User state:', { user, token: user?.token });

    if (!user?.token) {
      Alert.alert('Login Required', 'Please log in to add items to your cart.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Login', onPress: () => navigation.navigate('AuthStack', { screen: 'Login' }) },
      ]);
      return;
    }

    if (!product?._id) {
      Alert.alert('Error', 'Invalid product data');
      return;
    }

    if (alreadyInCart) {
      Alert.alert('Already Added', 'This item is already in your cart.');
      return;
    }

   dispatch(addToCart({ productId: product._id, count: 1 }))
  .unwrap()
      .catch((error: any) => {
        const errorMessage = typeof error === 'string' ? error : JSON.stringify(error);
        Alert.alert('Error', errorMessage || 'Failed to add item');
      });
  };

  const toggleLoved = () => {
    if (!user?.token) {
      Alert.alert('Login Required', 'Please log in to add items to your loved list.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Login', onPress: () => navigation.navigate('AuthStack', { screen: 'Login' }) },
      ]);
      return;
    }

    if (!product?._id) {
      Alert.alert('Error', 'Invalid product data');
      return;
    }

    if (isLoved) {
      dispatch(removeFromLoved(product._id))
        .unwrap()
        .catch((error: any) => Alert.alert('Error', error?.message || 'Failed to remove item'));
    } else {
      dispatch(addToLoved(product._id))
        .unwrap()
        .catch((error: any) => Alert.alert('Error', error?.message || 'Failed to add item'));
    }
  };

  return (
    <View className="rounded-xl p-3 flex-[9] w-full bg-slate-100">
      {lovedError && <Text className="text-red-500 text-center">{lovedError}</Text>}
      <Text className="font-bold text-xl text-red-600">{product?.brand}</Text>
      <View>
        <View>
          <View className="flex-row justify-between">
            <Text className="flex font-semibold text-base text-cyan-900">
              Only {product.quantity} ,{product.name} Left
            </Text>
            <TouchableOpacity
              className="size-11 rounded-full border-2 border-cyan-900 items-center justify-center"
              onPress={toggleLoved}
              disabled={lovedLoading}
            >
              {lovedLoading ? (
                <ActivityIndicator size="small" color="#164e63" />
              ) : (
                <Icons
                  name={isLoved ? 'cards-heart' : 'cards-heart-outline'}
                  size={25}
                  color={'#164e63'}
                />
              )}
            </TouchableOpacity>
          </View>

          <Text className="font-semibold text-lg">Description</Text>
          <Text className="text-sm opacity-75">{product?.description}</Text>
        </View>

        <View className="flex-row items-center justify-between mt-5">
          <View className="flex-row">
            <View>
              <Text className="opacity-70">PRICE</Text>
              <View className="flex-row items-end">
                <Text className="font-semibold text-2xl">
                  R{product?.price.toLocaleString()}
                </Text>
                <Text className="ml-2 line-through text-lg text-slate-700">
                  {product?.oldPrice?.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            className="bg-sky-800 h-[60] w-44 items-center flex-row relative rounded-full justify-center"
            onPress={addMyCart}
            disabled={cartLoading}
          >
            <Text className="font-semibold right-8 text-white">
              {cartLoading ? 'Adding...' : alreadyInCart ? 'IN CART' : 'ADD CART'}
            </Text>
            <View className="size-12 right-4 rounded-full bg-white items-center justify-center absolute">
              <Icons
                name={alreadyInCart ? 'cart-check' : 'cart-plus'}
                size={25}
                color={'#075985'}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ProductDescription;