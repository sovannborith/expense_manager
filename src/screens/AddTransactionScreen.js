import React, { useState, useContext } from "react";
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
import { useFormik } from "formik";
import * as Yup from "yup";

import { AuthContext } from "../server/context/AuthProvider";
import FormInput from "../components/form/FormInput";
import FormButton from "../components/form/FormButton";
import FormOutLineButton from "../components/form/FormOutLineButton";
import { COLORS, SIZES } from "../constants";

const AddTransactionScreen = ({ navigation }) => {
  const [expType, setExptype] = useState("E");
  const [expDesc, setExpDesc] = useState("");
  const [expRemark, setExpRemark] = useState("");
  const [expAmt, setExpAmt] = useState(0);

  const [isLoading, setLoading] = useState(false);
  const { loginUser } = useContext(AuthContext);

  const AddTransactionSchema = Yup.object().shape({
    description: Yup.string().required(),
    expAmount: Yup.number().required(),
    remark: Yup.string(),
  });

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    touched,
    errors,
    isValid,
  } = useFormik({
    validationSchema: AddTransactionSchema,
    initialValues: { description:expDesc, expAmount: "0", remark: "" },
    onSubmit: () => {
      null;
    },
  });

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView>
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
                        expType == "R" ? COLORS.primary : COLORS.gray,
                      padding: 10,
                      borderTopLeftRadius: "50%",
                      borderBottomLeftRadius: "50%",
                      shadowColor: COLORS.gray,
                      shadowRadius: 5,
                      shadowOpacity: 2,
                      shadowOffset: { width: 0, height: 2 },
                      elevation: 5,
                      borderColor: COLORS.white,
                      borderWidth: expType == "R" ? 1 : null,
                      width: 80,
                    }}
                    onPress={() => setExptype("R")}
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
                        expType == "E" ? COLORS.red : COLORS.gray,
                      padding: 10,
                      borderTopRightRadius: "50%",
                      borderBottomRightRadius: "50%",
                      shadowColor: COLORS.gray,
                      shadowRadius: 5,
                      shadowOpacity: 2,
                      shadowOffset: { width: 0, height: 2 },
                      elevation: 5,
                      borderColor: COLORS.white,
                      borderWidth: expType == "E" ? 1 : null,
                      width: 80,
                    }}
                    onPress={() => setExptype("E")}
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
                    expType == "E"
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
                <FormInput
                  placeholderText="Remark"
                  labelValue={expRemark}
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
                  onPress={() => navigation.navigate("Home")}
                  danger={true}
                />
              </View>
            </Animatable.View>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};
export default AddTransactionScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    flex: 1,
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
