import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useFormik } from "formik";
import * as Yup from "yup";
import * as Animatable from "react-native-animatable";
import { firebase } from "../../server/firebase/firebase";

import FormInput from "../../components/form/FormInput";
import FormButton from "../../components/form/FormButton";
import SocialButton from "../../components/form/SocialButton";
import FormOutLineButton from "../../components/form/FormOutLineButton";
import { AuthContext } from "../../server/context/AuthProvider";
import Loader from "../../components/LoadingComponent";
import { COLORS, SIZES } from "../../constants";

const SignInScreen = ({ navigation }) => {
  const {
    loginUser,
    setLoginUser,
    login,
    loginWithFacebook,
    loginWithGoogle,
  } = useContext(AuthContext);

  const [isLoading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      await loginWithGoogle().then(() => {
        navigation.navigate("App", { Screen: "Home" });
      });
    } catch (e) {
      alert(e);
      return;
    } finally {
      setLoading(false);
    }
  };

  const signInWithFacebook = async () => {
    try {
      setLoading(true);
      await loginWithFacebook();

      if (loginUser) {
        navigation.navigate("App", { Screen: "Home" });
      }
    } catch (e) {
      alert(e);
      return;
    } finally {
      setLoading(false);
    }
  };

  const signIn = (email, password) => {
    try {
      setLoading(true);
      if (isValid) {
        login(email, password);
      }
      console.log(loginUser);
      if (loginUser) {
        navigation.navigate("App", { Screen: "Home" });
      }
    } catch (e) {
      alert("Login failed! Please try again!");
      console.log(e);
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

  //if (isLoading) return <Loader loadingLabel="Loading..." />;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.logoCover}>
              <Image
                source={require("../../assets/logo_01.png")}
                style={styles.logo}
              />
              <Animatable.View animation="fadeInUpBig">
                <View style={styles.signInWrapper}>
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
                      buttonTitle="Sign In"
                      loading={isLoading}
                      onPress={handleSubmit}
                      loadingLabel="Signing in..."
                    />

                    <SocialButton
                      buttonTitle="Sign In with Facebook"
                      btnType="facebook"
                      color="#4867aa"
                      backgroundColor="#e6eaf4"
                      onPress={() => signInWithFacebook()}
                      loading={isLoading}
                      loadingLabel="Signing in with Facebook..."
                    />

                    <SocialButton
                      buttonTitle="Sign In with Google"
                      btnType="google"
                      color="#de4d41"
                      backgroundColor="#f5e7ea"
                      onPress={() => signInWithGoogle()}
                      loading={isLoading}
                      loadingLabel="Signing in with Google..."
                    />
                    <FormOutLineButton
                      buttonTitle="Forgot Password"
                      onPress={() => navigation.navigate("ForgetPassword")}
                    />
                    <FormOutLineButton
                      buttonTitle="Sign Up"
                      onPress={() => navigation.navigate("SignUp")}
                    />
                  </View>
                </View>
              </Animatable.View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );

  /* if (isLoading) {
    return <Loader loadingLabel="Signing in..." />;
  } else {
    
  } */
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    height: SIZES.height,
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
    justifyContent: "center",
    alignItems: "center",
    width: SIZES.width,
    /* height: "100%", */
    marginTop: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: COLORS.white,
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
});
