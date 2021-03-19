import React, { createContext, useState } from "react";
import { firebase } from "../firebase/firebase";
import * as Facebook from "expo-facebook";
import * as Google from "expo-google-app-auth";
import Loader from "../../components/LoadingComponent";
import api from "../../services/api";

export const ProfileContext = createContext();

const db = firebase.firestore();
export const ProfileProvider = ({ children }) => {
  const profile = {
    login: async (email, password) => {
      try {
        await firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then((res) => {
            api.setToken(JSON.stringify(res.user.uid));
          })
          .catch((error) => {
            alert("Login failed. " + error.message);
          });
      } catch (e) {
        alert(e);
      }
    },
    register: async (email, password) => {
      try {
        await firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .then((res) => {
            api.setToken(JSON.stringify(res.user.uid));
          });
      } catch (e) {
        alert("Error @register: " + e);
      }
    },
    resetPassword: async (email) => {
      try {
        await firebase.auth().sendPasswordResetEmail(email);
      } catch (e) {
        alert(e);
      }
    },
    signOut: async () => {
      try {
        await firebase
          .auth()
          .signOut()
          .then((res) => {
            api.removeToken();
          });
        setLoginUser(null);
      } catch (e) {
        alert(e);
      }
    },

    uploadProfilePhoto: async (uri) => {
      const uid = getCurrentUser().uid;
      try {
        const photo = await Firebase.getBlob(uri);
        const imgRef = firebase.storage().ref("profilePhotos").child(uid);
        await imgRef.put(photo);
        const url = await imgRef.getDownloadURL();

        await db.collection("tbl_user_profile").doc(uid).update({
          profile_pic: url,
        });

        return url;
      } catch (error) {
        alert(error);
      }
    },

    getBlob: async (url) => {
      return await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.onload = () => {
          resolve(xhr.response);
        };

        xhr.onerror = () => {
          reject(new TypeError("Network request failed!"));
        };

        xhr.responseType = "blob";
        xhr.open("GET", url, true);
        xhr.send(null);
      });
    },
    toggleTheme: () => {
      setIsDarkTheme((isDarkTheme) => !isDarkTheme);
    },
    loginWithFacebook: async () => {
      const appId = "462397001840220";

      try {
        await Facebook.initializeAsync({
          appId: appId,
        });
        const {
          type,
          token,
          expirationDate,
          permissions,
          declinedPermissions,
        } = await Facebook.logInWithReadPermissionsAsync({
          permissions: ["public_profile"],
        });
        if (type === "success") {
          await firebase
            .auth()
            .setPersistence(firebase.auth.Auth.Persistence.LOCAL); // Set persistent auth state
          const credential = firebase.auth.FacebookAuthProvider.credential(
            token
          );
          firebase
            .auth()
            .signInWithCredential(credential)
            .then((res) => {
              api.setToken(JSON.stringify(res.user.uid));
            })
            .catch((error) => {
              alert(error);
            });
        } else {
          //alert("Cancelled!");
        }
      } catch (e) {
        alert(`Facebook Login Error: ${e}`);
      }
    },
    loginWithGoogle: async () => {
      try {
        const result = await Google.logInAsync({
          androidClientId: androidClientId,
          iosClientId: iosClientId,
          scopes: ["profile", "email"],
        });

        if (result.type === "success") {
          googleSignIn(result);
        } else {
          return { cancelled: true };
        }
      } catch (e) {
        alert("Error @Login with Google: " + e);
      }
    },
  };
  return (
    <AuthContext.Provider value={userAuth}>{children}</AuthContext.Provider>
  );
};
