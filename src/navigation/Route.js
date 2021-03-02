import React, { useState, useEffect, useContext } from "react";

import AppStack from "./AppStack";
import { firebase } from "../server/firebase/firebase";
import { UserContext } from "../server/context/UserContext";

const Route = () => {
  const { user, setUser } = useContext(UserContext);
  const [initializing, setInitializing] = useState(true);

  const onAuthStateChanged = (user) => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) return null;
  return <AppStack />;
};
export default Route;
