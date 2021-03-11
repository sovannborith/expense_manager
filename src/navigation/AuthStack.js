import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import SignupScreen from "../screens/authentication/SignUpScreen";
import SignInScreen from "../screens/authentication/SignInScreen";
import ForgetPasswordScreen from "../screens/authentication/ForgetPasswordScreen";

const AuthStack = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="SignIn"
      options={{ header: () => null, headerTintColor: "#fff" }}
      screenOptions={{
        headerStyle: {
          backgroundColor: "#ee3431",
          shadowColor: "#ee3431", // iOS
          elevation: 0, // Android
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{
          title: "Sign In",
        }}
      />
      <Stack.Screen
        name="ForgetPassword"
        component={ForgetPasswordScreen}
        options={{
          title: "Forget Password",
        }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignupScreen}
        options={{
          title: "Sign Up",
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
