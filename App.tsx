/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import './global.css';

import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import RootNav from './src/Navigations/RootNav';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {MenuProvider} from 'react-native-popup-menu';
import {Provider} from 'react-redux';
import {persistor, store} from './src/redux/Store';
import {PersistGate} from 'redux-persist/integration/react';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading = {
        <View className='flex-1 justify-center items-center'>
          <ActivityIndicator size="large"/>
        </View>
      } persistor={persistor}>
        <MenuProvider>
          <NavigationContainer>
            <RootNav />
          </NavigationContainer>
        </MenuProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
