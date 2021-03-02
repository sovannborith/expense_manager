import React from "react";
import Route from "./Route";
import { UserProvider } from "../server/context/UserContext";
const Providers = () => {
  return (
    <UserProvider>
      <Route />
    </UserProvider>
  );
};

export default Providers;
