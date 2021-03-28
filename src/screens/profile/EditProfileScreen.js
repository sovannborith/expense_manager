import React, { useContext, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { firebase } from "../../server/firebase/firebase";
import { useFormik } from "formik";
import * as Yup from "yup";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import BottomSheet from "reanimated-bottom-sheet";
import Animated from "react-native-reanimated";

import FormInput from "../../components/form/FormInput";
import FormButton from "../../components/form/FormButton";
import FormOutLineButton from "../../components/form/FormOutLineButton";
import util from "../../utils/util";
import { COLORS, SIZES } from "../../constants";
import { AuthContext } from "../../server/context/AuthProvider";

const db = firebase.firestore();

const EditProfileScreen = () => {
  const [image, setImage] = useState();

  const [userData, setUserData] = useState(null);
  const [userID, setUserID] = useState();
  const [displayName, setDisplayName] = useState();
  const [email, setEmail] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [photoUrl, setPhotoUrl] = useState();
  const [createdDate, setCreatedDate] = useState();

  const [loading, setLoading] = useState(null);

  const getPermissionAsync = async () => {
    if (Platform.OS == "ios") {
      const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
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
    enableReinitialize: true,
    initialValues: {
      uid: userData ? userData.uid : "",
      displayName: userData ? userData.display_name : "",
      email: userData ? userData.user_email : "",
      phoneNumber: userData ? userData.phone_num : "",
      photoUrl: userData ? userData.photo_url : "",
    },
    onSubmit: () => {
      if (isValid) {
        alert("Hello");
      }
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
      <FormOutLineButton
        buttonTitle="Take Photo"
        onPress={takePhotoFromCamera}
      />
      <FormOutLineButton
        buttonTitle="Choose From Library"
        onPress={choosePhotoFromLibrary}
      />
      <FormOutLineButton
        buttonTitle="Cancel"
        onPress={() => bs.current.snapTo(1)}
        danger={true}
      />
    </View>
  );

  const getUserData = async () => {
    try {
      await db
        .collection("tbl_user_profile")
        .doc(util.getCurrentLoginUser().uid)
        .get()
        .then((documentSnapshot) => {
          if (documentSnapshot.exists) {
            setUserData(documentSnapshot.data());
          } else console.log("No data found!");
        });
    } catch (e) {
      alert(e);
    }
  };

  useEffect(() => {
    try {
      getUserData();
      getPermissionAsync();
    } catch (e) {
      alert(e);
    } finally {
      //setLoading(false);
    }
  }, []);

  bs = React.createRef();
  fall = new Animated.Value(1);
  //if (loading) return <Loader />;

  return (
    <SafeAreaView>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <View style={styles.logoCover}>
            <TouchableOpacity
              onPress={() => {
                Keyboard.dismiss();
                this.bs.current.snapTo(0);
              }}
              style={{
                borderRadius: "50%",
              }}
            >
              <Image
                source={{
                  uri: photoUrl ? photoUrl : util.getDefaultProfilePicture(),
                }}
                style={styles.logo}
              />
            </TouchableOpacity>
            <Animatable.View
              animation="fadeInUpBig"
              style={{
                opacity: Animated.add(0.1, Animated.multiply(this.fall, 1.0)),
              }}
            >
              <View style={styles.signInWrapper}>
                <FormInput
                  labelValue={values.uid}
                  iconType="user"
                  editable={false}
                  placeholderText="UID"
                />

                <FormInput
                  iconType="user"
                  labelValue={values.displayName}
                  error={errors.displayName}
                  touched={touched.displayName}
                  onChangeText={handleChange("displayName")}
                  placeholderText="Disaply Name"
                  onBlur={handleBlur("displayName")}
                  autoCapitalize="none"
                  autoCorrect={true}
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
                  iconType="contacts"
                  labelValue={values.phoneNumber}
                  error={errors.phoneNumber}
                  touched={touched.phoneNumber}
                  onChangeText={handleChange("phoneNumber")}
                  placeholderText="Contact Number"
                  onBlur={handleBlur("phoneNumber")}
                  onSubmitEditing={handleSubmit}
                />

                <FormButton buttonTitle="Update" onPress={handleSubmit} />
              </View>
              <BottomSheet
                ref={this.bs}
                snapPoints={[650, -5]}
                renderContent={renderInner}
                renderHeader={renderHeader}
                initialSnap={1}
                callbackNode={this.fall}
                enabledGestureInteraction={true}
              />
            </Animatable.View>
          </View>
        </View>
      </TouchableWithoutFeedback>
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
    borderRadius: 60,
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
  panel: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    paddingTop: 20,
    width: "100%",
    paddingBottom: 100,
  },
  header: {
    backgroundColor: COLORS.white,
    shadowColor: "#333333",
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: "center",
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    //backgroundColor: "#00000040",
    backgroundColor: COLORS.primary,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: "gray",
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: "#2e64e5",
    alignItems: "center",
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
  },
});
