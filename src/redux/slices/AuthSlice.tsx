import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Address, AuthState, RootState, User} from '../types';
import {clearLovedItems} from './lovedSlice';
import {clearOrders} from './orderSlice';

const initialState: AuthState = {
  user: null,
  address: [],
  loading: false,
  error: null,
  addressStatus: 'idle',
  addressError: null,
  register: {loading: false, error: null, success: false},
  forgotPassword: {loading: false, error: null, success: false},
  verifyResetOtp: {loading: false, error: null, success: false},
  resetPassword: {loading: false, error: null, success: false},
  login: {loading: false, error: null, success: false},
};

export const register = createAsyncThunk(
  'auth/register',
  async (
    {name, email, password}: {name: string; email: string; password: string},
    {rejectWithValue},
  ) => {
    try {
      const response = await axios.post('http://localhost:8000/user/register', {
        name,
        email: email.trim().toLowerCase(),
        password,
      });
      console.log('Register response:', response.data);
      await AsyncStorage.setItem('userToken', response.data.token);
      return response.data as User;
    } catch (error: any) {
      console.error('Register error:', error.response?.data, error.message);
      return rejectWithValue(
        error.response?.data?.message || 'Failed to register',
      );
    }
  },
);

export const login = createAsyncThunk(
  'auth/login',
  async (
    {email, password}: {email: string; password: string},
    {rejectWithValue},
  ) => {
    try {
      const response = await axios.post('http://localhost:8000/user/login', {
        email: email.trim().toLowerCase(),
        password,
      });
      console.log('Login response:', response.data);
      await AsyncStorage.setItem('userToken', response.data.token);
      return response.data as User;
    } catch (error: any) {
      // console.error('Login error:', error.response?.data, error.message);
      return rejectWithValue(
        error.response?.data?.message || 'Failed to log in',
      );
    }
  },
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, {rejectWithValue}) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/user/forgotPassword',
        {email},
      );
      //console.log('ForgotPassword response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        'ForgotPassword error:',
        error.response?.data,
        error.message,
      );
      return rejectWithValue(
        error.response?.data?.message || 'Failed to send OTP',
      );
    }
  },
);

export const verifyResetOtp = createAsyncThunk(
  'auth/verifyResetOtp',
  async ({email, otp}: {email: string; otp: string}, {rejectWithValue}) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/user/verify-otp',
        {email, otp},
      );
      console.log('verifyResetOtp response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        'verifyResetOtp error:',
        error.response?.data,
        error.message,
      );
      return rejectWithValue(
        error.response?.data?.message || 'Failed to verify OTP',
      );
    }
  },
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (
    {email, newPassword}: {email: string; newPassword: string},
    {rejectWithValue},
  ) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/user/resetPassword',
        {
          email,
          newPassword,
        },
      );
      console.log('ResetPassword response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        'ResetPassword error:',
        error.response?.data,
        error.message,
      );
      return rejectWithValue(
        error.response?.data?.message || 'Failed to reset password',
      );
    }
  },
);

export const clearVerifyResetOtp = createAsyncThunk(
  'auth/clearVerifyResetOtp',
  async () => {
    console.log('Clearing verifyResetOtp state');
    return {};
  },
);
export const addAddress = createAsyncThunk(
  'auth/addAddress',
  async (
    {
      name,
      surname,
      phone,
      city,
      country,
      houseNo,
      streetName,
      postalCode,
    }: {
      name: string;
      surname?: string;
      phone: string;
      city: string;
      country: string;
      houseNo: string;
      streetName: string;
      postalCode: string;
    },
    {rejectWithValue},
  ) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.error('No token found in AsyncStorage');
        return rejectWithValue('No authentication token found');
      }

      const addressData = {
        name,
        surname,
        phone,
        city,
        country,
        houseNo,
        streetName,
        postalCode,
      };
      console.log(
        'Sending address data:',
        JSON.stringify(addressData, null, 2),
      );

      const response = await axios.post(
        'http://localhost:8000/user/address',
        addressData,
        {headers: {Authorization: `Bearer ${token}`}},
      );

      console.log(
        'Add address response:',
        JSON.stringify(response.data, null, 2),
      );
      return response.data.address as Address[];
    } catch (error: any) {
      console.error('addAddress error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        requestBody: {
          name,
          surname,
          phone,
          city,
          country,
          houseNo,
          streetName,
          postalCode,
        },
      });
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.errors?.join(', ') ||
          'Failed to add address',
      );
    }
  },
);

