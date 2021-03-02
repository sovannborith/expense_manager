import React, { createContext } from "react";
/* import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";

import config from "../firebase/config/firebaseConfig";
if (!firebase.apps.length) {
  firebase.initializeApp(config);
} */

import { firebase } from "../firebase/firebase";

const FirebaseContext = createContext();
const db = firebase.firestore();

const Firebase = {
  getCurrentUser: () => {
    return firebase.auth().getCurrentUser();
  },
  SignUp: async (user) => {
    try {
      await firebase
        .auth()
        .createUserWithEmailAndPassword(user.email, user.passowrd);

      const uid = Firebase.getCurrentUser().uid;
      let profilePhotoUrl = "default";

      await db.collection("tbl_user_profile").doc(uid).set({
        user_email: user.email,
        user_name: user.userName,
        profile_pic: user.profilePhotoUrl,
      });

      if (user.profilePhotoUrl) {
      }
      //delete user.passowrd;

      return { ...user, profilePhotoUrl, uid };
    } catch (error) {
      console.log("Error @createUser: ", error.message);
    }
  },

  uploadProfilePhoto: async (uri) => {
    const uid = Firebase.getCurrentUser().uid;
    try {
      const photo = await Firebase.getBlob(uri);
      const imgRef = firebase.storage().ref("profilePhotos").chile(uid);
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

  SignIn: async (user) => {
    try {
      await firebase
        .auth()
        .loginWithEmailAndPassword(user.email, user.passowrd);

      const uid = Firebase.getCurrentUser().uid;
      let profilePhotoUrl = "default";

      await db.collection("tbl_user_profile").doc(uid).set({
        user_email: user.email,
        user_name: user.userName,
        profile_pic: user.profilePhotoUrl,
      });

      if (user.profilePhotoUrl) {
      }
      //delete user.passowrd;

      return { ...user, profilePhotoUrl, uid };
    } catch (error) {
      console.log("Error @createUser: ", error.message);
    }
  },

  uploadProfilePhoto: async (uri) => {
    const uid = Firebase.getCurrentUser().uid;
    try {
      const photo = await Firebase.getBlob(uri);
      const imgRef = firebase.storage().ref("profilePhotos").chile(uid);
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
};

const FirebaseProvider = (props) => {
  return (
    <FirebaseContext.Provider value={Firebase}>
      {props.children}
    </FirebaseContext.Provider>
  );
};

export { FirebaseProvider, FirebaseContext };
