import React, { useState } from "react";
import { View, StyleSheet, Image, SafeAreaView, Text } from "react-native";
import * as Animatable from "react-native-animatable";
import FormInput from "../components/form/FormInput";
import SwipeButton from "../components/SwipeButton";
import { COLORS, SIZES } from "../constants";

const AddTransactionScreen = () => {
  const [toggleState, setToggleState] = useState(false);

  const handleToggle = (value) => setToggleState(value);
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.logoCover}>
          <Image
            source={require("../assets/logo_01.png")}
            style={styles.logo}
          />
          <Animatable.View animation="fadeInUpBig">
            <View>
              <Text>Add New Transaction</Text>

              <SwipeButton onToggle={handleToggle} />
            </View>
            <View style={styles.signInWrapper}>
              <FormInput labelValue="User ID" iconType="user" />
              <FormInput labelValue="Display Name" iconType="user" />
              <FormInput labelValue="Email" iconType="user" />
              <FormInput labelValue="Phone Number" iconType="contacts" />
              <FormInput labelValue="Photo Url" iconType="picture" />
            </View>
          </Animatable.View>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default AddTransactionScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    flex: 1,
  },
  logoCover: {
    alignItems: "center",
    backgroundColor: COLORS.primary,
    alignItems: "center",
    height: SIZES.height,
  },
  logo: {
    height: 120,
    width: 120,
    resizeMode: "cover",
  },
  signInWrapper: {
    flex: 1,
    alignItems: "center",
    width: SIZES.width,
    marginTop: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: COLORS.lightGray,
    padding: 10,
  },
});
