import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import SignupScreen from "../screens/authentication/SignUpScreen";
import SignInScreen from "../screens/authentication/SignInScreen";
import ForgetPasswordScreen from "../screens/authentication/ForgetPasswordScreen";
import BackButton from "../components/BackButton";
import { COLORS } from "../constants";

const AuthStack = ({ navigation }) => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="SignIn"
      options={{ header: () => null, headerTintColor: COLORS.white }}
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
          shadowColor: COLORS.primary, // iOS
          elevation: 0, // Android
        },
        headerTintColor: COLORS.white,
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
          headerLeft: () => (
            <BackButton
              onPress={() =>
                navigation.navigate("SignIn", { screen: "SignIn" })
              }
            />
          ),
        }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignupScreen}
        options={{
          title: "Sign Up",
          headerLeft: () => (
            <BackButton
              onPress={() =>
                navigation.navigate("SignIn", { screen: "SignIn" })
              }
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
