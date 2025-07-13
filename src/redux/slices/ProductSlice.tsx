import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import axios from 'axios';
import {ProductParams} from '../../type/Params';
import { fetchProducts } from './ProductsSlice';
import { ProductState } from '../types';

const baseURL = 'http://localhost:8000';

export const fetchProduct = createAsyncThunk<
  ProductParams[],
  void,
  {rejectValue: string}
>('product/fetchProducts', async (_, {rejectWithValue}) => {
  try {
    const response = await axios.get(`${baseURL}/products`);
    if (!Array.isArray(response.data.respond)) {
      return rejectWithValue('Invalid response format');
    }
    return response.data.respond as ProductParams[];
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to fetch products',
    );
  }
});


const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchProducts.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<ProductParams[]>) => {
          state.loading = false;
          state.products = action.payload;
        },
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default productSlice.reducer;
