import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import Loading from "../LoadingComponent";
import { COLORS, SIZES } from "../../constants";

const FormOutLineButton = ({ buttonTitle, loading, ...rest }) => {
  return (
    <TouchableOpacity style={styles.forgotButton} {...rest}>
      {loading ? (
        <Loading size="small" />
      ) : (
        <Text style={styles.buttonText}>{buttonTitle}</Text>
      )}
    </TouchableOpacity>
  );
};

export default FormOutLineButton;

const styles = StyleSheet.create({
  forgotButton: {
    marginTop: 10,
    width: "100%",
    height: SIZES.largeTitle,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderLeftWidth: 5,
    borderLeftColor: COLORS.primary,
    borderRightColor: COLORS.primary,
    borderRightWidth: 5,
  },
  buttonText: {
    fontSize: 16,
    color: "#246b6b",
  },
});
