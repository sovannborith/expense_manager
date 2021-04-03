import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { firebase } from "../server/firebase/firebase";
import { COLORS, icons } from "../constants";
import util from "../utils/util";

const db = firebase.firestore();

const HeaderRight = ({ onPress }) => {
  const [userData, setUserData] = useState(null);

  const getUserData = async (uid) => {
    try {
      await db
        .collection("tbl_user_profile")
        .doc(uid)
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
    const curLoginUser = util.getCurrentLoginUser();

    if (curLoginUser) {
      getUserData(curLoginUser.uid);
    }
  }, []);
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.profileButton}>
        <Image
          source={{
            uri: userData
              ? userData.photo_url
              : util.getDefaultProfilePicture(),
          }}
          style={styles.image}
          color={COLORS.white}
        />
      </TouchableOpacity>
    </View>
  );
};

export default HeaderRight;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  profileButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    borderColor: COLORS.white,
    borderWidth: 1,
    padding: 3,
    shadowColor: COLORS.gray,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  image: {
    width: 28,
    height: 28,
    //tintColor: COLORS.white,
    borderRadius: 14,
    resizeMode: "cover",
  },
});
