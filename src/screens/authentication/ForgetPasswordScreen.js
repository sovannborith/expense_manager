import React, { useContext, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import FormInput from "../../components/form/FormInput";
import FormButton from "../../components/form/FormButton";
import FormOutLineButton from "../../components/form/FormOutLineButton";
import { AuthContext } from "../../server/context/AuthProvider";
import { useFormik } from "formik";
import * as Yup from "yup";
import * as Animatable from "react-native-animatable";
import { COLORS, SIZES } from "../../constants";
import Loader from "../../components/LoadingComponent";
const ForgetPasswordScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useContext(AuthContext);

  const SignInSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required(),
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
    initialValues: { email: "" },
    onSubmit: () => {
      try {
        setLoading(true);
        if (isValid) {
          resetPassword(values.email);
          navigation.navigate("SignIn");
          alert("Password reset link has sent to your email address");
        }
      } catch (e) {
        alert(e);
      } finally {
        setLoading(false);
      }
    },
  });
  if (loading) return <Loader />;
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : null}>
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

                    <FormButton
                      buttonTitle="Reset Password"
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
          </TouchableWithoutFeedback>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgetPasswordScreen;

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
    justifyContent: "center",
    alignItems: "center",
    width: SIZES.width,
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
