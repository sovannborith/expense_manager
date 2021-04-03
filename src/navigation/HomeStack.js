import React, { useContext } from "react";
import { StyleSheet, Alert } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthContext } from "../server/context/AuthProvider";

import { COLORS } from "../constants";

import HomeScreen from "../screens/HomeScreen";
import HeaderRight from "../components/HeaderRight";
import LogOutButton from "../components/LogOutButton";

const Stack = createStackNavigator();

const HomeStack = ({ navigation }) => {
  const { signOut } = useContext(AuthContext);
  return (
    <Stack.Navigator
      initialRouteName="Home"
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
        name="Home"
        component={HomeScreen}
        options={{
          title: "Expense Manager",
          headerLeft: () => (
            <LogOutButton
              onPress={() => {
                Alert.alert(
                  //title
                  "Sign Out Confirmation",
                  //body
                  "Are you sure want to sign out?",
                  [
                    {
                      text: "Yes",

                      onPress: async () => {
                        await signOut().then(() => {
                          navigation.navigate("Auth", { screen: "SignIn" });
                        });
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
              }}
            />
          ),
          headerRight: () => (
            <HeaderRight onPress={() => navigation.navigate("Profile")} />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
