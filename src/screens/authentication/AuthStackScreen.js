import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import SignInScreen from "./SignInScreen";
import SignUpScreen from "./SignUpScreen";

const RootStack = createStackNavigator();

const AuthStackScreen = ({ navigation }) => (
  <RootStack.Navigator headerMode="none" initialRouteName="SignIn">
    <RootStack.Screen name="SignIn" component={SignInScreen} options={{title=''} }/>
    <RootStack.Screen name="SignUp" component={SignUpScreen}  options={{title=''} }/>
  </RootStack.Navigator>
);

export default AuthStackScreen;
