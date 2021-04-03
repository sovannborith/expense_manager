import React from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { SIZES } from "../../constants";

const windowWidth = Dimensions.get("window").width;

const OnboardingItem = ({ item }) => {
  return (
    <View style={(styles.container, { width: windowWidth })}>
      <Image source={item.imageUrl} style={styles.image} />
      <View style={{ flex: 0.3 }}>
        <View style={{ marginTop: 5 }}>
          <Text style={styles.title}>{item.title}</Text>
        </View>
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
    paddingBottom: 30,
  },
  image: {
    flex: 0.7,
    justifyContent: "center",
    alignSelf: "center",
    width: SIZES.width - 20,
    resizeMode: "contain",
    borderRadius: 5,
  },
  title: {
    fontWeight: "800",
    fontSize: 24,
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
