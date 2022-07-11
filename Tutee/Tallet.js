import React, { useContext, useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableHighlight,
  FlatList,
  Alert,
  Dimensions,
  TextInput,
  Platform,
  Pressable
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import LottieView from "lottie-react-native";
import { Card, ListItem, Button, List } from "react-native-elements";
import { AntDesign } from "@expo/vector-icons";
import { useLinkProps, useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import * as Notifications from "expo-notifications";
import Icon from "react-native-vector-icons/Feather";
import { MaterialIcons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import ModalDropdown from "react-native-modal-dropdown";
import Rewards from "../Tutor/Rewards";
import firestore from "@react-native-firebase/firestore";
import { Linking } from "react-native";

import WithdrawModal from "../components/Earnings/WithdrawModal";
import MyLoader from "../components/loader/MyLoader";
import { TextInputMask } from "react-native-masked-text";

const Tab = createMaterialTopTabNavigator();
export default function Tallet(props) {
  // const { usersType } = props.route.params;
  const { userData } = props;
  const navigation = useNavigation();
  const [toggleWallet, settogglewallet] = useState(true);
  const [toggleHour, setToggleHour] = useState(false);
  const [toggleRewards, setToggleRewards] = useState(false);
  const [rate, setrate] = useState("");
  const [height, setheight] = useState("");
  const [transactionHistory, setHistory] = useState([]);
  const [isMounted, setMounted] = useState(true);
  const [balance, setbalance] = useState("");
  // CODE ADDED BY UDDIPAN
  const [balanceNumric, setBalanceNumeric] = useState(0);
  // CODE ADDED BY UDDIPAN
  const [currency, settotalcurrency] = useState("");
  const [iscurrency, setiscurrency] = useState(false);
  const [hourcount, sethourcount] = useState(0);
  const [rewardcount, setrewardcount] = useState(0);
  const [packageData, setPackageData] = useState([]);
  const [asyncCat, setasyncCat] = useState([]);
  const [play, setplay] = useState(false);
  const [visibleWithdawModal, setVisibleWithdrawModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const list = [];
  function goToHours() {
    setToggleHour(true);
    settogglewallet(false);
    setToggleRewards(false);
  }
  function goToRewards() {
    setToggleRewards(true);
    setToggleHour(false);
    settogglewallet(false);
  }
  function goToWallet() {
    settogglewallet(true);
    setToggleHour(false);
    setToggleRewards(false);
  }
  let totalcurrency;

  function currencyFormat(balance) {
    return (
      "$" +
      parseFloat(balance)
        .toFixed(2)
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    );
  }

  function kFormatter(num) {
    return Math.abs(num) > 999
      ? "$" + Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
      : "$" + Math.sign(num) * Math.abs(num);
  }

  async function getUserInfo() {
    await Promise.all([
      firestore()
        .collection("Users")
        .doc(props.userData.ID)
        .onSnapshot((querysnapshot) => {
          let moneyformat = kFormatter(querysnapshot.data().Balance);
          setbalance(moneyformat);
          // CODE ADDED BY UDDIPAN
          setBalanceNumeric(querysnapshot.data().Balance);
          // CODE ADDED BY UDDIPAN
          totalcurrency = currencyFormat(querysnapshot.data().Balance);

          setiscurrency(true);
          setrewardcount(querysnapshot.data().RewardCount);
          setPackageData(querysnapshot.data().Package);
          sethourcount(querysnapshot.data().Hours);
          settotalcurrency(totalcurrency);
          setrate(querysnapshot.data().Rate);
        }),
      firestore()
        .collection("Transactions")
        .doc(props.userData.ID)
        .onSnapshot((querysnapshot) => {
          if (querysnapshot.exists) {
            list.push(querysnapshot.data().History);
            console.log(list);
            let uniqueArray = [...new Set(list)];
            setHistory(uniqueArray);

            setMounted(false);
          }
        }),
      firestore()
        .collection("Categories")
        // .collection("AsynchronousCategories")
        .onSnapshot((querysnapshot) => {
          const List = [];
          querysnapshot.forEach((docsnap) => {
            const { ID } = docsnap.data();
            if (ID !== "22" && ID !== "21" && ID !== "20") {
              List.push({ ...docsnap.data(), key: docsnap.id });
            }
          });
          setasyncCat(List);
        })
    ]);
  }
  useEffect(() => {
    async function getUserData() {
      await getUserInfo();
    }
    getUserData();
  }, []);
  // CODE ADDED BY UDDIPAN
  const handleCashOut = async () => {
    if (balanceNumric >= 100) setVisibleWithdrawModal(true);
    else
      alert(
        "You need to have minimum $100 in your Tallet in order to cash out."
      );
  };
  // CODE ADDED BY UDDIPAN
  return (
    <SafeAreaView
      style={{
        height: "100%",
        backgroundColor: "black",
        paddingTop: Platform.OS === "android" ? 25 : 10
      }}
    >
      <MyLoader loading={loading} color={"#fff"} />
      <View
        onLayout={(event) => {
          var { x, y, width, height } = event.nativeEvent.layout;
          setheight(height);
        }}
        style={{ backgroundColor: "black", height: 160 }}
      >
        <View
          style={{ zIndex: 1, position: "absolute", alignSelf: "flex-end" }}
        >
          {/* <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              justifyContent: "center",
              alignSelf: "flex-end",
              backgroundColor: "white",
              width: 35,
              height: 35,
              borderRadius: 35,
              justifyContent: "center",
            }}
          >
            <MaterialIcons
              name="home"
              size={25}
              style={{ alignSelf: "center" }}
              color={"black"}
            />
          </TouchableOpacity> */}
        </View>
        <View
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            flexDirection: "row"
          }}
        >
          <Pressable onPress={() => navigation.navigate("UpdateProfile")}>
            <Image
              source={{ uri: props.userData.Photo }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 50,
                marginRight: 0
              }}
            />
          </Pressable>
          <View>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ color: "white", left: 10, fontSize: 15 }}>
                Your
              </Text>
              <Text
                style={{
                  color: "#F1C411",
                  left: 10,
                  fontSize: 15,
                  fontWeight: "bold"
                }}
              >
                {" "}
                Tuto-Wallet (TALLET).
              </Text>
            </View>

            <Text style={{ color: "white", left: 10, fontSize: 13 }}>
              View reward points and total earnings.
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            top: 160 / 5
          }}
        >
          <View
            style={{
              flexDirection: "column",
              alignSelf: "center",
              justifyContent: "center",
              width: 55
            }}
          >
            {toggleRewards === true ? (
              <LottieView
                ref={(animation) => {
                  setplay(animation);
                }}
                autoPlay={true}
                style={{
                  width: 115,
                  height: 115,
                  alignSelf: "center",
                  marginTop: Platform.OS === "android" ? -11 : -4,

                  position: "absolute"
                }}
                source={require("../assets/focus2.json")}
                loop={true}
              />
            ) : null}
            <View style={{ flexDirection: "row", width: 60, height: 60 }}>
              <TouchableOpacity
                onPress={() => goToRewards()}
                style={{
                  backgroundColor: "#F1C411",
                  alignSelf: "center",
                  borderRadius: 35,
                  height: 55,
                  width: 55,
                  justifyContent: "center"
                }}
              >
                <Image
                  source={require("../assets/medal.png")}
                  style={{ alignSelf: "center", width: 40, height: 40 }}
                />
              </TouchableOpacity>
              <View
                style={{
                  backgroundColor: "red",
                  width: "auto",
                  height: 20,
                  borderRadius: 15,
                  justifyContent: "center",
                  position: "absolute",
                  right: 0,
                  top: -3,
                  padding: 5
                }}
              >
                <Text
                  style={{ fontSize: 14, alignSelf: "center", color: "white" }}
                >
                  {rewardcount}
                </Text>
              </View>
            </View>
            <Text
              style={{
                color: "white",
                alignSelf: "center",
                bottom: 0,
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12
              }}
            >
              Rewards{" "}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "column",
              alignSelf: "center",
              width: 70,
              bottom: 5
            }}
          >
            {toggleWallet === true ? (
              <LottieView
                ref={(animation) => {
                  setplay(animation);
                }}
                autoPlay={true}
                style={{
                  width: 140,
                  height: 140,
                  alignSelf: "center",
                  marginTop: Platform.OS === "android" ? -17 : -11.5,
                  position: "absolute"
                }}
                source={require("../assets/focus2.json")}
                loop={true}
              />
            ) : null}
            <View style={{ flexDirection: "row", width: 75, height: 75 }}>
              <TouchableOpacity
                onPress={() => goToWallet()}
                style={{
                  backgroundColor: "#F1C411",
                  alignSelf: "center",
                  borderRadius: 35,
                  height: 70,
                  width: 70,
                  justifyContent: "center"
                }}
              >
                <Image
                  source={require("../assets/wallet.png")}
                  style={{
                    width: 40,
                    height: 40,
                    alignSelf: "center",
                    resizeMode: "contain"
                  }}
                />
              </TouchableOpacity>
              <View
                style={{
                  backgroundColor: "red",
                  width: "auto",
                  height: 25,
                  borderRadius: 15,
                  justifyContent: "center",
                  position: "absolute",
                  right: 0,
                  top: 0,
                  padding: 5
                }}
              >
                <Text
                  style={{ fontSize: 12, alignSelf: "center", color: "white" }}
                >
                  {balance}
                </Text>
              </View>
            </View>
            <Text style={{ color: "white", alignSelf: "center", fontSize: 12 }}>
              Tallet
            </Text>
          </View>
          <View
            style={{
              flexDirection: "column",
              alignSelf: "center",
              width: 55
            }}
          >
            <View style={{ flexDirection: "row", width: 60, height: 60 }}>
              <TouchableOpacity
                onPress={() => goToHours()}
                style={{
                  backgroundColor: "#F1C411",
                  alignSelf: "center",
                  borderRadius: 35,
                  height: 55,
                  width: 55,

                  justifyContent: "center"
                }}
              >
                <Icon name="clock" style={{ alignSelf: "center" }} size={40} />
              </TouchableOpacity>
              <View
                style={{
                  backgroundColor: "red",
                  width: 20,
                  height: 20,
                  borderRadius: 15,
                  justifyContent: "center",
                  position: "absolute",
                  right: 0,
                  top: -3
                }}
              >
                <Text
                  style={{ fontSize: 14, alignSelf: "center", color: "white" }}
                >
                  {hourcount}
                </Text>
              </View>
            </View>
            {toggleHour === true ? (
              <LottieView
                ref={(animation) => {
                  setplay(animation);
                }}
                autoPlay={true}
                style={{
                  width: 115,
                  height: 115,
                  alignSelf: "center",
                  marginTop: Platform.OS === "android" ? -14 : -11.5,
                  position: "absolute",
                  zIndex: -1
                }}
                source={require("../assets/focus2.json")}
                loop={true}
              />
            ) : null}

            <Text
              style={{
                color: "white",
                alignSelf: "center",
                width: 60,
                textAlign: "center",
                fontSize: 12
              }}
            >
              Invoices
            </Text>
          </View>
        </View>
      </View>
      <Card
        containerStyle={{
          shadowColor: "grey",
          shadowOpacity: 0.5,
          shadowOffset: { width: 2, height: 2 },
          height: "220%",
          backgroundColor: "white",
          borderColor: "white",
          width: Dimensions.get("screen").width,
          right: 15
        }}
      >
        {toggleHour ? (
          <View style={{}}>
            <FlatList
              data={transactionHistory}
              // style={{ height: 300 }}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => {
                var x = item.ServiceFee;
                var y = parseFloat(x) / 100;
                var amountearned = parseInt(item.Earned);
                var amountTobeAdded = y * amountearned;
                var total = amountTobeAdded + amountearned;
                console.log(
                  "rendered item ",
                  item,
                  "Service",
                  y,
                  "total",
                  total,
                  "amount to be added to total",
                  amountTobeAdded
                );
                return (
                  <View style={{ width: "100%", height: "auto" }}>
                    <Card
                      containerStyle={{
                        width: "100%",
                        alignSelf: "center",
                        borderRadius: 10,
                        height: "auto",
                        shadowOffset: { width: 0, height: 2 },
                        shadowColor: "black",
                        shadowRadius: 2,
                        shadowOpacity: 0.5,
                        backgroundColor: "#101820FF",
                        borderColor: "#101820FF"
                      }}
                    >
                      <Text
                        style={{
                          color: "#F1C411",
                          top: 0,
                          fontSize: 15,
                          fontWeight: "bold",
                          alignSelf: "center"
                        }}
                      >
                        {item.SessionTopic}
                      </Text>

                      <View style={{ flexDirection: "row", top: 0 }}>
                        <Text
                          style={{
                            alignSelf: "center",
                            color: "white",
                            left: 3
                          }}
                        >
                          With
                        </Text>
                        <View style={{ flexDirection: "column", left: 3 }}>
                          <TouchableOpacity style={{ width: 100 }}>
                            <Image
                              source={{ uri: item.StudentPic }}
                              style={{
                                width: 35,
                                height: 35,
                                right: 0,
                                left: 5,
                                borderRadius: 35
                              }}
                            />
                          </TouchableOpacity>
                          <Text style={{ color: "white", left: 5 }}>
                            {item.StudentName}
                          </Text>
                        </View>
                      </View>
                      <View style={{ flexDirection: "row" }}>
                        <MaterialIcons
                          name="date-range"
                          size={20}
                          color={"#F1C411"}
                          style={{
                            alignSelf: "center"
                          }}
                        />

                        <Text
                          style={{
                            color: "white",
                            alignSelf: "center",
                            left: 3
                          }}
                        >
                          {item.Date}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row", top: 5 }}>
                        <MaterialIcons
                          name="access-time"
                          size={18}
                          color={"#F1C411"}
                          style={{
                            alignSelf: "center"
                          }}
                        />

                        <Text
                          style={{
                            color: "white",
                            marginTop: 0,
                            alignSelf: "center"
                          }}
                        >
                          {" "}
                          {item.From} - {item.To}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row", marginTop: 10 }}>
                        <MaterialCommunityIcons
                          name="timelapse"
                          size={18}
                          color={"#F1C411"}
                          style={{
                            alignSelf: "center"
                          }}
                        />

                        <Text
                          style={{
                            color: "white",
                            marginTop: 0,
                            alignSelf: "center"
                          }}
                        >
                          {" "}
                          Number of hours: {item.HoursCompleted}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row", marginTop: 5 }}>
                        <MaterialCommunityIcons
                          name="credit-card-clock"
                          size={18}
                          color={"#F1C411"}
                          style={{
                            alignSelf: "center"
                          }}
                        />
                        <Text style={{ color: "white", marginTop: 0 }}>
                          {" "}
                          Hourly Rate: ${item.HourlyRate}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row", marginTop: 10 }}>
                        <Image
                          source={require("../assets/tip.png")}
                          style={{
                            alignSelf: "center",
                            width: 20,
                            height: 20,
                            right: 1
                          }}
                        />

                        <Text
                          style={{
                            color: "white",
                            marginTop: 0,
                            alignSelf: "center",
                            left: 1
                          }}
                        >
                          10% Service Fee: $12
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row", marginTop: 5 }}>
                        <MaterialIcons
                          name="attach-money"
                          size={20}
                          color={"#F1C411"}
                          style={{
                            alignSelf: "center"
                          }}
                        />

                        <Text
                          style={{
                            color: "white",
                            alignSelf: "center",
                            left: 0
                          }}
                        >
                          Total Collected: ${total}
                        </Text>
                      </View>
                    </Card>
                  </View>
                );
              }}
            />
          </View>
        ) : toggleRewards ? (
          <View style={{ flexGrow: 1 }}>
            <Rewards userData={userData} />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={{ height: "100%", backgroundColor: "white" }}
            style={{ height: "auto", backgroundColor: "white" }}
          >
            <Card
              containerStyle={{
                width: "100%",
                alignSelf: "center",
                borderRadius: 10,
                height: "auto",
                shadowOffset: { width: 0, height: 2 },
                shadowColor: "black",
                shadowRadius: 2,
                shadowOpacity: 0.5,
                backgroundColor: "#101820FF",
                borderColor: "#101820FF"
              }}
            >
              <View
                style={{
                  position: "absolute",
                  zIndex: 1,
                  right: 10,
                  width: 30,
                  top: -3
                }}
              >
                {/* <TouchableOpacity
                  style={{
                    width: 30,
                    maxWidth: 30,
                    height: 30,
                    backgroundColor: "#F1C411",
                    justifyContent: "center",
                    borderRadius: 5,
                    alignSelf: "flex-end",
                    marginRight: 5
                  }}
                >
                  <MaterialIcons
                    name="settings"
                    size={30}
                    style={{ alignSelf: "center" }}
                  />
                </TouchableOpacity> */}
                <TouchableOpacity
                  style={{
                    width: 30,
                    maxWidth: 30,
                    height: 30,
                    backgroundColor: "#F1C411",
                    justifyContent: "center",
                    borderRadius: 5,
                    alignSelf: "flex-end"
                  }}
                  onPress={() =>
                    Linking.openURL("https://www.tutoritto.com/about-3")
                  }
                >
                  <MaterialIcons
                    name="account-balance"
                    size={30}
                    style={{ alignSelf: "center" }}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: "row", alignSelf: "center" }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 16,
                    color: "#F1C411",
                    alignSelf: "center"
                  }}
                >
                  BALANCE
                </Text>
                <TouchableOpacity
                  style={{
                    width: 30,
                    height: 30,

                    backgroundColor: "#F1C411",
                    justifyContent: "center",
                    borderRadius: 25,
                    justifyContent: "center",
                    left: 5
                  }}
                  onPress={() => goToHours()}
                >
                  <Image
                    source={require("../assets/dollar.png")}
                    style={{ width: 25, height: 25, alignSelf: "center" }}
                  />
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  color: "white",
                  fontSize: 20,
                  right: 5,
                  top: 5,
                  alignSelf: "center",
                  textAlign: "center"
                }}
              >
                {currency}
              </Text>

              {/* <TouchableOpacity
                style={{
                  backgroundColor: "#F1C411",
                  width: "100%",
                  height: 30,
                  borderRadius: 5,
                  justifyContent: "center",
                  marginTop: 40,
                  alignSelf: "flex-start"
                }}
                onPress={() => {
                  handleCashOut();
                }}
              >
                <Text style={{ alignSelf: "center", fontWeight: "bold" }}>
                  CASH OUTss
                </Text>
              </TouchableOpacity> */}
            </Card>
            {/* ss */}
          </ScrollView>
        )}
      </Card>
      <WithdrawModal
        visible={visibleWithdawModal}
        close={() => setVisibleWithdrawModal(false)}
        userData={props.userData}
        availableBalance={balanceNumric}
      />
    </SafeAreaView>
  );
}
