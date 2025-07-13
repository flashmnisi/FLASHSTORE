import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Order, OrderState } from '../types';

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
  createOrder: {
    loading: false,
    error: null,
    success: false,
  },
  fetchUserOrders: {
    loading: false,
    error: null,
  },
};

export const createOrder = createAsyncThunk<
  Order,
  {
    orderItems: { product: string; qty: number; price: number }[];
    shippingAddress: {
      name: string;
      surname?: string;
      phone: string;
      city: string;
      houseNo: string;
      streetName: string;
      postalCode: string;
      country: string;
    };
    paymentMethod: string;
    itemsPrice: number;
    shippingPrice: number;
    totalPrice: number;
    deliveryOption: string;
    paymentData?: any;
  },
  { rejectValue: string }
>(
  'order/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return rejectWithValue('No authentication token found');
      const response = await axios.post(
        'http://localhost:8000/user/order',
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data.order as Order;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.join(', ') ||
        'Failed to create order';
      return rejectWithValue(errorMessage);
    }
  },
);

export const fetchUserOrders = createAsyncThunk<
  Order[],
  void,
  { rejectValue: string }
>(
  'order/fetchUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return rejectWithValue('No authentication token found');
      const response = await axios.get('http://localhost:8000/user/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data.orders as Order[];
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.join(', ') ||
        'Failed to fetch orders';
      return rejectWithValue(errorMessage);
    }
  },
);

export const clearUserOrders = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>(
  'order/clearUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return rejectWithValue('No authentication token found');
      await axios.delete('http://localhost:8000/user/orders/clear', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.join(', ') ||
        'Failed to clear orders';
      return rejectWithValue(errorMessage);
    }
  },
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearCreateOrder: (state) => {
      state.createOrder = {
        loading: false,
        error: null,
        success: false,
        order: undefined,
      };
    },
    clearOrders: (state) => {
      state.orders = [];
      state.loading = false;
      state.error = null;
      state.fetchUserOrders = {
        loading: false,
        error: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.createOrder.loading = true;
        state.createOrder.error = null;
        state.createOrder.success = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.createOrder.loading = false;
        state.createOrder.success = true;
        state.createOrder.order = action.payload;
        state.orders.push(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.createOrder.loading = false;
        state.createOrder.error = action.payload as string;
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.fetchUserOrders.loading = true;
        state.fetchUserOrders.error = null;
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.fetchUserOrders.loading = false;
        state.orders = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.fetchUserOrders.loading = false;
        state.fetchUserOrders.error = action.payload as string;
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(clearUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearUserOrders.fulfilled, (state) => {
        state.loading = false;
        state.orders = [];
        state.fetchUserOrders = {
          loading: false,
          error: null,
        };
      })
      .addCase(clearUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.fetchUserOrders.error = action.payload as string;
      });
  },
});

export const { clearCreateOrder, clearOrders } = orderSlice.actions;
export default orderSlice.reducer;