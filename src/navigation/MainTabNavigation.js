import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import AnimatedTabBar, { TabsConfigsType } from "curved-bottom-navigation-bar";

import Icon from "react-native-vector-icons/Ionicons";
import {
  AntDesign,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import { useTheme, Avatar } from "react-native-paper";
import { View } from "react-native-animatable";
import { TouchableOpacity } from "react-native-gesture-handler";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import ResortDetailScreen from "../screens/ResortDetailScreen";
import { PRIMARY_COLOR } from "../constants/constant";
import ExploreScreen from "../screens/ExploreScreen";
import SplashScreen from "../screens/SplashScreen";
import ProvinceListScreen from "../screens/ProvinceListScreen";
import ProvinceDetailScreen from "../screens/ProvinceDetailScreen";
import ResortListScreen from "../screens/ResortListScreen";
import HotelListScreen from "../screens/HotelListScreen";
import HotelDetailScreen from "../screens/HotelDetailScreen";

const HomeStack = createStackNavigator();
const ResortStack = createStackNavigator();
const ExploreStack = createStackNavigator();
const ProvinceStack = createStackNavigator();
const HotelStack = createStackNavigator();


const Tab = createBottomTabNavigator();

const tabs = {
  Home: {
    icon: ({ progress }) => (
      <AntDesign name={"home"} size={22} color={PRIMARY_COLOR} />
    ),
  },
  Resorts: {
    icon: ({ progress }) => (
      <FontAwesome5 name={"plane"} size={22} color={PRIMARY_COLOR} />
    ),
  },
  Hotels: {
    icon: ({ progress }) => (
      <FontAwesome5 name={"hotel"} size={22} color={PRIMARY_COLOR} />
    ),
  },
  Provinces: {
    icon: ({ progress }) => (
      <AntDesign name="appstore-o" size={22} color={PRIMARY_COLOR} />
    ),
  },
  Emergency: {
    icon: ({ progress }) => (
      <AntDesign name={"contacts"} size={22} color={PRIMARY_COLOR} />
    ),
  },
  Explore: {
    icon: ({ progress }) => (
      <AntDesign name={"appstore-o"} size={22} color={PRIMARY_COLOR} />
    ),
  },
};

const MainTabNavigation = () => (
  <Tab.Navigator
    initialRouteName="Home"
    tabBar={(props) => (
      <AnimatedTabBar
        dotColor={"#f54ece"}
        dotSize={50}
        barColor={"#246b6b"}
        tabs={tabs}
        {...props}
      />
    )}
  >
    <Tab.Screen
      name="Home"
      component={HomeStackScreen}
      options={{
        tabBarLabel: "Home",
        tabBarColor: "#FF6347",
      }}
    />

    <Tab.Screen
      name="Resorts"
      component={ResortStackScreen}
      options={{
        tabBarLabel: "Resorts",
        tabBarColor: "#694fad",
      }}
    />
    <Tab.Screen
      name="Hotels"
      component={HotelStackScreen}
      options={{
        tabBarLabel: "Hotels",
        tabBarColor: "#694fad",
      }}
    />
    <Tab.Screen
      name="Provinces"
      component={ProvinceStackScreen}
      options={{
        tabBarLabel: "Provinces",
        tabBarColor: "#694fad",
      }}
    />
    <Tab.Screen
      name="Emergency"
      component={ExploreStackScreen}
      options={{
        tabBarLabel: "Emergency",
        tabBarColor: "#694fad",
      }}
    />

    <Tab.Screen
      name="Explore"
      component={HomeStackScreen}
      options={{
        tabBarLabel: "Explore",
        tabBarColor: "#694fad",
      }}
    />
  </Tab.Navigator>
);

const HomeStackScreen = ({ navigation, style }) => {
  const { colors } = useTheme();
  return (
    <HomeStack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
          shadowColor: colors.background, // iOS
          elevation: 0, // Android
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Welcome to KH Tour",

          headerLeft: () => (
            <View style={{ marginLeft: 10 }}>
              <Icon.Button
                name="ios-menu"
                size={25}
                color={colors.text}
                backgroundColor={colors.background}
                onPress={() => navigation.openDrawer()}
              />
            </View>
          ),
          headerRight: () => (
            <View style={{ flexDirection: "row", marginRight: 10 }}>
              <Icon.Button
                name="ios-search"
                size={25}
                color={colors.text}
                backgroundColor={colors.background}
                onPress={() => {}}
              />
              <TouchableOpacity
                style={{ paddingHorizontal: 10, marginTop: 5 }}
                onPress={() => {
                  navigation.navigate("Profile");
                }}
              >
                <Avatar.Image
                  source={{
                    uri:
                      "https://api.adorable.io/avatars/80/abott@adorable.png",
                  }}
                  size={30}
                />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
    </HomeStack.Navigator>
  );
};

const ProvinceStackScreen = ({ navigation }) => (
  <ProvinceStack.Navigator
    initialRouteName="ProvinceList"
    screenOptions={{
      headerStyle: {
        backgroundColor: "#1f65ff",
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold",
      },
    }}
  >
    <ProvinceStack.Screen
      name="ProvinceList"
      component={ProvinceListScreen}
      options={{
        title: "",
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#1f65ff"
            onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />
    <ProvinceStack.Screen
      name="ProvinceDetail"
      component={ProvinceDetailScreen}
      options={{
        title: "",
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#1f65ff"
            onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />
  </ProvinceStack.Navigator>
);

const ExploreStackScreen = ({ navigation }) => (
  <ExploreStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: "#1f65ff",
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold",
      },
    }}
  >
    <ExploreStack.Screen
      name="Explore"
      component={ExploreScreen}
      options={{
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#1f65ff"
            onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />
  </ExploreStack.Navigator>
);

const ResortStackScreen = ({ navigation }) => {
  const { colors } = useTheme();

  return (
    <ResortStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
          shadowColor: colors.background, // iOS
          elevation: 0, // Android
        },
        headerTintColor: colors.text,
      }}
    >
      <ResortStack.Screen
        name="Resorts"
        component={ResortListScreen}
        options={{
          title: "",
          headerLeft: () => (
            <View style={{ marginLeft: 10 }}>
              <Icon.Button
                name="ios-menu"
                size={25}
                backgroundColor={colors.background}
                color={colors.text}
                onPress={() => navigation.openDrawer()}
              />
            </View>
          ),
          headerRight: () => (
            <View style={{ marginRight: 10 }}>
              <MaterialCommunityIcons.Button
                name="account-edit"
                size={25}
                backgroundColor={colors.background}
                color={colors.text}
                onPress={() => navigation.navigate("EditProfile")}
              />
            </View>
          ),
        }}
      />
      <ResortStack.Screen
        name="ResortDetail"
        options={{
          title: "Resort Details",
          headerBackTitle: null,
          headerBackTitleVisible: false,
        }}
        component={ResortDetailScreen}
      />
    </ResortStack.Navigator>
  );
};

const HotelStackScreen = ({ navigation }) => {
  const { colors } = useTheme();

  return (
    <HotelStack.Navigator
      initialRouteName="Hotels"
      screenOptions={{
          
        headerStyle: {
          backgroundColor: colors.background,
          shadowColor: colors.background, // iOS
          elevation: 0, // Android
        },
        headerTintColor: colors.text,
      }}
    >
      <HotelStack.Screen
        name="Hotels"
        component={HotelListScreen}
        options={{
          title: "Hotel List",
          headerLeft: () => (
            <View style={{ marginLeft: 10 }}>
              <Icon.Button
                name="ios-menu"
                size={25}
                backgroundColor={colors.background}
                color={colors.text}
                onPress={() => navigation.openDrawer()}
              />
            </View>
          ),
          headerRight: () => (
            <View style={{ marginRight: 10 }}>
              <MaterialCommunityIcons.Button
                name="account-edit"
                size={25}
                backgroundColor={colors.background}
                color={colors.text}
                onPress={() => navigation.navigate("EditProfile")}
              />
            </View>
          ),
        }}
      />
      <HotelStack.Screen
        name="HotelDetail"
        options={{
          title: "Hotel Details",
          headerBackTitle: null,
          headerBackTitleVisible: false,
        }}
        component={HotelDetailScreen}
      />
    </HotelStack.Navigator>
  );
};

export default MainTabNavigation;
