import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { COLORS } from "../constants";
import OnboardingScreen from "../screens/OnboardingScreen";
import AuthStack from "../navigation/AuthStack";
import HomeTabNavigation from "../navigation/HomeTabNavigation";
import ProfileStack from "../navigation/ProfileStack";
import HeaderRight from "../components/HeaderRight";
import LogOutButton from "../components/LogOutButton";

const AppStack = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="App"
      headerMode="none"
      screenOptions={{
        headerShown: false,
        header: null,
        navigationOptions: {
          headerForceInset: { top: "never", bottom: "never" },
        },
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
