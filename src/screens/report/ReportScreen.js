import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import {
  VictoryPie,
  VictoryChart,
  VictoryBar,
  VictoryAxis,
  VictoryLegend,
  VictoryGroup,
  VictoryTheme,
} from "victory-native";
import { firebase } from "../../server/firebase/firebase";
import { Svg } from "react-native-svg";

import DropDownPicker from "react-native-dropdown-picker";

//import api from "../services/api";
import util from "../../utils/util";
import Loader from "../../components/LoadingComponent";
import { COLORS, SIZES, icons } from "../../constants";

const ReportScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(1);
  const [tranData, setTranData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [barChart, setBarChart] = useState([]);

  const isFocused = useIsFocused();
  const db = firebase.firestore();

  const getValueByKey = (obj, key) => {
    for (const [k, val] of Object.entries(obj)) {
      if (k === key) {
        return val;
      }
    }
  };

  const reportScope = [
    { value: 1, label: "Current Month" },
    { value: 3, label: "Last 3 Months" },
    { value: 6, label: "Last 6 Months" },
    { value: 9, label: "Last 9 Months" },
    { value: 0, label: "This Year" },
    { value: -1, label: "Last Year" },
  ];

  const groupByType = (array, key) => {
    return array.reduce((result, currentValue) => {
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
      );

      return result;
    }, {});
  };

  const calculateYearMonth = (param) => {
    let curDate = new Date();
    switch (param) {
      case 1:
        return {
          year: curDate.getFullYear(),
          min_month: curDate.getMonth() + 1,
          max_month: curDate.getMonth() + 1,
        };
        break;
      case 3:
        if (curDate.getMonth() + 1 - (param - 1) >= 0) {
          return {
            year: curDate.getFullYear(),
            min_month: curDate.getMonth() + 1 - (param - 1),
            max_month: curDate.getMonth() + 1,
          };
        } else {
          return {
            year: curDate.getFullYear(),
            min_month: 1,
            max_month: curDate.getMonth() + 1,
          };
        }
        break;

      case 6:
        if (curDate.getMonth() + 1 - (param - 1) >= 0) {
          return {
            year: curDate.getFullYear(),
            min_month: curDate.getMonth() + 1 - param - 1,
            max_month: curDate.getMonth() + 1,
          };
        } else {
          return {
            year: curDate.getFullYear(),
            min_month: 1,
            max_month: curDate.getMonth() + 1,
          };
        }
        break;

      case 9:
        if (curDate.getMonth() + 1 - (param - 1) >= 0) {
          return {
            year: curDate.getFullYear(),
            min_month: curDate.getMonth() + 1 - param - 1,
            max_month: curDate.getMonth() + 1,
          };
        } else {
          return {
            year: curDate.getFullYear(),
            min_month: 1,
            max_month: curDate.getMonth() + 1,
          };
        }
        break;

      case 12: //Current year
        return {
          year: curDate.getFullYear(),
          min_month: 1,
          max_month: curDate.getMonth() + 1,
        };
        break;

      case 0: //Current year
        return {
          year: curDate.getFullYear(),
          min_month: 1,
          max_month: curDate.getMonth() + 1,
        };
        break;

      case -1: //Last year
        return {
          year: curDate.getFullYear() - 1,
          min_month: 1,
          max_month: 12,
        };
        break;
      default:
        return {
          year: curDate.getFullYear(),
          min_month: curDate.getMonth() + 1,
          max_month: curDate.getMonth() + 1,
        };
    }
  };

  const loadData = async (month) => {
    var trxType = [];
    var transaction = [];
    var totalExp = 0;
    var totalRev = 0;
    var expCount = 0;
    var revCount = 0;
    let param = calculateYearMonth(month);
    try {
      const unsubscribe_01 = await db
        .collection("tbl_trx_type")
        .get()
        .then((documentSnapshot) => {
          documentSnapshot.docs.map((trx) => {
            trxType.push(trx.data());
          });
        })
        .catch((err) => console.log(err));

      const unsubscribe_02 = await db
        .collection("tbl_transactions")
        .where("uid", "==", util.getCurrentLoginUser().uid)
        .where("tran_year", "==", param.year)
        .where("tran_month", ">=", param.min_month)
        .where("tran_month", "<=", param.max_month)
        .get()
        .then((documentSnapshot) => {
          documentSnapshot.docs.map((trx) => {
            transaction.push(trx.data());
          });
        })
        .catch((err) => console.log(err));

      trxType.forEach((type) => {
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
      let trxGroupByMonth = groupByType(transaction, "tran_month");
      let barChartData = formatBarData(trxGroupByMonth);

      setBarChart(barChartData);
      const unsubscribe_05 = setTransactions(transaction);

      return () => {
        unsubscribe_01;
        unsubscribe_02;
        unsubscribe_03;
        unsubscribe_05;
      };
    } catch (e) {
      console.log("Error @ReportScreen - loadData: " + e);
    }
  };

  const formatBarData = (trxDtls) => {
    let inc = [];
    let exp = [];
    for (const [k, val] of Object.entries(trxDtls)) {
      let totExp = 0;
      let totInc = 0;
      val.map((item) => {
        if (item.trx_type === "EXP") {
          totExp += Number(item.tran_amt || 0);
        } else {
          totInc += Number(item.tran_amt || 0);
        }
      });
      inc.push({
        x: util.getMonthName(Number(k) - 1),
        y: totInc,
        //label: "Income",
      });
      exp.push({
        x: util.getMonthName(Number(k) - 1),
        y: totExp,
        //label: "Expense",
      });
    }

    return {
      Income: inc,
      Expense: exp,
    };
  };

  useEffect(() => {
    setLoading(true);
    try {
      loadData(Number(selectedItem?.value));
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [isFocused]);

  const renderBarChart = () => {
    if (Platform.OS == "ios") {
      return (
        <View>
          <VictoryChart domainPadding={20} theme={VictoryTheme.material}>
            {/* <VictoryAxis label="Year" style={{ top: 20 }} /> */}
            <VictoryGroup offset={10}>
              <VictoryBar
                data={barChart.Income}
                barWidth={20}
                cornerRadius={{ top: 10 }}
                style={{
                  data: {
                    fill: COLORS.primary,
                  },
                }}
              />
              <VictoryBar
                data={barChart.Expense}
                barWidth={20}
                cornerRadius={{ top: 10 }}
                style={{
                  data: {
                    fill: COLORS.danger,
                  },
                }}
                events={[
                  {
                    target: "data",
                    eventHandlers: {
                      onPressIn: () => {
                        return [
                          {
                            target: "data",
                            mutation: (props) => {
                              let exp = barChart.Expense[props.index];
                              alert(exp);
                            },
                          },
                        ];
                      },
                    },
                  },
                ]}
              />
            </VictoryGroup>
            <VictoryLegend
              data={[
                {
                  name: "Income",
                  symbol: {
                    fill: COLORS.primary,
                  },
                },
                {
                  name: "Expense",
                  symbol: {
                    fill: COLORS.danger,
                  },
                },
              ]}
              orientation="horizontal"
              x={SIZES.width / 2 - 70}
              y={30}
            />
          </VictoryChart>
        </View>
      );
    } else {
      return (
        <View>
          <Svg
            width={SIZES.width}
            height={SIZES.width}
            style={{ width: "100%", height: "auto" }}
          >
            <VictoryChart domainPadding={20} theme={VictoryTheme.material}>
              <VictoryGroup offset={20}>
                <VictoryBar
                  data={barChart.Income}
                  barWidth={20}
                  cornerRadius={{ top: 10 }}
                  style={{
                    data: {
                      fill: COLORS.primary,
                    },
                  }}
                />
                <VictoryBar
                  data={barChart.Expense}
                  barWidth={20}
                  cornerRadius={{ top: 10 }}
                  style={{
                    data: {
                      fill: COLORS.danger,
                    },
                  }}
                />
              </VictoryGroup>
              <VictoryLegend
                data={[
                  {
                    name: "Income",
                    symbol: {
                      fill: COLORS.primary,
                    },
                  },
                  {
                    name: "Expense",
                    symbol: {
                      fill: COLORS.danger,
                    },
                  },
                ]}
                orientation="horizontal"
                x={SIZES.width / 2 - 70}
                y={30}
              />
            </VictoryChart>
          </Svg>
        </View>
      );
    }
  };

  const formatDataForChart = (trxDtls) => {
    let chartData = trxDtls;
    let finalChartData = [];
    let tempData = [];
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
            zIndex: 999,
          }}
        >
          <DropDownPicker
            items={reportScope}
            onChangeItem={(item) => {
              setSelectedItem(Number(item.value));
              loadData(Number(item.value));
            }}
            containerStyle={{
              height: 40,
              width: SIZES.width - 20,
            }}
            autoScrollToDefaultValue={true}
            defaultValue={reportScope[0].value}
            globalTextStyle={{
              fontSize: 14,
              textAlign: "left",
            }}
            itemStyle={{
              justifyContent: "flex-start",
            }}
          />
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
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 100,
            alignItems: "center",
            width: SIZES.width,
          }}
          showsVerticalScrollIndicator={false}
        >
          {barChart && renderBarChart()}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ReportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: COLORS.lightGray,
    height: "auto",
    zIndex: 1,
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
    zIndex: 2,
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
