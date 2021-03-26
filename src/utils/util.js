import { firebase } from "../server/firebase/firebase";

const db = firebase.firestore();

const util = {
  getCurrentLoginUser: () => {
    try {
      const firebaseUser = firebase.auth().currentUser;
      if (firebaseUser) {
        return firebaseUser;
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  },
  getCurrentTime: () => {
    const currentDate = new Date();
    const cHour = currentDate.getHours();
    const cMinute = currentDate.getMinutes();
    const cSecond = currentDate.getSeconds();
    const result = cHour + ":" + cMinute + ":" + cSecond;
    try {
      return result;
    } catch (e) {
      return null;
    }
  },
  getCurrentDate: () => {
    const currentDate = new Date();
    const cDay = currentDate.getDate();
    const cMonth = currentDate.getMonth() + 1;
    const cYear = currentDate.getFullYear();
    const result = cYear + "-" + cMonth + "-" + cDay;
    try {
      return result;
    } catch (e) {
      return null;
    }
  },
  getCurrentDateTime: () => {
    const currentDate = new Date();
    const cDay = currentDate.getDate();
    const cMonth = currentDate.getMonth() + 1;
    const cYear = currentDate.getFullYear();
    const cHour = currentDate.getHours();
    const cMinute = currentDate.getMinutes();
    const cSecond = currentDate.getSeconds();
    const result =
      cYear +
      "-" +
      cMonth +
      "-" +
      cDay +
      " " +
      cHour +
      ":" +
      cMinute +
      ":" +
      cSecond;
    try {
      return result;
    } catch (e) {
      return null;
    }
  },
};

export default util;
