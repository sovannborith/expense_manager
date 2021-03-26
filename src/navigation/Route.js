import "react-native-gesture-handler";
import React, { useState, useEffect, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";

import { firebase } from "../server/firebase/firebase";
import { AuthContext } from "../server/context/AuthProvider";
import Loader from "../components/LoadingComponent";
import api from "../services/api";
import util from "../utils/util";
import MainTabNavigation from "./MainTabNavigation";
import AuthStack from "./AuthStack";

const Route = () => {
  const { loginUser, setLoginUser } = useContext(AuthContext);
  const [initializing, setInitializing] = useState(true);

  const onAuthStateChanged = (user) => {
    if (user) {
      setLoginUser(user);
      //console.log(util.getCurrentLoginUser());
      try {
        api.setToken(JSON.stringify(user.uid));
      } catch (e) {
        null;
      }
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
