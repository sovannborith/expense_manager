import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";

const AddTransactionScreen = () => {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text>Add Transaction Test</Text>
      </View>
    </SafeAreaView>
  );
};
export default AddTransactionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
