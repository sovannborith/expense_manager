import React, { useContext } from "react";
import { StyleSheet, Alert } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthContext } from "../server/context/AuthProvider";
import { COLORS } from "../constants";
import AddTransactionScreen from "../screens/AddTransactionScreen";
import LogOutButton from "../components/LogOutButton";
import HeaderRight from "../components/HeaderRight";
const Stack = createStackNavigator();

const AddTransactionStack = ({ navigation }) => {
  const { signOut } = useContext(AuthContext);
  return (
    <Stack.Navigator
      initialRouteName="AddTransaction"
      options={{
        headerTintColor: COLORS.white,
      }}
      screenOptions={{
        title: "Add New Transaction",
        headerStyle: {
          backgroundColor: COLORS.primary,
          shadowColor: COLORS.primary, // iOS
          elevation: 0, // Android

          //marginTop: 500,
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

export default AddTransactionStack;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-end",
    marginRight: 50,
    backgroundColor: "blue",
  },
});
