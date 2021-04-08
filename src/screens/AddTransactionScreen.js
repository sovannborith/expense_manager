import React, { useState, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";

import { AuthContext } from "../server/context/AuthProvider";

import DropDownPicker from "react-native-dropdown-picker";
import FormInput from "../components/form/FormInput";
import FormButton from "../components/form/FormButton";
import FormOutLineButton from "../components/form/FormOutLineButton";
import { COLORS, SIZES } from "../constants";
import { firebase } from "../server/firebase/firebase";
import util from "../utils/util";
import Loader from "../components/LoadingComponent";
const db = firebase.firestore();

const AddTransactionScreen = ({ navigation }) => {
  const [tranItems, setTranItems] = useState([]);
  const [expType, setExptype] = useState("EXP");
  const [selectedItem, setSelectedItem] = useState();

  const [isLoading, setLoading] = useState(false);
  const { loginUser } = useContext(AuthContext);

  const AddTransactionSchema = Yup.object().shape({
    description: Yup.string().required(),
    expAmount: Yup.number().positive().integer().min(1).required(),
    expItem: Yup.string().required(),
    remark: Yup.string(),
  });

  const formik = ({
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    touched,
    errors,
    isValid,
  } = useFormik({
    validationSchema: AddTransactionSchema,
    initialValues: {
      description: "",
      expAmount: "1",
      expItem: "",
      remark: "",
    },
    onSubmit: async () => {
      if (isValid) {
        setLoading(true);
        try {
          await db
            .collection("tbl_transactions")
            .add({
              tran_id: new Date().getTime() + util.getRandomNumber(1, 100),
              exp_item: values.expItem,
              tran_desc: values.description,
              tran_amt: parseInt(values.expAmount),
              tran_rmk: values.remark,
            })
            .then(() => {
              formik.resetForm();
              alert("Transaction created!");
            });
        } catch (err) {
          alert(err);
        } finally {
          setLoading(false);
        }
      }
    },
  }));

  const getTransactionType = async (type) => {
    try {
      await db
        .collection("tbl_trx_type")
        .where("val_id", "==", type)
        .get()
        .then((querySnapshot) => {
          setTranItems(
            querySnapshot.docs.map((doc) => ({
              label: doc.data().type_nm_en,
              value: doc.data().type_id,
              val_id: doc.data().val_id,
            }))
          );
          setSelectedItem(tranItems ? tranItems[0] : null);
        })
        .catch((err) => alert(err));
    } catch (err) {
      alert(err);
    }
  };

  const handleExpClick = () => {
    setExptype("EXP");
    getTransactionType(expType);
    setSelectedItem(tranItems[0]);
  };
  const handleRevClick = () => {
    setExptype("REVN");
    getTransactionType(expType);
    setSelectedItem(tranItems[0]);
  };

  useEffect(() => {
    setLoading(true);
    try {
      getTransactionType("EXP");
    } catch (e) {
      alert(e);
    } finally {
      setLoading(false);
    }
    /* const unsubscribe = getTransactionType(expType);
    return unsubscribe.unsubscribe; */
  }, []);
  if (isLoading) return <Loader loadingLabel="Loadding..." />;
  return (
    <SafeAreaView>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <View style={styles.logoCover}>
            <Image
              source={require("../assets/logo_01.png")}
              style={styles.logo}
            />

            <Animatable.View animation="fadeInUpBig" style={{ marginTop: 20 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  backgroundColor: COLORS.lightGray,
                  width: SIZES.width,
                  padding: 10,
                  borderTopRightRadius: 20,
                  borderTopLeftRadius: 20,
                }}
              >
                <Text
                  style={{
                    color: COLORS.primary,
                    fontWeight: "800",
                    marginTop: 15,
                  }}
                >
                  Add New Transaction
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    height: 50,
                    borderColor: COLORS.primary,
                    borderWidth: 3,
                    borderRadius: 30,
                    shadowColor: COLORS.gray,
                    shadowRadius: 5,
                    shadowOpacity: 2,
                    shadowOffset: { width: 0, height: 2 },
                    elevation: 5,
                    padding: 1,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      backgroundColor:
                        expType == "REVN" ? COLORS.primary : COLORS.gray,
                      padding: 10,
                      borderTopLeftRadius: "50%",
                      borderBottomLeftRadius: "50%",
                      shadowColor: COLORS.gray,
                      shadowRadius: 5,
                      shadowOpacity: 2,
                      shadowOffset: { width: 0, height: 2 },
                      elevation: 5,
                      borderColor: COLORS.white,
                      borderWidth: expType == "REVN" ? 1 : null,
                      width: 80,
                    }}
                    onPress={() => {
                      handleRevClick();
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "800",
                        color: COLORS.white,
                        paddingTop: 1,
                      }}
                    >
                      Revenue
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor:
                        expType == "EXP" ? COLORS.red : COLORS.gray,
                      padding: 10,
                      borderTopRightRadius: "50%",
                      borderBottomRightRadius: "50%",
                      shadowColor: COLORS.gray,
                      shadowRadius: 5,
                      shadowOpacity: 2,
                      shadowOffset: { width: 0, height: 2 },
                      elevation: 5,
                      borderColor: COLORS.white,
                      borderWidth: expType == "EXP" ? 1 : null,
                      width: 80,
                    }}
                    onPress={() => {
                      handleExpClick();
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "800",
                        color: COLORS.white,
                        paddingTop: 1,
                      }}
                    >
                      Expense
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.signInWrapper}>
                <FormInput
                  placeholderText={
                    expType == "EXP"
                      ? "Expense Description"
                      : "Revenue Description"
                  }
                  iconType="filetext1"
                  labelValue={values.description}
                  onChangeText={handleChange("description")}
                  onBlur={handleBlur("description")}
                  error={errors.description}
                  touched={touched.description}
                  autoFocus={true}
                />
                <FormInput
                  placeholderText="Amount (in USD)"
                  iconType="user"
                  keyboardType="numeric"
                  labelValue={values.expAmount}
                  onChangeText={handleChange("expAmount")}
                  onBlur={handleBlur("expAmount")}
                  error={errors.expAmount}
                  touched={touched.expAmount}
                />
                <DropDownPicker
                  items={
                    tranItems
                    /* .filter((item) => {
                      item.val_id == expType;
                    })
                    .map(({ value, label, val_id }) => ({
                      value,
                      label,
                      val_id,
                    })) */
                  }
                  onBlur={handleBlur("expItem")}
                  touched={touched.expItem}
                  onChangeItem={(item) => {
                    setSelectedItem(item);
                    formik.setFieldValue("expItem", item.value);
                  }}
                  containerStyle={{ height: 40, width: SIZES.width - 20 }}
                  //searchable={true}
                  autoScrollToDefaultValue={true}
                  defaultValue={selectedItem?.value}
                  globalTextStyle={{
                    fontSize: 14,
                    textAlign: "left",
                  }}
                  itemStyle={{
                    justifyContent: "flex-start",
                  }}
                />
                <FormInput
                  placeholderText="Remark"
                  iconType="filetext1"
                  multiline={true}
                  labelValue={values.remark}
                  onChangeText={handleChange("remark")}
                  onBlur={handleBlur("remark")}
                  touched={touched.remark}
                  onSubmitEditing={handleSubmit}
                />
                <FormButton buttonTitle="Create" onPress={handleSubmit} />
                <FormOutLineButton
                  buttonTitle="Cancel"
                  onPress={() => navigation.replace("App", { screen: "Home" })}
                  danger={true}
                />
              </View>
            </Animatable.View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};
export default AddTransactionScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
  },
  logoCover: {
    alignItems: "center",
    backgroundColor: COLORS.primary,
    alignItems: "center",
    height: SIZES.height,
  },
  logo: {
    height: 120,
    width: 120,
    resizeMode: "cover",
  },
  signInWrapper: {
    flex: 1,
    alignItems: "center",
    width: SIZES.width,
    backgroundColor: COLORS.lightGray,
    padding: 10,
  },
});
