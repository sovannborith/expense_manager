import React, { useState, useEffect, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";

import AppStack from "./AppStack";
import { firebase } from "../server/firebase/firebase";
import { UserContext } from "../server/context/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Loader from "../components/LoadingComponent";
import MainStack from "./MainStack";
const Route = () => {
  const { user, setUser } = useContext(UserContext);
  const [isLoading, setLoading] = useState(true);
  //const [initializing, setInitializing] = useState(true);

  const onAuthStateChanged = (user) => {
    setUser(user);
    //if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  //if (initializing) return null;
  return (
    <NavigationContainer>
      {isLoading ? <Loader /> : <MainStack />}
    </NavigationContainer>
  );
};
export default Route;
