import React from "react";
import Route from "./Route";
import { AuthProvider } from "../server/context/AuthProvider";
const Providers = () => {
  return (
    <AuthProvider>
      <Route />
    </AuthProvider>
  );
};

export default Providers;
