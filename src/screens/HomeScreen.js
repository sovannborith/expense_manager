import React, { useState, useContext, useEffect } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";

import FormButton from "../components/form/FormButton";
import Loader from "../components/LoadingComponent";

const HomeScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [isFirstLaunch, setFirstLaunch] = useState(true);
  const { signOut } = useContext(UserContext);

  const checkFirstLaunch = async () => {
    try {
      setLoading(true);
      const value = await AsyncStorage.getItem("@isFirstLaunch");
      //alert("First Launch " & value);
      if (value !== null) {
        setFirstLaunch(false);
      }
      if (isFirstLaunch) {
        navigation.navigate("Onboarding");
      }
    } catch (e) {
      alert(e);
    } finally {
      setLoading(false);
    }
  };

  const checkLoginUser = async () => {
    try {
      const loginUser = await AsyncStorage.getItem("@loginUser");

      if (!loginUser) {
        navigation.navigate("Auth", { screen: "Login" });
      }
    } catch (e) {
      alert(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkFirstLaunch();
    checkLoginUser();
  }, []);

  const logOff = () => {
    signOut();
    AsyncStorage.removeItem("@isFirstLaunch");
    navigation.navigate("Home");
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
