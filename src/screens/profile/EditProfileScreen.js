import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
  SafeAreaView,
} from "react-native";

const EditProfileScreen = () => {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text>Prifile</Text>
      </View>
    </SafeAreaView>
  );
};
export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