export const deleteAddress = createAsyncThunk(
  'auth/deleteAddress',
  async (index: string, {rejectWithValue}) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      await axios.delete(`http://localhost:8000/user/address/${index}`, {
        headers: {Authorization: `Bearer ${token}`},
      });
      console.log('Delete address successful');
      return index;
    } catch (error: any) {
      console.error(
        'deleteAddress error:',
        error.response?.data,
        error.message,
      );
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete address',
      );
    }
  },
);

export const updateAddress = createAsyncThunk(
  'auth/updateAddress',
  async (
    {
      index,
      name,
      surname,
      phone,
      city,
      country,
      houseNo,
      streetName,
      postalCode,
    }: {
      index: string;
      name: string;
      surname?: string;
      phone: string;
      city: string;
      country: string;
      houseNo: string;
      streetName: string;
      postalCode: string;
    },
    {rejectWithValue},
  ) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await axios.put(
        `http://localhost:8000/user/address/${index}`,
        {name, surname, phone, city, country, houseNo, streetName, postalCode},
        {headers: {Authorization: `Bearer ${token}`}},
      );

      console.log('Update address response:', response.data);
      return response.data.address as Address[];
    } catch (error: any) {
      console.error(
        'updateAddress error:',
        error.response?.data,
        error.message,
      );
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update address',
      );
    }
  },
);

export const fetchAddresses = createAsyncThunk(
  'auth/fetchAddresses',
  async (_, {rejectWithValue}) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.error('No token found in AsyncStorage');
        return rejectWithValue('No authentication token found');
      }

      console.log('Fetching addresses with token:', token.slice(0, 20) + '...');
      const response = await axios.get('http://localhost:8000/user/addresses', {
        headers: {Authorization: `Bearer ${token}`},
      });

      console.log('Fetched addresses:', JSON.stringify(response.data, null, 2));
      return response.data.address as Address[];
    } catch (error: any) {
      console.error('Fetch addresses error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        headers: error.response?.headers,
      });
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch addresses',
      );
    }
  },
);

export const updateProfile = createAsyncThunk<
  User,
  {name: string; email: string},
  {state: RootState; rejectValue: string}
>('auth/updateProfile', async ({name, email}, {getState, rejectWithValue}) => {
  try {
    const {user} = getState().auth;
    if (!user?.token) {
      return rejectWithValue('No authentication token found');
    }

    const updateData: any = {name, email: email.trim().toLowerCase()};

    const response = await axios.put(
      'http://localhost:8000/user/profile',
      updateData,
      {headers: {Authorization: `Bearer ${user.token}`}},
    );

    console.log('Update profile response:', response.data);
    await AsyncStorage.setItem('userToken', response.data.token);
    return response.data as User;
  } catch (error: any) {
    console.error('updateProfile error:', error.response?.data, error.message);
    return rejectWithValue(
      error.response?.data?.message ||
        error.response?.data?.errors?.join(', ') ||
        'Failed to update profile',
    );
  }
});

export const deleteAccount = createAsyncThunk<
  void,
  void,
  {state: RootState; rejectValue: string}
