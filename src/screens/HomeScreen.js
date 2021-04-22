import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  SafeAreaView,
  ScrollView,
  FlatList,
  Animated,
  LogBox,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
//import { useTheme } from "@react-navigation/native";
//import { AuthContext } from "../server/context/AuthProvider";
import { VictoryPie } from "victory-native";
import { firebase } from "../server/firebase/firebase";
import { Svg } from "react-native-svg";

//import api from "../services/api";
import util from "../utils/util";
import Loader from "../components/LoadingComponent";
import { COLORS, SIZES, icons } from "../constants";
import { TouchableOpacity } from "react-native-gesture-handler";

//import Header from "../components/Header";
import category from "../services/category";

const HomeScreen = ({ navigation }) => {
  LogBox.ignoreLogs([
    "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation - use another VirtualizedList-backed container instead.",
  ]);

  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("income");
  const [tranType, setTranType] = useState(null);
  const [expType, setExpType] = useState([]);
  const [revType, setRevType] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showMoreToggle, setShowMoreToggle] = useState(false);
  const [tranData, setTranData] = useState([]);

  const isFocused = useIsFocused();
  const db = firebase.firestore();

  let categoryListHeightAnimationValue = useRef(new Animated.Value(140))
    .current;

  const getValueByKey = (obj, key) => {
    for (const [k, val] of Object.entries(obj)) {
      if (k === key) {
        return val;
      }
    }
  };
  const validate = async () => {
    try {
      if (!util.getCurrentLoginUser()) {
        navigation.navigate("Auth", { screen: "SignIn" });
      } else {
        const unsubscribe_01 = await db
          .collection("tbl_user_profile")
          .doc(util.getCurrentLoginUser().uid)
          .get()
          .then((documentSnapshot) => {
            if (documentSnapshot.exists) {
              let firstLaunch = documentSnapshot.data().is_first_launch;
              if (firstLaunch == true) {
                navigation.navigate("Onboarding");
              }
            } else {
              console.log("No data found");
            }
          })
          .catch((err) => console.log(err));
        return () => {
          unsubscribe_01;
        };
      }
    } catch (e) {
      console.log("Error @HomeScreen - validate: " + e);
    } finally {
      setLoading(false);
    }
  };

  const loadHomeData = async () => {
    var trxType = [];
    var transaction = [];
    var et = [];
    var rt = [];
    var totalExp = 0;
    var totalRev = 0;
    var expCount = 0;
    var revCount = 0;
    var curDate = new Date();
    try {
      const unsubscribe_01 = await db
        .collection("tbl_trx_type")
        .get()
        .then((documentSnapshot) => {
          documentSnapshot.docs.map((trx) => {
            trxType.push(trx.data());
          });
        })
        .catch((err) => alert(err));

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
        if (type.val_id === "EXP") {
          et.push(type);
        } else {
          rt.push(type);
        }
        transaction.forEach((trx) => {
          if (trx.exp_item === type.type_id) {
            if (type.val_id === "EXP") {
              totalExp = totalExp + parseInt(trx.tran_amt);
              expCount += 1;
              trx.trx_type = type.val_id;
              trx.color = type.color;
              trx.icon = type.icon;
              trx.type_nm_en = type.type_nm_en;
            } else {
              totalRev = totalRev + parseInt(trx.tran_amt);
              revCount += 1;
              trx.trx_type = type.val_id;
              trx.color = type.color;
              trx.icon = type.icon;
              trx.type_nm_en = type.type_nm_en;
            }
          }
        });
      });
      const unsubscribe_03 = setTranData({
        totalRevenue: totalRev,
        totalExpense: totalExp,
        totalBalance: totalRev - totalExp,
        totalExpCount: expCount,
        totalRevCount: revCount,
      });
      const unsubscribe_04 = setTranType(trxType);
      const unsubscribe_05 = setTransactions(transaction);
      const unsubscribe_06 = setExpType(et);
      const unsubscribe_07 = setRevType(rt);

      return () => {
        unsubscribe_01;
        unsubscribe_02;
        unsubscribe_03;
        unsubscribe_04;
        unsubscribe_05;
        unsubscribe_06;
        unsubscribe_07;
      };
    } catch (e) {
      alert("Error @HomeScreen - loadHomeData: " + e);
    }
  };

  useEffect(() => {
    setLoading(true);
    try {
      validate();
      loadHomeData();
    } catch (e) {
      alert(e);
    } finally {
      setLoading(false);
    }
  }, [isFocused]);

  const renderCategoryList = (rt) => {
    const renderItem = ({ item }) => {
      return (
        <TouchableOpacity
          style={{
            flex: 1,
            flexDirection: "row",
            margin: 5,
            height: 60,
            paddingVertical: SIZES.radius,
            paddingHorizontal: SIZES.padding - 10,
            justifyContent: "space-evenly",
            borderRadius: 5,
            alignItems: "center",
            width: SIZES.width / 2 - SIZES.padding,
            backgroundColor: COLORS.white,
            ...styles.shadow,
          }}
          onPress={() => setSelectedCategory(item.type_id)}
        >
          <Image
            source={getValueByKey(icons, item.icon)}
            style={{
              width: 30,
              height: 30,
              tintColor: getValueByKey(COLORS, item.color),
            }}
          />
          <Text
            style={{
              marginLeft: SIZES.base,
              color: COLORS.primary,
              fontWeight: "700",
            }}
          >
            {item.type_nm_en}
          </Text>
        </TouchableOpacity>
      );
    };

    return (
      <View>
        <Animated.View style={{ height: categoryListHeightAnimationValue }}>
          <FlatList
            data={
              viewMode == "income"
                ? formatDataForChart(revType)
                : formatDataForChart(expType)
            }
            renderItem={renderItem}
            keyExtractor={(item) => `key-${item.type_id}`}
            numColumns={2}
          />
        </Animated.View>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginVertical: SIZES.base,
          }}
          onPress={() => {
            if (showMoreToggle) {
              Animated.timing(categoryListHeightAnimationValue, {
                toValue: 140,
                duration: 300,
                useNativeDriver: false,
              }).start();
            } else {
              Animated.timing(categoryListHeightAnimationValue, {
                toValue: 220,
                duration: 300,
                useNativeDriver: false,
              }).start();
            }
            setShowMoreToggle(!showMoreToggle);
          }}
        >
          <Text style={{ color: COLORS.primary, fontWeight: "800" }}>
            {showMoreToggle ? "LESS" : "MORE"}
          </Text>
          <Image
            source={showMoreToggle ? icons.up_arrow : icons.down_arrow}
            style={{
              marginLeft: 5,
              width: 15,
              height: 15,
              alignSelf: "center",
            }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const formatDataForChart = () => {
    let tempData = [];
    let chartData = viewMode == "income" ? revType : expType;
    let finalChartData = [];

    let total = 0;
    chartData.forEach((item) => {
      let subTotal = 0;
      transactions.forEach((trx) => {
        if (trx.exp_item == item.type_id) {
          tempData.push(trx);
          subTotal += Number(trx.tran_amt);
        }
      });
      item.y = subTotal;
      item.itemCount = tempData.length;
    });
    chartData.forEach((item) => {
      if (Number(item.y) > 0) {
        finalChartData.push(item);
      }
    });

    finalChartData.forEach((trx) => {
      total += Number(trx.y);
    });

    finalChartData.forEach((item) => {
      let percentage = ((item.y / total) * 100).toFixed(0);
      item.label = `${percentage}%`;
    });
    return finalChartData;
  };

  const renderChart = () => {
    var cd = viewMode == "income" ? revType : expType;

    var chartData = formatDataForChart(cd);

    let colorScales = [];

    chartData.forEach((item) => {
      colorScales.push(getValueByKey(COLORS, item.color));
    });
    let totalCount =
      viewMode == "income" ? tranData.totalRevCount : tranData.totalExpCount;

    if (Platform.OS == "ios") {
      return (
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <VictoryPie
            data={chartData}
            labels={(datum) => `${datum.label}`}
            radius={({ datum }) =>
              selectedCategory && selectedCategory == datum.type_id
                ? SIZES.width * 0.4
                : SIZES.width * 0.4 - 20
            }
            innerRadius={70}
            labelRadius={({ innerRadius }) =>
              (SIZES.width * 0.4 + innerRadius) / 2.5
            }
            style={{
              labels: { fill: "white" },
              parent: {
                ...styles.shadow,
              },
            }}
            width={SIZES.width * 0.8}
            height={SIZES.width * 0.8}
            colorScale={colorScales}
            events={[
              {
                target: "data",
                eventHandlers: {
                  onPressIn: () => {
                    return [
                      {
                        target: "labels",
                        mutation: (props) => {
                          let category = chartData[props.index];
                          if (
                            Number(category.type_id) !==
                            Number(selectedCategory)
                          ) {
                            return;
                          } else {
                            let titleDtl =
                              category.val_id == "EXP"
                                ? `Expense on ${category.type_nm_en}`
                                : `Income from ${category.type_nm_en}`;
                            navigation.navigate("Transaction", {
                              screen: "TransactionByCategory",
                              initial: false,
                              params: {
                                trxItem: chartData[props.index],
                                title: titleDtl,
                              },
                            });
                          }
                        },
                      },
                    ];
                  },
                },
              },
            ]}
          />

          <View style={{ position: "absolute", top: "42%", left: "42%" }}>
            <Text style={{ textAlign: "center" }}>{totalCount}</Text>
            <Text style={{ textAlign: "center" }}>
              {viewMode == "income" ? "Income(s)" : "Expense(s)"}
            </Text>
          </View>
        </View>
      );
    } else {
      // Android workaround by wrapping VictoryPie with SVG
      return (
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Svg
            width={SIZES.width}
            height={SIZES.width}
            style={{ width: "100%", height: "auto" }}
          >
            <VictoryPie
              data={chartData}
              labels={(datum) => `${datum.label}`}
              radius={({ datum }) =>
                selectedCategory && selectedCategory == datum.type_id
                  ? SIZES.width * 0.4
                  : SIZES.width * 0.4 - 20
              }
              innerRadius={70}
              labelRadius={({ innerRadius }) =>
                (SIZES.width * 0.4 + innerRadius) / 2.5
              }
              style={{
                labels: { fill: "white" },
                parent: {
                  ...styles.shadow,
                },
              }}
              width={SIZES.width * 0.8}
              height={SIZES.width * 0.8}
              colorScale={colorScales}
              events={[
                {
                  target: "data",
                  eventHandlers: {
                    onPressIn: () => {
                      return [
                        {
                          target: "labels",
                          mutation: (props) => {
                            let category = chartData[props.index].type_id;
                            if (Number(category) !== Number(selectedCategory)) {
                              return;
                            } else {
                              let titleDtl =
                                category.val_id == "EXP"
                                  ? `Expense on ${category.type_nm_en}`
                                  : `Income from ${category.type_nm_en}`;
                              navigation.navigate("Transaction", {
                                screen: "TransactionByCategory",
                                initial: false,
                                params: {
                                  trxItem: chartData[props.index],
                                  title: titleDtl,
                                },
                              });
                            }
                          },
                        },
                      ];
                    },
                  },
                },
              ]}
            />
          </Svg>
          <View style={{ position: "absolute", top: "42%", left: "42%" }}>
            <Text style={{ textAlign: "center" }}>{totalCount}</Text>
            <Text style={{ textAlign: "center" }}>
              {viewMode == "income" ? "Income(s)" : "Expense(s)"}
            </Text>
          </View>
        </View>
      );
    }
  };

  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  if (loading) return <Loader loadingLabel="Loading..." />;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <View style={styles.container}>
        <View
          style={{
            backgroundColor: COLORS.primary,
            width: "100%",
            paddingLeft: 10,
            paddingTop: 20,
          }}
        >
          <Text
            style={{
              fontWeight: "800",
              color: COLORS.white,
            }}
          >
            Current Month Balance
          </Text>
        </View>
        <View style={styles.summary}>
          <View style={styles.summarySection}>
            <Text style={styles.sectionHeader}>Income</Text>
            <Text style={styles.sectionNumber}>
              {numberWithCommas(Number(tranData?.totalRevenue || 0))}
            </Text>
          </View>
          <View style={styles.summarySection}>
            <Text style={styles.sectionHeader}>Expense</Text>
            <Text style={styles.sectionNumber}>
              {numberWithCommas(Number(tranData?.totalExpense || 0))}
            </Text>
          </View>
          <View style={styles.summarySection}>
            <Text style={styles.sectionHeader}>Balance</Text>
            <Text style={styles.sectionNumber}>
              {numberWithCommas(Number(tranData?.totalBalance || 0))}
            </Text>
          </View>
        </View>

        <View style={{ ...styles.category }}>
          <View style={styles.categoryCaption}>
            <Text style={styles.categoryCaptionHeader}>CATEGORIES</Text>
            <Text style={styles.categoryCaptionTotal}>
              Income: {tranData?.totalRevCount || 0}
            </Text>
            <Text style={styles.categoryCaptionTotal}>
              Expenses: {tranData?.totalExpCount || 0}
            </Text>
          </View>
          <View style={styles.chart}>
            <TouchableOpacity
              style={{
                alignItems: "center",
                justifyContent: "center",
                height: 50,
                width: 50,
                backgroundColor: viewMode == "income" ? COLORS.primary : null,
                borderRadius: 25,
                color: COLORS.primary,
              }}
              onPress={() => setViewMode("income")}
            >
              <Image
                source={icons.income}
                resizeMode="contain"
                style={{
                  width: 20,
                  height: 20,
                  opacity: viewMode == "income" ? 1 : 0.4,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignItems: "center",
                justifyContent: "center",
                height: 50,
                width: 50,
                backgroundColor: viewMode == "expense" ? COLORS.danger : null,
                borderRadius: 25,
                color: COLORS.primary,
              }}
              onPress={() => setViewMode("expense")}
            >
              <Image
                source={icons.expense}
                resizeMode="contain"
                style={{
                  width: 20,
                  height: 20,
                  opacity: viewMode == "expense" ? 1 : 0.4,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 100,
            alignItems: "center",
            width: SIZES.width,
          }}
          showsVerticalScrollIndicator={false}
        >
          {viewMode == "income" && (
            <View>
              {renderCategoryList(revType)}
              {renderChart()}
            </View>
          )}
          {viewMode == "expense" && (
            <View>
              {renderCategoryList(expType)}
              {renderChart()}
            </View>
          )}
          <View
            style={{
              justifyContent: "center",
              alignItems: "flex-end",
              width: "100%",
              paddingRight: 10,
            }}
          >
            <TouchableOpacity
              style={{ alignSelf: "flex-end" }}
              onPress={() =>
                navigation.navigate("Transaction", {
                  screen: "TransactionList",
                  initial: false,
                })
              }
            >
              <Text style={{ color: COLORS.primary }}>
                View current month transaction
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: COLORS.lightGray,
    height: "auto",
    //padding: 5,
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
  category: {
    width: SIZES.width - SIZES.padding / 2,
    marginTop: 10,
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
  shadow: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
});
