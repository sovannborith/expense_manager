import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { Avatar } from "react-native-paper";
import { COLORS } from "../constants";
import AddTransactionScreen from "../screens/AddTransactionScreen";
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

        headerTintColor: COLORS.white,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="AddTransaction"
        component={AddTransactionScreen}
        options={{ header: () => null }}
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
