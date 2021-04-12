import React, { createContext, useState } from "react";
import { firebase } from "../firebase/firebase";
import * as Facebook from "expo-facebook";
import * as Google from "expo-google-app-auth";
import util from "../../utils/util";
import api from "../../services/api";
export const AuthContext = createContext();

const db = firebase.firestore();
const storage = firebase.storage();
export const AuthProvider = ({ children }) => {
  const [loginUser, setLoginUser] = useState(null);

  const androidClientId =
    "170056723597-jbp72nsfklf9calfdr8s7qjq383f6tf9.apps.googleusercontent.com";
  const iosClientId =
    "170056723597-v6go477npl5upfraifas991at6r4bcoc.apps.googleusercontent.com";

  const googleSignIn = async (googleUser) => {
    if (!isUserEqual(googleUser, loginUser)) {
      const credential = firebase.auth.GoogleAuthProvider.credential(
        googleUser.idToken,
        googleUser.accessToken
      );

      await firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      await firebase
        .auth()
        .signInWithCredential(credential)
        .then((res) => {
          if (res.additionalUserInfo.isNewUser) {
            db.collection("tbl_user_profile").doc(res.user.uid).set({
              display_name: res.user.displayName,
              is_active: true,
              is_first_launch: true,
              user_email: res.user.email,
              phone_num: res.user.providerData[0].phoneNumber,
              uid: res.user.uid,
              photo_url: res.user.providerData[0].photoURL,
              created_dt: util.getCurrentDateTime(),
              last_login_dt: util.getCurrentDateTime(),
            });
            setLoginUser(res.user);
          } else {
            db.collection("tbl_user_profile").doc(res.user.uid).update({
              last_login_dt: util.getCurrentDateTime(),
            });
          }
        })
        .catch((error) => {
          alert("Error @AuthProvider - googleSignIn: " + e);
        });
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

  const userAuth = {
    loginUser,
    setLoginUser,
    login: async (email, password) => {
      try {
        await firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then((res) => {
            db.collection("tbl_user_profile").doc(res.user.uid).update({
              last_login_dt: util.getCurrentDateTime(),
            });
            setLoginUser(res.user);
          })
          .catch((error) => {
            alert("Login failed. " + error.message);
            return null;
          });
      } catch (e) {
        alert(e);
      }
    },

    register: async (email, password) => {
      try {
        const user = await firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .then((res) => {
            db.collection("tbl_user_profile").doc(res.user.uid).set({
              display_name: res.user.displayName,
              is_active: true,
              is_first_launch: true,
              user_email: res.user.email,
              phone_num: res.user.providerData[0].phoneNumber,
              uid: res.user.uid,
              photo_url: res.user.providerData[0].photoURL,
              created_dt: util.getCurrentDateTime(),
              last_login_dt: util.getCurrentDateTime(),
            });
            setLoginUser(res.user);
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

    /* getBlob: async (url) => {
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
    }, */
    toggleTheme: () => {
      setIsDarkTheme((isDarkTheme) => !isDarkTheme);
    },
    loginWithFacebook: async () => {
      const appId = "462397001840220";

      try {
        await Facebook.initializeAsync({
          appId: appId,
        });
        const { type, token } = await Facebook.logInWithReadPermissionsAsync({
          permissions: ["public_profile"],
        });
        if (type === "success") {
          await firebase
            .auth()
            .setPersistence(firebase.auth.Auth.Persistence.LOCAL); // Set persistent auth state
          const credential = firebase.auth.FacebookAuthProvider.credential(
            token
          );
          const user = await firebase
            .auth()
            .signInWithCredential(credential)
            .then((res) => {
              if (res.additionalUserInfo.isNewUser) {
                db.collection("tbl_user_profile").doc(res.user.uid).set({
                  display_name: res.user.displayName,
                  is_active: true,
                  is_first_launch: true,
                  user_email: res.user.email,
                  phone_num: res.user.providerData[0].phoneNumber,
                  uid: res.user.uid,
                  photo_url: res.user.providerData[0].photoURL,
                  created_dt: util.getCurrentDateTime(),
                  last_login_dt: util.getCurrentDateTime(),
                });
              } else {
                db.collection("tbl_user_profile").doc(res.user.uid).update({
                  last_login_dt: util.getCurrentDateTime(),
                });
              }
              setLoginUser(res.user);
            })
            .catch((error) => {
              alert(error);
            });
        } else {
          alert("Operations cancelled!");
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
          await googleSignIn(result);
        } else {
          alert("Operations cancelled.");
          return { cancelled: true };
        }
      } catch (e) {
        alert("Error @Login with Google: " + e);
      }
    },
    getUserProfile: async () => {
      try {
        await db
          .collection("tbl_user_profile")
          .doc(loginUser.uid)
          .get()
          .then((documentSnapshot) => {
            if (documentSnapshot.exists) {
              return documentSnapshot.data();
            } else return null;
          });
      } catch (e) {
        alert(e);
        return null;
      }
    },

    updateUserProfile: async (
      uid,
      displayName,
      email,
      contactNumber,
      photoUrl
    ) => {
      try {
        //const imgUrl = await userAuth.uploadProfilePhoto(photoUrl);

        db.collection("tbl_user_profile").doc(uid).update({
          display_name: displayName,
          user_email: email,
          phone_num: contactNumber,
          photo_url: photoUrl,
        });
      } catch (e) {
        alert(e);
      }
    },
    updateUserFirstLaunch: async (flag) => {
      try {
        db.collection("tbl_user_profile").doc(loginUser.uid).update({
          is_first_launch: flag,
        });
      } catch (e) {
        alert(e);
      }
    },
  };
  return (
    <AuthContext.Provider value={userAuth}>{children}</AuthContext.Provider>
  );
};
