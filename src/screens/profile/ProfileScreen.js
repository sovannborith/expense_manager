import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, SafeAreaView } from "react-native";
import * as Animatable from "react-native-animatable";

import { firebase } from "../../server/firebase/firebase";
import FormInput from "../../components/form/FormInput";
import { COLORS, SIZES } from "../../constants";
import util from "../../utils/util";
import Loader from "../../components/LoadingComponent";

const db = firebase.firestore();
const ProfileScreen = () => {
  const [userData, setUserData] = useState(null);
  const [userID, setUserId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [createdDate, setCreatedDate] = useState("");

  const [loading, setLoading] = useState(null);

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
    } catch (e) {
      alert(e);
    } finally {
    }
  }, []);

  if (loading) return <Loader />;

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.logoCover}>
          <Image
            source={{
              uri: photoUrl ? photoUrl : util.getDefaultProfilePicture(),
            }}
            style={styles.logo}
          />
          <Animatable.View animation="fadeInUpBig">
            <View style={styles.signInWrapper}>
              <FormInput
                labelValue={userData ? userData.uid : null}
                iconType="user"
                editable={false}
              />
              <FormInput
                labelValue={userData ? userData.display_name : null}
                iconType="user"
                editable={false}
              />
              <FormInput
                labelValue={userData ? userData.user_email : null}
                iconType="mail"
                editable={false}
              />
              <FormInput
                labelValue={userData ? userData.phone_num : null}
                iconType="contacts"
                editable={false}
              />

              <FormInput
                labelValue={userData ? userData.created_dt : null}
                iconType="calendar"
                editable={false}
              />
            </View>
          </Animatable.View>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.lightGray,
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
});
