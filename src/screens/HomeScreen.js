import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
  SafeAreaView,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { UserContext } from "../server/context/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";
import FormButton from "../components/form/FormButton";
import Loader from "../components/LoadingComponent";

const HomeScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const theme = useTheme();
  const [isLoading, setLoading] = useState(false);
  const [isFirstLaunch, setFirstLaunch] = useState(true);
  const { signOut } = useContext(UserContext);
  //const isFocused = useIsFocused();

  const validate = async () => {
    try {
      const value = await AsyncStorage.getItem("@isFirstLaunch");
      if (value !== "0") {
        navigation.navigate("Onboarding");
      } else {
        let userData = await api.getToken("@loginUser");
        if (userData === null || userData == "undefined") {
          navigation.replace("Auth", { screen: "SignIn" });
        }
      }
    } catch (e) {
      alert(e);
    } finally {
    }
  };

  useEffect(() => {
    validate();
    if (isLoading) setLoading(false);
  }, []);

  const logOff = () => {
    signOut();
    navigation.replace("Auth", { screen: "SignIn" });
  };

  const handleSignOut = () => {
    Alert.alert(
      //title
      "Sign Out Confirmation",
      //body
      "Are you sure want to sign out?",
      [
        {
          text: "Yes",
          onPress: () => {
            logOff();
          },
        },
        {
          text: "Cancel",
          onPress: () => true,
          style: "cancel",
        },
      ],
      { cancelable: false }
      //clicking out side of alert will not cancel
    );
  };
  const handleSignIn = () => {
    navigation.navigate("Auth", { screen: "SignIn" });
  };
  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 20 }}>
      <StatusBar backgroundColor="#246b6b" barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.summary}>
          <View style={styles.summarySection}>
            <Text style={styles.sectionHeader}>Revenue</Text>
            <View style={styles.sectionButtom}>
              <Text style={styles.sectionNumber}>0.00</Text>
            </View>
          </View>
          <View style={styles.summarySection}>
            <Text style={styles.sectionHeader}>Expense</Text>
            <View style={styles.sectionButtom}>
              <Text style={styles.sectionNumber}>0.00</Text>
            </View>
          </View>
          <View style={styles.summarySection}>
            <Text style={styles.sectionHeader}>Balance</Text>
            <View style={styles.sectionButtom}>
              <Text style={styles.sectionNumber}>0.00</Text>
            </View>
          </View>
        </View>

        {/* <View style={{ flex: 1 }}>
          <FormButton buttonTitle="Sign Out" onPress={handleSignOut} />
          <FormButton buttonTitle="Sign In" onPress={handleSignIn} />
        </View> */}
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: "center",
    padding: 5,
  },
  summary: {
    width: "100%",
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
  },
  summarySection: {
    flexDirection: "column",
    backgroundColor: "#246b6b", //"#ee3431",
    borderColor: "#246b6b",
    borderWidth: 1,
    width: "30%",
    alignItems: "center",
    borderRadius: 3,
    shadowColor: "#246b6b",
    shadowRadius: 5,
    shadowOpacity: 2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    paddingHorizontal: 5,
  },
  sectionHeader: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    paddingBottom: 3,
  },
  sectionButtom: {
    backgroundColor: "#ee3431",
    width: "100%",
    height: 22,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: "#ee3431",
    alignItems: "center",

    shadowColor: "#ee3431",
    shadowRadius: 5,
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  sectionNumber: {
    color: "#fff",
    fontWeight: "500",
  },
});
