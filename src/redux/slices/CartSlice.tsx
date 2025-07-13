import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  createSelector,
} from '@reduxjs/toolkit';
import axios from 'axios';
import {RootState, CartState, CartItem} from '../types';

axios.defaults.baseURL = 'http://localhost:8000';

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
  deliveryFee: 350,
  freeDeliveryFrom: 6000,
  deliveryOption: null,
};

const deliveryOptions = {
  standard: {fee: 350, desc: 'Delivery within 3-5 business days R350'},
  express: {fee: 400, desc: 'Get it by tomorrow for R50 extra'},
  sameDay: {fee: 450, desc: 'Get it today by 9pm for R100 extra'},
};

export const fetchCart = createAsyncThunk<
  CartItem[],
  void,
  {state: RootState; rejectValue: string}
>('cart/fetchCart', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth?.user?.token;
    if (!token) {
      return thunkAPI.rejectWithValue('No authentication token found');
    }
    console.log('fetchCart:', {token, url: `${axios.defaults.baseURL}/cart`});
    const res = await axios.get('/cart', {
      headers: {Authorization: `Bearer ${token}`},
    });
    console.log('fetchCart response:', res.data);
    return res.data.items || res.data;
  } catch (err: any) {
    console.error('fetchCart error:', err.response?.data, err);
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || 'Fetch cart failed',
    );
  }
});

export const addToCart = createAsyncThunk<
  CartItem,
  {productId: string; count: number},
  {state: RootState; rejectValue: string}
>('cart/addToCart', async ({productId, count}, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth?.user?.token;
    if (!token) {
      return thunkAPI.rejectWithValue('No authentication token found');
    }
    console.log('addToCart payload:', {
      productId,
      count,
      token,
      url: `${axios.defaults.baseURL}/cart`,
    });
    const res = await axios.post(
      '/cart',
      {productId, count},
      {headers: {Authorization: `Bearer ${token}`}},
    );
    console.log('addToCart response:', res.data);
    if (!res.data.item) {
      return thunkAPI.rejectWithValue('Invalid response from server');
    }
    return res.data.item;
  } catch (err: any) {
    const errorMessage =
      err.response?.data?.message || err.message || 'Add to cart failed';
    console.error('addToCart error:', {
      message: errorMessage,
      response: err.response?.data,
      status: err.response?.status,
    });
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const updateCartItem = createAsyncThunk<
  CartItem,
  {productId: string; count: number},
  {state: RootState; rejectValue: string}
>('cart/updateCartItem', async ({productId, count}, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth?.user?.token;
    if (!token) {
      return thunkAPI.rejectWithValue('No authentication token found');
    }
    console.log('updateCartItem payload:', {
      productId,
      count,
      token,
      url: `${axios.defaults.baseURL}/cart`,
    });
    const res = await axios.put(
      '/cart',
      {productId, count},
      {headers: {Authorization: `Bearer ${token}`}},
    );
    console.log('updateCartItem response:', res.data);
    if (!res.data.item) {
      return thunkAPI.rejectWithValue('Invalid response from server');
    }
    return res.data.item;
  } catch (err: any) {
    console.error('updateCartItem error:', {
      message: err.response?.data?.message || err.message,
      response: err.response?.data,
      status: err.response?.status,
    });
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || 'Update cart item failed',
    );
  }
});

export const removeFromCart = createAsyncThunk<
  string,
  string,
  {state: RootState; rejectValue: string}
>('cart/removeFromCart', async (productId, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth?.user?.token;
    if (!token) {
      return thunkAPI.rejectWithValue('No authentication token found');
    }
    console.log('removeFromCart:', {
      productId,
      token,
      url: `${axios.defaults.baseURL}/cart/${productId}`,
    });
    await axios.delete(`/cart/${productId}`, {
      headers: {Authorization: `Bearer ${token}`},
    });
    return productId;
  } catch (err: any) {
    console.error('removeFromCart error:', err.response?.data, err);
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || 'Remove failed',
    );
  }
});

export const clearCart = createAsyncThunk<
  {success: boolean},
  void,
  {state: RootState; rejectValue: string}
