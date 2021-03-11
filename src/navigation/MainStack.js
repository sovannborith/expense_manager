import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import AppStack from "./AppStack";
import AuthStack from "./AuthStack";

const Stack = createStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator initialRouteName="App">
      <Stack.Screen
        name="App"
        component={AppStack}
        options={{ header: () => null }}
      />
      <Stack.Screen name="Auth" component={AuthStack} />
    </Stack.Navigator>
  );
};

export default MainStack;
