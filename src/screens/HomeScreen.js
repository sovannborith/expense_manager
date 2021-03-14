import React, { useState, useContext, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  FlatList,
  Animated,
  LogBox,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { AuthContext } from "../server/context/AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { VictoryPie } from "victory-native";

import { Svg } from "react-native-svg";

import api from "../services/api";
import FormButton from "../components/form/FormButton";
import Loader from "../components/LoadingComponent";
import { COLORS, SIZES, FONTS, icons } from "../constants";
import { TouchableOpacity } from "react-native-gesture-handler";
import category from "../services/category";

const HomeScreen = ({ navigation }) => {
  LogBox.ignoreLogs([
    "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation - use another VirtualizedList-backed container instead.",
  ]);
  const { colors } = useTheme();
  const theme = useTheme();
  const [isLoading, setLoading] = useState(false);
  const { signOut } = useContext(AuthContext);
  //const isFocused = useIsFocused();

  const validate = async () => {
    try {
      const value = await AsyncStorage.getItem("@isFirstLaunch");
      if (value !== "0") {
        navigation.navigate("Onboarding");
      } else {
        let userData = await api.getToken();
        if (userData === null || userData == "undefined") {
          navigation.replace("Auth", { screen: "SignIn" });
        }
      }
    } catch (e) {
      alert("Error @HomeScreen - validate: " + e);
    } finally {
    }
  };

  useEffect(() => {
    validate();
    if (isLoading) setLoading(false);
  }, []);

  const logOff = () => {
    signOut();

    navigation.replace("Auth", { screen: "SignIn" });
  };

  const handleSignOut = () => {
    Alert.alert(
      //title
      "Sign Out Confirmation",
      //body
      "Are you sure want to sign out?",
      [
        {
          text: "Yes",
          onPress: () => {
            logOff();
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
    );
  };

  const handleSignIn = () => {
    navigation.replace("Auth", { screen: "SignIn" });
  };
  /* Category section */
  const [viewMode, setViewMode] = useState("list");
  const [categories, setCategories] = useState(category);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showMoreToggle, setShowMoreToggle] = useState(false);

  let categoryListHeightAnimationValue = useRef(new Animated.Value(140))
    .current;

  const renderCategoryList = () => {
    const renderItem = ({ item }) => {
      return (
        <TouchableOpacity
          style={{
            flex: 1,
            flexDirection: "row",
            margin: 5,
            height: 60,
            paddingVertical: SIZES.radius,
            paddingHorizontal: SIZES.padding,
            justifyContent: "space-evenly",
            borderRadius: 5,
            alignItems: "center",
            width: SIZES.width / 2 - SIZES.padding - 10,
            backgroundColor: COLORS.white,
            ...styles.shadow,
          }}
          onPress={() => setSelectedCategory(item)}
        >
          <Image
            source={item.icon}
            style={{
              width: 20,
              height: 20,
              tintColor: item.color,
            }}
          />
          <Text
            style={{
              marginLeft: SIZES.base,
              color: COLORS.primary,
              fontWeight: "800",
            }}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      );
    };

    return (
      <View style={{ paddingHorizontal: SIZES.padding - 5 }}>
        <Animated.View style={{ height: categoryListHeightAnimationValue }}>
          <FlatList
            data={categories}
            renderItem={renderItem}
            keyExtractor={(item) => `key-${item.id}`}
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

  const processCategoryDataToDisplay = () => {
    // Filter expenses with "Confirmed" status

    let chartData = categories.map((item) => {
      let confirmExpenses = item.expenses.filter((a) => a.status == "C");
      var total = confirmExpenses.reduce((a, b) => a + (b.total || 0), 0);

      return {
        name: item.name,
        y: total,
        expenseCount: confirmExpenses.length,
        color: item.color,
        id: item.id,
      };
    });

    // filter out categories with no data/expenses
    let filterChartData = chartData.filter((a) => a.y > 0);

    // Calculate the total expenses
    let totalExpense = filterChartData.reduce((a, b) => a + (b.y || 0), 0);

    // Calculate percentage and repopulate chart data
    let finalChartData = filterChartData.map((item) => {
      let percentage = ((item.y / totalExpense) * 100).toFixed(0);
      return {
        label: `${percentage}%`,
        y: Number(item.y),
        expenseCount: item.expenseCount,
        color: item.color,
        name: item.name,
        id: item.id,
      };
    });

    return finalChartData;
  };

  const setSelectCategoryByName = ({ name }) => {
    let category = categories.filter((a) => a.name == name);
    setSelectedCategory(category[0]);
  };
  const renderChart = () => {
    let chartData = processCategoryDataToDisplay();
    let colorScales = chartData.map((item) => item.color);
    let totalExpenseCount = chartData.reduce(
      (a, b) => a + (b.expenseCount || 0),
      0
    );

    if (Platform.OS == "ios") {
      return (
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <VictoryPie
            data={chartData}
            labels={(datum) => `${datum.y}`}
            radius={({ datum }) =>
              selectedCategory && selectedCategory.name == datum.name
                ? SIZES.width * 0.4
                : SIZES.width * 0.4 - 10
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
                  onPress: () => {
                    return [
                      {
                        target: "labels",
                        mutation: (props) => {
                          let categoryName = chartData[props.index].name;
                          setSelectCategoryByName(categoryName);
                        },
                      },
                    ];
                  },
                },
              },
            ]}
          />

          <View style={{ position: "absolute", top: "42%", left: "42%" }}>
            <Text style={{ textAlign: "center" }}>{totalExpenseCount}</Text>
            <Text style={{ textAlign: "center" }}>Expenses</Text>
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
              standalone={false} // Android workaround
              data={chartData}
              labels={(datum) => `${datum.y}`}
              radius={({ datum }) =>
                selectedCategory && selectedCategory.name == datum.name
                  ? SIZES.width * 0.4
                  : SIZES.width * 0.4 - 10
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
              width={SIZES.width}
              height={SIZES.width}
              colorScale={colorScales}
              events={[
                {
                  target: "data",
                  eventHandlers: {
                    onPress: () => {
                      return [
                        {
                          target: "labels",
                          mutation: (props) => {
                            let categoryName = chartData[props.index].name;
                            setSelectCategoryByName(categoryName);
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
            <Text style={{ textAlign: "center" }}>{totalExpenseCount}</Text>
            <Text style={{ textAlign: "center" }}>Expenses</Text>
          </View>
        </View>
      );
    }
  };
  const renderExpenseSummary = () => {
    let data = processCategoryDataToDisplay();

    const renderItem = ({ item }) => (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          height: 40,
          paddingHorizontal: SIZES.radius,
          borderRadius: 10,
          marginBottom: 5,
          backgroundColor:
            selectedCategory && selectedCategory.name == item.name
              ? item.color
              : COLORS.white,
        }}
        onPress={() => {
          let categoryName = item.name;
          setSelectCategoryByName(categoryName);
        }}
      >
        {/* Name/Category */}
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 20,
              height: 20,
              backgroundColor:
                selectedCategory && selectedCategory.name == item.name
                  ? COLORS.white
                  : item.color,
              borderRadius: 5,
            }}
          />

          <Text
            style={{
              marginLeft: SIZES.base,
              color:
                selectedCategory && selectedCategory.name == item.name
                  ? COLORS.white
                  : COLORS.primary,
            }}
          >
            {item.name}
          </Text>
        </View>

        {/* Expenses */}
        <View style={{ justifyContent: "center" }}>
          <Text
            style={{
              color:
                selectedCategory && selectedCategory.name == item.name
                  ? COLORS.white
                  : COLORS.primary,
            }}
          >
            {item.y} USD - {item.label}
          </Text>
        </View>
      </TouchableOpacity>
    );

    return (
      <View style={{ padding: SIZES.padding }}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.id}`}
        />
      </View>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 20 }}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <View style={styles.container}>
        {/* <NavBar /> */}
        <View style={styles.summary}>
          <View style={styles.summarySection}>
            <Text style={styles.sectionHeader}>Revenue</Text>
            <Text style={styles.sectionNumber}>0.00</Text>
          </View>
          <View style={styles.summarySection}>
            <Text style={styles.sectionHeader}>Expense</Text>
            <Text style={styles.sectionNumber}>0.00</Text>
          </View>
          <View style={styles.summarySection}>
            <Text style={styles.sectionHeader}>Balance</Text>
            <Text style={styles.sectionNumber}>0.00</Text>
          </View>
        </View>
        <View style={{ ...styles.category }}>
          <View style={styles.categoryCaption}>
            <Text style={styles.categoryCaptionHeader}>CATEGORIES</Text>
            <Text style={styles.categoryCaptionTotal}>
              {categories.length} total
            </Text>
          </View>
          <View style={styles.chart}>
            <TouchableOpacity
              style={{
                alignItems: "center",
                justifyContent: "center",
                height: 50,
                width: 50,
                backgroundColor: viewMode == "list" ? COLORS.primary : null,
                borderRadius: 25,
                color: COLORS.primary,
              }}
              onPress={() => setViewMode("list")}
            >
              <Image
                source={icons.menu}
                resizeMode="contain"
                style={{
                  width: 20,
                  height: 20,
                  tintColor:
                    viewMode == "list" ? COLORS.white : COLORS.darkgray,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignItems: "center",
                justifyContent: "center",
                height: 50,
                width: 50,
                backgroundColor: viewMode == "chart" ? COLORS.primary : null,
                borderRadius: 25,
                color: COLORS.primary,
              }}
              onPress={() => setViewMode("chart")}
            >
              <Image
                source={icons.chart}
                resizeMode="contain"
                style={{
                  width: 20,
                  height: 20,
                  tintColor:
                    viewMode == "chart" ? COLORS.white : COLORS.darkgray,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 60 }}
          showsVerticalScrollIndicator={false}
        >
          {viewMode == "list" && <View>{renderCategoryList()}</View>}
          {viewMode == "chart" && (
            <View>
              {renderChart()}
              {renderExpenseSummary()}
            </View>
          )}
        </ScrollView>

        <View style={{ flex: 1 }}>
          <FormButton buttonTitle="Sign Out" onPress={handleSignOut} />
          <FormButton buttonTitle="Sign In" onPress={handleSignIn} />
        </View>
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