>('cart/clearCart', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth?.user?.token;
    if (!token) {
      return thunkAPI.rejectWithValue('No authentication token found');
    }
    await axios.delete('/cart', {
      headers: {Authorization: `Bearer ${token}`},
    });
    return {success: true};
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || 'Clear cart failed',
    );
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    removeFromCartLocally: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        item => item.product._id !== action.payload,
      );
    },
    updateCartItemLocally: (
      state,
      action: PayloadAction<{id: string; count: number}>,
    ) => {
      const item = state.items.find(i => i.product._id === action.payload.id);
      if (item) {
        item.count = action.payload.count;
      }
    },
    setDeliveryOption: (state, action: PayloadAction<string>) => {
      state.deliveryOption = action.payload;
      state.deliveryFee =
        deliveryOptions[action.payload as keyof typeof deliveryOptions]?.fee ??
        350;
    },
    resetCart: state => {
      state.items = [];
      state.deliveryFee = 350;
      state.deliveryOption = null;
      state.loading = false;
      state.error = null;
    },
    changeCount: (
      state,
      action: PayloadAction<{productId: string; amount: number}>,
    ) => {
      const item = state.items.find(
        i => i.product._id === action.payload.productId,
      );
      if (item) {
        item.count += action.payload.amount;
        if (item.count <= 0) {
          state.items = state.items.filter(
            i => i.product._id !== action.payload.productId,
          );
        }
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCart.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch cart';
      })
      .addCase(addToCart.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.product?._id) {
          const existing = state.items.find(
            item => item.product._id === action.payload.product._id,
          );
          if (existing) {
            existing.count = action.payload.count;
          } else {
            state.items.push(action.payload);
          }
        } else {
          state.error = 'Invalid payload received';
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add item';
      })
      .addCase(updateCartItem.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.product?._id) {
          const existing = state.items.find(
            item => item.product._id === action.payload.product._id,
          );
          if (existing) {
            existing.count = action.payload.count;
            if (existing.count <= 0) {
              state.items = state.items.filter(
                item => item.product._id !== action.payload.product._id,
              );
            }
          } else {
            state.items.push(action.payload);
          }
        } else {
          state.error = 'Invalid payload received';
        }
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update item';
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(
          item => item.product._id !== action.payload,
        );
      })
      .addCase(clearCart.fulfilled, state => {
        state.items = [];
      });
  },
});

export const {
  resetCart,
  changeCount,
  setDeliveryOption,
  removeFromCartLocally,
  updateCartItemLocally,
} = cartSlice.actions;

export const selectCartItems = (state: RootState) => state.cart?.items || [];
export const selectCartCount = (state: RootState) =>
  state.cart?.items?.reduce((total, item) => total + item.count, 0) || 0;
export const selectCartTotal = (state: RootState) =>
  state.cart?.items?.reduce(
    (total, item) => total + item.count * (item.product.price || 0),
    0,
  ) || 0;
export const selectCartLength = (state: RootState) =>
  state.cart?.items?.length || 0;
export const selectSubtotal = (state: RootState) =>
  state.cart?.items?.reduce(
    (sum, item) => sum + (item.product.price || 0) * item.count,
    0,
  ) || 0;
export const selectTotalItemCount = (state: RootState) =>
  state.cart?.items?.reduce((total, item) => total + item.count, 0) || 0;
export const selectCartError = (state: RootState): string | null =>
  state.cart?.error ?? null;
export const selectCartLoading = (state: RootState): boolean =>
  state.cart?.loading ?? false;

const cartSelector = (state: RootState) => state.cart;

export const selectDeliveryPrice = createSelector(
  cartSelector,
  selectSubtotal,
  (cart, subtotal) => {
    if (!cart?.deliveryOption) return cart?.deliveryFee || 350;
    const baseFee =
      deliveryOptions[cart.deliveryOption as keyof typeof deliveryOptions]
        ?.fee ?? 0;
    const result =
      subtotal >= cart.freeDeliveryFrom && cart.deliveryOption !== 'pickup'
        ? 0
        : baseFee;
    console.log('selectDeliveryPrice result:', {
      deliveryOption: cart?.deliveryOption,
      subtotal,
      result,
    });
    return result;
  },
);

export const selectTotal = createSelector(
  selectSubtotal,
  selectDeliveryPrice,
  (subtotal, delivery) => subtotal + delivery,
);

export default cartSlice.reducer;
