import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import Animated from "react-native-reanimated";

import {
  Provider as PaperProvider,
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme,
} from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

import { DrawerContent } from "./DrawerContent";

import MainTabNavigation from "./MainTabNavigation";
import SupportScreen from "../../src/screens/SupportScreen";
import SettingsScreen from "../../src/screens/SettingsScreen";
import BookmarkScreen from "../../src/screens/BookmarkScreen";
import SignInScreen from "../../src/screens/authentication/SignInScreen";
import SignUpScreen from "../../src/screens/authentication/SignUpScreen";
import ForgetPasswordScreen from "../../src/screens/authentication/ForgetPasswordScreen";
import HeaderLeft from "../../src/components/HeaderLeft";
import AdminHomeScreen from "../../src/screens/admin/AdminHomeScreen";
//import AsyncStorage from "@react-native-community/async-storage";
import AboutUsScreen from "../screens/AboutUsScreen";

const Drawer = createDrawerNavigator();

const AppStack = () => {
  // -- Animated screen
  const [progress, setProgress] = useState(new Animated.Value(0));

  const scale = Animated.interpolate(progress, {
    inputRange: [0, 1],
    outputRange: [1, 0.8],
  });
  const borderRadius = Animated.interpolate(progress, {
    inputRange: [0, 1],
    outputRange: [0, 30],
  });
  // -- Animated screen
  const animatedStyle = {
    borderRadius,
    transform: [{ scale }],
    shadowColor: "grey",
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 20 },
    elevation: 5,
  };

  const [isDarkTheme, setIsDarkTheme] = React.useState(false);

  const CustomDefaultTheme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      ...PaperDefaultTheme.colors,
      background: "#246b6b",
      text: "#333333",
    },
  };

  const CustomDarkTheme = {
    ...NavigationDarkTheme,
    ...PaperDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      ...PaperDarkTheme.colors,
      background: "#333333",
      text: "#ffffff",
    },
  };

  const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

  const AuthStack = createStackNavigator();
  const MainStack = createStackNavigator();

  const MainStackScreen = ({ navigation, style }) => {
    const { colors } = useTheme();

    return (
      <Animated.View style={StyleSheet.flatten([styles.stack, style])}>
        <MainStack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: colors.background,
              shadowColor: colors.background, // iOS
              elevation: 0, // Android
            },
            headerTintColor: "white",// colors.text,
            headerLeft: () => (
              <HeaderLeft onPress={() => navigation.openDrawer()} />
            ),
          }}
        >
          <MainStack.Screen
            name="MainRoot"
            options={{
              title: "",              
              headerBackTitle: null,
              headerBackTitleVisible: false,
            }}
            component={MainTabNavigation}
          />
          <MainStack.Screen name="SupportScreen"
            options={{
              title: "",
            }}
          >
            {(props) => (
              <SupportScreen {...props} style={animatedStyle} />
            )}
          </MainStack.Screen>
          <MainStack.Screen name="SettingsScreen"
            options={{
              title: "",
            }}
          >
            {(props) => (
              <SettingsScreen {...props} style={animatedStyle} />
            )}
          </MainStack.Screen>
          <MainStack.Screen name="BookmarkScreen"
            options={{
              title: "",
            }}
          >
            {(props) => (
              <BookmarkScreen {...props} style={animatedStyle} />
            )}
          </MainStack.Screen>
          <MainStack.Screen name="Admin"
            options={{
              title: "",
            }}
          >
            {(props) => (
              <AdminHomeScreen {...props} style={animatedStyle} />
            )}
          </MainStack.Screen>
          <MainStack.Screen name="AboutUsScreen"
            options={{
              title: "",
            }}
          >
            {(props) => (
              <AboutUsScreen {...props} style={animatedStyle} />
            )}
          </MainStack.Screen>
        </MainStack.Navigator>
      </Animated.View>
    );
  };

  const AuthenticationStackScreen = ({ navigation, style }) => {
    const { colors } = useTheme();

    return (
      <Animated.View style={StyleSheet.flatten([styles.stack, style])}>
        <AuthStack.Navigator
          initialRouteName="SignIn"
          screenOptions={{
            headerStyle: {
              backgroundColor: colors.background,
              shadowColor: colors.background, // iOS
              elevation: 0, // Android
            },
            headerTintColor: colors.text,
            headerLeft: () => (
              <HeaderLeft onPress={() => navigation.openDrawer()} />
            ),
          }}
        >
          <AuthStack.Screen
            name="SignUp"
            options={{
              title: "",
              headerBackTitle: null,
              headerBackTitleVisible: false,
            }}
            component={SignUpScreen}
          />
          <AuthStack.Screen
            name="SignIn"
            component={SignInScreen}
            options={{
              title: "",
              headerBackTitle: null,
              headerBackTitleVisible: false,
            }}
          />

          <AuthStack.Screen
            name="ForgetPassword"
            options={{
              title: "",
              headerBackTitle: null,
              headerBackTitleVisible: false,
            }}
            component={ForgetPasswordScreen}
          />
        </AuthStack.Navigator>
      </Animated.View>
    );
  };

  return (
    <PaperProvider theme={theme}>
      <LinearGradient style={{ flex: 1 }} colors={["#f5f5f5", "#fff0f0"]}>
        <NavigationContainer theme={theme}>
        <Animated.View style={styles.stack}>
        <Drawer.Navigator
            drawerType="slide"
            overlayColor="transparent"
            drawerStyle={styles.drawerStyles}
            contentContainerStyle={{ flex: 1 }}
            drawerContentOptions={{
              activeBackgroundColor: "transparent",
              activeTintColor:"#246b6b",
              inactiveTintColor: "white",
              
            }}
            sceneContainerStyle={{ backgroundColor: "transparent" }}
            drawerContent={(props) => {
              setProgress(props.progress);
              return <DrawerContent {...props} />;
            }}
          >            
            <Drawer.Screen name="HomeDrawer">
              {(props) => (
                <MainStackScreen {...props} style={animatedStyle} />
              )}
            </Drawer.Screen>
            
            <Drawer.Screen name="AuthScreen">
              {(props) => (
                <AuthenticationStackScreen {...props} style={animatedStyle} />
              )}
            </Drawer.Screen>
          </Drawer.Navigator>
      </Animated.View>
        </NavigationContainer>
      </LinearGradient>
    </PaperProvider>
  );
};

export default AppStack;

const styles = StyleSheet.create({
  stack: {
    flex: 1,
    shadowColor: "#FFF",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
    overflow: "hidden",
  },
  drawerStyles: { flex: 1, width: "75%", backgroundColor: "transparent" },
  drawerItem: { alignItems: "flex-start", marginVertical: 0 },
  drawerLabel: { color: "#246b6b", marginLeft: -16 },
  avatar: {
    borderRadius: 60,
    marginBottom: 16,
    borderColor: "white",
    borderWidth: StyleSheet.hairlineWidth,
  },

  menuOuter: {
    top: -5,
    marginLeft: 20,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#92a3b0",
    paddingLeft: 6,
    paddingRight: 6,
    paddingTop: 2,
    borderRadius: 22,
    shadowColor: "grey",
    shadowRadius: 3,
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
});
