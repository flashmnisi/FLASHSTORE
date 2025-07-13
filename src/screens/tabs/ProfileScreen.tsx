import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Switch,
  SafeAreaView,
  Image,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  logout,
  deleteAccount,
  clearAddresses,
} from '../../redux/slices/AuthSlice';
import { resetCart, selectCartItems } from '../../redux/slices/CartSlice';
import {
  clearCreateOrder,
  clearOrders,
  fetchUserOrders,
  clearUserOrders,
} from '../../redux/slices/OrderSlice';
import {
  clearLovedItems,
  fetchLovedItems,
  clearLovedItemsLocally,
} from '../../redux/slices/LovedSlice';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Order, RootState } from '../../redux/types';
import { AppDispatch } from '../../redux/store';
import { RootStackParamList } from '../../Navigations/RootNav';
import { changeCount, updateCartItem } from '../../redux/slices/CartSlice';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Address } from '../../type/Params';
import { FlashList } from '@shopify/flash-list';

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'AuthStack'
>;

const ProfileScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const {
    user,
    address,
    loading: authLoading,
    error: authError,
  } = useSelector((state: RootState) => state.auth);
  const {
    orders,
    fetchUserOrders: { loading: ordersLoading, error: ordersError },
  } = useSelector((state: RootState) => ({
    orders: state.order?.orders ?? [],
    fetchUserOrders: state.order?.fetchUserOrders ?? {
      loading: false,
      error: null,
    },
  }));
  const {
    items: lovedItems,
    loading: lovedLoading,
    error: lovedError,
  } = useSelector((state: RootState) => ({
    items: state.loved?.items ?? [],
    loading: state.loved?.loading ?? false,
    error: state.loved?.error ?? null,
  }));
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const cartItems = useSelector(selectCartItems);

  useEffect(() => {
    if (user?.token) {
      console.log('Fetching orders and loved items for user:', user._id);
      dispatch(fetchUserOrders());
      dispatch(fetchLovedItems());
    }
  }, [dispatch, user?.token]);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            console.log('Starting logout, user:', !!user, 'token:', !!user?.token);
            // Remove token first
            await AsyncStorage.removeItem('userToken');
            console.log('Token removed from AsyncStorage');

            // Clear backend data if authenticated
            if (user?.token) {
              console.log('Clearing backend loved items and orders');
              await Promise.all([
                dispatch(clearLovedItems())
                  .unwrap()
                  .catch(err => {
                    console.warn('clearLovedItems failed:', err?.message);
                    return null; // Continue despite failure
                  }),
                dispatch(clearUserOrders())
                  .unwrap()
                  .catch(err => {
                    console.warn('clearUserOrders failed:', err?.message);
                    return null; 
                  }),
              ]);
            } else {
              console.log('No user token, clearing locally');
              dispatch(clearLovedItemsLocally());
              dispatch(clearOrders());
            }

            console.log('Resetting Redux state');
            dispatch(logout());
            dispatch(resetCart());
            dispatch(clearAddresses());
            dispatch(clearCreateOrder());
            dispatch(clearOrders());

          } catch (error: any) {
            console.error('Logout error:', error?.message);
            Alert.alert('Error', error?.message || 'Failed to log out');
          }
        },
      },
    ]);
  };

  const handleRemoveFromCart = (productId: string, count: number) => {
    Alert.alert('Remove Item', 'Do you want to remove this item from cart?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          console.log(`Removing ${productId} from cart, count: ${count}`);
          if (user) {
            dispatch(updateCartItem({ productId, count: 0 }));
          } else {
            dispatch(changeCount({ productId, amount: -count }));
          }
        },
      },
    ]);
  };

  const handleChangeCount = (
    productId: string,
    current: number,
    amount: number,
  ) => {
    const newCount = current + amount;
    if (newCount < 1) return;
    console.log(`Changing count for ${productId}, newCount: ${newCount}`);
    if (user) {
      dispatch(updateCartItem({ productId, count: newCount }));
    } else {
      dispatch(changeCount({ productId, amount }));
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to permanently delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Starting delete account');
              await Promise.all([
                dispatch(deleteAccount()).unwrap(),
                dispatch(clearLovedItems()).unwrap(),
                dispatch(clearUserOrders()).unwrap(),
              ]);
              dispatch(logout());
              dispatch(resetCart());
              dispatch(clearAddresses());
              dispatch(clearCreateOrder());
              dispatch(clearOrders());
              navigation.reset({
                index: 0,
                routes: [{ name: 'AuthStack', params: { screen: 'Login' } }],
              });
              Alert.alert('Success', 'Your account has been deleted.');
            } catch (error: any) {
              console.error('Delete account error:', error?.message);
              Alert.alert('Error', error?.message || 'Failed to delete account');
            }
          },
        },
      ],
    );
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const renderUserInfo = () => (
    <View
      className={`bg-white rounded-lg p-4 mb-4 shadow-md ${
        isDarkTheme ? 'bg-gray-800' : 'bg-white'
      }`}>
      <View className="flex-row justify-between items-center mb-2">
        <Text
          className={`text-lg font-bold ${
            isDarkTheme ? 'text-white' : 'text-black'
          }`}>
          My Profile
        </Text>
        {cartItems.length > 0 && (
          <View className="bg-red-600 px-3 py-1 rounded-full">
            <Text className="text-white font-bold text-sm">
              {cartItems.length} in Cart
            </Text>
          </View>
        )}
      </View>

      {authLoading ? (
        <ActivityIndicator
          size="small"
          color={isDarkTheme ? '#fff' : '#0000ff'}
        />
      ) : authError ? (
        <Text
          className={`text-red-500 text-center ${
            isDarkTheme ? 'text-red-400' : 'text-red-500'
          }`}>
          {authError}
        </Text>
      ) : user ? (
        <>
          <Text
            className={`text-base mb-1 ${
              isDarkTheme ? 'text-gray-300' : 'text-black'
            }`}>
            Name: {user.name ?? 'N/A'}
          </Text>
          <Text className={`text-base mb-1 ${isDarkTheme ? 'text-gray-300' : 'text-black'}`}>
            Email: {user.email ?? 'N/A'}
          </Text>
          <TouchableOpacity
            className="mt-2 bg-blue-500 rounded-lg p-2"
            onPress={() => navigation.navigate('EditProfile')}>
            <Text className="text-white text-center">Edit Profile</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text
          className={`text-gray-500 text-center ${
            isDarkTheme ? 'text-gray-400' : 'text-gray-500'
          }`}>
          Not logged in
        </Text>
      )}
    </View>
  );

  const renderOrderItem = ({ item }: { item: Order }) => {
    const paymentStatus = item.isPaid ? 'Paid' : 'Not Paid';
    const deliveryStatus = item.isDelivered ? 'Delivered' : 'Not Delivered';

    return (
      <TouchableOpacity
        className={`p-2 border-b ${
          isDarkTheme ? 'border-gray-600' : 'border-gray-200'
        }`}
        onPress={() => navigation.navigate('Order', { id: item._id })}>
        <Text
          className={`text-base font-medium ${
            isDarkTheme ? 'text-white' : 'text-black'
          }`}>
          Order #{item._id.slice(-6)}....
        </Text>
        <Text
          className={`text-sm ${
            isDarkTheme ? 'text-gray-400' : 'text-gray-600'
          }`}>
          Payment:{' '}
          <Text
            className={`text-sm ${
              item.isPaid ? 'text-green-600' : 'text-red-600'
            }`}>
            {paymentStatus}
          </Text>
        </Text>
        <Text
          className={`text-sm ${
            isDarkTheme ? 'text-gray-400' : 'text-gray-600'
          }`}>
          Delivery:{' '}
          <Text
            className={`text-sm ${
              item.isDelivered ? 'text-green-600' : 'text-yellow-600'
            }`}>
            {deliveryStatus}
          </Text>
        </Text>
        <Text
          className={`text-sm ${
            isDarkTheme ? 'text-gray-400' : 'text-gray-600'
          }`}>
          Total: R{item.totalPrice?.toFixed(2) ?? '0.00'}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderOrders = () => (
    <View
      className={`bg-white rounded-lg p-4 mb-4 shadow-md ${
        isDarkTheme ? 'bg-gray-800' : 'bg-white'
      }`}>
      <View className="flex-row justify-between items-center mb-2">
        <Text
          className={`text-lg font-bold ${
            isDarkTheme ? 'text-white' : 'text-black'
          }`}>
          My Orders
        </Text>
        <View className="flex-row gap-2">
          <TouchableOpacity onPress={() => dispatch(fetchUserOrders())}>
            <Text className="text-blue-500 text-sm">Refresh</Text>
          </TouchableOpacity>
        </View>
      </View>
      {ordersLoading ? (
        <ActivityIndicator
          size="small"
          color={isDarkTheme ? '#fff' : '#0000ff'}
        />
      ) : ordersError ? (
        <Text
          className={`text-red-500 text-center ${
            isDarkTheme ? 'text-red-400' : 'text-red-500'
          }`}>
          {ordersError}
        </Text>
      ) : orders.length === 0 ? (
        <Text
          className={`text-gray-500 text-center ${
            isDarkTheme ? 'text-gray-400' : 'text-gray-500'
          }`}>
          No orders found
        </Text>
      ) : (
        <FlashList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={item => item._id}
          scrollEnabled={false}
          estimatedItemSize={60}
        />
      )}
      <TouchableOpacity
        onPress={() =>
          Alert.alert(
            'Clear All Orders',
            'Are you sure you want to clear all orders? This action cannot be undone.',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Clear',
                style: 'destructive',
                onPress: async () => {
                  try {
                    await dispatch(clearUserOrders()).unwrap();
                    Alert.alert('Success', 'Orders cleared!');
                  } catch (error: any) {
                    console.error('Clear orders error:', error?.message);
                    Alert.alert('Error', error?.message || 'Failed to clear orders');
                  }
                },
              },
            ],
          )
        }
        disabled={orders.length === 0 || ordersLoading}>
        <Text
          className={`text-red-500 text-sm ${
            orders.length === 0 || ordersLoading ? 'opacity-50' : ''
          }`}>
          Clear All
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderLovedItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      className={`p-2 border-b ${
        isDarkTheme ? 'border-gray-600' : 'border-gray-200'
      }`}
      onPress={() => navigation.navigate('DetailScreen', { id: item })}>
      <Text
        className={`text-base font-medium ${
          isDarkTheme ? 'text-white' : 'text-black'
        }`}>
        Product #{item.slice(-6)}
      </Text>
    </TouchableOpacity>
  );

  const renderLovedItems = () => (
    <View
      className={`bg-white rounded-lg p-4 mb-4 shadow-md ${
        isDarkTheme ? 'bg-gray-800' : 'bg-white'
      }`}>
      <View className="flex-row justify-between items-center mb-2">
        <Text
          className={`text-lg font-bold mb-2 ${
            isDarkTheme ? 'text-white' : 'text-black'
          }`}>
          Loved Items
        </Text>
        <View className="flex-row gap-2">
          <TouchableOpacity onPress={() => dispatch(fetchLovedItems())}>
            <Text className="text-blue-500 text-sm">Refresh</Text>
          </TouchableOpacity>
        </View>
      </View>
      {lovedLoading ? (
        <ActivityIndicator
          size="small"
          color={isDarkTheme ? '#fff' : '#0000ff'}
        />
      ) : lovedError ? (
        <Text
          className={`text-red-500 text-center ${
            isDarkTheme ? 'text-red-400' : 'text-red-500'
          }`}>
          {lovedError}
        </Text>
      ) : lovedItems.length === 0 ? (
        <Text
          className={`text-gray-500 text-center ${
            isDarkTheme ? 'text-gray-400' : 'text-gray-500'
          }`}>
          No loved items
        </Text>
      ) : (
        <FlashList
          data={lovedItems}
          renderItem={renderLovedItem}
          keyExtractor={item => item}
          scrollEnabled={false}
          estimatedItemSize={40}
        />
      )}
      <TouchableOpacity
        onPress={() =>
          Alert.alert(
            'Clear Loved Items',
            'Are you sure you want to clear all loved items?',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Clear',
                style: 'destructive',
                onPress: async () => {
                  try {
                    await dispatch(clearLovedItems()).unwrap();
                    Alert.alert('Success', 'Loved items cleared!');
                  } catch (error: any) {
                    console.error('Clear loved items error:', error?.message);
                    Alert.alert('Error', error?.message || 'Failed to clear loved items');
                  }
                },
              },
            ],
          )
        }
        disabled={lovedItems.length === 0 || lovedLoading}>
        <Text
          className={`text-red-500 text-sm ${
            lovedItems.length === 0 || lovedLoading ? 'opacity-50' : ''
          }`}>
          Clear All
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderAddressItem = ({ item }: { item: Address }) => (
    <View
      className={`p-2 border-b ${
        isDarkTheme ? 'border-gray-600' : 'border-gray-200'
      }`}>
      <Text
        className={`text-base font-medium ${
          isDarkTheme ? 'text-white' : 'text-black'
        }`}>
        {item.name}
      </Text>
      <Text
        className={`text-sm ${
          isDarkTheme ? 'text-gray-400' : 'text-gray-600'
        }`}>
        {item.streetName}, {item.city}
      </Text>
    </View>
  );

  const renderAddresses = () => (
    <View
      className={`bg-white rounded-lg p-4 mb-4 shadow-md ${
        isDarkTheme ? 'bg-gray-800' : 'bg-white'
      }`}>
      <View className="flex-row justify-between items-center mb-2">
        <Text
          className={`text-lg font-bold ${
            isDarkTheme ? 'text-white' : 'text-black'
          }`}>
          Delivery Addresses
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddAddress')}>
          <Text className="text-blue-500 text-sm">Add New</Text>
        </TouchableOpacity>
      </View>
      {authLoading ? (
        <ActivityIndicator
          size="small"
          color={isDarkTheme ? '#fff' : '#0000ff'}
        />
      ) : authError ? (
        <Text
          className={`text-red-500 text-center ${
            isDarkTheme ? 'text-red-400' : 'text-red-500'
          }`}>
          {authError}
        </Text>
      ) : address.length === 0 ? (
        <Text
          className={`text-gray-500 text-center ${
            isDarkTheme ? 'text-gray-400' : 'text-gray-500'
          }`}>
          No addresses saved
        </Text>
      ) : (
        <FlashList
          data={address}
          renderItem={renderAddressItem}
          keyExtractor={item => `${item.name}-${item.streetName}-${item.city}`}
          scrollEnabled={false}
          estimatedItemSize={50}
        />
      )}
    </View>
  );

  const renderCartItems = () => (
    <View
      className={`bg-white rounded-lg p-4 mb-4 shadow-md ${
        isDarkTheme ? 'bg-gray-800' : 'bg-white'
      }`}>
      <View className="flex-row justify-between items-center mb-2">
        <Text
          className={`text-lg font-bold ${
            isDarkTheme ? 'text-white' : 'text-black'
          }`}>
          My Cart
        </Text>
        {cartItems.length > 0 && (
          <TouchableOpacity onPress={() => navigation.navigate('Confirm')}>
            <Text className="text-blue-600 font-semibold">Checkout</Text>
          </TouchableOpacity>
        )}
      </View>
      {cartItems.length === 0 ? (
        <Text
          className={`text-gray-500 text-center ${
            isDarkTheme ? 'text-gray-400' : 'text-gray-500'
          }`}>
          Your cart is empty
        </Text>
      ) : (
        cartItems.map((item, idx) => (
          <View
            key={idx}
            className={`flex-row mb-3 border-b pb-3 ${
              isDarkTheme ? 'border-gray-600' : 'border-gray-200'
            }`}>
            <Image
              source={{
                uri:
                  item.product.images?.[0] || 'https://via.placeholder.com/100',
              }}
              className="w-[80px] h-[80px] rounded-lg mr-3"
              resizeMode="contain"
            />
            <View className="flex-1 justify-between">
              <View>
                <Text
                  className={`text-base font-bold ${
                    isDarkTheme ? 'text-white' : 'text-black'
                  }`}>
                  {item.product.name}
                </Text>
                <Text
                  className={`text-sm ${
                    isDarkTheme ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                  {item.product.brand}
                </Text>
                <Text
                  className={`text-cyan-700 font-semibold ${
                    isDarkTheme ? 'text-cyan-500' : 'text-cyan-700'
                  }`}>
                  R{(item.product.price * item.count).toFixed(2)}
                </Text>
              </View>
              <View className="flex-row items-center justify-between mt-2">
                <View className="flex-row items-center gap-2">
                  <TouchableOpacity
                    onPress={() =>
                      handleChangeCount(item.product._id, item.count, -1)
                    }
                    disabled={item.count <= 1}>
                    <Icons
                      name="minus-circle"
                      size={30}
                      color={item.count <= 1 ? '#d3d3d3' : '#075985'}
                    />
                  </TouchableOpacity>
                  <Text
                    className={`font-semibold text-base mx-2 ${
                      isDarkTheme ? 'text-white' : 'text-black'
                    }`}>
                    {item.count}
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      handleChangeCount(item.product._id, item.count, 1)
                    }>
                    <Icons name="plus-circle" size={30} color="#075985" />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    handleRemoveFromCart(item.product._id, item.count)
                  }>
                  <Icons name="trash-can-outline" size={28} color="#ff0000" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))
      )}
    </View>
  );

  const renderSettings = () => (
    <View
      className={`bg-white rounded-lg p-4 mb-4 shadow-md ${
        isDarkTheme ? 'bg-gray-800' : 'bg-white'
      }`}>
      <Text
        className={`text-lg font-bold mb-2 ${
          isDarkTheme ? 'text-white' : 'text-black'
        }`}>
        Settings
      </Text>
      <View className="flex-row justify-between items-center mb-2">
        <Text
          className={`text-base ${
            isDarkTheme ? 'text-gray-300' : 'text-black'
          }`}>
          Enable Notifications
        </Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
        />
      </View>
      <View className="flex-row justify-between items-center mb-2">
        <Text
          className={`text-base ${
            isDarkTheme ? 'text-gray-300' : 'text-black'
          }`}>
          Dark Theme
        </Text>
        <Switch value={isDarkTheme} onValueChange={toggleTheme} />
      </View>
    </View>
  );

  const renderLogout = () => (
    <View className="flex-row justify-between shadow-md gap-4">
      <TouchableOpacity
        className="rounded-lg p-4 mb-4 bg-rose-500 flex-1"
        onPress={handleLogout}>
        <Text className="text-white text-center font-bold">Log Out</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-red-700 rounded-lg p-4 mb-4"
        onPress={handleDeleteAccount}>
        <Text className="text-white text-center font-bold">Delete Account</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView
      className={`flex-1 p-4 ${isDarkTheme ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <SafeAreaView>
        {renderUserInfo()}
        {renderCartItems()}
        {renderOrders()}
        {renderLovedItems()}
        {renderAddresses()}
        {renderSettings()}
        {renderLogout()}
      </SafeAreaView>
    </ScrollView>
  );
};

export default ProfileScreen;