import { firebase } from "../firebase/firebase";

const db = firebase.firestore();

const transactionApi = {
  addTransaction: ({}) => {},
  getTransactionType: async (type) => {
    await db
      .collection("tbl_trx_type")
      .where("val_id", "==", type)
      .get()
      .then((querySnapshot) => {
        console.log(querySnapshot);
      })
      .catch((err) => alert(err));
  },
};

export default transactionApi;
