import React from 'react';
import {NavigatorScreenParams} from '@react-navigation/native';
import AuthNav, {AuthStackParamList} from './AuthNav';
import TabsNav, {TabStackParamList} from './TabsNav';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import DetailScreen from '../screens/details/productDetails/DetailScreen';
import CategoryScreen from '../screens/details/categoryDetails/CategoryScreen';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/Store';
import ViewAllCat from '../screens/details/viewAllCat/ViewAllCat';
import AddAddressScreen from '../screens/details/addressDetails/AddAddressScreen';
import AddressScreen from '../screens/details/addressDetails/AddressScreen';
import ConfirmScreen from '../screens/details/confirmScreen/ConfirmScreen';
import OrdersScreen from '../screens/details/confirmScreen/OrdersScreen';
import EditProfile from '../screens/tabs/EditProfileScreen';
import EditAddress from '../screens/details/addressDetails/EditAddress';

export type RootStackParamList = {
  AuthStack: NavigatorScreenParams<AuthStackParamList>;
  TabStack: NavigatorScreenParams<TabStackParamList>;
  DetailScreen: {id: string};
  CategoryScreen: {id: string; name: string};
  ViewAllCat: {id: string};
  AddAddress: undefined;
  Addresses: undefined;
  Confirm: undefined; 
  Order: {id: string};
  EditProfile: undefined;
  EditAddress:{index:number};
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
export type RootStakeScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

const RootNav = () => {
  const user = useSelector((state: RootState) => state.auth?.user);
  return (
    <RootStack.Navigator screenOptions={{headerShown: false}}>
      {!user ? (
        <RootStack.Screen name="AuthStack" component={AuthNav} />
      ) : (
        <>
          <RootStack.Screen name="TabStack" component={TabsNav} />
          <RootStack.Screen name="DetailScreen" component={DetailScreen} />
          <RootStack.Screen name="CategoryScreen" component={CategoryScreen} />
          <RootStack.Screen name="ViewAllCat" component={ViewAllCat} />
          <RootStack.Screen name="AddAddress" component={AddAddressScreen} />
          <RootStack.Screen name="Addresses" component={AddressScreen} />
          <RootStack.Screen name="Confirm" component={ConfirmScreen} />
          <RootStack.Screen name="Order" component={OrdersScreen} />
          <RootStack.Screen name='EditProfile' component={EditProfile} />
          <RootStack.Screen name='EditAddress' component={EditAddress} />
        </>
      )}
    </RootStack.Navigator>
  );
};

export default RootNav;
