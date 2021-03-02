import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";

import config from "./config/firebaseConfig";
if (!firebase.apps.length) {
  firebase.initializeApp(config);
}
export { firebase };
