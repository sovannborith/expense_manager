import React from "react";
import { View, Dimensions, Text, StyleSheet } from "react-native";

import LottieView from "lottie-react-native";

const windowWidth = Dimensions.get("window").width;
const Loader = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: windowWidth,
      }}
    >
      <LottieView
        source={require("../assets/splash-turismo.json")}
        autoPlay
        loop
        width={windowWidth}
      />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  loadingText: {
    fontSize: 16,
    color: "#246b6b",
  },
});
