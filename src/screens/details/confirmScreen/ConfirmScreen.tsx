import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Pressable, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { initStripe, useStripe } from '@stripe/stripe-react-native';
import Config from 'react-native-config';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import { AppDispatch, RootState } from '../../../redux/store';
import { fetchAddresses, logout } from '../../../redux/slices/AuthSlice';
import {
  clearCart,
  selectSubtotal,
  setDeliveryOption as setDeliveryOptionRedux,
} from '../../../redux/slices/CartSlice';
import { createOrder } from '../../../redux/slices/OrderSlice';

import { RootStackParamList } from '../../../Navigations/RootNav';
import { Address, OrderData, CartItem as ReduxCartItem } from '../../../redux/types';

import AddressSelection from '../../confirmScreen/AddressSelection';
import DeliveryOptions from '../../confirmScreen/DeliveryOptions';
import PaymentMethod from '../../confirmScreen/PaymentMethode';
import OrderSummary from '../../confirmScreen/OrderSummary';
import Stepper from '../../confirmScreen/Stepper';
import { PAYMENT_METHODS, CHECKOUT_STEPS } from '../../confirmScreen/Constant';

const ConfirmScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [deliveryOption, setDeliveryOption] = useState<string | null>(null);
  const [deliveryFee, setDeliveryFee] = useState<number>(350);
  const [paymentMethod, setPaymentMethod] = useState<string>(PAYMENT_METHODS.CASH);
  const [error, setError] = useState<string | null>(null);

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const user = useSelector((state: RootState) => state.auth?.user);
  const addressList = useSelector((state: RootState) => state.auth?.address || []);
  const addressStatus = useSelector((state: RootState) => state.auth?.addressStatus || 'idle');
  const addressError = useSelector((state: RootState) => state.auth?.addressError);
  const orderStatus = useSelector((state: RootState) =>
    state.order?.createOrder?.loading ? 'loading' : 'idle'
  );
  const orderError = useSelector((state: RootState) => state.order?.createOrder?.error);
  const cartItems = useSelector((state: RootState) => state.cart?.items as ReduxCartItem[]);
  const subtotal = useSelector(selectSubtotal) || 0;
  const cartDeliveryFee = useSelector((state: RootState) => state.cart?.deliveryFee || 350);
  const cartDeliveryOption = useSelector((state: RootState) => state.cart?.deliveryOption);

  const deliveryOptions = {
    standard: 0,
    express: 50,
    sameDay: 100,
    pickup: 0,
  };

  useEffect(() => {
    const initializeStripe = async () => {
      if (!Config.STRIPE_PUBLISHABLE_KEY) {
        console.error('STRIPE_PUBLISHABLE_KEY is not defined in .env');
        setError('Payment configuration missing.');
        return;
      }
      await initStripe({ publishableKey: Config.STRIPE_PUBLISHABLE_KEY });
    };
    initializeStripe();
  }, []);

  useEffect(() => {
    setDeliveryOption(cartDeliveryOption);
    setDeliveryFee(cartDeliveryFee);
  }, [cartDeliveryOption, cartDeliveryFee]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (!user?._id || !token) {
        setError('Please log in to proceed.');
        await dispatch(logout());
        navigation.navigate('AuthStack', { screen: 'Login' });
        return;
      }
      dispatch(fetchAddresses());
    };
    checkAuth();
  }, [dispatch, user?._id, navigation]);

  useEffect(() => {
    if (orderError) {
      setError(orderError);
      if (orderError.includes('Not authorized')) {
        dispatch(logout());
        navigation.navigate('AuthStack', { screen: 'Login' });
      }
    }
  }, [orderError, dispatch, navigation]);

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  const validateOrder = () => {
    if (!cartItems?.length) {
      setError('Your cart is empty.');
      return false;
    }
    if (!selectedAddress) {
      setError('Please select a shipping address.');
      return false;
    }
    if (!deliveryOption) {
      setError('Please select a delivery option.');
      return false;
    }
    if (!paymentMethod) {
      setError('Please select a payment method.');
      return false;
    }
    return true;
  };

  const createStripePaymentIntent = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) throw new Error('No authentication token found');

      const amount = (subtotal + deliveryFee) * 100;
      if (isNaN(amount) || amount < 50) throw new Error('Invalid order amount. Minimum is 50 cents.');

      const response = await axios.post(
        'http://localhost:8000/payment/create-order',
        { amount, currency: 'ZAR' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return {
        clientSecret: response.data.client_secret,
        paymentIntentId: response.data.payment_intent_id,
      };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create Stripe Payment Intent';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const placeOrder = async (method: string, paymentData: any = null) => {
    if (!validateOrder() || !cartItems) return;

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        setError('Session expired. Please log in again.');
        await dispatch(logout());
        navigation.navigate('AuthStack', { screen: 'Login' });
        return;
      }

      const orderData: OrderData = {
        orderItems: cartItems.map((item) => ({
          product: item.product._id,
          qty: item.count,
          price: item.product.price,
          name: item.product.name || 'Unknown',
          image: Array.isArray(item.product.images)
            ? item.product.images[0]
            : item.product.images || '',
        })),
        shippingAddress: { ...selectedAddress!, phone: selectedAddress!.phone.toString() },
        paymentMethod: method,
        itemsPrice: subtotal,
        shippingPrice: deliveryFee,
        totalPrice: subtotal + deliveryFee,
        deliveryOption: deliveryOption as string,
        paymentData: method === PAYMENT_METHODS.CARD ? { paymentIntentId: paymentData?.paymentIntentId } : undefined,
        isPaid: method === PAYMENT_METHODS.CARD,
      };

      const result = await dispatch(createOrder(orderData)).unwrap();
      await dispatch(clearCart()).unwrap();
      navigation.navigate('Order', { id: result._id });
      Alert.alert('Success', 'Order placed successfully!');
    } catch (err: any) {
      setError(err.message || 'Error placing order. Please try again.');
    }
  };

  const handleStripePayment = async () => {
    if (!validateOrder() || !cartItems) return;
    if (!Config.STRIPE_PUBLISHABLE_KEY) {
      setError('Payment configuration missing.');
      return;
    }

    try {
      const { clientSecret, paymentIntentId } = await createStripePaymentIntent();

      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: 'Your Nonprofit Name',
        paymentIntentClientSecret: clientSecret,
      });

      if (initError) throw new Error(initError.message);

      const { error: paymentError } = await presentPaymentSheet();

      if (paymentError) throw new Error(paymentError.message);

      await placeOrder(PAYMENT_METHODS.CARD, { paymentIntentId });
    } catch (err: any) {
      setError(err.message || 'Payment failed. Please try again.');
    }
  };

  const handleSelectDelivery = (option: string, fee: number) => {
    setDeliveryOption(option);
    setDeliveryFee(fee);
    dispatch(setDeliveryOptionRedux(option));
  };

  return (
    <ScrollView className="mt-14">
      <View className="flex-1 px-5 pt-10">
        <Stepper currentStep={currentStep} steps={CHECKOUT_STEPS} />

        {currentStep > 0 && (
          <Pressable
            onPress={handleBack}
            className="bg-gray-300 p-2.5 rounded-lg w-20 mb-2.5"
          >
            <Text className="text-center text-base">Back</Text>
          </Pressable>
        )}

        {error && <Text className="text-red-500 mb-2.5 text-base">{error}</Text>}
        {addressError && <Text className="text-red-500 mb-2.5 text-base">{addressError}</Text>}

        {currentStep === 0 && (
          <AddressSelection
            addressList={addressList}
            addressStatus={addressStatus}
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
            onNext={() => setCurrentStep(1)}
          />
        )}
        {currentStep === 1 && (
          <DeliveryOptions
            deliveryOption={deliveryOption}
            setDeliveryOption={(option) =>
              handleSelectDelivery(option, deliveryOptions[option as keyof typeof deliveryOptions] || 350)
            }
            setDeliveryFee={setDeliveryFee}
            onNext={() => setCurrentStep(2)}
          />
        )}
        {currentStep === 2 && (
          <PaymentMethod
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            orderStatus={orderStatus}
            deliveryOption={deliveryOption}
            setDeliveryOption={setDeliveryOption}
            deliveryFee={deliveryFee}
            setDeliveryFee={setDeliveryFee}
            onPay={handleStripePayment}
            onNext={() => setCurrentStep(3)}
          />
        )}
        {currentStep === 3 && cartItems && (
          <OrderSummary
            selectedAddress={selectedAddress}
            cartItems={cartItems}
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            paymentMethod={paymentMethod}
            deliveryOption={deliveryOption}
            orderStatus={orderStatus}
            onPlaceOrder={() => placeOrder(paymentMethod)}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default React.memo(ConfirmScreen);