>('auth/deleteAccount', async (_, {getState, rejectWithValue, dispatch}) => {
  try {
    const {user} = getState().auth;
    if (!user?.token) {
      return rejectWithValue('No user token found');
    }
    const response = await axios.delete(`http://localhost:8000/user/delete`, {
      headers: {Authorization: `Bearer ${user.token}`},
    });
    if (response.status !== 200) {
      throw new Error('Failed to delete account');
    }
    await AsyncStorage.removeItem('userToken');
    dispatch(clearLovedItems());
    dispatch(clearOrders());
    return;
  } catch (err: any) {
    const message = err.response?.data?.error || `Error: ${err.message}`;
    return rejectWithValue(message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.address = action.payload.address || [];
    },
    logout: state => {
      state.user = null;
      state.error = null;
      state.address = [];
      state.addressStatus = 'idle';
      state.addressError = null;
      state.verifyResetOtp = {loading: false, error: null, success: false};
      AsyncStorage.removeItem('userToken');
    },
    clearRegister: state => {
      state.register = {loading: false, error: null, success: false};
    },
    clearForgotPassword: state => {
      state.forgotPassword = {loading: false, error: null, success: false};
    },
    clearResetPassword: state => {
      state.resetPassword = {loading: false, error: null, success: false};
    },
    clearVerifyResetOtp: state => {
      state.verifyResetOtp = {loading: false, error: null, success: false};
    },
    clearAddresses: state => {
      state.address = [];
      state.addressStatus = 'idle';
      state.addressError = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(register.pending, state => {
        state.register.loading = true;
        state.register.error = null;
        state.register.success = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.register.loading = false;
        state.register.success = true;
        state.user = action.payload;
        state.address = action.payload.address || [];
      })
      .addCase(register.rejected, (state, action) => {
        state.register.loading = false;
        state.register.error = action.payload as string;
      })
      .addCase(login.pending, state => {
        state.login.loading = true;
        state.login.error = null;
        state.login.success = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.login.loading = false;
        state.login.success = true;
        state.user = action.payload;
        state.address = action.payload.address || [];
      })
      .addCase(login.rejected, (state, action) => {
        state.login.loading = false;
        state.login.error = action.payload as string;
        state.login.success = false;
      })
      .addCase(forgotPassword.pending, state => {
        state.forgotPassword.loading = true;
        state.forgotPassword.error = null;
        state.forgotPassword.success = false;
      })
      .addCase(forgotPassword.fulfilled, state => {
        state.forgotPassword.loading = false;
        state.forgotPassword.success = true;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.forgotPassword.loading = false;
        state.forgotPassword.error = action.payload as string;
      })
      .addCase(verifyResetOtp.pending, state => {
        if (!state.verifyResetOtp) {
          state.verifyResetOtp = {loading: false, error: null, success: false};
        }
        state.verifyResetOtp.loading = true;
        state.verifyResetOtp.error = null;
        state.verifyResetOtp.success = false;
      })
      .addCase(verifyResetOtp.fulfilled, state => {
        state.verifyResetOtp.loading = false;
        state.verifyResetOtp.success = true;
      })
      .addCase(verifyResetOtp.rejected, (state, action) => {
        state.verifyResetOtp.loading = false;
        state.verifyResetOtp.error = action.payload as string;
        state.verifyResetOtp.success = false;
      })
      .addCase(clearVerifyResetOtp.fulfilled, state => {
        state.verifyResetOtp = {loading: false, error: null, success: false};
      })
      .addCase(resetPassword.pending, state => {
        state.resetPassword.loading = true;
        state.resetPassword.error = null;
        state.resetPassword.success = false;
      })
      .addCase(resetPassword.fulfilled, state => {
        state.resetPassword.loading = false;
        state.resetPassword.success = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetPassword.loading = false;
        state.resetPassword.error = action.payload as string;
      })
      .addCase(addAddress.pending, state => {
        state.addressStatus = 'loading';
        state.addressError = null;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.addressStatus = 'succeeded';
        state.address = action.payload;
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.addressStatus = 'failed';
        state.addressError = action.payload as string;
      })
      .addCase(fetchAddresses.pending, state => {
        state.addressStatus = 'loading';
        state.addressError = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.addressStatus = 'succeeded';
        state.address = action.payload || [];
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.addressStatus = 'failed';
        state.addressError = action.payload as string;
      })
      .addCase(deleteAddress.pending, state => {
        state.addressStatus = 'loading';
        state.addressError = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addressStatus = 'succeeded';
        state.address = state.address.filter(
          (_, i) => i.toString() !== action.payload,
        );
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.addressStatus = 'failed';
        state.addressError = action.payload as string;
      })
      .addCase(updateAddress.pending, state => {
        state.addressStatus = 'loading';
        state.addressError = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.addressStatus = 'succeeded';
        state.address = action.payload;
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.addressStatus = 'failed';
        state.addressError = action.payload as string;
      })
      .addCase(updateProfile.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteAccount.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAccount.fulfilled, state => {
        state.loading = false;
        state.user = null;
        state.address = [];
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setUser,
  logout,
  clearRegister,
  clearForgotPassword,
  clearResetPassword,
  clearAddresses,
} = authSlice.actions;
export default authSlice.reducer;
