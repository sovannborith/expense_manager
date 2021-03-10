import React from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;

const OnboardingItem = ({ item }) => {
  return (
    <View style={(styles.container, { width: windowWidth })}>
      <Image
        source={item.imageUrl}
        style={[
          styles.image,
          { width: windowWidth - 20, resizeMode: "contain" },
        ]}
      />
      <View style={{ flex: 0.3 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );
};

export default OnboardingItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    flex: 0.7,
    justifyContent: "center",
    alignSelf: "center",
  },
  title: {
    fontWeight: "800",
    fontSize: 28,
    marginBottom: 10,
    textAlign: "center",
    color: "#493d8a",
  },
  description: {
    fontWeight: "300",
    color: "#62656b",
    textAlign: "center",
    paddingHorizontal: 64,
  },
});
