import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LovedState } from '../types';

const initialState: LovedState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchLovedItems = createAsyncThunk<
  string[],
  void,
  { rejectValue: string }
>('loved/fetchLovedItems', async (_, { rejectWithValue }) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      return rejectWithValue('No authentication token found');
    }
    const response = await axios.get('http://localhost:8000/user/loved', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.lovedItems as string[];
  } catch (error: any) {
    console.error('Fetch loved items error:', error.response?.data, error.message);
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch loved items');
  }
});

export const addToLoved = createAsyncThunk<string, string, { rejectValue: string }>(
  'loved/addToLoved',
  async (productId: string, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }
      const response = await axios.post(
        'http://localhost:8000/user/loved',
        { productId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      console.log('addToLoved response:', response.data);
      return response.data.productId as string;
    } catch (error: any) {
      console.error('Add to loved error:', error.response?.data, error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to add to loved items');
    }
  },
);

export const removeFromLoved = createAsyncThunk<string, string, { rejectValue: string }>(
  'loved/removeFromLoved',
  async (productId: string, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }
      const response = await axios.post(
        'http://localhost:8000/user/remove',
        { productId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      console.log('removeFromLoved response:', response.data);
      return response.data.productId as string;
    } catch (error: any) {
      console.error('Remove from loved error:', error.response?.data, error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from loved items');
    }
  },
);

export const clearLovedItems = createAsyncThunk<void, void, { rejectValue: string }>(
  'loved/clearLovedItems',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }
      await axios.delete('http://localhost:8000/user/loved/clear', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('clearLovedItems successful');
      return;
    } catch (error: any) {
      console.error('Clear loved items error:', error.response?.data, error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to clear loved items');
    }
  },
);

const lovedSlice = createSlice({
  name: 'loved',
  initialState,
  reducers: {
    clearLovedItemsLocally: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLovedItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLovedItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        console.log('fetchLovedItems fulfilled:', action.payload);
      })
      .addCase(fetchLovedItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addToLoved.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToLoved.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        console.log('addToLoved fulfilled:', action.payload);
      })
      .addCase(addToLoved.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(removeFromLoved.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromLoved.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((id) => id !== action.payload);
        console.log('removeFromLoved fulfilled:', action.payload);
      })
      .addCase(removeFromLoved.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(clearLovedItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearLovedItems.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
      })
      .addCase(clearLovedItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearLovedItemsLocally } = lovedSlice.actions;
export default lovedSlice.reducer;