import React from 'react';
import { View } from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';

const ProductShimmer = () => {
  return (
    <View className="flex-row flex-wrap justify-between px-3">
      {[...Array(6)].map((_, index) => (
        <View
          key={index}
          className="w-[47%] h-60 bg-white rounded-lg mb-4 p-2"
        >
          <ShimmerPlaceholder
            LinearGradient={LinearGradient}
            style={{ width: '100%', height: 100, borderRadius: 8 }}
          />
          <ShimmerPlaceholder
            LinearGradient={LinearGradient}
            style={{ width: '60%', height: 15, marginTop: 10, borderRadius: 4 }}
          />
          <ShimmerPlaceholder
            LinearGradient={LinearGradient}
            style={{ width: '40%', height: 15, marginTop: 6, borderRadius: 4 }}
          />
          <ShimmerPlaceholder
            LinearGradient={LinearGradient}
            style={{ width: '30%', height: 15, marginTop: 6, borderRadius: 4 }}
          />
        </View>
      ))}
    </View>
  );
};

export default ProductShimmer;