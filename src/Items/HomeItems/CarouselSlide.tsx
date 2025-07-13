import React, {useRef, useEffect, useState} from 'react';
import {
  FlatList,
  View,
  Image,
  Dimensions,
  Animated,
  ImageProps,
} from 'react-native';

const {width} = Dimensions.get('window');

type ImageItem = {
  id: string;
  image: ImageProps;
};

const images: ImageItem[] = [
  {id: '1', image: require('../../images/carousel/carousel1.jpg')},
  {id: '2', image: require('../../images/carousel/carousel2.jpg')},
  {id: '3', image: require('../../images/carousel/carousel3.jpg')},
  {id: '4', image: require('../../images/carousel/carousel4.jpg')},
];

export default function CarouselSlide() {
  const flatListRef = useRef<FlatList<ImageItem>>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = index + 1;

      if (nextIndex >= images.length) {
        flatListRef.current?.scrollToIndex({index: 0, animated: false});
        nextIndex = 0;
      } else {
        flatListRef.current?.scrollToIndex({index: nextIndex, animated: true});
      }

      setIndex(nextIndex);
    }, 5000);

    return () => clearInterval(interval);
  }, [index]);

  const handleScroll = Animated.event(
    [{nativeEvent: {contentOffset: {x: scrollX}}}],
    {useNativeDriver: false},
  );

  const renderDots = () => {
    return images.map((_, i) => {
      const opacity = scrollX.interpolate({
        inputRange: [(i - 1) * width, i * width, (i + 1) * width],
        outputRange: [0.3, 1, 0.3],
        extrapolate: 'clamp',
      });

      const dotWidth = scrollX.interpolate({
        inputRange: [(i - 1) * width, i * width, (i + 1) * width],
        outputRange: [12, 30, 12],
        extrapolate: 'clamp',
      });

      return (
        <Animated.View
          key={i}
          style={[
            {
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: 'white',
              marginHorizontal: 5,
            },
            {opacity, width: dotWidth},
          ]}
        />
      );
    });
  };

  return (
    <View style={{alignItems: 'center'}}>
      <FlatList
        ref={flatListRef}
        data={images}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({item}) => (
          <View style={{width}}>
            <Image
              source={item.image}
              className="w-[width] h-[200] m-2 rounded"
              resizeMode="cover"
            />
          </View>
        )}
      />
      <View className="flex-row absolute bottom-4 items-center">
        {renderDots()}
      </View>
    </View>
  );
}
