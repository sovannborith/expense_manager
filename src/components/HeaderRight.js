import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { Avatar } from "react-native-paper";

const HeaderRight = ({ onPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <Image source={require("../assets/favicon.png")} height={30} />
      </TouchableOpacity>
    </View>
  );
};

export default HeaderRight;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-end",
    marginRight: 50,
    backgroundColor: "blue",
  },
});
