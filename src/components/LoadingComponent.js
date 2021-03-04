import React from "react";
import { View, ActivityIndicator } from "react-native";

const Loading = ({ size }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size={size} />
    </View>
  );
};

export default Loading;
