import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import AppStack from "./AppStack";
import AuthStack from "./AuthStack";

const Stack = createStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator initialRouteName="App" headerMode="none">
      <Stack.Screen name="App" component={AppStack} />
      <Stack.Screen
        name="Auth"
        component={AuthStack}
        options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
