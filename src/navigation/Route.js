import "react-native-gesture-handler";
import React, { useState, useEffect, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { firebase } from "../server/firebase/firebase";
import { AuthContext } from "../server/context/AuthProvider";
import Loader from "../components/LoadingComponent";
import api from "../services/api";
import AppStack from "./AppStack";

const Route = () => {
  const { loginUser, setLoginUser } = useContext(AuthContext);
  const [initializing, setInitializing] = useState(true);

  const onAuthStateChanged = (user) => {
    if (user) {
      setLoginUser(user);
      try {
        api.setToken(JSON.stringify(user.uid));
      } catch (e) {
        alert(e);
      }
    }
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) {
    return <Loader loadingLabel="Loading..." />;
  }
  return (
    <NavigationContainer>
      {/* {loginUser ? <AppStack /> : <AuthStack />} */}
      <AppStack />
    </NavigationContainer>
  );
};
export default Route;
