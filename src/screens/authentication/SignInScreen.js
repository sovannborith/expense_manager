import React, { useContext, useState, useEffect, Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
} from "react-native";
import { useFormik } from "formik";
import * as Yup from "yup";
import * as Animatable from "react-native-animatable";
import * as Facebook from "expo-facebook";
import AsyncStorage from "@react-native-async-storage/async-storage";

import FormInput from "../../components/form/FormInput";
import FormButton from "../../components/form/FormButton";
import SocialButton from "../../components/form/SocialButton";
import FormLineButton from "../../components/form/FormLineButton";
import { UserContext } from "../../server/context/UserContext";
import Loader from "../../components/LoadingComponent";

import HomeScreen from "../HomeScreen";

const SignInScreen = ({ navigation }) => {
  const { login, user, loginWithFacebook, loginWithGoogle } = useContext(
    UserContext
  );

  const [loginUser, setLoginUser] = useState(null);
  const [isLoading, setLoading] = useState(true);

  const checkUser = async () => {
    try {
      await AsyncStorage.getItem("@loginUser").then((value) => {
        setLoginUser(value);
      });
    } catch (e) {
      alert(e);
    } finally {
      setLoading(false);
    }
  };
  const signInWithGoogle = () => {
    try {
      loginWithGoogle().then(navigation.navigate("App", { Screen: "Home" }));
    } catch (e) {
      alert(e);
    }
  };

  const signInWithFacebook = () => {
    try {
      loginWithFacebook();
      //setUser(user);
      navigation.navigate("App", { Screen: "Home" });
    } catch (e) {
      alert(e);
    }
  };

  const signIn = (email, password) => {
    try {
      setLoading(true);
      if (isValid) {
        login(email, password);
      }
      if (user) {
        //setUser(user);
        navigation.navigate("App", { Screen: "Home" });
      }
    } catch (e) {
      alert("Login failed! Please try again!");
    } finally {
      setLoading(false);
    }
  };

  const SignInSchema = Yup.object().shape({
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
    validationSchema: SignInSchema,
    initialValues: { email: "", password: "" },
    onSubmit: () => {
      signIn(values.email, values.password);
    },
  });

  useEffect(() => {
    try {
      checkUser();
      if (loginUser) {
        navigation.navigate("App", { Screen: "Home" });
      }
    } catch (e) {
      alert(e);
    }
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "height" : null}
        style={styles.container}
      >
        {isLoading ? (
          <Loader />
        ) : (
          <View style={{ flex: 1 }}>
            <View style={{ alignItems: "center" }}>
              <Image
                source={require("../../assets/logo_01.png")}
                style={styles.logo}
              />
            </View>
            <Animatable.View animation="fadeInUpBig" style={styles.footer}>
              <View style={styles.signInWrapper}>
                {/* <View style={styles.loginHeader}> */}
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
                  />

                  <FormButton
                    buttonTitle="Sign In"
                    loading={isLoading}
                    onPress={handleSubmit}
                  />

                  <View>
                    <SocialButton
                      buttonTitle="Sign In with Facebook"
                      btnType="facebook"
                      color="#4867aa"
                      backgroundColor="#e6eaf4"
                      onPress={() => signInWithFacebook()}
                    />

                    <SocialButton
                      buttonTitle="Sign In with Google"
                      btnType="google"
                      color="#de4d41"
                      backgroundColor="#f5e7ea"
                      onPress={() => signInWithGoogle()}
                    />
                  </View>
                  <FormLineButton
                    buttonTitle="Forgot Password"
                    onPress={() => navigation.navigate("ForgetPassword")}
                  />
                  <FormLineButton
                    buttonTitle="Sign Up"
                    onPress={() => navigation.navigate("SignUp")}
                  />
                </View>
              </View>
            </Animatable.View>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f9fafd",
    flex: 1,
    padding: 10,
  },
  logo: {
    height: 150,
    width: 150,
    resizeMode: "cover",
  },
  signInWrapper: {
    borderColor: "#246b6b",
    borderWidth: 1,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "flex-start",
    height: "100%",
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
    color: "#000",
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
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#BEC1D2",
    borderLeftWidth: 3,
    borderLeftColor: "#ee3431",
    borderRightColor: "#ee3431",
    borderRightWidth: 3,
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
