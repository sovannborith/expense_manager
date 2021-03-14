import React from "react";
import { SafeAreaView } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import AppStack from "./AppStack";
import AuthStack from "./AuthStack";
import { COLORS, SIZES } from "../constants";

const Stack = createStackNavigator();

const MainStack = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <Stack.Navigator initialRouteName="App" headerMode="none">
        <Stack.Screen name="App" component={AppStack} />
        <Stack.Screen
          name="Auth"
          component={AuthStack}
          options={{ header: () => null }}
        />
      </Stack.Navigator>
    </SafeAreaView>
  );
};

export default MainStack;
