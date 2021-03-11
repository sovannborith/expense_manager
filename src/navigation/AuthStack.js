import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import SignupScreen from "../screens/authentication/SignUpScreen";
import SignInScreen from "../screens/authentication/SignInScreen";
import ForgetPasswordScreen from "../screens/authentication/ForgetPasswordScreen";
import OnboardingScreen from "../screens/OnboardingScreen";
import Loader from "../components/LoadingComponent";

import FontAwesome from "react-native-vector-icons/FontAwesome";

const AuthStack = () => {
  const Stack = createStackNavigator();
  /* 
  if (loginUser === null) {
    route;
  } else if (isFirstLaunch == true) {
    routeName = "Onboarding";
  } else {
    routeName = "SignIn";
  } */

  return (
    <Stack.Navigator initialRouteName="SignIn">
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="ForgetPassword"
        component={ForgetPasswordScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignupScreen}
        options={({ navigation }) => ({
          title: "",
          headerStyle: {
            backgroundColor: "#f9fafd",
            shadowColor: "#f9fafd",
            elevation: 0,
          },
          headerLeft: () => (
            <View style={{ marginLeft: 10 }}>
              <FontAwesome.Button
                name="long-arrow-left"
                size={25}
                backgroundColor="#f9fafd"
                color="#333"
                onPress={() => navigation.navigate("Login")}
              />
            </View>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
