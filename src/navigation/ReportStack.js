import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthContext } from "../server/context/AuthProvider";
import { COLORS } from "../constants";
import HeaderRight from "../components/HeaderRight";
import ReportScreen from "../screens/report/ReportScreen";
import LogOutButton from "../components/LogOutButton";
const Stack = createStackNavigator();

const ReportStack = ({ navigation }) => {
  const { signOut } = useContext(AuthContext);
  return (
    <Stack.Navigator
      initialRouteName="Report"
      options={{
        headerTintColor: COLORS.white,
        title: "Report",
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
        name="Report"
        component={ReportScreen}
        options={{
          /* headerLeft: () => (
            <BackButton
              onPress={() =>
                navigation.goBack()
              }
            />
          ), */
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

export default ReportStack;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-end",
    marginRight: 50,
    backgroundColor: "blue",
  },
});
