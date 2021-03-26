import { firebase } from "../firebase/firebase";

const db = firebase.firestore();

const transactionApi = {
  addTransaction: ({}) => {},
  setToken: async ({ token }) => {
    try {
      await AsyncStorage.setItem("loginUser", token);
    } catch (e) {
      alert("Error @ api - setToken: " + e);
    }
  },
  getToken: async () => {
    try {
      await AsyncStorage.getItem("loginUser").then((res) => {
        return JSON.parse(res);
      });
    } catch (e) {
      //alert(e);
    }
  },
  removeToken: async () => {
    try {
      await AsyncStorage.removeItem("loginUser");
    } catch (e) {
      alert(e);
    }
  },
};

export default transactionApi;
