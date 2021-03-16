import React from "react";
import { SafeAreaView, Image, View, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

/* import ProfileStack from "./ProfileStack"; */
import AppStack from "./AppStack";
import ReportStack from "./ReportStack";
/* import ProfileStack from "./ProfileStack"; */
import AddTransactionStack from "./AddTransactionStack";
import TabBarCustomButton from "../components/TabBarCustomButton";
import { COLORS, icons } from "../constants";

const Tab = createBottomTabNavigator();
const Tabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="App"
      tabBarOptions={{
        showLabel: false,
        style: {
          position: "absolute",
          bottom: 0,
          right: 0,
          elevation: 0,
          backgroundColor: COLORS.white,
          borderTopColor: "transparent",
          height: 60,
        },
      }}
    >
      <Tab.Screen
        name="Report"
        component={ReportStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItem: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={icons.chart}
                resizeMode="contain"
                style={{
                  width: 26,
                  height: 26,
                  marginLeft: 4,
                  tintColor: focused ? COLORS.primary : COLORS.gray,
                }}
              />
              <Text
                style={{
                  color: focused ? COLORS.primary : COLORS.gray,
                  fontSize: 12,
                  fontWeight: "700",
                }}
              >
                Report
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="App"
        component={AppStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItem: "center",
                justifyContent: "center",
                marginLeft: -80,
              }}
            >
              <Image
                source={icons.home}
                resizeMode="contain"
                style={{
                  width: 30,
                  height: 30,
                  tintColor: focused ? COLORS.primary : COLORS.gray,
                }}
              />
              <Text
                style={{
                  color: focused ? COLORS.primary : COLORS.gray,
                  fontSize: 12,
                  fontWeight: "700",
                }}
              >
                Home
              </Text>
            </View>
          ),
        }}
      />

      {/* <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItem: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={icons.user}
                resizeMode="contain"
                style={{
                  width: 26,
                  height: 26,
                  marginLeft: 4,
                  tintColor: focused ? COLORS.primary : COLORS.gray,
                }}
              />
              <Text
                style={{
                  color: focused ? COLORS.primary : COLORS.gray,
                  fontSize: 12,
                  fontWeight: "700",
                }}
              >
                Profile
              </Text>
            </View>
          ),
        }}
      /> */}

      <Tab.Screen
        name="AddTransaction"
        component={AddTransactionStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={icons.plus}
              resizeMode="contain"
              style={{
                width: 30,
                height: 30,
                tintColor: COLORS.white,
              }}
            />
          ),
          tabBarButton: (props) => <TabBarCustomButton {...props} />,
        }}
      />
    </Tab.Navigator>
  );
};

const MainTabNavigation = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <Tabs />
    </SafeAreaView>
  );
};

export default MainTabNavigation;
