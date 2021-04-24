import React, { useContext } from "react";
import { StyleSheet, Alert } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthContext } from "../server/context/AuthProvider";
import { COLORS } from "../constants";
import AddTransactionScreen from "../screens/transaction/AddTransactionScreen";
import TransactionByCategoryScreen from "../screens/transaction/TransactionByCategoryScreen";
import TransactionList from "../screens/transaction/TransactionList";
import LogOutButton from "../components/LogOutButton";
import HeaderRight from "../components/HeaderRight";
const Stack = createStackNavigator();

const TransactionStack = ({ navigation }) => {
  const { signOut } = useContext(AuthContext);
  return (
    <Stack.Navigator
      initialRouteName="AddTransaction"
      options={{
        headerTintColor: COLORS.white,
      }}
      screenOptions={{
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
    >
      <Stack.Screen
        name="AddTransaction"
        component={AddTransactionScreen}
        mode="modal"
        options={{
          title: "Add New Transaction",
        }}
      />
      <Stack.Screen
        name="TransactionByCategory"
        component={TransactionByCategoryScreen}
        options={({ route }) => ({ title: route.params.title })}
      />
      <Stack.Screen
        name="TransactionList"
        component={TransactionList}
        options={{
          headerTitle: "Current Month Transaction",
        }}
      />
    </Stack.Navigator>
  );
};

export default TransactionStack;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-end",
    marginRight: 50,
    backgroundColor: "blue",
  },
});
