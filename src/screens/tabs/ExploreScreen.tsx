import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Alert,
  SafeAreaView,
  Image,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootState, AppDispatch} from '../../redux/store';
import {ProductParams} from '../../type/Params';
import {addToCart} from '../../redux/slices/CartSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import debounce from 'lodash.debounce';
import {RootStackParamList} from '../../Navigations/RootNav';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ExploreScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<NavigationProp>();
  const allProducts = useSelector(
    (state: RootState) => state.products.products,
  );
  const user = useSelector((state: RootState) => state.auth.user);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ProductParams[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const loadRecentSearches = async () => {
      try {
        const saved = await AsyncStorage.getItem('recentSearches');
        if (saved) {
          setRecentSearches(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Failed to load recent searches:', error);
      }
    };
    loadRecentSearches();
  }, []);

  useEffect(() => {
    const saveRecentSearches = async () => {
      try {
        await AsyncStorage.setItem(
          'recentSearches',
          JSON.stringify(recentSearches),
        );
      } catch (error) {
        console.error('Failed to save recent searches:', error);
      }
    };
    saveRecentSearches();
  }, [recentSearches]);

  const performSearch = useCallback(
    (text: string) => {
      if (text.trim().length === 0) {
        setResults([]);
        return;
      }
      const filtered = allProducts.filter(
        product =>
          product.name.toLowerCase().includes(text.toLowerCase()) ||
          product.description?.toLowerCase().includes(text.toLowerCase()) ||
          product.brand?.toLowerCase().includes(text.toLowerCase()),
      );
      setResults(filtered);

      if (text.trim() && !recentSearches.includes(text.trim())) {
        setRecentSearches(prev => [text.trim(), ...prev.slice(0, 4)]);
      }
    },
    [allProducts, recentSearches],
  );

  const debouncedSearch = useMemo(
    () => debounce(performSearch, 500),
    [performSearch],
  );

  const handleSearch = (text: string) => {
    setQuery(text);
    debouncedSearch(text);
  };

  const handleKeyPress = (event: any) => {
    if (event.nativeEvent.key === 'Enter' && query.trim()) {
      debouncedSearch.cancel();
      performSearch(query);
    }
  };

  const handleAddToCart = (product: ProductParams) => {
    if (!user) {
      Alert.alert(
        'Please Log In',
        'You need to log in to add items to your cart.',
        [
          {text: 'Cancel'},
          {
            text: 'Log In',
            onPress: () => navigation.navigate('AuthStack', {screen: 'Login'}),
          },
        ],
      );
      return;
    }
    dispatch(addToCart({productId: product._id, count: 1}));
  };

  return (
    <SafeAreaView className="flex-1 p-4 bg-white">
      <TextInput
        value={query}
        onChangeText={handleSearch}
        onKeyPress={handleKeyPress}
        placeholder="Search for products..."
        className="border p-3 rounded-lg mb-4 m-2"
        returnKeyType="search"
      />

      {recentSearches.length > 0 ? (
        <View className="mb-4">
          <View className="flex-row justify-between m-2">
            <Text className="text-gray-700 font-bold mb-2">
              Recent Searches:
            </Text>
            <View className="flex-row justify-between items-center mb-2">
              
              <TouchableOpacity onPress={() => setRecentSearches([])}>
                <Text className="text-blue-500">Clear All</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recentSearches.map((term, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => {
                  setQuery(term);
                  performSearch(term);
                }}
                className="bg-gray-200 rounded-full px-4 py-2 mr-2">
                <Text>{term}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ) : (
        <>
          <Text className="text-xl font-semibold p-2 text-orange-600 text-center">
            Search Your Products
          </Text>
          <Image
            source={{uri: 'http://localhost:8000/assets/Search.jpg'}}
            style={{resizeMode: 'contain'}}
            className="h-full w-full"
          />
        </>
      )}

      {results.length > 0 ? (
        <FlatList
          data={results}
          keyExtractor={item => item._id}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('DetailScreen', {id: item._id})
              }
              className="mb-4 flex-row border p-3 rounded-xl gap-3 items-center m-2">
              <Image
                source={{
                  uri: item.images?.[0] || 'https://via.placeholder.com/100',
                }}
                className="w-24 h-24 rounded-lg"
              />
              <View className="flex-1 ml-2">
                <Text className="font-bold text-lg">{item.name}</Text>
                <Text className="text-sm text-gray-500" numberOfLines={2}>
                  {item.description}
                </Text>
                <Text className="text-cyan-700 font-semibold mt-1">
                  R {item.price}
                </Text>
                <TouchableOpacity
                  onPress={() => handleAddToCart(item)}
                  className="mt-2 bg-cyan-800 p-2 rounded-full">
                  <Text className="text-white text-center">Add to Cart</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : query.length > 0 ? (
        <Text className="text-center text-red-500">
          No results found for "{query}"
        </Text>
      ) : null}
    </SafeAreaView>
  );
};

export default ExploreScreen;
