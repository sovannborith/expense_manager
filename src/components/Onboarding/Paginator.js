import React from "react";
import { View, StyleSheet, Animated } from "react-native";

import windowWidth from "../../utils/Dimensions";

const Paginator = ({ data, scrollX }) => {
  return (
    <View style={{ flexDirection: "row", height: 64 }}>
      {data.map((_, i) => {
        const inputRange = [
          (i - 1) * windowWidth,
          i * windowWidth,
          (i + 1) * windowWidth,
        ];

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [10, 20, 10],
          extrapolate: "clamp",
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: "clamp",
        });

        return (
          <Animated.View
            style={[styles.dot, { width: dotWidth, opacity: opacity }]}
            key={i.toString()}
          ></Animated.View>
        );
      })}
      ;
    </View>
  );
};

export default Paginator;

const style = StyleSheet.create({
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ee3431",
    marginHorizontal: 8,
  },
});
