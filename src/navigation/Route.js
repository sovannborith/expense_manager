import "react-native-gesture-handler";
import React, { useState, useEffect, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";

import { firebase } from "../server/firebase/firebase";
import { UserContext } from "../server/context/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "../components/LoadingComponent";
import MainTabNavigation from "./MainTabNavigation";
import AuthStack from "./AuthStack";
const Route = () => {
  const { user, setUser } = useContext(UserContext);
  const [isLoading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);

  const setLoginUser = async ({ loginUser }) => {
    try {
      if (loginUser !== null) {
        await AsyncStorage.setItem("@loginUser", loginUser);
      }
    } catch (e) {
      alert(e);
    }
  };

  const onAuthStateChanged = (user) => {
    if (user) {
      setUser(user);
      AsyncStorage.setItem("@loginUser", user.uid);
    }
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    if (isLoading) setLoading(false);
    return subscriber;
  }, []);

  if (initializing) {
    return <Loader />;
  }
  return (
    <NavigationContainer>
      {/* <MainTabNavigation /> */}
      {user ? <MainTabNavigation /> : <AuthStack />}
    </NavigationContainer>
  );
};
export default Route;
