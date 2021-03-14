import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  SafeAreaView,
} from "react-native";

import { COLORS } from "../../constants";

const ProfileScreen = () => {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.logoCover}>
          <Image
            source={require("../../assets/logo_01.png")}
            style={styles.logo}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoCover: {
    alignItems: "center",
    height: 160,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  logo: {
    height: 150,
    width: 150,
    resizeMode: "cover",
  },
});
