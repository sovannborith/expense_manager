import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import Loading from "../LoadingComponent";
import { COLORS, SIZES } from "../../constants";
const FormButton = ({ buttonTitle, loading, loadingLabel, ...rest }) => {
  return (
    <TouchableOpacity style={styles.buttonContainer} {...rest}>
      {loading ? (
        <Loading size="small" loadingLabel={loadingLabel} />
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
    height: SIZES.largeTitle,
    backgroundColor: COLORS.primary,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  buttonText: {
    fontSize: 16,
    color: COLORS.white,
  },
});
