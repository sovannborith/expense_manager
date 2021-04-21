import React, { useState, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Animated,
  TouchableHighlight,
  Alert,
} from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import * as Animatable from "react-native-animatable";

import { AuthContext } from "../../server/context/AuthProvider";

import { COLORS, SIZES, icons } from "../../constants";
import { firebase } from "../../server/firebase/firebase";
import util from "../../utils/util";
import Loader from "../../components/LoadingComponent";
const db = firebase.firestore();

const TransactionList = ({ route, navigation }) => {
  const [loading, setLoading] = useState(false);
  const { loginUser } = useContext(AuthContext);

  const [category, setCategory] = useState([]);
  const [transactionList, setTransactionList] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const [viewMode, setViewMode] = useState("inc");

  const [arrowIcon, setArrowIcon] = useState(0);
  const [tranKey, setTranKey] = useState(null);

  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  const loadData = async () => {
    var trxType = [];
    var transaction = [];

    var curDate = new Date();
    try {
      //Get all transaction types
      const unsubscribe_01 = await db
        .collection("tbl_trx_type")
        .get()
        .then((documentSnapshot) => {
          documentSnapshot.docs.map((trx) => {
            trxType.push(trx.data());
          });
        })
        .catch((err) => alert(err));
      //Get all transactions
      const unsubscribe_02 = await db
        .collection("tbl_transactions")
        .where("uid", "==", util.getCurrentLoginUser().uid)
        .where("tran_year", "==", curDate.getFullYear())
        .where("tran_month", "==", curDate.getMonth() + 1)
        .get()
        .then((documentSnapshot) => {
          documentSnapshot.docs.map((trx) => {
            transaction.push(trx.data());
          });
        })
        .catch((err) => alert(err));

      trxType.forEach((type) => {
        transaction.forEach((trx) => {
          if (trx.exp_item === type.type_id) {
            trx.trx_type = type.val_id;
            trx.color = type.color;
            trx.icon = type.icon;
            trx.type_nm_en = type.type_nm_en;
          }
        });
      });

      let tempData = [];
      var totalExp = 0;
      var totalInc = 0;
      var expCount = 0;
      var incCount = 0;
      transaction.forEach((item) => {
        if (item.val_id === "EXP") {
          totalExp = totalExp + parseInt(item.tran_amt);
          expCount += 1;
        } else {
          totalInc = totalInc + parseInt(item.tran_amt);
          incCount += 1;
        }
      });
      tempData.push({
        totalExpense: totalExp,
        totalIncome: totalInc,
        totalExpenseCount: expCount,
        totalIncomeCount: incCount,
        balance: totalInc - totalExp,
      });

      const unsubscribe_03 = setHeaderData(tempData);
      console.log(headerData);
      //const unsubscribe_04 = setTransactionList(filterData(transaction));

      return () => {
        unsubscribe_01;
        unsubscribe_02;
        unsubscribe_03;
        unsubscribe_04;
        //unsubscribe_05;
      };
    } catch (e) {
      console.log("Error @TransactionList - loadHomeData: " + e);
    }
  };

  const listHomeData = async (trxDtls) => {
    let tempData = [];
    var totalExp = 0;
    var totalInc = 0;
    var expCount = 0;
    var incCount = 0;
    trxDtls.forEach((item) => {
      if (item.val_id === "EXP") {
        totalExp = totalExp + parseInt(item.tran_amt);
        expCount += 1;
      } else {
        totalInc = totalInc + parseInt(item.tran_amt);
        incCount += 1;
      }
    });
    tempData.push({
      totalExpense: totalExp,
      totalIncome: totalInc,
      totalExpenseCount: expCount,
      totalIncomeCount: incCount,
      balance: totalInc - totalExp,
    });
    console.log(tempData);
    return tempData;
  };

  const filterData = async (trxDtls) => {
    let tempData = [];
    if (viewMode === "inc") {
      trxDtls.forEach((item) => {
        if (item.val_id === "REVN") {
          tempData.push(item);
        }
      });
    } else {
      trxDtls.forEach((item) => {
        if (item.val_id === "exp") {
          tempData.push(item);
        }
      });
    }
    return tempData;
  };

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
    if (rowKey === tranKey) {
      setArrowIcon(0);
    }
  };

  const deleteRow = (rowMap, rowKey) => {
    setLoading(true);
    try {
      deleteDBData(rowKey);
      closeRow(rowMap, rowKey);
      /* Alert.alert(
        //title
        "Deleting Confirmation",
        //body
        "Are you sure want to delete this transaction?",
        [
          {
            text: "Yes",
            onPress: async () => {
              await deleteDBData(rowKey);
              closeRow(rowMap, rowKey);
            },
          },
          {
            text: "Cancel",
            onPress: () => true,
            style: "cancel",
          },
        ],
        { cancelable: false }
        //clicking out side of alert will not cancel
      ); */
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const removeArrayData = (id) => {
    const newTransaction = [...transactionDetails];
    const preIdx = transactionDetails.findIndex((item) => item.key === id);

    newTransaction.splice(preIdx, 1);
    setTransactionDetails(newTransaction);
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
          removeArrayData(id);
        })
        .error((err) => console.log(err));

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
                source={arrowIcon == 1 ? icons.right_icon : icons.back_icon}
                resizeMode="contain"
                style={{
                  width: 20,
                  height: 20,
                  tintColor: COLORS.primary,
                  right: -20,
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

  const handleExpClick = () => {
    setViewMode("exp");
    filterData(viewMode);
  };
  const handleRevClick = () => {
    setViewMode("inc");
    filterData(viewMode);
  };
  useEffect(() => {
    setLoading(true);
    loadData();
    try {
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [viewMode]);
  if (loading) return <Loader loadingLabel="Loading..." />;
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.summary}>
          <View style={styles.summarySection}>
            <Text style={styles.sectionHeader}>Income</Text>
            <Text style={styles.sectionNumber}>
              {numberWithCommas(Number(headerData?.totalIncome))}
            </Text>
          </View>
          <View style={styles.summarySection}>
            <Text style={styles.sectionHeader}>Expense</Text>
            <Text style={styles.sectionNumber}>
              {numberWithCommas(Number(headerData?.totalExpense))}
            </Text>
          </View>
          <View style={styles.summarySection}>
            <Text style={styles.sectionHeader}>Balance</Text>
            <Text style={styles.sectionNumber}>
              {numberWithCommas(Number(headerData?.balance))}
            </Text>
          </View>
        </View>

        <View style={[styles.logoCover, styles.shadow]}>
          <Animatable.View animation="fadeInUpBig">
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: COLORS.lightGray,
                width: SIZES.width,
                padding: 10,
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,
              }}
            >
              <Text
                style={{
                  color: COLORS.primary,
                  fontWeight: "800",
                  marginTop: 15,
                }}
              >
                Transaction List
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  height: 50,
                  borderColor: COLORS.primary,
                  borderWidth: 3,
                  borderRadius: 30,
                  shadowColor: COLORS.gray,
                  shadowRadius: 5,
                  shadowOpacity: 2,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: 5,
                  padding: 1,
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{
                    backgroundColor:
                      viewMode == "inc" ? COLORS.primary : COLORS.gray,
                    padding: 10,
                    borderTopLeftRadius: "50%",
                    borderBottomLeftRadius: "50%",
                    shadowColor: COLORS.gray,
                    shadowRadius: 5,
                    shadowOpacity: 2,
                    shadowOffset: { width: 0, height: 2 },
                    elevation: 5,
                    borderColor: COLORS.white,
                    borderWidth: viewMode == "inc" ? 1 : null,
                    width: 80,
                  }}
                  onPress={() => {
                    handleRevClick();
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "800",
                      color: COLORS.white,
                      paddingTop: 1,
                    }}
                  >
                    Income
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{
                    backgroundColor:
                      viewMode == "exp" ? COLORS.red : COLORS.gray,
                    padding: 10,
                    borderTopRightRadius: "50%",
                    borderBottomRightRadius: "50%",
                    shadowColor: COLORS.gray,
                    shadowRadius: 5,
                    shadowOpacity: 2,
                    shadowOffset: { width: 0, height: 2 },
                    elevation: 5,
                    borderColor: COLORS.white,
                    borderWidth: viewMode == "exp" ? 1 : null,
                    width: 80,
                  }}
                  onPress={() => {
                    handleExpClick();
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "800",
                      color: COLORS.white,
                      paddingTop: 1,
                    }}
                  >
                    Expense
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.signInWrapper}>
              <SwipeListView
                style={{ width: SIZES.width - 20, height: SIZES.height }}
                data={transactionList}
                renderItem={renderItem}
                renderHiddenItem={renderHiddenItem}
                keyExtractor={(item) => `${item.tran_id}`}
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
          </Animatable.View>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default TransactionList;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
  },
  summary: {
    width: "100%",
    height: 75,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  summarySection: {
    flexDirection: "column",
    backgroundColor: COLORS.white, //"#ee3431",
    marginTop: 10,
    height: (SIZES.body2 + 5) * 2,
    justifyContent: "space-between",
    width: Math.abs(SIZES.width / 3) - 10,
    alignItems: "center",
    borderRadius: SIZES.body2 + 5,
    shadowColor: COLORS.gray,
    shadowRadius: 5,
    shadowOpacity: 2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    paddingVertical: 5,
  },
  sectionHeader: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 14,
    paddingVertical: 3,
  },
  sectionNumber: {
    color: COLORS.secondary,
    fontWeight: "500",
  },

  logoCover: {
    alignItems: "center",
    backgroundColor: COLORS.lightGray,
    alignItems: "center",
    height: SIZES.height,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  category: {
    width: SIZES.width - SIZES.padding / 2,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: SIZES.padding / 4,
  },
  categoryCaptionHeader: {
    fontWeight: "800",
    color: COLORS.primary,
  },
  categoryCaptionTotal: {
    color: COLORS.darkgray,
    fontSize: 12,
  },
  chart: {
    flexDirection: "row",
  },
  signInWrapper: {
    flex: 1,
    alignItems: "center",
    width: SIZES.width,

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
    marginBottom: 15,
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
    marginBottom: 15,

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
    marginBottom: 15,
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
