import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import axios from 'axios';
import {ProductParams} from '../../type/Params';
import {RootState} from '../store';
import { ProductsState } from '../types';

const initialState: ProductsState = {
  products: [],
  productDetails: null,
  loading: false,
  error: null,
};

const BASE_URL = 'http://localhost:8000';

export const fetchProducts = createAsyncThunk<
  ProductParams[],
  void,
  {rejectValue: string}
>('products/fetchProducts', async (_, {rejectWithValue}) => {
  try {
    const res = await axios.get(`${BASE_URL}/products/getProducts`);
    return res.data.respond as ProductParams[];
  } catch (err: any) {
    const message = err.response?.data?.error || `Error: ${err.message}`;
    return rejectWithValue(message);
  }
});

export const fetchProductById = createAsyncThunk<
  ProductParams,
  string,
  {rejectValue: string}
>('products/fetchProductById', async (id, {rejectWithValue}) => {
  try {
    const res = await axios.get(`${BASE_URL}/products/${id}`);
    return res.data.respond as ProductParams;
  } catch (err: any) {
    const message = err.response?.data?.error || `Error: ${err.message}`;
    return rejectWithValue(message);
  }
});

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    setSelectedProduct(state, action: PayloadAction<ProductParams>) {
      state.productDetails = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProducts.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch products';
      })

      .addCase(fetchProductById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetails = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch product';
      });
  },
});

export const {clearError, setSelectedProduct} = productsSlice.actions;

export const selectProductDetails = (state: RootState) =>
  state.products?.productDetails;
export const selectProducts = (state: RootState) => state.products?.products;
export const selectProductsLoading = (state: RootState) =>
  state.products?.loading;
export const selectProductsError = (state: RootState) => state.products?.error;

export default productsSlice.reducer;
