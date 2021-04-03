import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { Avatar } from "react-native-paper";
import { COLORS } from "../constants";
import AddTransactionScreen from "../screens/AddTransactionScreen";
import BackButton from "../components/BackButton";
import HeaderRight from "../components/HeaderRight";
const Stack = createStackNavigator();

const AddTransactionStack = ({ navigation }) => {
  return (
    <Stack.Navigator
      initialRouteName="Profile"
      options={{
        headerTintColor: COLORS.white,
        title: "",
      }}
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
          shadowColor: COLORS.primary, // iOS
          elevation: 0, // Android
        },
        //headerShown: false,
        headerTintColor: COLORS.white,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="AddTransaction"
        component={AddTransactionScreen}
        options={{
          //header: () => null,
          /* headerLeft: () => (
            <BackButton
              //onPress={() => navigation.navigate("App", { screen: "Home" })}
              onPress={() => navigation.goBack()}
            />
          ), */
          headerRight: () => (
            <HeaderRight onPress={() => navigation.navigate("Profile")} />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default AddTransactionStack;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-end",
    marginRight: 50,
    backgroundColor: "blue",
  },
});
