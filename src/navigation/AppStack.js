import React from "react";
import { StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import { COLORS } from "../constants";

import HomeScreen from "../screens/HomeScreen";
import OnboardingScreen from "../screens/OnboardingScreen";
import HeaderRight from "../components/HeaderRight";
import BackButton from "../components/BackButton";
import ProfileStack from "../navigation/ProfileStack";
import AuthStack from "../navigation/AuthStack";

const Stack = createStackNavigator();

const AppStack = ({ navigation }) => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      options={{
        headerTintColor: COLORS.white,
        title: "",
      }}
      /* headerMode="none" */
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
          shadowColor: COLORS.primary, // iOS
          elevation: 0, // Android
        },
        /* headerShown: false, */
        headerTintColor: COLORS.white,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{ header: () => null, title: "" }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Expense Tracker",
          headerRight: () => (
            <HeaderRight onPress={() => navigation.navigate("Profile")} />
          ),
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          title: "Your Profile",
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
          headerRight: () => (
            <HeaderRight onPress={() => navigation.navigate("Profile")} />
          ),
        }}
      />
      <Stack.Screen
        name="Auth"
        component={AuthStack}
        options={{
          title: "Sign In",
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default AppStack;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-end",
    marginRight: 50,
    backgroundColor: "blue",
  },
});
