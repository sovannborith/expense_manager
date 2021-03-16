import React, { useContext } from "react";
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { AuthContext } from "../server/context/AuthProvider";
import { COLORS } from "../constants";
import api from "../services/api";

const LogOutButton = ({ props }) => {
  const { loginUser, signOut } = useContext(AuthContext);

  const handleSignOut = () => {
    Alert.alert(
      //title
      "Sign Out Confirmation",
      //body
      "Are you sure want to sign out?",
      [
        {
          text: "Yes",
          onPress: () => {
            signOut();
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
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleSignOut} style={styles.profileButton}>
        {loginUser ? (
          <AntDesign name="logout" size={24} color={COLORS.white} />
        ) : null}
      </TouchableOpacity>
    </View>
  );
};

export default LogOutButton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    marginLeft: 10,
  },
  profileButton: {
    shadowColor: COLORS.gray,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  image: {
    width: 24,
    height: 24,
    tintColor: COLORS.white,
  },
});
