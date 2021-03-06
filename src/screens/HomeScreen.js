import React, { useState, useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  ScrollView,
  Alert,
  SafeAreaView,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { UserContext } from "../server/context/UserContext";

import FormButton from "../components/form/FormButton";

const HomeScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  const { signOut } = useContext(UserContext);

  const logOff = () => {
    signOut();
    navigation.navigate("Home", { screen: "Home" });
  };

  const handleSubmit = () => {
    Alert.alert(
      //title
      "Sign Out Confirmation",
      //body
      "Are you sure want to sign out?",
      [
        {
          text: "Yes",
          onPress: () => {
            logOff();
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
    <SafeAreaView style={{ flex: 1, paddingTop: 20 }}>
      <StatusBar
        barStyle={theme.dark ? "light-content" : "dark-content"}
        style={{ backgroundColor: "#019131" }}
      />
      <View>
        <Text>Hello Expense Manager</Text>
      </View>

      <View>
        <FormButton
          buttonTitle="Sign In"
          loading={loading}
          onPress={handleSubmit}
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
