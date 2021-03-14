import "react-native-gesture-handler";
import React, { useState, useEffect, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";

import { firebase } from "../server/firebase/firebase";
import { AuthContext } from "../server/context/AuthProvider";
import Loader from "../components/LoadingComponent";
import MainTabNavigation from "./MainTabNavigation";
import AuthStack from "./AuthStack";
import api from "../services/api";
const Route = () => {
  const { loginUser, setLoginUser } = useContext(AuthContext);
  const [initializing, setInitializing] = useState(true);

  const onAuthStateChanged = (loginUser) => {
    if (loginUser !== null || loginUser !== "undefined") {
      setLoginUser(loginUser);
    }
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) {
    return <Loader />;
  }
  return (
    <NavigationContainer>
      {loginUser ? <MainTabNavigation /> : <AuthStack />}
    </NavigationContainer>
  );
};
export default Route;
