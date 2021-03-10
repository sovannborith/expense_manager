import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import SignupScreen from "../screens/authentication/SignUpScreen";
import SignInScreen from "../screens/authentication/SignInScreen";
import ForgetPasswordScreen from "../screens/authentication/ForgetPasswordScreen";
import OnboardingScreen from "../screens/authentication/OnboardingScreen";
import Loader from "../components/LoadingComponent";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthStack = () => {
  const Stack = createStackNavigator();
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const [loading, setLoading] = useState(false);
  let routeName;

  useEffect(() => {
    try {
      AsyncStorage.getItem("@alreadyLaunched").then((value) => {
        alert(value);
        if (value === null) {
          //AsyncStorage.setItem("alreadyLaunched", "true"); // No need to wait for `setItem` to finish, although you might want to handle errors
          setIsFirstLaunch(true);
        } else {
          setIsFirstLaunch(false);
        }
      }); // Add some error handling, also you can simply do setIsFirstLaunch(null)
    } catch (e) {
      alert(e);
    }
  }, []);

  if (isFirstLaunch === null) {
    setLoading(true);
    return <Loader isLoading={loading} />;
  } else if (isFirstLaunch == true) {
    routeName = "Onboarding";
  } else {
    routeName = "SignIn";
  }
  alert(routeName);
  //routeName = "Onboarding";
  return (
    <Stack.Navigator initialRouteName={routeName}>
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{ header: () => null }}
      />
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
