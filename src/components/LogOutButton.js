import React, { useContext } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { AuthContext } from "../server/context/AuthProvider";
import { COLORS } from "../constants";

const LogOutButton = ({ onPress }) => {
  const { loginUser, signOut } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.profileButton}>
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
    justifyContent: "center",
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
