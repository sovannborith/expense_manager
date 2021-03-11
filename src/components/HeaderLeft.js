import React from "react";
import { View, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const HeaderLeft = ({ onPress }) => {
  return (
    <View style={styles.menuOuter}>
      <MaterialIcons name="arrow-back" size={24} onPress={onPress} />
    </View>
  );
};

export default HeaderLeft;

const styles = StyleSheet.create({});
