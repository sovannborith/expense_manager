import React, { useState, useRef, useContext } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Animated,
  SafeAreaView,
} from "react-native";

//import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../server/context/AuthProvider";

import slides from "../services/slides";
import OnboardingItem from "../components/Onboarding/OnboardingItem";
import Paginator from "../components/Onboarding/Paginator";
import NextButton from "../components/Onboarding/NextButton";
import { SIZES } from "../constants";
//import Loader from "../components/LoadingComponent";

const Onboarding = ({ navigation }) => {
  const { updateUserFirstLaunch } = useContext(AuthContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  //const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = async () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      await updateUserFirstLaunch(false).then(
        navigation.navigate("App", { screen: "Home" })
      );
    }
  };
  //if (loading) return <Loader loadingLabel="Loading..." />;

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <View style={{ height: SIZES.height / 2 }}>
          <FlatList
            data={slides}
            horizontal
            showsHorizontalScrollIndicator={false}
            bounces={false}
            renderItem={({ item }) => <OnboardingItem item={item} />}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            pagingEnabled={true}
            scrollEventThrottle={32}
            onViewableItemsChanged={viewableItemsChanged}
            viewabilityConfig={viewConfig}
            ref={slidesRef}
            keyExtractor={(item) => `key-${item.id}`}
          />
        </View>
        <View style={{ height: 10, marginTop: 20 }}>
          <Paginator data={slides} scrollX={scrollX} />
        </View>
        <NextButton
          percentage={(currentIndex + 1) * (100 / slides.length)}
          scrollTo={scrollTo}
        />
      </View>
    </SafeAreaView>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
