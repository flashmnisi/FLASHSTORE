import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import axios from 'axios';
import {categoryParams} from '../../type/Params';
import { CategoryState } from '../types';

const baseURL = 'http://localhost:8000';

export const fetchCategories = createAsyncThunk<
  categoryParams[],
  void,
  {rejectValue: string}
>('category/fetchCategories', async (_, {rejectWithValue}) => {
  try {
    const response = await axios.get(`${baseURL}/categories/getCategories`);
    if (!Array.isArray(response.data.respond)) {
      return rejectWithValue('Invalid response format');
    }
    return response.data.respond as categoryParams[];
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to fetch categories',
    );
  }
});

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCategories.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCategories.fulfilled,
        (state, action: PayloadAction<categoryParams[]>) => {
          state.loading = false;
          state.categories = action.payload;
        },
      )
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default categorySlice.reducer;
