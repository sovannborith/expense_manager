import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { Avatar } from "react-native-paper";

import HomeScreen from "../screens/HomeScreen";
import OnboardingScreen from "../screens/OnboardingScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
//import HeaderRight from "../components/HeaderRight";
const Stack = createStackNavigator();

const AppStack = ({ navigation }) => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      options={{
        headerTintColor: "#fff",
        title: "",
      }}
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
        name="Onboarding"
        component={OnboardingScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "",
          HeaderRight: () => (
            <View style={styles.container}>
              <TouchableOpacity onPress={navigation.navigate("Profile")}>
                <Avatar.Image
                  source={require("../assets/favicon.png")}
                  height={30}
                />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Your Profile",
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
