import React, { useContext, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  Platform,
  Text,
  ImageBackground,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useFormik } from "formik";
import * as Yup from "yup";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import BottomSheet from "reanimated-bottom-sheet";
import Animated from "react-native-reanimated";

import FormInput from "../../components/form/FormInput";
import { COLORS, SIZES } from "../../constants";
import { AuthContext } from "../../server/context/AuthProvider";

const EditProfileScreen = () => {
  const [image, setImage] = useState();
  let bs = React.createRef();
  let fall = new Animated.Value(1);

  const getPermissionAsync = async () => {
    if (Platform.OS == "ios") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert(
          "Sorry, we need camera roll permissions to update your profile picture!"
        );
      }
    }
  };

  const takePhotoFromCamera = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        setImage(result.uri);
        this.bs.current.snapTo(1);
      }
    } catch (e) {
      alert(e);
    }
  };

  const choosePhotoFromLibrary = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        setImage(result.uri);
        this.bs.current.snapTo(1);
      }
    } catch (e) {
      alert(e);
    }
  };

  const EditProfileSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required(),
    displayName: Yup.string().required(),
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
    validationSchema: EditProfileSchema,
    initialValues: {
      uid: "",
      displayName: "",
      email: "",
      contactNumber: "",
      photoUrl: "",
    },
    onSubmit: () => {
      signIn(values.email, values.password);
    },
  });

  const { loginUser } = useContext(AuthContext);

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );

  const renderInner = () => (
    <View style={styles.panel}>
      <View style={{ alignItems: "center" }}>
        <Text style={styles.panelTitle}>Upload Photo</Text>
        <Text style={styles.panelSubtitle}>Choose Your Profile Picture</Text>
      </View>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={takePhotoFromCamera}
      >
        <Text style={styles.panelButtonTitle}>Take Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={choosePhotoFromLibrary}
      >
        <Text style={styles.panelButtonTitle}>Choose From Library</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.panelButton}
        onPress={() => this.bs.current.snapTo(1)}
      >
        <Text style={styles.panelButtonTitle}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <BottomSheet
          ref={bs}
          snapPoints={[330, 0]}
          renderContent={renderInner}
          renderHeader={renderHeader}
          initialSnap={1}
          callbackNode={fall}
          enabledGestureInteraction={true}
        />
        <View style={styles.logoCover}>
          <TouchableOpacity onPress={() => alert("Test")}>
            <ImageBackground
              source={require("../../assets/logo_01.png")}
              style={styles.logo}
            />
          </TouchableOpacity>
          <Animatable.View animation="fadeInUpBig">
            <View style={styles.signInWrapper}>
              <FormInput
                labelValue={values.uid}
                iconType="user"
                editable={false}
                placeholderText="UID"
              />
              <FormInput
                labelValue="Display Name"
                iconType="user"
                labelValue={values.email}
                error={errors.displayName}
                touched={touched.displayName}
                onChangeText={handleChange("displayName")}
                placeholderText="Disaply Name"
              />
              <FormInput
                labelValue={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                placeholderText="Email"
                iconType="mail"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                error={errors.email}
                touched={touched.email}
              />
              <FormInput
                labelValue="Phone Number"
                iconType="contacts"
                labelValue={values.contactNumber}
                error={errors.contactNumber}
                touched={touched.contactNumber}
                onChangeText={handleChange("contactNumber")}
                placeholderText="Contact Number"
              />
              <FormInput
                labelValue="Photo Url"
                iconType="picture"
                iconType="picture"
                labelValue={values.photoUrl}
                error={errors.photoUrl}
                touched={touched.photoUrl}
                onChangeText={handleChange("photoUrl")}
                onSubmitEditing={handleSubmit}
                placeholderText="Photo Url"
              />
            </View>
          </Animatable.View>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default EditProfileScreen;

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
    marginTop: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: COLORS.lightGray,
    padding: 10,
  },
});
