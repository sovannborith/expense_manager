import React, { useState, useEffect, useContext } from "react";

import { StatusBar } from "react-native";

import { NavigationContainer } from "@react-navigation/native";

import { firebase } from "../server/firebase/firebase";
import { UserContext } from "../server/context/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "../components/LoadingComponent";
import MainStack from "./MainStack";
import { set } from "react-native-reanimated";
const Route = () => {
  const { setUser } = useContext(UserContext);
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
      <MainStack />
    </NavigationContainer>
  );
};
export default Route;
