import React from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { COLORS, icons } from "../constants";

const BackButton = ({ onPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.profileButton}>
        <Image
          source={icons.back_arrow}
          resizeMode="contain"
          style={styles.image}
          color={COLORS.white}
        />
      </TouchableOpacity>
    </View>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    marginRight: 10,
  },
  profileButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    borderColor: COLORS.white,
    paddingLeft: 10,
    paddingTop: 10,
    /*borderWidth: 1,
     padding: 6,
    shadowColor: COLORS.gray,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3, */
  },
  image: {
    width: 24,
    height: 24,
    tintColor: COLORS.white,
  },
});
