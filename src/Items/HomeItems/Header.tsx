import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import {selectCartLength} from '../../redux/slices/CartSlice';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootState} from '../../redux/store';
import {RootStackParamList} from '../../Navigations/RootNav';

const Header = () => {
  const Data = [
    'Search Trending Products',
    'Find Your Favorite products',
    'Super Deal Products',
    'Search item by brand or desc',
  ];
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'TabStack'>>();
  const animatedValue = useRef(new Animated.Value(0)).current;
  const numberItems = useSelector(selectCartLength);
  const user = useSelector((state: RootState) => state.auth?.user);

  useEffect(() => {
    const startAnimation = () => {
      animatedValue.setValue(0);
      Animated.loop(
        Animated.sequence(
          Data.map((_, i) =>
            Animated.sequence([
              Animated.timing(animatedValue, {
                toValue: -(i + 1) * 50,
                duration: 500,
                useNativeDriver: true,
              }),
              Animated.delay(1500),
            ]),
          ),
        ),
      ).start();
    };

    startAnimation();
  }, []);

  return (
    <SafeAreaView className="bg-sky-800">
      <View className="pl-5 pr-5">
        <View className="flex-row justify-between items-center">
          <TouchableOpacity onPress={() => navigation.navigate('Addresses')}>
            <Entypo name="location" size={25} color={'#6495ed'} />
          </TouchableOpacity>
          <Text className="color-gray-500 font-semibold text-lg">
            {user?.email}
          </Text>
          <View>
            <TouchableOpacity
              onPress={() => navigation.navigate('TabStack', {screen: 'Cart'})}>
              <View className="px-1">
                <View className="bg-white size-5 items-center justify-center rounded-full">
                  <Text>{numberItems}</Text>
                </View>
              </View>
              <View>
                <Icons name="cart-variant" size={25} color={'#6495ed'} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View className="flex flex-row p-4 justify-between items-center w-full">
        <TouchableOpacity
          onPress={() => navigation.navigate('TabStack', {screen: 'Explore'})}
          className="border border-white rounded-full bg-white w-full h-[40] justify-center">
          <View className="overflow-hidden items-center h-[46]">
            <Animated.View style={{transform: [{translateY: animatedValue}]}}>
              {[...Data, ...Data].map((item, index) => (
                <View key={index} className="h-[50] w-[300] justify-center">
                  <Text className="text-lg ml-5 text-gray-500 font-semibold">
                    {item}
                  </Text>
                </View>
              ))}
            </Animated.View>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('TabStack', {screen: 'Explore'})}
            className="right-0 mr-4 absolute justify-center items-center">
            <Icon name="search" size={25} color={'#6b7280'} />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Header;
