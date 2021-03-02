import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useTheme } from "@react-navigation/native";
const HomeScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const theme = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 20 }}>
      <StatusBar
        barStyle={theme.dark ? "light-content" : "dark-content"}
        style={{ backgroundColor: "#019131" }}
      />
      <View>
        <Text>Hello Expense Manager</Text>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
