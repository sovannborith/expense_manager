import React from "react";
import { StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { COLORS } from "../constants";

import EditProfileScreen from "../screens/profile/EditProfileScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import BackButton from "../components/BackButton";
import EditProfileIcon from "../components/EditProfileIcon";
//import HeaderRight from "../components/HeaderRight";
const Stack = createStackNavigator();

const ProfileStack = ({ navigation }) => {
  return (
    <Stack.Navigator
      initialRouteName="Profile"
      options={{
        headerTintColor: COLORS.white,
        title: "Your Profile",
      }}
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
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Your Profile",
          headerLeft: () => (
            <BackButton
              onPress={() =>
                //navigation.navigate("App", { screen: "Home" })
                navigation.goBack()
              }
            />
          ),
          headerRight: () => (
            <EditProfileIcon
              onPress={() => navigation.navigate("EditProfile")}
            />
          ),
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          title: "Edit Profile",
          headerLeft: () => (
            <BackButton
              onPress={() =>
                navigation.navigate("Profile", { screen: "Profile" })
              }
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-end",
    marginRight: 50,
    backgroundColor: "blue",
  },
});
