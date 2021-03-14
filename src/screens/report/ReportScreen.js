import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { COLORS } from "../../constants";

const ReportScreen = () => {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text>Report</Text>
      </View>
    </SafeAreaView>
  );
};
export default ReportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});
