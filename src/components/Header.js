import React, { useContext } from "react";
import { View, StyleSheet, Alert, Text } from "react-native";
import { COLORS, SIZES } from "../constants";
import { AuthContext } from "../server/context/AuthProvider";
import HeaderRight from "./HeaderRight";
import LogOutButton from "./LogOutButton";

const Header = ({ navigation, title }) => {
  const { signOut } = useContext(AuthContext);
  return (
    <View style={styles.container}>
      <LogOutButton
        onPress={() => {
          Alert.alert(
            //title
            "Sign Out Confirmation",
            //body
            "Are you sure want to sign out?",
            [
              {
                text: "Yes",

                onPress: async () => {
                  await signOut().then(() => {
                    navigation.navigate("Auth", { screen: "SignIn" });
                  });
                },
              },
              {
                text: "Cancel",
                onPress: () => true,
                style: "cancel",
              },
            ],
            { cancelable: false }
            //clicking out side of alert will not cancel
          );
        }}
      />
      <Text style={styles.title}>{title}</Text>
      <HeaderRight
        onPress={() => {
          navigation.navigate("Profile", { screen: "Profile" });
        }}
      />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.primary,
  },
  title: {
    fontWeight: "800",
    color: COLORS.white,
    fontSize: SIZES.h4,
  },
});
