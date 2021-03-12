import React, { createContext, useState } from "react";
import { firebase } from "../firebase/firebase";
import * as Facebook from "expo-facebook";
import * as Google from "expo-google-app-auth";

import api from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Loader from "../../components/LoadingComponent";

const UserContext = createContext([{}, () => {}]);
const db = firebase.firestore();

const UserProvider = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [user, setUser] = useState(null);
  const tokenKey = "@loginUser";
  const androidClientId =
    "170056723597-jbp72nsfklf9calfdr8s7qjq383f6tf9.apps.googleusercontent.com";
  const iosClientId =
    "170056723597-v6go477npl5upfraifas991at6r4bcoc.apps.googleusercontent.com";

  const googleSignIn = (googleUser) => {
    if (!isUserEqual(googleUser, user)) {
      const credential = firebase.auth.GoogleAuthProvider.credential(
        googleUser.idToken,
        googleUser.accessToken
      );

      firebase
        .auth()
        .signInWithCredential(credential)
        .then((res) => {
          api.setToken("@loginUser", res.user.uid);
        })
        .catch((error) => {
          alert(error);
        });
    } else {
      alert("User already signed-in");
    }
  };
  const isUserEqual = (googleUser, user) => {
    if (user) {
      var providerData = user.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  };

  const userFirebase = {
    user,
    setUser,
    login: async (email, password) => {
      try {
        await firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then((res) => {
            console.log(res.user);
            api.setToken("@loginUser", res.user.uid);
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
            api.setToken("@loginUser", res.user.uid);
          });
      } catch (e) {
        alert(e);
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
            api.removeToken("@loginUser");
          });
        setUser(null);
      } catch (e) {
        alert(e);
      }
    },
    getLoginUser: async () => {
      return firebase.auth().currentUser;
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
        console.log("Error @uploadProfilePhoto: ", error);
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
              api.setToken("@loginUser", res.user.uid);
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
        return { error: true };
      }
    },
  };
  return (
    <UserContext.Provider value={userFirebase}>{children}</UserContext.Provider>
  );
};

export { UserContext, UserProvider };
