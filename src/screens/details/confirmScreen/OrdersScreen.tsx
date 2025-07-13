import React, { useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppDispatch, RootState } from '../../../redux/store';
import { fetchUserOrders } from '../../../redux/slices/OrderSlice';
import { RootStackParamList } from '../../../Navigations/RootNav';
import { useNavigation } from '@react-navigation/native';
import { Order } from '../../../redux/types';

type Props = { item: Order };

const OrdersScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();
  const orders = useSelector((state: RootState) => state.order?.orders || []);
  const loading = useSelector((state: RootState) => state.order?.fetchUserOrders.loading || false);
  const error = useSelector((state: RootState) => state.order?.fetchUserOrders.error || null);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

const renderOrderItem = ({ item }: Props) => {
  console.log('Order item:', { id: item._id, isPaid: item.isPaid, isDelivered: item.isDelivered });
  const status = item.isDelivered ? 'Delivered' : item.isPaid ? 'Paid' : 'Pending';
  const shippingAddress = item.shippingAddress || {
    name: 'N/A',
    city: 'N/A',
  };
  return (
    <View className="mx-5 p-10 bg-white border-gray-300 rounded-lg mb-10">
      <Text className="text-lg font-bold">Order #{item._id}</Text>
      <Text className="text-base">Total: R{item.totalPrice}</Text>
      <Text className={`text-sm ${
              item.isPaid ? 'text-green-600' : 'text-red-600'
            }`}>Status: {status}</Text>
      <Text className="text-base">
        Date: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
      </Text>
      <Text className="text-base">
        Shipping: {shippingAddress.name}, {shippingAddress.city}
      </Text>
    </View>
  );
};

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (error) {
    return <Text className="text-center text-red-500">{error}</Text>;
  }

  return (
    <View className="flex-1 mt-14">
      <View className="flex-row justify-between m-3 p-2">
        <Text className="text-red-700 font-semibold">MY ORDERS</Text>
        <TouchableOpacity onPress={() => navigation.navigate('TabStack', { screen: 'Home' })}>
          <Text className="text-blue-500">HOME</Text>
        </TouchableOpacity>
      </View>
      {orders.length === 0 ? (
        <Text className="text-center">No orders placed yet.</Text>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item: Order) => item._id}
        />
      )}
    </View>
  );
};

export default OrdersScreen;