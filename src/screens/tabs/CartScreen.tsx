import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {RootStackParamList} from '../../Navigations/RootNav';
import {RootState, AppDispatch} from '../../redux/Store';
import {useSelector, useDispatch} from 'react-redux';
import CartList from '../../Items/CartItems/CartList';
import {
  selectCartItems,
  selectSubtotal,
  selectDeliveryPrice,
  selectTotal,
  selectTotalItemCount,
  selectCartError,
  selectCartLoading,
} from '../../redux/slices/CartSlice';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CartScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<NavigationProp>();
  const cartItems = useSelector(selectCartItems);
  const checkoutItems = useSelector(selectTotalItemCount);
  const subtotal = useSelector(selectSubtotal);
  const deliveryFee = useSelector(selectDeliveryPrice);
  const total = useSelector(selectTotal);
  const user = useSelector((state: RootState) => state.auth?.user);
  const error = useSelector(selectCartError);
  const loading = useSelector(selectCartLoading);

  React.useEffect(() => {
    if (error) {
      Alert.alert('Cart Error', error);
    }
  }, [error]);

  return (
    <View className="bg-white flex-1 gap-2">
      <Image
        source={{uri: 'http://localhost:8000/assets/checkout2.webp'}}
        className="w-full h-[160px] object-contain"
      />
      {loading && (
        <Text className="text-center text-lg text-gray-700">
          Loading cart...
        </Text>
      )}
      {cartItems.length > 0 ? (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={item => item.product._id}
            renderItem={({item}) => <CartList CartItem={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{alignItems: 'center', paddingBottom: 20}}
          />
        </>
      ) : (
        <View className="m-2 bg-white rounded-lg p-4 shadow-md">
          <Text className="text-xl font-semibold p-2 text-orange-600">
            YOUR CART IS CURRENTLY EMPTY
          </Text>
          <Image
            source={{uri: 'http://localhost:8000/assets/emptyCart.webp'}}
            style={{resizeMode: 'contain'}}
            className="h-[200px] w-full"
          />
          <Text className="text-xl font-semibold text-orange-600 mt-2">
            BROWSE PRODUCTS TO GET STARTED
          </Text>
        </View>
      )}
      <View className="rounded-2xl bg-cyan-800 mx-2 p-4 mt-2 mb-4 shadow-md">
        <Text className="font-bold text-xl text-red-500 mb-4">
          Checkout Summary
        </Text>

        <View className="gap-2">
          <View className="flex-row justify-between">
            <Text className="text-white font-medium">Subtotal</Text>
            <Text className="text-white font-medium">
              R {subtotal.toLocaleString()}
            </Text>
          </View>

          <View className="flex-row justify-between">
            <Text className="text-white font-medium">Delivery</Text>
            <Text className="font-medium text-red-400">
             R 0
            </Text>
          </View>

          <View className="flex-row justify-between">
            <Text className="text-white font-medium">Items</Text>
            <Text className="text-white font-medium">
              {checkoutItems} item(s)
            </Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between mt-6">
          <View>
            <Text className="text-xl text-red-500 font-bold">Total</Text>
            <Text className="text-3xl text-white font-bold">
              R {total.toLocaleString()}
            </Text>
          </View>
          <View className="absolute bottom-2 right-2"> 
            {cartItems.length === 0 ? (
              <View className="bg-white p-4 rounded-lg shadow">
                <Text className="text-lg font-bold text-cyan-800">
                  Cart is empty
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                className="flex-row bg-white h-[55px] w-[140px] rounded-full items-center justify-center shadow"
                onPress={() => {
                  navigation.navigate('Confirm');
                }}>
                <Text className="font-bold text-cyan-800 mr-3">Checkout</Text>
                <View className="size-[40px] rounded-full bg-cyan-800 items-center justify-center">
                  <Icons name="arrow-right" size={22} color="#fff" />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default CartScreen;
