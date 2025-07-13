import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {RootStakeScreenProps} from '../../../Navigations/RootNav';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../redux/Store';
import {
  fetchProducts,
  selectProducts,
  selectProductsLoading,
} from '../../../redux/slices/ProductsSlice';
import {ProductParams} from '../../../type/Params';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {FlashList} from '@shopify/flash-list';
import ProductShimmer from './ProductShimmer';
import {
  addToLoved,
  removeFromLoved,
  fetchLovedItems,
} from '../../../redux/slices/LovedSlice';

const CategoryScreen = ({
  navigation,
  route: {
    params: {id, name},
  },
}: RootStakeScreenProps<'CategoryScreen'>) => {
  const [visibleProducts, setVisibleProducts] = useState<ProductParams[]>([]);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [sortType, setSortType] = useState<
    'default' | 'priceAsc' | 'priceDesc'
  >('default');
  const [loadingProducts, setLoadingProducts] = useState<{
    [key: string]: boolean;
  }>({});
  const [optimisticLovedItems, setOptimisticLovedItems] = useState<string[]>(
    [],
  );
  const itemsPerPage = 10;

  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(selectProducts);
  const loading = useSelector(selectProductsLoading);
  const user = useSelector((state: RootState) => state.auth.user);
  const lovedItems = useSelector((state: RootState) => state.loved.items);

  useEffect(() => {
    setOptimisticLovedItems(lovedItems);
    console.log('lovedItems updated:', lovedItems);
  }, [lovedItems]);

  useEffect(() => {
    dispatch(fetchProducts());
    if (user?.token) {
      dispatch(fetchLovedItems());
    }
  }, [dispatch, user?.token]);

  const productsByCategory = useMemo(() => {
    return products.reduce((acc, product) => {
      const categoryId = product.category;
      if (!categoryId) return acc;
      if (!acc[categoryId]) acc[categoryId] = [];
      acc[categoryId].push(product);
      return acc;
    }, {} as {[key: string]: ProductParams[]});
  }, [products]);

  const productData = productsByCategory[id] || [];
  const sortedProducts = useMemo(() => {
    let sorted = [...productData];
    if (sortType === 'priceAsc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortType === 'priceDesc') {
      sorted.sort((a, b) => b.price - a.price);
    }
    return sorted;
  }, [productData, sortType]);

  useEffect(() => {
    if (sortedProducts.length) {
      setVisibleProducts(sortedProducts.slice(0, itemsPerPage));
      setPage(1);
    }
  }, [sortedProducts]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      dispatch(fetchProducts()),
      user?.token ? dispatch(fetchLovedItems()) : Promise.resolve(),
    ]);
    setRefreshing(false);
  };

  const loadMore = () => {
    if (page * itemsPerPage >= sortedProducts.length) return;
    const nextPage = page + 1;
    const nextItems = sortedProducts.slice(0, nextPage * itemsPerPage);
    setVisibleProducts(nextItems);
    setPage(nextPage);
  };

  const isCategoryLoading = loading || !productsByCategory[id];

  const toggleLoved = async (productId: string, isLoved: boolean) => {
    if (!user?.token) {
      Alert.alert(
        'Login Required',
        'Please log in to add items to your loved list.',
      );
      return;
    }

    setLoadingProducts(prev => ({...prev, [productId]: true}));
    setOptimisticLovedItems(prev =>
      isLoved ? prev.filter(id => id !== productId) : [...prev, productId],
    );
    console.log(
      `Optimistic update: ${isLoved ? 'Removing' : 'Adding'} ${productId}`,
    );

    try {
      if (isLoved) {
        console.log(`Removing product ${productId} from loved items`);
        await dispatch(removeFromLoved(productId)).unwrap();
      } else {
        console.log(`Adding product ${productId} to loved items`);
        await dispatch(addToLoved(productId)).unwrap();
      }
    } catch (error: any) {
      console.error('toggleLoved error:', error);

      setOptimisticLovedItems(lovedItems);
      Alert.alert('Error', error?.message || 'Failed to update loved items');
    } finally {
      setLoadingProducts(prev => ({...prev, [productId]: false}));
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <View>
        <View className="flex-row justify-between">
          <TouchableOpacity
            onPress={navigation.goBack}
            className="items-center justify-center m-2 p-2 border-sky-950 size-14 rounded-full">
            <Icons name="arrow-left" size={25} color={'#0369a1'} />
          </TouchableOpacity>
          <View className="m-2 p-2 border-sky-950 bg-white items-center justify-center">
            <Text className="font-semibold text-xl">{name}</Text>
          </View>
        </View>
      </View>

      <View className="flex-row justify-between gap-1 m-2">
        <TouchableOpacity className="bg-slate-300 h-10 justify-center items-center w-[49%]">
          <Text className="font-semibold">{productData.length} items</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-slate-300 h-10 justify-center items-center w-[49%]"
          onPress={() => setSortModalVisible(true)}>
          <Text className="font-semibold">Sort</Text>
        </TouchableOpacity>
      </View>

      {isCategoryLoading ? (
        <ProductShimmer />
      ) : (
        <View className="flex-1">
          <FlashList
            data={visibleProducts}
            keyExtractor={item => item._id}
            contentContainerStyle={{padding: 10}}
            estimatedItemSize={215}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            refreshing={refreshing}
            onRefresh={onRefresh}
            numColumns={2}
            extraData={optimisticLovedItems}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('DetailScreen', {id: item._id})
                }
                className="w-[185px] bg-white">
                <View className="m-2 p-2 border rounded-lg border-slate-300 bg-white">
                  <Image
                    source={{uri: item.images[0]}}
                    style={{resizeMode: 'contain'}}
                    className="w-full h-[130px]"
                  />
                  <Text className="font-bold bg-emerald-500 p-1 px-3 text-[12px]">
                    {item.name}
                  </Text>
                  <View className="flex-row justify-between mt-3">
                    <View>
                      <Text className="text-base font-semibold">
                        {item.brand}
                      </Text>
                      <View className="flex-row gap-2">
                        <Text className="font-bold text-cyan-700">
                          R {item.price}
                        </Text>
                        {item.oldPrice && (
                          <Text className="color-slate-400 line-through">
                            R{item.oldPrice}
                          </Text>
                        )}
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={() =>
                        toggleLoved(
                          item._id,
                          optimisticLovedItems.includes(item._id),
                        )
                      }
                      disabled={loadingProducts[item._id]}
                      className="flex-row items-center justify-center p-2">
                      {loadingProducts[item._id] ? (
                        <ActivityIndicator size="small" color="#6495ed" />
                      ) : (
                        <Icons
                          name={
                            optimisticLovedItems.includes(item._id)
                              ? 'cards-heart'
                              : 'cards-heart-outline'
                          }
                          size={25}
                          color="#6495ed"
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                  {item.oldPrice && (
                    <View className="size-12 bg-red-400 items-center justify-center rounded-lg absolute top-2 right-2">
                      <Text className="text-white text-xs">Save</Text>
                      <Text className="text-white text-xs">
                        {Math.round(
                          ((item.oldPrice - item.price) / item.oldPrice) * 100,
                        )}
                        %
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      <Modal visible={sortModalVisible} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white p-4 rounded-t-2xl">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold">Sort By</Text>
              <TouchableOpacity onPress={() => setSortModalVisible(false)}>
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
                setSortModalVisible(false);
              }}>
              <Text className="text-red-500">Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CategoryScreen;
