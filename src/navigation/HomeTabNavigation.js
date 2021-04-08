import React from "react";
import { SafeAreaView, Image, View, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import ReportStack from "./ReportStack";
import AddTransactionStack from "./AddTransactionStack";
import HomeStack from "./HomeStack";
import TabBarCustomButton from "../components/TabBarCustomButton";
import { COLORS, icons } from "../constants";

const Tab = createBottomTabNavigator();
const Tabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        showLabel: false,
        style: {
          position: "absolute",
          bottom: 0,
          right: 0,
          elevation: 0,
          backgroundColor: COLORS.white,
          borderTopColor: "transparent",
          height: 80,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItem: "center",
                justifyContent: "center",
                marginLeft: 8,
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
                  width: 100,
                }}
              >
                Home
              </Text>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="AddTransaction"
        component={AddTransactionStack}
        options={() => ({
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
        })}
      />

      <Tab.Screen
        name="Report"
        component={ReportStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItem: "center",
                justifyContent: "center",
                marginLeft: 90,
              }}
            >
              <Image
                source={icons.chart}
                resizeMode="contain"
                style={{
                  width: 26,
                  height: 26,
                  marginLeft: 8,
                  tintColor: focused ? COLORS.primary : COLORS.gray,
                }}
              />
              <Text
                style={{
                  color: focused ? COLORS.primary : COLORS.gray,
                  fontSize: 12,
                  fontWeight: "700",
                  width: 100,
                }}
              >
                Report
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const HomeTabNavigation = () => {
  return (
    <>
      <Tabs />
    </>
  );
};

export default HomeTabNavigation;
