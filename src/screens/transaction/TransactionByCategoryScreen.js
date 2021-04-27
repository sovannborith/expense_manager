import React, { useState, useContext, useEffect, useLayoutEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Animated,
  TouchableHighlight,
  Keyboard,
  Alert,
} from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import * as Animatable from "react-native-animatable";

import { AuthContext } from "../../server/context/AuthProvider";

import FormOutLineButton from "../../components/form/FormOutLineButton";
import { COLORS, SIZES, icons } from "../../constants";
import { firebase } from "../../server/firebase/firebase";
import util from "../../utils/util";
import Loader from "../../components/LoadingComponent";
const db = firebase.firestore();

const TransactionByCategoryScreen = ({ route, navigation }) => {
  const [loading, setLoading] = useState(false);
  const { loginUser } = useContext(AuthContext);
  const [trxType, setTrxType] = useState([]);
  const [transactionDetails, setTransactionDetails] = useState([]);
  const [arrowIcon, setArrowIcon] = useState(0);
  const [tranKey, setTranKey] = useState(null);

  useLayoutEffect(() => {
    try {
      setLoading(true);

      loadTransactionDetails();
      Keyboard.dismiss();
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [navigation, route]);

  const loadTransactionDetails = async () => {
    try {
      const { trxItem } = route.params;
      //navigation.setOptions({ title: title });
      setTrxType(trxItem);
      let curDate = new Date();
      const unsubscribe_01 = await db
        .collection("tbl_transactions")
        .where("uid", "==", loginUser.uid)
        .where("exp_item", "==", trxItem.type_id)
        .where("tran_year", "==", curDate.getFullYear())
        .where("tran_month", "==", curDate.getMonth() + 1)
        .get()
        .then((documentSnapshot) => {
          setTransactionDetails(
            documentSnapshot.docs.map((item) => item.data())
          );
        });
      //.error((err) => console.log(err));
      return () => {
        unsubscribe_01;
      };
    } catch (e) {
      console.log(e);
    }
  };

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = (rowMap, rowKey) => {
    setLoading(true);
    try {
      deleteDBData(rowKey);
      closeRow(rowMap, rowKey);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const deleteDBData = async (id) => {
    try {
      const unsubscribe_01 = await db
        .collection("tbl_transactions")
        .where("uid", "==", loginUser.uid)
        .where("tran_id", "==", id)
        .get()
        .then((documentSnapShot) => {
          documentSnapShot.docs.map((item) => {
            item.ref.delete();
          });
        })
        .then(() => {
          loadTransactionDetails();
          //removeArrayData(id);
        })
        .catch((err) => console.log(err));

      return () => {
        unsubscribe_01;
      };
    } catch (e) {
      console.log(e);
    }
  };

  const onRowDidOpen = (rowKey) => {
    setArrowIcon(1);
    setTranKey(rowKey);
  };

  const onRowDidClose = (rowKey) => {
    setArrowIcon(0);
    setTranKey(null);
  };

  const onLeftActionStatusChange = (rowKey) => {
    console.log("onLeftActionStatusChange", rowKey);
  };

  const onRightActionStatusChange = (rowKey) => {
    console.log("onRightActionStatusChange", rowKey);
  };

  const onRightAction = (rowKey) => {
    console.log("onRightAction", rowKey);
  };

  const onLeftAction = (rowKey) => {
    console.log("onLeftAction", rowKey);
  };

  const VisibleItem = (props) => {
    const {
      data,
      rowHeightAnimatedValue,
      removeRow,
      leftActionState,
      rightActionState,
    } = props;

    if (rightActionState) {
      Animated.timing(rowHeightAnimatedValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => {
        removeRow();
      });
    }

    return (
      <Animated.View
        style={[styles.rowFront, { height: rowHeightAnimatedValue }]}
      >
        <TouchableHighlight
          style={styles.rowFrontVisible}
          onPress={() => console.log("Element touched")}
          underlayColor={"#aaa"}
        >
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <View
              style={{
                justifyContent: "center",
                paddingRight: 10,
              }}
            >
              <Image
                source={getValueByKey(icons, trxType.icon)}
                resizeMode="contain"
                style={{
                  width: 40,
                  height: 40,
                  tintColor: getValueByKey(COLORS, trxType.color),
                }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.title} numberOfLines={1}>
                {trxType?.val_id === "EXP" ? "Expense - " : "Revenue - "}
                {data.item.tran_desc}
              </Text>
              <Text style={{ color: COLORS.gray }}>
                Amount: {data.item.tran_amt}
              </Text>
              <Text style={{ color: COLORS.gray }}>
                Date: {util.formartDate(new Date(data.item.timestamp))}
              </Text>
            </View>
            <View
              style={{
                justifyContent: "center",
                paddingRight: 10,
              }}
            >
              <Image
                source={icons.back_icon}
                resizeMode="contain"
                style={{
                  width: 20,
                  height: 20,
                  tintColor: COLORS.primary,
                  right: -10,
                  alignSelf: "flex-end",
                }}
              />
            </View>
          </View>
        </TouchableHighlight>
      </Animated.View>
    );
  };

  const renderItem = (data, rowMap) => {
    const rowHeightAnimatedValue = new Animated.Value(60);
    if (data == null) return <Text>No data!</Text>;
    return (
      <VisibleItem
        data={data}
        rowHeightAnimatedValue={rowHeightAnimatedValue}
        removeRow={() => deleteRow(rowMap, data.item.tran_id)}
      />
    );
  };

  const HiddenItemWithActions = (props) => {
    const {
      swipeAnimatedValue,
      leftActionActivated,
      rightActionActivated,
      rowActionAnimatedValue,
      rowHeightAnimatedValue,
      onClose,
      onDelete,
    } = props;

    if (rightActionActivated) {
      Animated.spring(rowActionAnimatedValue, {
        toValue: 500,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.spring(rowActionAnimatedValue, {
        toValue: 75,
        useNativeDriver: false,
      }).start();
    }

    return (
      <Animated.View
        style={[
          styles.rowBack,
          {
            height: rowHeightAnimatedValue,
          },
        ]}
      >
        {!leftActionActivated && (
          <TouchableOpacity
            style={[styles.backRightBtn, styles.backRightBtnLeft]}
            onPress={onClose}
          >
            <Image
              source={icons.close}
              resizeMode="contain"
              style={{
                width: 20,
                height: 20,
                tintColor: COLORS.white,
              }}
            />
          </TouchableOpacity>
        )}
        {!leftActionActivated && (
          <Animated.View
            style={[
              styles.backRightBtn,
              styles.backRightBtnRight,
              {
                flex: 1,
                width: rowActionAnimatedValue,
              },
            ]}
          >
            <TouchableOpacity
              style={[styles.backRightBtn, styles.backRightBtnRight]}
              onPress={onDelete}
            >
              <Animated.View
                style={[
                  styles.trash,
                  {
                    transform: [
                      {
                        scale: swipeAnimatedValue.interpolate({
                          inputRange: [-90, -45],
                          outputRange: [1, 0],
                          extrapolate: "clamp",
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Image
                  source={icons.trash}
                  resizeMode="contain"
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: COLORS.white,
                  }}
                />
              </Animated.View>
            </TouchableOpacity>
          </Animated.View>
        )}
      </Animated.View>
    );
  };

  const renderHiddenItem = (data, rowMap) => {
    const rowActionAnimatedValue = new Animated.Value(75);
    const rowHeightAnimatedValue = new Animated.Value(60);

    return (
      <HiddenItemWithActions
        data={data}
        rowMap={rowMap}
        rowActionAnimatedValue={rowActionAnimatedValue}
        rowHeightAnimatedValue={rowHeightAnimatedValue}
        onClose={() => closeRow(rowMap, data.item.tran_id)}
        onDelete={() => deleteRow(rowMap, data.item.tran_id)}
      />
    );
  };

  const getValueByKey = (obj, key) => {
    for (const [k, val] of Object.entries(obj)) {
      if (k === key) {
        return val;
      }
    }
  };
  if (loading) return <Loader loadingLabel="Loading..." />;
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={[styles.logoCover, styles.shadow]}>
          <View
            style={{
              backgroundColor: COLORS.white,
              ...styles.logo,
            }}
          >
            <Image
              source={getValueByKey(icons, trxType.icon)}
              style={{
                tintColor: getValueByKey(COLORS, trxType.color),
                ...styles.logoImg,
              }}
            />
          </View>
          <Animatable.View animation="fadeInUpBig" style={{ marginTop: 10 }}>
            <View style={styles.signInWrapper}>
              <SwipeListView
                style={{ width: SIZES.width - 20 }}
                data={transactionDetails}
                renderItem={renderItem}
                renderHiddenItem={renderHiddenItem}
                keyExtractor={(item) => `${item.tran_id}`}
                /* leftOpenValue={75} */
                rightOpenValue={-150}
                disableRightSwipe
                onRowDidOpen={onRowDidOpen}
                onRowDidClose={onRowDidClose}
                leftActivationValue={100}
                rightActivationValue={-300}
                leftActionValue={0}
                rightActionValue={-500}
                onLeftAction={onLeftAction}
                onRightAction={onRightAction}
                onLeftActionStatusChange={onLeftActionStatusChange}
                onRightActionStatusChange={onRightActionStatusChange}
              />
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: COLORS.lightGray,
                paddingHorizontal: 20,
              }}
            >
              <FormOutLineButton
                buttonTitle="View current month transaction?"
                onPress={() =>
                  navigation.navigate("Transaction", {
                    screen: "TransactionList",
                  })
                }
              />
            </View>
          </Animatable.View>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default TransactionByCategoryScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
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
    alignItems: "center",
    justifyContent: "center",
  },
  logoImg: {
    height: 60,
    width: 60,
    resizeMode: "contain",
  },
  signInWrapper: {
    flex: 1,
    alignItems: "center",
    width: SIZES.width,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: COLORS.lightGray,
    padding: 10,
  },
  backTextWhite: {
    color: "#FFF",
  },
  rowFront: {
    backgroundColor: "#FFF",
    borderRadius: 5,
    height: 60,
    margin: 5,
    marginBottom: 5,
    shadowColor: "#999",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  rowFrontVisible: {
    backgroundColor: "#FFF",
    borderRadius: 5,
    height: 60,
    padding: 10,
    marginBottom: 5,

    justifyContent: "center",
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#DDD",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingLeft: 15,
    margin: 5,
    marginBottom: 5,
    borderRadius: 5,
  },
  backRightBtn: {
    alignItems: "flex-end",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
  },
  backRightBtnLeft: {
    backgroundColor: COLORS.primary,
    right: 70,
    alignItems: "center",
    justifyContent: "center",
    width: 80,
  },
  backRightBtnRight: {
    backgroundColor: COLORS.danger,
    right: 0,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    width: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  trash: {
    height: 25,
    width: 25,
    marginRight: 7,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
    alignSelf: "flex-start",
  },
  details: {
    fontSize: 12,
    color: "#999",
  },
  shadow: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
});
