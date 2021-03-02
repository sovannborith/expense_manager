import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
//import { useTheme } from "react-native-paper";

import { windowHeight, windowWidth } from "../../utils/Dimensions";

import { AntDesign } from "@expo/vector-icons";

const FormInput = ({ labelValue, placeholderText, iconType, touched, error, autoFocus, ...rest }) => {
  
  return (
    <View style={{
      marginTop: 5,
      marginBottom: 10,
      width: "100%",
      height: 50,
      borderColor: !touched ? "#878787" : !error? "#246b6b":"#d10000",
      borderRadius: 3,
      borderWidth: 1,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#fff",
    }}>
      <View style={{
        padding: 10,
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        width: 50,
        color: !touched ? "#878787" : !error? "#246b6b":"#d10000",
        borderRightColor: !touched ? "#878787" : !error? "#246b6b":"#d10000",
        borderRightWidth: 1,
      }}>
        <AntDesign name={iconType} size={25} color={!touched ? "#878787" : !error? "#246b6b":"#d10000"} 
          
        />
      </View>
      <TextInput
        value={labelValue}
        style={{
          padding: 10,
          flex: 1,
          fontSize: 16,
          color:!touched ? "#878787" : !error? "#246b6b":"#d10000",
          justifyContent: "center",
          alignItems: "center",
        }}
        numberOfLines={1}
        placeholder={placeholderText}
        placeholderTextColor={!touched ? "#878787" : !error? "#b0b0b0":"#d10000"}
        underlineColorAndroid="transparent"
        autoFocus={autoFocus}
        {...rest}
      />
      {touched && (
        <View style={{height:20,
        width: 20,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: !error ? "#246b6b":"#d10000",
        right: 10}} >        
        <AntDesign name ={!error ? "check" : "close"} size={16} color="white" style={{textAlign: "center", fontWeight: "bold"}}/>
      </View>
      
      )}
    
    </View>
  )
};

export default FormInput;

