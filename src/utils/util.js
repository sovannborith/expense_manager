import { firebase } from "../server/firebase/firebase";

//const db = firebase.firestore();

const util = {
  getDefaultProfilePicture: () => {
    return "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png";
  },
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
  getRandomNumber: (s, e) => {
    try {
      return Math.floor(Math.random() * e) + s;
    } catch (e) {
      return null;
    }
  },
  formartYearMonth: (date) => {
    const cYear = date.getFullYear();
    const cMonth = date.getMonth() + 1;
    const result = cYear + "" + cMonth;
    try {
      return result;
    } catch (e) {
      return null;
    }
  },
  formartDate: (date) => {
    const cDay = date.getDate();
    const cMonth = date.getMonth() + 1;
    const cYear = date.getFullYear();
    const cHour = date.getHours();
    const cMinute = date.getMinutes();
    const cSecond = date.getSeconds();
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
  getMonthName: (month) => {
    let result ="";
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    months.map((item, idx) => {
      if (idx === month) {
        result = item;
      }
    });
    return result;
  },
};

export default util;
