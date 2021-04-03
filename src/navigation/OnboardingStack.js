import React from "react";
import { StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import { COLORS } from "../constants";
import OnboardingScreen from "../screens/OnboardingScreen";

import LogOutButton from "../components/LogOutButton";

const OnboardingStack = ({ navigation }) => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="Home"
      options={{
        headerTintColor: COLORS.white,
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
        headerLeft: () => <LogOutButton />,
      }}
    >
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{ header: () => null, title: "", headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default OnboardingStack;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-end",
    marginRight: 50,
    backgroundColor: "blue",
  },
});
