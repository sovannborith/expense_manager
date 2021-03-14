import React, { Component, useContext, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
} from "react-native";

import { firebase } from "../../server/firebase/firebase";
import * as Animatable from "react-native-animatable";

import { useFormik } from "formik";
import * as Yup from "yup";

import FormInput from "../../components/form/FormInput";
import FormButton from "../../components/form/FormButton";
import FormOutLineButton from "../../components/form/FormOutLineButton";
import { AuthContext } from "../../server/context/AuthProvider";
import { COLORS } from "../../constants";
import Loader from "../../components/LoadingComponent";

const SignUpScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);

  const signUp = async (email, password) => {
    try {
      if (isValid) {
        await firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .then((res) => {
            api.setToken(res.user.uid);
            navigation.navigate("App", { screen: "Home" });
          });
      }
    } catch (e) {
      alert(e);
    } finally {
      setLoading(false);
    }
  };

  const SignUpSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required(),
    password: Yup.string().required(),
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
    validationSchema: SignUpSchema,
    initialValues: { email: "", password: "" },
    onSubmit: () => {
      signUp(values.email, values.password);
    },
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : null}>
        <View style={styles.container}>
          <View style={styles.logoCover}>
            <Image
              source={require("../../assets/logo_01.png")}
              style={styles.logo}
            />
          </View>
          <Animatable.View animation="fadeInUpBig">
            <View style={styles.signInWrapper}>
              <View>
                <Text style={styles.text}>Sign In</Text>
              </View>
              <View style={styles.formElement}>
                <FormInput
                  labelValue={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  placeholderText="Email"
                  iconType="user"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  error={errors.email}
                  touched={touched.email}
                  autoFocus={true}
                />

                <FormInput
                  labelValue={values.password}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  placeholderText="Password"
                  iconType="lock"
                  secureTextEntry={true}
                  error={errors.password}
                  touched={touched.password}
                  onSubmitEditing={handleSubmit}
                />

                <FormButton
                  buttonTitle="Register"
                  loading={loading}
                  onPress={handleSubmit}
                />
                <FormOutLineButton
                  buttonTitle="Sign In"
                  onPress={() => navigation.navigate("SignIn")}
                />
              </View>
            </View>
          </Animatable.View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    flex: 1,
  },
  logoCover: {
    alignItems: "center",
    height: 160,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  logo: {
    height: 150,
    width: 150,
    resizeMode: "cover",
  },
  signInWrapper: {
    alignItems: "center",
    justifyContent: "flex-start",
    height: "100%",
    marginTop: 20,
  },
  loginHeader: {
    position: "relative",
    top: -1,
    height: 50,
    backgroundColor: "#246b6b",
    borderColor: "#246b6b",
    borderWidth: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 28,
    marginBottom: 10,
    color: "#246b6b",
    fontWeight: "bold",
    top: 3,
  },
  formElement: {
    padding: 10,
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
  signIn: {},
  navButton: {
    marginTop: 15,
  },
  forgotButton: {
    marginTop: 10,
    width: "100%",
    height: 50,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#246b6b",
  },
  navButtonText: {
    fontSize: 16,
    color: "#246b6b",
  },
  formFooter: {
    height: 50,
    backgroundColor: "#246b6b",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    width: "100%",
    top: 1,
    borderColor: "#246b6b",
    borderWidth: 1,
  },
  footer: {
    flex: Platform.OS === "ios" ? 3 : 5,
  },
});
