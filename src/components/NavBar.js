import React from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Touchable,
} from "react-native";

import { COLORS, FONTS, SIZES, icons } from "../constants";

const NavBar = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <Image />
      </TouchableOpacity>
    </View>
  );
};
export default NavBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 80,
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
});
