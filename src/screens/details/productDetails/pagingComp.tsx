import { View, Dimensions,Animated, StyleSheet } from 'react-native'
import React from 'react'

const {width} = Dimensions.get('screen')
type Props = {
  data: string[];          
  scrollX: Animated.Value;
  index: number;
};

const PagingComp = ({data, scrollX, index}:Props) => {
  return (
    <View style={{
        marginTop:30,
        flexDirection:'row',
        width:'100%',
        justifyContent:'center',
        alignItems:'center'
    }}>
      {data.map((_: any, idx: number) => {
        const inputRange = [(idx - 1) * width,idx* width,(idx + 1) * width];
        const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange:[12, 30, 12],
            extrapolate: 'clamp',
        });
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange:[10, 1, 10],
          extrapolate: 'clamp',
      });
        return <Animated.View key={idx.toString()} style=
          {[{
            width:12,
            height:12,
            borderRadius:6,
            backgroundColor:'#ccc',
            marginHorizontal:4
          },{width:dotWidth,opacity},
          idx == index && styles.dotActive
        ]}/>
      })}
    </View>
  )
}

export default PagingComp
const styles = StyleSheet.create({
    dotActive: {
        backgroundColor:'red'
    }
})