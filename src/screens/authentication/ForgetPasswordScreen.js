import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import FormInput from "../../components/form/FormInput";
import FormButton from "../../components/form/FormButton";
import FormLineButton from "../../components/form/FormLineButton";
import { UserContext } from "../../server/context/UserContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import * as Animatable from "react-native-animatable";
const ForgetPasswordScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useContext(UserContext);

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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : null}
      style={styles.container}
    >
      <View style={{ flex: 1 }}>
        <View style={{ alignItems: "center" }}>
          <Image
            source={require("../../assets/logo_01.png")}
            style={styles.logo}
          />
        </View>
        <Animatable.View animation="fadeInUpBig" style={styles.footer}>
          <View style={styles.signInWrapper}>
            <View style={styles.loginHeader}>
              <Text style={styles.text}>Reset Password</Text>
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

              <FormButton
                buttonTitle="Reset Password"
                loading={loading}
                onPress={handleSubmit}
              />
              <FormLineButton
                buttonTitle="Sign In"
                onPress={() => navigation.navigate("SignIn")}
              />
            </View>
            <View style={styles.formFooter}></View>
          </View>
        </Animatable.View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ForgetPasswordScreen;

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
    //backgroundColor: "#246b6b",
    borderWidth: 1,
    /* borderTopLeftRadius: 25,
    borderTopRightRadius: 25, */
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "flex-start",
    //padding: 10,
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
    color: "#fff",
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
