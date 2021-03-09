import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import Loading from "../LoadingComponent";
const FormLineButton = ({ buttonTitle, loading, ...rest }) => {
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

export default FormLineButton;

const styles = StyleSheet.create({
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
  buttonText: {
    fontSize: 16,
    color: "#246b6b",
  },
});
