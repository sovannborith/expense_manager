import React from "react";
import { View } from "react-native";

import LottieView from "lottie-react-native";

const Loader = ({ isLoading }) => {
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <LottieView
          source={require("../assets/splash-turismo.json")}
          autoPlay
          loop
        />
      </View>
    );
  } else {
    return null;
  }
};

export default Loader;
