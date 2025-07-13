import React from 'react';
import {
  BottomTabScreenProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import CartScreen from '../screens/tabs/CartScreen';
import PaymentScreen from '../screens/tabs/ExploreScreen';
import ProfileScreen from '../screens/tabs/ProfileScreen';
import HomeScreen from '../screens/tabs/HomeScreen';
import {CompositeScreenProps} from '@react-navigation/native';
import {RootStakeScreenProps} from './RootNav';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ExploreScreen from '../screens/tabs/ExploreScreen';

export type TabStackParamList = {
  Home: undefined;
  Cart: undefined;
  Explore: undefined;
  Profile: undefined;
};

const TabStack = createBottomTabNavigator<TabStackParamList>();
export type TabStackScreenProps<T extends keyof TabStackParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<TabStackParamList, T>,
    RootStakeScreenProps<'TabStack'>
  >;
const TabsNav = () => {
  return (
    <TabStack.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({focused, color}) => {
          let iconName = 'home';

          if (route.name === 'Home')
            iconName = focused ? 'home' : 'home-outline';
          if (route.name === 'Cart')
            iconName = focused ? 'cart' : 'cart-outline';
          if (route.name === 'Explore')
            iconName = focused ? 'search' : 'search-outline';
          if (route.name === 'Profile')
            iconName = focused ? 'person' : 'person-outline';

          return <Ionicons name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: '#075985',
        tabBarInactiveTintColor: '#999',
      })}
      initialRouteName="Home">
      <TabStack.Screen name="Home" component={HomeScreen} />
      <TabStack.Screen name="Cart" component={CartScreen} />
      <TabStack.Screen name="Explore" component={ExploreScreen} />
      <TabStack.Screen name="Profile" component={ProfileScreen} />
    </TabStack.Navigator>
  );
};

export default TabsNav;
