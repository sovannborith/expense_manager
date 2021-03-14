import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  SafeAreaView,
} from "react-native";

import FormInput from "../../components/form/FormInput";
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
        <View style={styles.signInWrapper}>
          <FormInput labelValue="User ID" iconType="user" />
          <FormInput labelValue="Display Name" iconType="user" />
          <FormInput labelValue="Email" iconType="user" />
          <FormInput labelValue="Phone Number" iconType="contacts" />
          <FormInput labelValue="Photo Url" iconType="picture" />
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
    height: 125,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  logo: {
    height: 120,
    width: 120,
    resizeMode: "cover",
  },
  signInWrapper: {
    flex: 1,

    alignItems: "center",
    height: "100%",
    padding: 10,
  },
});
