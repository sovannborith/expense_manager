import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { COLORS } from "../constants";
import BackButton from "../components/BackButton";
import HeaderRight from "../components/HeaderRight";
import ReportScreen from "../screens/report/ReportScreen";
const Stack = createStackNavigator();

const ReportStack = ({ navigation }) => {
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
          headerLeft: () => (
            <BackButton
              onPress={() =>
                navigation.goBack()
              }
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
