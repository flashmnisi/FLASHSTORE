import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Animated,
  RefreshControl,
  Alert,
  Dimensions,
  Modal,
} from 'react-native';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import { FlashList } from '@shopify/flash-list';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import Header from '../../Items/HomeItems/Header';
import CarouselSlide from '../../Items/HomeItems/CarouselSlide';
import SuperDeals from '../../Items/HomeItems/SuperDeals';
import Trends from '../../Items/HomeItems/Trends';
import Market from '../../Items/HomeItems/Market';
import FutureCategories from '../../Items/HomeItems/FutureCategories';

import { RootState, AppDispatch } from '../../redux/Store';
import { fetchCategories } from '../../redux/slices/categorySlice';
import { fetchProducts } from '../../redux/slices/ProductsSlice';
import { addToCart } from '../../redux/slices/CartSlice';
import { fetchLovedItems } from '../../redux/slices/LovedSlice'; 
import { RootStackParamList } from '../../Navigations/RootNav';
import { ProductParams } from '../../type/Params';
import Fontisto from 'react-native-vector-icons/Fontisto';

const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type Props = {
  displayMode?: 'grid' | 'list'; 
};

const HomeScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<NavigationProp>();
  const { categories, loading: categoryLoading } = useSelector(
    (state: RootState) => state.category,
  );
  const { products, loading: productLoading } = useSelector(
    (state: RootState) => state.products,
  );
  const { items: lovedItems, loading: lovedLoading, error: lovedError } = useSelector(
    (state: RootState) => state.loved,
  );
  const user = useSelector((state: RootState) => state.auth?.user);
  const cartItems = useSelector((state: RootState) => state.cart?.items);

  const [refreshing, setRefreshing] = useState(false);
  const [visibleItems, setVisibleItems] = useState(10);
  const [showAll, setShowAll] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [sortType, setSortType] = useState<
    'default' | 'priceAsc' | 'priceDesc'
  >('default');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
   const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('grid');

  const toggleDisplayMode = () => {
    setDisplayMode(displayMode === 'grid' ? 'list' : 'grid');
  };

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts());
    if (user?.token) {
      dispatch(fetchLovedItems());
    }
  }, [dispatch, user?.token]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      dispatch(fetchCategories()),
      dispatch(fetchProducts()),
      user?.token && dispatch(fetchLovedItems()),
    ]);
    setRefreshing(false);
  };

    const handleSortFilter = (
    sortType: 'default' | 'priceAsc' | 'priceDesc',
    selectedCategory: string | null
  ) => {
    setSortType(sortType);
    setSelectedCategory(selectedCategory);
  };
  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCategory) {
      result = result.filter(item => item.category === selectedCategory);
    }

    result = result.filter(item => item.inStock && item.quantity > 0);

    if (sortType === 'priceAsc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortType === 'priceDesc') {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, selectedCategory, sortType]);

  const productsByCategory = useMemo(() => {
    return products.reduce(
      (acc: Record<string, ProductParams[]>, product: ProductParams) => {
        const categoryId = product.category || 'uncategorized';
        if (!acc[categoryId]) acc[categoryId] = [];
        acc[categoryId].push(product);
        return acc;
      },
      {},
    );
  }, [products]);

  const superDeals = productsByCategory['680b340bad130901da811111'] || [];
  const trends = productsByCategory['680b340bad130901da822222'] || [];

  const handleAddToCart = (item: ProductParams) => {
    if (!user) {
      Alert.alert(
        'Please Log In',
        'You need to log in to add items to your cart.',
        [
          { text: 'Cancel' },
          {
            text: 'Log In',
            onPress: () => navigation.navigate('AuthStack', { screen: 'Login' }),
          },
        ],
      );
      return;
    }

    if (!item.inStock || item.quantity < 1) {
      Alert.alert('Out of Stock', `${item.name} is currently out of stock.`);
      return;
    }
    const alreadyInCart = cartItems?.some(
      cartItem => cartItem.product._id === item._id,
    );
    if (alreadyInCart) {
      Alert.alert('Already Added', 'This item is already in your cart.');
      return;
    }

    dispatch(addToCart({ productId: item._id, count: 1 }));
  };

  const loadMoreItems = useCallback(() => {
    if (visibleItems >= filteredProducts.length) return;
    setVisibleItems(prev => prev + 10);
  }, [filteredProducts.length, visibleItems]);

  const Data = [
    <Text className="text-red-800 text-xl font-bold">SUPER DEALS</Text>,
    <Text className="text-cyan-700 text-xl">UpTo 80% OFF</Text>,
  ];

  const animatedValue = useRef(new Animated.Value(0)).current;
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
  }, [animatedValue]);

  const shimmerCategory = () => (
    <View className="flex-row gap-3 my-3">
      {[...Array(4)].map((_, i) => (
        <ShimmerPlaceHolder
          key={i}
          style={{ height: 120, width: 120, borderRadius: 10 }}
        />
      ))}
    </View>
  );

  const shimmerProductGrid = () => (
    <View className="flex-row flex-wrap justify-between p-2">
      {[...Array(6)].map((_, i) => (
        <ShimmerPlaceHolder
          key={i}
          style={{
            width: '48%',
            height: 200,
            marginVertical: 5,
            borderRadius: 10,
          }}
        />
      ))}
    </View>
  );


  return (
    <>

      <Header/>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {lovedError && (
          <View className="p-2 bg-red-100">
            <Text className="text-red-500">{lovedError}</Text>
          </View>
        )}
        <CarouselSlide />
        <View className="m-2">
          <Text className="text-xl font-bold text-cyan-800">
            FUTURE CATEGORIES
          </Text>
          {categoryLoading ? (
            shimmerCategory()
          ) : (
            <View style={{ height: 130, width: width - 16 }}>
              <FlashList
                data={categories}
                horizontal
                showsHorizontalScrollIndicator={false}
                estimatedItemSize={120}
                keyExtractor={(item: ProductParams) => item._id}
                renderItem={({ item }) => <FutureCategories item={item} />}
              />
            </View>
          )}
        </View>

        <View className="flex-row justify-between mt-5 m-2 items-center">
          <View className="overflow-hidden items-center h-[50]">
            <Animated.View style={{ transform: [{ translateY: animatedValue }] }}>
              {[...Data, ...Data].map((item, index) => (
                <View key={index} className="h-[50] justify-center">
                  <Text className="text-lg ml-5 text-red-500 font-semibold">
                    {item}
                  </Text>
                </View>
              ))}
            </Animated.View>
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ViewAllCat', {
                id: '680b340bad130901da811111',
              })
            }>
            <Text className="font-semibold text-blue-600">VIEW ALL</Text>
          </TouchableOpacity>
        </View>

        {productLoading || lovedLoading ? (
          shimmerCategory()
        ) : (
          <View style={{ height: 180, width: width - 16 }}>
            <FlashList
              data={superDeals}
              horizontal
              showsHorizontalScrollIndicator={false}
              estimatedItemSize={160}
              keyExtractor={(item: ProductParams) => item._id}
              renderItem={({ item }) => (
                <SuperDeals item={item} onAddToCart={handleAddToCart} />
              )}
            />
          </View>
        )}

        <View className="flex-row justify-between mt-5 m-2 p-2 items-center bg-slate-500">
          <Text className="text-xl font-bold text-white">TRENDS</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ViewAllCat', {
                id: '680b340bad130901da822222',
              })
            }>
            <Text className="font-semibold text-white">VIEW ALL</Text>
          </TouchableOpacity>
        </View>

        {productLoading || lovedLoading ? (
          shimmerCategory()
        ) : (
          <View style={{ height: 180, width: width - 16 }}>
            <FlashList
              data={trends}
              horizontal
              showsHorizontalScrollIndicator={false}
              estimatedItemSize={160}
              keyExtractor={(item: ProductParams) => item._id}
              renderItem={({ item }) => (
                <Trends item={item} onAddToCart={handleAddToCart} />
              )}
            />
          </View>
        )}

        <View className="flex-row justify-between m-2 bg-cyan-900 p-2">
          <Text className="text-xl font-bold text-pink-900 rounded-md pl-2 pr-2">
            ON MARKET
          </Text>
          <TouchableOpacity
            onPress={() => {
              setShowAll(!showAll);
              setVisibleItems(showAll ? 10 : products.length);
            }}>
            <Text className="text-xl font-semibold text-white">
              {showAll ? 'View Less' : 'View All'}
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-between gap-1 m-2">
          <TouchableOpacity
            className="bg-slate-300 h-10 justify-center items-center w-[32%]"
             onPress={toggleDisplayMode}
             >
            <Fontisto name={displayMode === 'grid'?"nav-icon-list":"nav-icon-grid"} size={20} color={'#6495ed'} />
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-slate-300 h-10 justify-center items-center w-[32%]"
            onPress={() => setSortModalVisible(true)}>
            <Text className="font-semibold">Sort</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-slate-300 h-10 justify-center items-center w-[32%]"
            onPress={() => setFilterModalVisible(true)}>
            <Text className="font-semibold">Filter</Text>
          </TouchableOpacity>
        </View>

        {productLoading || lovedLoading ? (
          shimmerProductGrid()
        ) : (
              <View style={{ minHeight: 400}}>
        <FlashList
          data={filteredProducts.slice(0, visibleItems)}
          numColumns={displayMode === 'grid' ? 2 : 1}
          estimatedItemSize={displayMode === 'grid' ? 180 : 100}
          keyExtractor={(item: ProductParams) => item._id}
          onEndReached={loadMoreItems}
          onEndReachedThreshold={0.5}
          renderItem={({ item }) => (
            <Market
              item={item}
              onAddToCart={handleAddToCart}
              displayMode={displayMode} 
            />
          )}
        />
      </View>

        )}
      </ScrollView>

      <Modal visible={sortModalVisible} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white p-4 rounded-t-2xl">
            <View className="flex-row justify-between">
              <Text className="text-lg font-bold mb-4">Sort by</Text>
              <TouchableOpacity
                onPress={() => setSortModalVisible(false)}
                accessibilityLabel="Close sort modal"
                accessibilityRole="button">
                <Text className="text-lg font-bold text-red-700">X</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => {
                setSortType('priceAsc');
                setSortModalVisible(false);
              }}>
              <Text className="text-blue-500 mb-2">Price: Low to High</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSortType('priceDesc');
                setSortModalVisible(false);
              }}>
              <Text className="text-blue-500 mb-2">Price: High to Low</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSortType('default');
                setSelectedCategory(null);
                setSortModalVisible(false);
              }}>
              <Text className="text-red-500">Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={filterModalVisible} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white p-4 rounded-t-2xl">
            <View className="flex-row justify-between">
              <Text className="text-lg font-bold mb-4">Filter</Text>
              <TouchableOpacity
                onPress={() => setFilterModalVisible(false)}
                accessibilityLabel="Close filter modal"
                accessibilityRole="button">
                <Text className="text-lg font-bold text-red-700">X</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-base font-semibold mb-2">
              Filter by Category
            </Text>
            <View className="mb-4">
              {categoryLoading ? (
                <Text className="text-gray-500">Loading categories...</Text>
              ) : categories.length === 0 ? (
                <Text className="text-gray-500">No categories available</Text>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {categories.map((category: { _id: string; name: string }) => (
                    <TouchableOpacity
                      key={category._id}
                      className={`mr-2 px-3 py-2 rounded-lg ${
                        selectedCategory === category._id
                          ? 'bg-blue-500'
                          : 'bg-gray-200'
                      }`}
                      onPress={() => {
                        setSelectedCategory(
                          selectedCategory === category._id
                            ? null
                            : category._id,
                        );
                      }}>
                      <Text
                        className={`text-sm ${
                          selectedCategory === category._id
                            ? 'text-white'
                            : 'text-black'
                        }`}>
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
            <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
              <Text className="text-blue-500 mb-2">Apply Filters</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSelectedCategory(null);
                setFilterModalVisible(false);
              }}>
              <Text className="text-red-500">Clear Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default HomeScreen;