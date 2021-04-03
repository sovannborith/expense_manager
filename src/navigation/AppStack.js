import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { COLORS } from "../constants";
import OnboardingScreen from "../screens/OnboardingScreen";
import AuthStack from "../navigation/AuthStack";
import HomeTabNavigation from "../navigation/HomeTabNavigation";
import ProfileStack from "../navigation/ProfileStack";
import HeaderRight from "../components/HeaderRight";
import LogOutButton from "../components/LogOutButton";

const AppStack = ({ navigation }) => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="App"
      screenOptions={{
        headerShown: false,

        //header: () => null,
        //title: "Expense Manager",
        /* headerStyle: {
          backgroundColor: COLORS.primary,
          shadowColor: COLORS.primary, // iOS
          elevation: 0, // Android
        },
        headerTintColor: COLORS.white,
        headerTitleStyle: {
          fontWeight: "bold",
        }, */
      }}
    >
      <Stack.Screen name="App" component={HomeTabNavigation} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Profile" component={ProfileStack} />
      <Stack.Screen name="Auth" component={AuthStack} />
    </Stack.Navigator>
  );
};

export default AppStack;
