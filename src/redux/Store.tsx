import { configureStore, Reducer, ThunkDispatch } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  createTransform,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, UnknownAction } from 'redux';
import { RootState, CombinedState, AuthState, CartState, FavoritesState, LovedState } from './types';
import authReducer from './slices/AuthSlice';
import cartReducer from './slices/CartSlice';
import productsReducer from './slices/ProductsSlice';
import favoritesReducer from './slices/FavoratesSlice';
import lovedReducer from './slices/LovedSlice';
import categoryReducer from './slices/categorySlice';
import orderReducer from './slices/OrderSlice';

const authTransform = createTransform(
  (inboundState: AuthState) => ({
    user: inboundState.user,
    address: inboundState.address,
    register: { loading: false, error: null, success: false },
    forgotPassword: { loading: false, error: null, success: false },
    resetPassword: { loading: false, error: null, success: false },
    verifyResetOtp: { loading: false, error: null, success: false },
  }),
  (outboundState: Partial<AuthState>): AuthState => ({
    user: outboundState.user ?? null,
    address: outboundState.address ?? [],
    loading: false,
    error: null,
    addressStatus: 'idle',
    addressError: null,
    register: {
      loading: false,
      error: null,
      success: false,
      ...outboundState.register,
    },
    forgotPassword: {
      loading: false,
      error: null,
      success: false,
      ...outboundState.forgotPassword,
    },
    resetPassword: {
      loading: false,
      error: null,
      success: false,
      ...outboundState.resetPassword,
    },
     verifyResetOtp: {
      loading: false,
      error: null,
      success: false,
      ...outboundState.verifyResetOtp,
    }, 
      login: {
      loading: false,
      error: null,
      success: false,
      ...outboundState.login,
    }, 
  }),
  { whitelist: ['auth'] },
);

const cartTransform = createTransform<CartState, CartState>(
  (inboundState) => ({
    ...inboundState,
    loading: false,
    error: null,
  }),
  (outboundState) => ({
    items: outboundState.items ?? [],
    loading: false,
    error: null,
    deliveryFee: outboundState.deliveryFee ?? 350,
    freeDeliveryFrom: outboundState.freeDeliveryFrom ?? 6000,
     deliveryOption: outboundState.deliveryOption ?? null,
  }),
  { whitelist: ['cart'] },
);

const lovedTransform = createTransform(
  (inboundState: LovedState) => ({ items: inboundState.items }),
  (outboundState: Partial<LovedState>): LovedState => ({
    items: outboundState.items ?? [],
    loading: false,
    error: null,
  }),
  { whitelist: ['loved'] },
);

const favoritesTransform = createTransform(
  (inboundState: FavoritesState) => ({ items: inboundState.items }),
  (outboundState: Partial<FavoritesState>): FavoritesState => ({
    items: outboundState.items ?? [],
    loading: false,
    error: null,
  }),
  { whitelist: ['favorites'] },
);

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  version: 1,
  whitelist: ['auth', 'cart', 'favorites', 'loved'],
  transforms: [authTransform, cartTransform, lovedTransform, favoritesTransform],
};

const rootReducer: Reducer<CombinedState> = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  order: orderReducer,
  loved: lovedReducer,
  category: categoryReducer,
  products: productsReducer,
  favorites: favoritesReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
         
      },
    }),
});

export const persistor = persistStore(store);
export type AppDispatch = ThunkDispatch<RootState, unknown, UnknownAction>;


export type { RootState }; 