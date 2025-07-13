import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Animated,
  ActivityIndicator,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ViewToken,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Menu,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from 'react-native-popup-menu';

import {
  fetchProducts,
  selectProducts,
  selectProductsLoading,
  selectProductsError,
  setSelectedProduct,
} from '../../../redux/slices/ProductsSlice';

import PagingComp from '../productDetails/pagingComp';
import ProductDescription from '../productDetails/ProductDescription';
import {RootStakeScreenProps} from '../../../Navigations/RootNav';
import {ProductParams} from '../../../type/Params';
import {AppDispatch} from '../../../redux/store';

const DetailScreen = ({
  navigation,
  route: {
    params: {id},
  },
}: RootStakeScreenProps<'DetailScreen'>) => {
  const dispatch = useDispatch<AppDispatch>();
  const scrollX = useRef(new Animated.Value(0)).current;
  const [index, setIndex] = useState(0);

  const products = useSelector(selectProducts);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);

  useEffect(() => {
    dispatch(fetchProducts());
  }, []);

  const product = products?.find(p => p._id === id);

  useEffect(() => {
    if (product) {
      dispatch(setSelectedProduct(product));
    }
  }, [product]);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    Animated.event([{nativeEvent: {contentOffset: {x: scrollX}}}], {
      useNativeDriver: false,
    })(e);
  };

  const handleViewableChanged = useRef(
    ({viewableItems}: {viewableItems: Array<ViewToken>}) => {
      setIndex(viewableItems[0]?.index ?? 0);
    },
  ).current;

  const viewabilityConfig = useRef({itemVisiblePercentThreshold: 50}).current;

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#4ade80" />
      </SafeAreaView>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="text-lg text-red-600">
          {error || 'Product not found'}
        </Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-blue-500 mt-4">Go back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <>
      <SafeAreaView className="bg-cyan-700">
        <View className="p-2 flex-row items-center justify-between">
          <TouchableOpacity
            onPress={navigation.goBack}
            className="border-2 m-2 p-2 border-white rounded-full">
            <Icons name="arrow-left" size={25} color="#fff" />
          </TouchableOpacity>

          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => navigation.navigate('TabStack', {screen: 'Cart'})}
              className="mr-2">
              <Icons name="cart-variant" size={35} color="#fff" />
            </TouchableOpacity>
            <Menu>
              <MenuTrigger>
                <Icons name="dots-vertical" size={40} color="#fff" />
              </MenuTrigger>
              <MenuOptions
                customStyles={{
                  optionsContainer: {
                    padding: 10,
                    backgroundColor: '#fff',
                    borderRadius: 8,
                  },
                  optionWrapper: {
                    padding: 10,
                    width: 150,
                    alignItems: 'center',
                  },
                  optionText: {
                    textAlign: 'center',
                    color: '#000',
                    fontSize: 16,
                  },
                }}>
                <MenuOption
                  onSelect={() =>
                    navigation.navigate('TabStack', {screen: 'Home'})
                  }
                  text="HOME"
                />
                <MenuOption
                  onSelect={() => navigation.navigate('Confirm')}
                  text="PAYMENTS"
                />
                <MenuOption
                  onSelect={() =>
                    navigation.navigate('TabStack', {screen: 'Profile'})
                  }
                  text="ACCOUNT"
                />
              </MenuOptions>
            </Menu>
          </View>
        </View>
      </SafeAreaView>

      <View className="bg-white h-full items-center relative">
        <View className="left-0 bg-slate-100 w-full h-10">
          <Text className="font-bold text-3xl pl-3 text-red-600 capitalize">
            {product.name}
          </Text>
        </View>

        <FlatList
          data={product.images}
          keyExtractor={(item, idx) => `${item}-${idx}`}
          horizontal
          pagingEnabled
          snapToAlignment="center"
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          onViewableItemsChanged={handleViewableChanged}
          viewabilityConfig={viewabilityConfig}
          renderItem={({item}) => (
            <View className="h-[360px] w-[360px] items-center justify-center m-2">
              <Image
                source={{uri: item}}
                style={{resizeMode: 'contain'}}
                className="h-[330px] w-full"
              />
            </View>
          )}
        />

        <View className="absolute top-12 left-0 m-2 gap-2">
          {product.oldPrice && (
            <View className="bg-pink-700 p-1 rounded-full items-center justify-center size-20">
              <Text className="text-white text-lg font-semibold">
                {Math.round(
                  ((product.oldPrice - product.price) / product.oldPrice) * 100,
                )}
                %
              </Text>
              <Text className="text-white text-lg font-semibold">OFF</Text>
            </View>
          )}
          {product.sale && (
            <Image
              source={require('../../../images/colections/sale3.webp')}
              className="object-contain size-20"
            />
          )}
        </View>

        <View className="absolute bottom-0 top-0 items-center justify-center">
          <PagingComp data={product.images} scrollX={scrollX} index={index} />
        </View>

        <ProductDescription Product={product} />
      </View>
    </>
  );
};

export default DetailScreen;
