import React, { useState, useEffect, useContext } from "react";

import { StatusBar } from "react-native";

import { NavigationContainer } from "@react-navigation/native";

import { firebase } from "../server/firebase/firebase";
import { UserContext } from "../server/context/UserContext";

import Loader from "../components/LoadingComponent";
import MainStack from "./MainStack";
const Route = () => {
  const { getLoginUser } = useContext(UserContext);
  const [isLoading, setLoading] = useState(true);

  const onAuthStateChanged = (user) => {};

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    if (isLoading) setLoading(false);
    return subscriber;
  }, []);

  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#246b6b" barStyle="light-content" />
      {isLoading ? <Loader /> : <MainStack />}
    </NavigationContainer>
  );
};
export default Route;
