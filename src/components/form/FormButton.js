import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import Loading from "../LoadingComponent";
const FormButton = ({ buttonTitle,  loading, ...rest }) => {

  
  return (
    <TouchableOpacity style={styles.buttonContainer} {...rest}>
      {loading ? (
        <Loading size="small" />
      ) : (
        <Text style={styles.buttonText}>{buttonTitle}</Text>
      )}
    </TouchableOpacity>
  );
};

export default FormButton;

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 10,
    width: "100%",
    height: 50,
    backgroundColor: "#246b6b",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
  },
  buttonText: {
    fontSize: 16,
    color: "#ffffff",
  },
});
