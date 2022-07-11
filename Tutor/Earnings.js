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
  Pressable,
  TouchableOpacity
} from "react-native";
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
import Rewards from "./Rewards";
import axios from "axios";
import ModalDropdown from "react-native-modal-dropdown";

import firestore from "@react-native-firebase/firestore";
import { Linking } from "react-native";

import WithdrawModal from "../components/Earnings/WithdrawModal";
import MyLoader from "../components/loader/MyLoader";
import { TextInputMask } from "react-native-masked-text";

const Tab = createMaterialTopTabNavigator();
export default function Earnings(props) {
  // const { usersType } = props.route.params;
  const navigation = useNavigation();
  const { userData } = props;
  const [ishour, sethour] = useState(false);
  const [toggleWallet, settogglewallet] = useState(true);
  const [toggleHour, setToggleHour] = useState(false);
  const [toggleRewards, setToggleRewards] = useState(false);
  const [rate, setrate] = useState("");
  const [height, setheight] = useState("");
  const [usertype, setusertype] = useState("");
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
  const [balancecount, setbalancecount] = useState(0);
  const [isNumberofWords, setnumberofwords] = useState(false);
  const [numwords, setnumwords] = useState("");
  const [packageTitle, setPackageTitle] = useState("");
  const [packageDesc, setpackagedesc] = useState("");
  const [VideoSessions, setVideoSessions] = useState("");
  const [deliverydays, setdeliverydays] = useState("");
  const [revisions, setrevisions] = useState("");
  const [packagePrice, setPackagePrice] = useState("");
  const [NumofWords, setNumOfWords] = useState("");
  const [isPackages, setPackages] = useState(false);
  const [tier, setTier] = useState("");
  const [packageData, setPackageData] = useState([]);
  const [asyncCat, setasyncCat] = useState([]);
  const [categorySelected, setcategoryselected] = useState("");
  const [isCategory, setcategorybool] = useState(false);
  const [categoryIndex, setcategoryIndex] = useState("");
  const [play, setplay] = useState(false);
  const [subcategory, setsubcategory] = useState("");
  const [isExtra, setExtra] = useState(false);
  const [index, setindex] = useState(1);
  const [arrayofOptions, setArrayofOptions] = useState([]);
  const [extraTitle, setExtraTitle] = useState("");
  const [extraDescription, setExtraDescription] = useState("");
  const [isSample, setSampleBool] = useState(false);
  const [sampleLink, setSampleLink] = useState("");
  const [visibleWithdawModal, setVisibleWithdrawModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPackageIndex, setSelectedPackageIndex] = useState({});
  const [isEditOn, setIsEditOn] = useState(false);
  const [subcategories, setsubcategories] = useState([]);

  const priceRef = useRef(null);
  const priceEditRef = useRef(null);
  const subcatList = [];

  const [editData, setEditData] = useState({
    categorySelected: "",
    tier: "",
    packageTitle: "",
    packageDesc: "",
    VideoSessions: "",
    deliverydays: "",
    packagePrice: "",
    revisions: "",
    subcategory: "",
    extraTitle: "",
    extraDescription: "",
    Extra: false
  });
  function editHour() {
    sethour(true);
  }
  function submitToggle() {
    if (usertype === "Tuttee") {
      navigation.navigate("Home");
    } else {
      navigation.navigate("Tutor");
    }
  }

  const list = [];

  function uploadSample() {
    setSampleBool(true);
  }
  function SelectCategory(string, index) {
    setcategoryselected(string);

    setcategoryIndex(index);
    setcategorybool(true);
  }

  function SubCategorySelect(string, index) {
    setsubcategory(string);
  }
  function addExtra() {
    setExtra(true);
  }
  function savePackage() {
    if (
      tier != "" &&
      packageTitle != "" &&
      packageDesc != "" &&
      VideoSessions != "" &&
      deliverydays != "" &&
      packagePrice != "" &&
      revisions != "" &&
      categorySelected != "" &&
      subcategory != ""
    ) {
      setLoading(true);
      firestore()
        .collection("Users")
        .doc(props.userData.ID)
        .get()
        .then((querySnapshot) => {
          let userInfo = {
            ...querySnapshot.data(),
            id: querySnapshot.id
          };
          let isEducationUpdated = Array.isArray(userInfo.Education)
            ? userInfo.Education.length > 0
              ? true
              : false
            : false;
          let isSkillsUpdated = Array.isArray(userInfo.Categories)
            ? userInfo.Categories.length > 0
              ? true
              : false
            : false;
          let isCountryUpdated = Array.isArray(userInfo.Country)
            ? userInfo.Country.length > 0
              ? true
              : false
            : false;
          let isLanguageUpdated = Array.isArray(userInfo.Language)
            ? userInfo.Language.length > 0
              ? true
              : false
            : false;
          let isPromoVideoUpdated = userInfo.VideoCount > 0 ? true : false;
          let isTitleUpdated = userInfo.NameTitle?.length > 0 ? true : false;
          if (
            isEducationUpdated &&
            isSkillsUpdated &&
            isCountryUpdated &&
            isLanguageUpdated &&
            isPromoVideoUpdated &&
            isTitleUpdated
          ) {
            const Package = [
              {
                Category: categorySelected,
                SubCategory: subcategory,
                Tier: tier,
                Title: packageTitle,
                Description: packageDesc,
                NumOfSessions:
                  VideoSessions === "N/A" ? -1 : parseInt(VideoSessions),
                DeliveryDays:
                  deliverydays === "N/A" ? -1 : parseInt(deliverydays),
                Price: parseInt(priceRef.current.getRawValue()),
                Revisions: revisions === "N/A" ? -1 : parseInt(revisions),
                Extra: extraTitle != "" ? true : false,
                ExtraTitle: extraTitle,
                ExtraDescription: extraDescription
              }
            ];
            firestore()
              .collection("Users")
              .doc(props.userData.ID)
              .update({
                Package: firestore.FieldValue.arrayUnion(...Package)
              });
            Alert.alert("Package Saved");
            setPackages(false);
            setTier("");
          } else {
            Alert.alert("Please complete your profile to create packages!");
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      Alert.alert("Please fill all the fields");
    }
  }
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
          setprice(String(querysnapshot.data().Rate));
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
        // .where("type", "==", "asynchronous")
        // .collection("AsynchronousCategories")
        .onSnapshot((querysnapshot) => {
          console.log(querysnapshot);
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
  const [price, setprice] = useState("");
  function saveRate() {
    console.log("rate", rate);
    let intRate = parseInt(price);
    firestore()
      .collection("Users")
      .doc(props.userData.ID)
      .update({ Rate: intRate });
    sethour(false);
  }
  // CODE ADDED BY UDDIPAN
  const handleCashOut = async () => {
    setVisibleWithdrawModal(true);
    // if (balanceNumric >= 100) setVisibleWithdrawModal(true);
    // else
    //   alert(
    //     "You need to have minimum $100 in your Tallet in order to cash out."
    //   );
  };
  const handleEditPackage = async () => {
    if (
      editData.tier != "" &&
      editData.packageTitle != "" &&
      editData.packageDesc != "" &&
      editData.packagePrice != "" &&
      editData.revisions != "" &&
      editData.categorySelected != "" &&
      editData.subcategory != ""
    ) {
      setLoading(true);
      firestore()
        .collection("Users")
        .doc(props.userData.ID)
        .get()
        .then((querySnapshot) => {
          let userInfo = {
            ...querySnapshot.data(),
            id: querySnapshot.id
          };
          let isEducationUpdated = Array.isArray(userInfo.Education)
            ? userInfo.Education.length > 0
              ? true
              : false
            : false;
          let isSkillsUpdated = Array.isArray(userInfo.Categories)
            ? userInfo.Categories.length > 0
              ? true
              : false
            : false;
          let isCountryUpdated = Array.isArray(userInfo.Country)
            ? userInfo.Country.length > 0
              ? true
              : false
            : false;
          let isLanguageUpdated = Array.isArray(userInfo.Language)
            ? userInfo.Language.length > 0
              ? true
              : false
            : false;
          let isPromoVideoUpdated = userInfo.VideoCount > 0 ? true : false;
          let isTitleUpdated = userInfo.NameTitle?.length > 0 ? true : false;
          if (
            isEducationUpdated &&
            isSkillsUpdated &&
            isCountryUpdated &&
            isLanguageUpdated &&
            isPromoVideoUpdated &&
            isTitleUpdated
          ) {
            let exPackages = userInfo.Package;
            exPackages[selectedPackageIndex] = {
              Category: editData.categorySelected,
              SubCategory: editData.subcategory,
              Tier: editData.tier,
              Title: editData.packageTitle,
              Description: editData.packageDesc,
              NumOfSessions:
                editData.VideoSessions == 0
                  ? -1
                  : parseInt(editData.VideoSessions),
              DeliveryDays:
                editData.deliverydays == 0
                  ? -1
                  : parseInt(editData.deliverydays), //for unknown reason
              Price: parseInt(priceEditRef.current.getRawValue()),
              Revisions:
                editData.revisions === "N/A"
                  ? -1
                  : parseInt(editData.revisions),
              Extra: editData.extraTitle != "" ? true : false,
              ExtraTitle: editData.extraTitle,
              ExtraDescription: editData.extraDescription
            };
            firestore().collection("Users").doc(props.userData.ID).update({
              Package: exPackages
            });
            Alert.alert("Package Updated");
            setIsEditOn(false);
            setTier("");
          } else {
            Alert.alert("Please complete your profile to create packages!");
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      Alert.alert("Please fill all the fields");
    }
  };
  // CODE ADDED BY UDDIPAN
  async function categorySelect(categoryName) {
    setsubcategory("");
    await firestore()
      .collection("SubCategories")
      .where("CategoryName", "==", categoryName)
      .onSnapshot((querysnap) => {
        if (querysnap.empty) {
          console.log("nope");
        }
        querysnap.forEach((docsnap) => {
          subcatList.push({ ...docsnap.data(), key: docsnap.id });
        });
        setsubcategories(subcatList);
      });
  }

  // console.log(props.route.params.usersType);

  return (
    <SafeAreaView
      style={{
        height: "100%",
        backgroundColor: "black",
        paddingTop: Platform.OS === "android" ? 25 : 10
      }}
    >
      <MyLoader loading={loading} color={"#fff"} />
      <ScrollView
        // contentContainerStyle={{ height: "300%", backgroundColor: "white" }}
        style={{ minHeight: "100%", backgroundColor: "white" }}
      >
        <View
          onLayout={(event) => {
            var { x, y, width, height } = event.nativeEvent.layout;
            setheight(height);
          }}
          style={{ backgroundColor: "black", height: 200 }}
        >
          <View
            style={{ zIndex: 1, position: "absolute", alignSelf: "flex-end" }}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                justifyContent: "center",
                alignSelf: "flex-end",
                backgroundColor: "white",
                width: 35,
                height: 35,
                borderRadius: 35,
                justifyContent: "center"
              }}
            >
              <MaterialIcons
                name="home"
                size={25}
                style={{ alignSelf: "center" }}
                color={"black"}
              />
            </TouchableOpacity>
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
                    style={{
                      fontSize: 14,
                      alignSelf: "center",
                      color: "white",
                      marginTop: -4
                    }}
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
                    style={{
                      fontSize: 12,
                      alignSelf: "center",
                      color: "white"
                    }}
                  >
                    {balance}
                  </Text>
                </View>
              </View>
              <Text
                style={{ color: "white", alignSelf: "center", fontSize: 12 }}
              >
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
                  <Icon
                    name="clock"
                    style={{ alignSelf: "center" }}
                    size={40}
                  />
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
                    style={{
                      fontSize: 14,
                      alignSelf: "center",
                      color: "white"
                    }}
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
                style={{ height: Dimensions.get("screen").height - 250 }}
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
                ListEmptyComponent={() => {
                  return (
                    <View style={{ width: "100%" }}>
                      <Text style={{ textAlign: "center", fontSize: 18 }}>
                        No invoices found!
                      </Text>
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
            <View>
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

                <TouchableOpacity
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
                    CASH OUT
                  </Text>
                </TouchableOpacity>
              </Card>
              {/* ss */}
              <Card
                containerStyle={{
                  width: "100%",
                  alignSelf: "center",
                  height: "auto",
                  shadowOffset: { width: 0, height: 2 },
                  shadowColor: "black",
                  shadowRadius: 2,
                  shadowOpacity: 0.5,
                  borderRadius: 10,
                  backgroundColor: "#101820FF",
                  borderColor: "#101820FF"
                }}
              >
                <TouchableOpacity
                  style={{
                    width: 30,
                    height: 30,
                    alignSelf: "flex-end"
                  }}
                  onPress={() => editHour()}
                >
                  <MaterialIcons
                    name="edit"
                    size={18}
                    style={{
                      alignSelf: "flex-end",
                      justifyContent: "center",
                      color: "white"
                    }}
                  />
                </TouchableOpacity>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    bottom: 5,
                    marginBottom: 15
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      color: "#fdc500",
                      alignSelf: "center",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    YOUR HOURLY RATE
                  </Text>
                  <View
                    style={{
                      width: 30,
                      height: 30,

                      backgroundColor: "#fdc500",
                      justifyContent: "center",
                      borderRadius: 25,
                      justifyContent: "center",
                      left: 5
                    }}
                  >
                    <Image
                      source={require("../assets/hourlyrate.png")}
                      style={{
                        width: 25,
                        height: 25,
                        alignSelf: "center",
                        resizeMode: "contain",
                        left: 1
                      }}
                    />
                  </View>
                </View>
                {rate != "" ? (
                  <Text
                    style={{
                      fontSize: 16,
                      color: "white",
                      alignSelf: "center",
                      bottom: 20
                    }}
                  >
                    ${rate}/hr.
                  </Text>
                ) : (
                  <Text
                    style={{
                      fontSize: 16,
                      color: "white",
                      alignSelf: "center",
                      bottom: 20
                    }}
                  >
                    ${rate}/hr.
                  </Text>
                )}

                {ishour === true ? (
                  <View>
                    <TextInput
                      style={{
                        borderWidth: 1,
                        borderColor: "white",
                        color: "white"
                      }}
                      placeholder={"$"}
                      placeholderTextColor={"white"}
                      value={price}
                      onChangeText={(text) => setprice(text)}
                      keyboardType="number-pad"
                    />
                    <TouchableOpacity
                      onPress={() => {
                        saveRate();
                      }}
                      style={{
                        backgroundColor: "#fdc500",
                        top: 10,
                        width: "100%",
                        height: 30,
                        borderRadius: 5,
                        justifyContent: "center",
                        marginVertical: 10
                      }}
                    >
                      <Text style={{ alignSelf: "center" }}>SAVE</Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
              </Card>
              <>
                {isEditOn ? (
                  <>
                    <Card
                      containerStyle={{
                        width: "100%",
                        alignSelf: "center",
                        height: "auto",
                        shadowOffset: { width: 0, height: 2 },
                        shadowColor: "black",
                        shadowRadius: 2,
                        shadowOpacity: 0.5,
                        borderRadius: 10,
                        backgroundColor:
                          editData.tier === "Bronze"
                            ? "#cd7f32"
                            : editData.tier === "Silver"
                            ? "#D9D8D6"
                            : editData.tier === "Gold"
                            ? "#DFBD69"
                            : editData.tier === "Platinum"
                            ? "#E5E4E2"
                            : "#101820FF",
                        borderColor:
                          editData.tier === "Bronze"
                            ? "#cd7f32"
                            : editData.tier === "Silver"
                            ? "#D9D8D6"
                            : editData.tier === "Gold"
                            ? "#DFBD69"
                            : editData.tier === "Platinum"
                            ? "#E5E4E2"
                            : "#101820FF"
                      }}
                    >
                      <View style={{ bottom: 20 }}>
                        <View
                          style={{
                            width: "100%",
                            flexDirection: "column",
                            justifyContent: "flex-start"
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 18,
                              width: "100%",
                              color: "#fff",
                              marginTop: 10,
                              textAlign: "center"
                            }}
                          >
                            Update Package
                          </Text>
                          <Pressable
                            style={{ position: "absolute", top: 15, right: 0 }}
                            onPress={() => setIsEditOn(false)}
                          >
                            <MaterialCommunityIcons
                              name="close"
                              color="#fff"
                              size={25}
                            />
                          </Pressable>
                          <View style={{ height: 30 }} />
                          <Text
                            style={{
                              fontSize: 14,
                              width: "100%",
                              color: tier != "" ? "black" : "white",
                              alignSelf: "center",
                              marginBottom: 5,
                              marginTop: 10
                            }}
                          >
                            Select a category
                          </Text>
                          <ModalDropdown
                            options={asyncCat.map((item, i) => {
                              return item.Category;
                            })}
                            style={{
                              backgroundColor: "white",
                              height: 35,
                              justifyContent: "center",
                              width: "100%",
                              alignSelf: "flex-end",
                              borderRadius: 5
                            }}
                            textStyle={{
                              color: "black",
                              alignSelf: "flex-start",
                              left: 5
                            }}
                            dropdownStyle={{
                              width: "85%",
                              marginTop: 10
                            }}
                            dropdownTextStyle={{
                              backgroundColor: "white",
                              color: "black",
                              borderRadius: 0
                            }}
                            dropdownTextHighlightStyle={{
                              color: "#F1C411",
                              backgroundColor: "black"
                            }}
                            onSelect={(index, string) => {
                              setEditData({
                                ...editData,
                                categorySelected: string
                              });
                              categorySelect(string);
                            }}
                            defaultValue={editData.categorySelected}
                          />
                        </View>
                        {editData.categorySelected != "" && (
                          <View
                            style={{
                              width: "100%",
                              flexDirection: "column",
                              justifyContent: "flex-start"
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 14,
                                width: "100%",
                                color: tier != "" ? "black" : "white",
                                alignSelf: "center",
                                marginBottom: 5,
                                marginTop: 10
                              }}
                            >
                              Select a Sub Category
                            </Text>
                            <ModalDropdown
                              options={
                                subcategories.length > 0
                                  ? Array.isArray(subcategories[0]?.General)
                                    ? subcategories[0]?.General
                                    : []
                                  : []
                              }
                              style={{
                                backgroundColor: "white",
                                height: 35,
                                justifyContent: "center",
                                width: "100%",
                                alignSelf: "flex-end",
                                borderRadius: 5
                              }}
                              textStyle={{
                                color: "black",
                                alignSelf: "flex-start",
                                left: 5
                              }}
                              dropdownStyle={{
                                width: "85%",
                                marginTop: 10
                              }}
                              dropdownTextStyle={{
                                backgroundColor: "white",
                                color: "black",
                                borderRadius: 0
                              }}
                              dropdownTextHighlightStyle={{
                                color: "#F1C411",
                                backgroundColor: "black"
                              }}
                              onSelect={(index, string) =>
                                setEditData({
                                  ...editData,
                                  subcategory: string
                                })
                              }
                              defaultValue={editData.subcategory}
                            />
                          </View>
                        )}
                        <View
                          style={{
                            width: "100%",
                            flexDirection: "column",
                            justifyContent: "flex-start"
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              width: "100%",
                              color: tier != "" ? "black" : "white",
                              alignSelf: "center",
                              marginBottom: 5,
                              marginTop: 10
                            }}
                          >
                            Select a tier
                          </Text>
                          <ModalDropdown
                            options={["Bronze", "Silver", "Gold", "Platinum"]}
                            style={{
                              backgroundColor: "white",
                              height: 35,
                              justifyContent: "center",
                              width: "100%",
                              alignSelf: "flex-end",
                              borderRadius: 5
                            }}
                            textStyle={{
                              color: "black",
                              alignSelf: "flex-start",
                              left: 5
                            }}
                            dropdownStyle={{
                              width: "85%",
                              marginTop: 10
                            }}
                            dropdownTextStyle={{
                              backgroundColor: "white",
                              color: "black",
                              borderRadius: 0
                            }}
                            dropdownTextHighlightStyle={{
                              color: "#F1C411",
                              backgroundColor: "black"
                            }}
                            onSelect={(index, string) =>
                              setEditData({ ...editData, tier: string })
                            }
                            defaultValue={editData.tier}
                          />
                        </View>
                        <View
                          style={{
                            width: "100%",
                            flexDirection: "column",
                            justifyContent: "flex-start"
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              width: "100%",
                              color: tier != "" ? "black" : "white",
                              alignSelf: "center",
                              marginBottom: 5,
                              marginTop: 10
                            }}
                          >
                            Name
                          </Text>
                          <TextInput
                            style={{
                              alignSelf: "center",
                              backgroundColor: "white",
                              width: "100%",
                              borderRadius: 5,
                              height: 35,
                              padding: 0,
                              paddingHorizontal: 10
                            }}
                            onChangeText={(text) =>
                              setEditData({ ...editData, packageTitle: text })
                            }
                            value={editData.packageTitle}
                            multiline={true}
                            placeholder={"Name of your package"}
                          />
                        </View>
                        <View
                          style={{
                            width: "100%",
                            flexDirection: "column",
                            justifyContent: "flex-start"
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              width: "100%",
                              color: tier != "" ? "black" : "white",
                              alignSelf: "center",
                              marginBottom: 5,
                              marginTop: 10
                            }}
                          >
                            Description
                          </Text>
                          <TextInput
                            style={{
                              alignSelf: "center",
                              backgroundColor: "white",
                              width: "100%",
                              borderRadius: 5,
                              height: 35,
                              padding: 0,
                              paddingHorizontal: 10
                            }}
                            multiline={true}
                            onChangeText={(text) =>
                              setEditData({ ...editData, packageDesc: text })
                            }
                            value={editData.packageDesc}
                            placeholder={"Description of your package"}
                          />
                        </View>
                        <View
                          style={{
                            width: "100%",
                            flexDirection: "column",
                            justifyContent: "flex-start"
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              width: "100%",
                              color: tier != "" ? "black" : "white",
                              alignSelf: "center",
                              marginBottom: 5,
                              marginTop: 10
                            }}
                          >
                            Number of Live Video Sessions
                          </Text>
                          <ModalDropdown
                            options={[
                              "N/A",
                              ...Array(30)
                                .fill(0)
                                .map((e, i) => String(i + 1))
                            ]}
                            style={{
                              backgroundColor: "white",
                              height: 35,
                              justifyContent: "center",
                              width: "100%",
                              alignSelf: "flex-end",
                              borderRadius: 5
                            }}
                            textStyle={{
                              color: "black",
                              alignSelf: "flex-start",
                              left: 5
                            }}
                            scrollEnabled={true}
                            showsVerticalScrollIndicator={true}
                            dropdownStyle={{
                              width: "85%",
                              marginTop: 10
                            }}
                            dropdownTextStyle={{}}
                            dropdownTextHighlightStyle={{
                              color: "#F1C411",
                              backgroundColor: "black"
                            }}
                            onSelect={(text) =>
                              setEditData({ ...editData, VideoSessions: text })
                            }
                            defaultValue={String(editData.VideoSessions)}
                          />
                        </View>
                        <View
                          style={{
                            width: "100%",
                            flexDirection: "column",
                            justifyContent: "flex-start"
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              width: "100%",
                              color: tier != "" ? "black" : "white",
                              alignSelf: "center",
                              marginBottom: 5,
                              marginTop: 10
                            }}
                          >
                            Delivery Days
                          </Text>
                          <ModalDropdown
                            options={[
                              "N/A",
                              ...Array(30)
                                .fill(0)
                                .map((e, i) => String(i + 1))
                            ]}
                            style={{
                              backgroundColor: "white",
                              height: 35,
                              justifyContent: "center",
                              width: "100%",
                              alignSelf: "flex-end",
                              borderRadius: 5
                            }}
                            textStyle={{
                              color: "black",
                              alignSelf: "flex-start",
                              left: 5
                            }}
                            dropdownStyle={{
                              width: "85%",
                              marginTop: 10
                            }}
                            dropdownTextStyle={{
                              backgroundColor: "white",
                              color: "black",
                              borderRadius: 0
                            }}
                            dropdownTextHighlightStyle={{
                              color: "#F1C411",
                              backgroundColor: "black"
                            }}
                            onSelect={(text) =>
                              setEditData({ ...editData, deliverydays: text })
                            }
                            defaultValue={String(editData.deliverydays)}
                          />
                        </View>
                        <View
                          style={{
                            width: "100%",
                            flexDirection: "column",
                            justifyContent: "flex-start"
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              width: "100%",
                              color: tier != "" ? "black" : "white",
                              alignSelf: "center",
                              marginBottom: 5,
                              marginTop: 10
                            }}
                          >
                            Number of revisions
                          </Text>
                          <ModalDropdown
                            options={[
                              "N/A",
                              "1",
                              "2",
                              "3",
                              "4",
                              "5",
                              "6",
                              "7",
                              "8",
                              "9",
                              "10"
                            ]}
                            style={{
                              backgroundColor: "white",
                              height: 35,
                              justifyContent: "center",
                              width: "100%",
                              alignSelf: "flex-end",
                              borderRadius: 5
                            }}
                            textStyle={{
                              color: "black",
                              alignSelf: "flex-start",
                              left: 5
                            }}
                            dropdownStyle={{
                              width: "85%",
                              marginTop: 10
                            }}
                            dropdownTextStyle={{
                              backgroundColor: "white",
                              color: "black",
                              borderRadius: 0
                            }}
                            dropdownTextHighlightStyle={{
                              color: "#F1C411",
                              backgroundColor: "black"
                            }}
                            onSelect={(index, text) =>
                              setEditData({ ...editData, revisions: text })
                            }
                            defaultValue={String(editData.revisions)}
                          />
                        </View>
                        <View
                          style={{
                            width: "100%",
                            flexDirection: "column",
                            justifyContent: "flex-start"
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              width: "100%",
                              color: tier != "" ? "black" : "white",
                              alignSelf: "center",
                              marginBottom: 5,
                              marginTop: 10
                            }}
                          >
                            Price
                          </Text>
                          <TextInputMask
                            style={{
                              alignSelf: "center",
                              backgroundColor: "white",
                              width: "100%",
                              borderRadius: 5,
                              height: 35,
                              padding: 0,
                              paddingHorizontal: 10
                            }}
                            onChangeText={(string) =>
                              setEditData({ ...editData, packagePrice: string })
                            }
                            value={String(editData.packagePrice)}
                            placeholder={"$"}
                            // keyboardType={"number-pad"}
                            type={"money"}
                            options={{
                              precision: 0,
                              separator: ",",
                              delimiter: ",",
                              unit: "$",
                              suffixUnit: ""
                            }}
                            ref={priceEditRef}
                          />
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between"
                          }}
                        >
                          <TouchableOpacity
                            onPress={() =>
                              setEditData({
                                ...editData,
                                Extra: !editData.Extra
                              })
                            }
                            style={{
                              width: "113%",
                              marginTop: 15,
                              flexDirection: "row",
                              justifyContent: "center",
                              padding: 10,
                              borderColor: "#fff",
                              borderWidth: 1,
                              borderRadius: 10
                            }}
                          >
                            <MaterialIcons
                              name="add"
                              size={20}
                              color={tier != "" ? "black" : "white"}
                              style={{ alignSelf: "center", right: 5 }}
                            />
                            <Text
                              style={{
                                fontSize: 14,

                                color: tier != "" ? "black" : "white",
                                alignSelf: "flex-start",
                                right: 5,
                                fontStyle: "italic"
                              }}
                            >
                              Add an extra package feature
                            </Text>
                          </TouchableOpacity>
                          {editData.Extra && (
                            <TouchableOpacity
                              onPress={() =>
                                setEditData({ ...editData, Extra: false })
                              }
                              style={{
                                top: 17,
                                alignSelf: "center",
                                right: 5
                                // backgroundColor: "#222",
                              }}
                            >
                              <MaterialIcons
                                name="arrow-drop-up"
                                size={35}
                                color={tier != "" ? "black" : "white"}
                              />
                            </TouchableOpacity>
                          )}
                        </View>
                        {editData.Extra && (
                          <View>
                            <View
                              style={{
                                width: "100%",
                                flexDirection: "column",
                                justifyContent: "flex-start"
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 14,
                                  width: "100%",
                                  color: tier != "" ? "black" : "white",
                                  alignSelf: "center",
                                  marginBottom: 5,
                                  marginTop: 10
                                }}
                              >
                                Title
                              </Text>
                              <TextInput
                                style={{
                                  alignSelf: "center",
                                  backgroundColor: "white",
                                  width: "100%",
                                  borderRadius: 5,
                                  height: 35,
                                  padding: 0,
                                  paddingHorizontal: 10
                                }}
                                value={editData.extraTitle}
                                onChangeText={(text) =>
                                  setEditData({ ...editData, extraTitle: text })
                                }
                                multiline={true}
                                placeholder={" Title for your extra offer "}
                              />
                            </View>
                            <View
                              style={{
                                width: "100%",
                                flexDirection: "column",
                                justifyContent: "flex-start"
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 14,
                                  width: "100%",
                                  color: tier != "" ? "black" : "white",
                                  alignSelf: "center",
                                  marginBottom: 5,
                                  marginTop: 10
                                }}
                              >
                                Description
                              </Text>
                              <TextInput
                                style={{
                                  alignSelf: "center",
                                  backgroundColor: "white",
                                  width: "100%",
                                  borderRadius: 5,
                                  height: 35,
                                  padding: 0,
                                  paddingHorizontal: 10
                                }}
                                value={editData.extraDescription}
                                onChangeText={(text) =>
                                  setEditData({
                                    ...editData,
                                    extraDescription: text
                                  })
                                }
                                multiline={true}
                                placeholder={
                                  "Description for your extra offer "
                                }
                              />
                            </View>
                          </View>
                        )}
                        <TouchableOpacity
                          onPress={() => {
                            handleEditPackage();
                          }}
                          style={{
                            backgroundColor: tier != "" ? "black" : "#F1C411",
                            top: 10,
                            width: 200,
                            height: 30,
                            borderRadius: 10,
                            justifyContent: "center",
                            alignSelf: "center"
                          }}
                        >
                          <Text
                            style={{
                              alignSelf: "center",
                              color: tier != "" ? "white" : "black"
                            }}
                          >
                            Update
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </Card>
                  </>
                ) : (
                  <>
                    <Card
                      containerStyle={{
                        width: "100%",
                        alignSelf: "center",
                        height: "auto",
                        shadowOffset: { width: 0, height: 2 },
                        shadowColor: "black",
                        shadowRadius: 2,
                        shadowOpacity: 0.5,
                        borderRadius: 10,
                        backgroundColor:
                          tier === "Bronze"
                            ? "#cd7f32"
                            : tier === "Silver"
                            ? "#D9D8D6"
                            : tier === "Gold"
                            ? "#DFBD69"
                            : tier === "Platinum"
                            ? "#E5E4E2"
                            : "#101820FF",
                        borderColor:
                          tier === "Bronze"
                            ? "#cd7f32"
                            : tier === "Silver"
                            ? "#D9D8D6"
                            : tier === "Gold"
                            ? "#DFBD69"
                            : tier === "Platinum"
                            ? "#E5E4E2"
                            : "#101820FF"
                      }}
                    >
                      {isPackages === false ? (
                        <TouchableOpacity
                          onLayout={(event) => {
                            var { x, y, width, height } =
                              event.nativeEvent.layout;
                          }}
                          style={{ alignSelf: "flex-end" }}
                          onPress={() => setPackages(!isPackages)}
                        >
                          <MaterialIcons
                            name="add"
                            size={30}
                            style={{
                              color: "white"
                            }}
                          />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onLayout={(event) => {
                            var { x, y, width, height } =
                              event.nativeEvent.layout;
                          }}
                          style={{ alignSelf: "flex-end" }}
                          onPress={() => setPackages(!isPackages)}
                        >
                          <MaterialIcons
                            name="arrow-drop-up"
                            size={30}
                            style={{
                              color: "white"
                            }}
                          />
                        </TouchableOpacity>
                      )}
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          color: tier != "" ? "black" : "#F1C411",
                          alignSelf: "center",
                          alignItems: "center",
                          justifyContent: "center",
                          bottom: 25
                        }}
                      >
                        Packages
                      </Text>
                      {isPackages === true && (
                        <View style={{ bottom: 20 }}>
                          <View
                            style={{
                              width: "100%",
                              flexDirection: "column",
                              justifyContent: "flex-start"
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 14,
                                width: "100%",
                                color: tier != "" ? "black" : "white",
                                alignSelf: "center",
                                marginBottom: 5,
                                marginTop: 10
                              }}
                            >
                              Select a category
                            </Text>
                            <ModalDropdown
                              options={asyncCat.map((item, i) => {
                                return item.Category;
                              })}
                              style={{
                                backgroundColor: "white",
                                height: 35,
                                justifyContent: "center",
                                width: "100%",
                                alignSelf: "flex-end",
                                borderRadius: 5
                              }}
                              textStyle={{
                                color: "black",
                                alignSelf: "flex-start",
                                left: 5
                              }}
                              dropdownStyle={{
                                width: "85%",
                                marginTop: 10
                              }}
                              dropdownTextStyle={{
                                backgroundColor: "white",
                                color: "black",
                                borderRadius: 0
                              }}
                              dropdownTextHighlightStyle={{
                                color: "#F1C411",
                                backgroundColor: "black"
                              }}
                              onSelect={(index, string) => {
                                SelectCategory(string, index);
                                categorySelect(string);
                              }}
                              defaultValue="Pick"
                            />
                          </View>
                          {categorySelected != "" && (
                            <View
                              style={{
                                width: "100%",
                                flexDirection: "column",
                                justifyContent: "flex-start"
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 14,
                                  width: "100%",
                                  color: tier != "" ? "black" : "white",
                                  alignSelf: "center",
                                  marginBottom: 5,
                                  marginTop: 10
                                }}
                              >
                                Select a Sub Category
                              </Text>
                              <ModalDropdown
                                options={
                                  subcategories.length > 0
                                    ? Array.isArray(subcategories[0]?.General)
                                      ? subcategories[0]?.General
                                      : []
                                    : []
                                }
                                style={{
                                  backgroundColor: "white",
                                  height: 35,
                                  justifyContent: "center",
                                  width: "100%",
                                  alignSelf: "flex-end",
                                  borderRadius: 5
                                }}
                                textStyle={{
                                  color: "black",
                                  alignSelf: "flex-start",
                                  left: 5
                                }}
                                dropdownStyle={{
                                  width: "85%",
                                  marginTop: 10
                                }}
                                dropdownTextStyle={{
                                  backgroundColor: "white",
                                  color: "black",
                                  borderRadius: 0
                                }}
                                dropdownTextHighlightStyle={{
                                  color: "#F1C411",
                                  backgroundColor: "black"
                                }}
                                onSelect={(index, string) =>
                                  SubCategorySelect(string, index)
                                }
                                defaultValue="Pick"
                              />
                            </View>
                          )}
                          <View
                            style={{
                              width: "100%",
                              flexDirection: "column",
                              justifyContent: "flex-start"
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 14,
                                width: "100%",
                                color: tier != "" ? "black" : "white",
                                alignSelf: "center",
                                marginBottom: 5,
                                marginTop: 10
                              }}
                            >
                              Select a tier
                            </Text>
                            <ModalDropdown
                              options={["Bronze", "Silver", "Gold", "Platinum"]}
                              style={{
                                backgroundColor: "white",
                                height: 35,
                                justifyContent: "center",
                                width: "100%",
                                alignSelf: "flex-end",
                                borderRadius: 5
                              }}
                              textStyle={{
                                color: "black",
                                alignSelf: "flex-start",
                                left: 5
                              }}
                              dropdownStyle={{
                                width: "85%",
                                marginTop: 10
                              }}
                              dropdownTextStyle={{
                                backgroundColor: "white",
                                color: "black",
                                borderRadius: 0
                              }}
                              dropdownTextHighlightStyle={{
                                color: "#F1C411",
                                backgroundColor: "black"
                              }}
                              onSelect={(index, string) => setTier(string)}
                              defaultValue="Package Tier"
                            />
                          </View>
                          <View
                            style={{
                              width: "100%",
                              flexDirection: "column",
                              justifyContent: "flex-start"
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 14,
                                width: "100%",
                                color: tier != "" ? "black" : "white",
                                alignSelf: "center",
                                marginBottom: 5,
                                marginTop: 10
                              }}
                            >
                              Name
                            </Text>
                            <TextInput
                              style={{
                                alignSelf: "center",
                                backgroundColor: "white",
                                width: "100%",
                                borderRadius: 5,
                                height: 35,
                                padding: 0,
                                paddingHorizontal: 10
                              }}
                              onChangeText={(text) => setPackageTitle(text)}
                              multiline={true}
                              placeholder={"Name of your package"}
                            />
                          </View>
                          <View
                            style={{
                              width: "100%",
                              flexDirection: "column",
                              justifyContent: "flex-start"
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 14,
                                width: "100%",
                                color: tier != "" ? "black" : "white",
                                alignSelf: "center",
                                marginBottom: 5,
                                marginTop: 10
                              }}
                            >
                              Description
                            </Text>
                            <TextInput
                              style={{
                                alignSelf: "center",
                                backgroundColor: "white",
                                width: "100%",
                                borderRadius: 5,
                                height: 35,
                                padding: 0,
                                paddingHorizontal: 10
                              }}
                              multiline={true}
                              onChangeText={(text) => setpackagedesc(text)}
                              placeholder={"Description of your package"}
                            />
                          </View>
                          <View
                            style={{
                              width: "100%",
                              flexDirection: "column",
                              justifyContent: "flex-start"
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 14,
                                width: "100%",
                                color: tier != "" ? "black" : "white",
                                alignSelf: "center",
                                marginBottom: 5,
                                marginTop: 10
                              }}
                            >
                              Number of Live Video Sessions
                            </Text>
                            <ModalDropdown
                              options={[
                                "N/A",
                                ...Array(30)
                                  .fill(0)
                                  .map((e, i) => String(i + 1))
                              ]}
                              style={{
                                backgroundColor: "white",
                                height: 35,
                                justifyContent: "center",
                                width: "100%",
                                alignSelf: "flex-end",
                                borderRadius: 5
                              }}
                              textStyle={{
                                color: "black",
                                alignSelf: "flex-start",
                                left: 5
                              }}
                              scrollEnabled={true}
                              showsVerticalScrollIndicator={true}
                              dropdownStyle={{
                                width: "85%",
                                marginTop: 10
                              }}
                              dropdownTextStyle={{}}
                              dropdownTextHighlightStyle={{
                                color: "#F1C411",
                                backgroundColor: "black"
                              }}
                              onSelect={(index, string) =>
                                setVideoSessions(string)
                              }
                              defaultValue="#"
                            />
                          </View>
                          <View
                            style={{
                              width: "100%",
                              flexDirection: "column",
                              justifyContent: "flex-start"
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 14,
                                width: "100%",
                                color: tier != "" ? "black" : "white",
                                alignSelf: "center",
                                marginBottom: 5,
                                marginTop: 10
                              }}
                            >
                              Delivery Days
                            </Text>
                            <ModalDropdown
                              options={[
                                "N/A",
                                ...Array(30)
                                  .fill(0)
                                  .map((e, i) => String(i + 1))
                              ]}
                              style={{
                                backgroundColor: "white",
                                height: 35,
                                justifyContent: "center",
                                width: "100%",
                                alignSelf: "flex-end",
                                borderRadius: 5
                              }}
                              textStyle={{
                                color: "black",
                                alignSelf: "flex-start",
                                left: 5
                              }}
                              dropdownStyle={{
                                width: "85%",
                                marginTop: 10
                              }}
                              dropdownTextStyle={{
                                backgroundColor: "white",
                                color: "black",
                                borderRadius: 0
                              }}
                              dropdownTextHighlightStyle={{
                                color: "#F1C411",
                                backgroundColor: "black"
                              }}
                              onSelect={(index, string) =>
                                setdeliverydays(string)
                              }
                              defaultValue="#"
                            />
                          </View>
                          <View
                            style={{
                              width: "100%",
                              flexDirection: "column",
                              justifyContent: "flex-start"
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 14,
                                width: "100%",
                                color: tier != "" ? "black" : "white",
                                alignSelf: "center",
                                marginBottom: 5,
                                marginTop: 10
                              }}
                            >
                              Number of revisions
                            </Text>
                            <ModalDropdown
                              options={[
                                "N/A",
                                "1",
                                "2",
                                "3",
                                "4",
                                "5",
                                "6",
                                "7",
                                "8",
                                "9",
                                "10"
                              ]}
                              style={{
                                backgroundColor: "white",
                                height: 35,
                                justifyContent: "center",
                                width: "100%",
                                alignSelf: "flex-end",
                                borderRadius: 5
                              }}
                              textStyle={{
                                color: "black",
                                alignSelf: "flex-start",
                                left: 5
                              }}
                              dropdownStyle={{
                                width: "85%",
                                marginTop: 10
                              }}
                              dropdownTextStyle={{
                                backgroundColor: "white",
                                color: "black",
                                borderRadius: 0
                              }}
                              dropdownTextHighlightStyle={{
                                color: "#F1C411",
                                backgroundColor: "black"
                              }}
                              onSelect={(index, string) => setrevisions(string)}
                              defaultValue="#"
                            />
                          </View>
                          <View
                            style={{
                              width: "100%",
                              flexDirection: "column",
                              justifyContent: "flex-start"
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 14,
                                width: "100%",
                                color: tier != "" ? "black" : "white",
                                alignSelf: "center",
                                marginBottom: 5,
                                marginTop: 10
                              }}
                            >
                              Price
                            </Text>
                            <TextInputMask
                              type={"money"}
                              style={{
                                alignSelf: "center",
                                backgroundColor: "white",
                                width: "100%",
                                borderRadius: 5,
                                height: 35,
                                padding: 0,
                                paddingHorizontal: 10
                              }}
                              onChangeText={(text) => setPackagePrice(text)}
                              value={packagePrice}
                              placeholder={"$"}
                              // keyboardType="number-pad"
                              options={{
                                precision: 0,
                                separator: ",",
                                delimiter: ",",
                                unit: "$",
                                suffixUnit: ""
                              }}
                              ref={priceRef}
                            />
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between"
                            }}
                          >
                            <TouchableOpacity
                              onPress={() => addExtra()}
                              style={{
                                width: "113%",
                                marginTop: 15,
                                flexDirection: "row",
                                justifyContent: "center",
                                padding: 10,
                                borderColor: "#fff",
                                borderWidth: 1,
                                borderRadius: 10
                              }}
                            >
                              <MaterialIcons
                                name="add"
                                size={20}
                                color={tier != "" ? "black" : "white"}
                                style={{ alignSelf: "center", right: 5 }}
                              />
                              <Text
                                style={{
                                  fontSize: 14,

                                  color: tier != "" ? "black" : "white",
                                  alignSelf: "flex-start",
                                  right: 5,
                                  fontStyle: "italic"
                                }}
                              >
                                Add an extra package feature
                              </Text>
                            </TouchableOpacity>
                            {isExtra && (
                              <TouchableOpacity
                                onPress={() => setExtra(false)}
                                style={{
                                  top: 17,
                                  alignSelf: "center",
                                  right: 5
                                  // backgroundColor: "#222",
                                }}
                              >
                                <MaterialIcons
                                  name="arrow-drop-up"
                                  size={35}
                                  color={tier != "" ? "black" : "white"}
                                />
                              </TouchableOpacity>
                            )}
                          </View>
                          {isExtra && (
                            <View>
                              <View
                                style={{
                                  width: "100%",
                                  flexDirection: "column",
                                  justifyContent: "flex-start"
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: 14,
                                    width: "100%",
                                    color: tier != "" ? "black" : "white",
                                    alignSelf: "center",
                                    marginBottom: 5,
                                    marginTop: 10
                                  }}
                                >
                                  Title
                                </Text>
                                <TextInput
                                  style={{
                                    alignSelf: "center",
                                    backgroundColor: "white",
                                    width: "100%",
                                    borderRadius: 5,
                                    height: 35,
                                    padding: 0,
                                    paddingHorizontal: 10
                                  }}
                                  onChangeText={(text) => setExtraTitle(text)}
                                  multiline={true}
                                  placeholder={" Title for your extra offer "}
                                />
                              </View>
                              <View
                                style={{
                                  width: "100%",
                                  flexDirection: "column",
                                  justifyContent: "flex-start"
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: 14,
                                    width: "100%",
                                    color: tier != "" ? "black" : "white",
                                    alignSelf: "center",
                                    marginBottom: 5,
                                    marginTop: 10
                                  }}
                                >
                                  Description
                                </Text>
                                <TextInput
                                  style={{
                                    alignSelf: "center",
                                    backgroundColor: "white",
                                    width: "100%",
                                    borderRadius: 5,
                                    height: 35,
                                    padding: 0,
                                    paddingHorizontal: 10
                                  }}
                                  onChangeText={(text) =>
                                    setExtraDescription(text)
                                  }
                                  multiline={true}
                                  placeholder={
                                    "Description for your extra offer "
                                  }
                                />
                              </View>
                            </View>
                          )}
                          {/* <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => uploadSample()}
                      style={{
                        width: "72.5%",
                        marginTop: 15,
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <MaterialIcons
                        name="link"
                        size={20}
                        color={tier != "" ? "black" : "white"}
                        style={{ alignSelf: "center", right: 5 }}
                      />
                      <Text
                        style={{
                          fontSize: 14,

                          color: tier != "" ? "black" : "white",
                          alignSelf: "flex-start",

                          fontStyle: "italic",
                        }}
                      >
                        Add samples of your work
                      </Text>
                    </TouchableOpacity>
                    {isSample && (
                      <TouchableOpacity
                        onPress={() => setSampleBool(false)}
                        style={{ top: 6, alignSelf: "center", right: 5 }}
                      >
                        <MaterialIcons
                          name="arrow-drop-up"
                          size={35}
                          color={tier != "" ? "black" : "white"}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                  {isSample && (
                    <TextInput
                      style={{
                        backgroundColor: "white",
                        width: "100%",
                        borderRadius: 5,
                      }}
                      onChangeText={(text) => setSampleLink(text)}
                      multiline={true}
                      placeholder={"Link to your sample "}
                    />
                  )} */}
                          <TouchableOpacity
                            onPress={() => {
                              savePackage();
                            }}
                            style={{
                              backgroundColor: tier != "" ? "black" : "#F1C411",
                              top: 10,
                              width: 200,
                              height: 30,
                              borderRadius: 10,
                              justifyContent: "center",
                              alignSelf: "center"
                            }}
                          >
                            <Text
                              style={{
                                alignSelf: "center",
                                color: tier != "" ? "white" : "black"
                              }}
                            >
                              Save
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </Card>
                    {packageData != null
                      ? packageData.map((item, i) => {
                          return (
                            <>
                              <View
                                style={[
                                  styles.msgCustomPackage,
                                  {
                                    backgroundColor:
                                      item.Tier === "Bronze"
                                        ? "#cd7f32"
                                        : item.Tier === "Silver"
                                        ? "#D9D8D6"
                                        : item.Tier === "Gold"
                                        ? "#DFBD69"
                                        : item.Tier === "Platinum"
                                        ? "#E5E4E2"
                                        : "#333939"
                                  }
                                ]}
                              >
                                <View style={styles.msgCustomPackageTop}>
                                  <View style={{ flex: 1 }}>
                                    <Text style={styles.msgCustomPackageName}>
                                      {item.Title}
                                    </Text>
                                    <Text style={styles.msgCustomPackageTier}>
                                      {item.Tier}, {item.Category},{" "}
                                      {item.SubCategory}
                                    </Text>
                                  </View>
                                  <View style={styles.msgCustomPackageRight}>
                                    <Text style={styles.msgCustomePackagePrice}>
                                      ${item.Price}
                                    </Text>
                                  </View>
                                </View>
                                <View style={styles.msgCustomPackageMiddle}>
                                  <Text style={styles.msgCustomePackageText}>
                                    Live Sessions:{" "}
                                    {item.NumOfSessions === -1
                                      ? "N/A"
                                      : item.NumOfSessions}
                                  </Text>
                                  <Text style={styles.msgCustomePackageText}>
                                    Delivery Days:{" "}
                                    {item.DeliveryDays === -1
                                      ? "N/A"
                                      : item.DeliveryDays}
                                  </Text>
                                  <Text style={styles.msgCustomePackageText}>
                                    Number of revisions:{" "}
                                    {item.Revisions === -1
                                      ? "N/A"
                                      : item.Revisions}
                                  </Text>
                                  <Text style={styles.msgCustomePackageText}>
                                    {item.Description}
                                  </Text>
                                </View>
                                <Pressable
                                  style={[
                                    styles.msgCustomePackageBtn,
                                    { backgroundColor: "#F1C411" }
                                  ]}
                                  onPress={() => {
                                    setIsEditOn(true);
                                    setSelectedPackageIndex(i);
                                    setEditData({
                                      ...editData,
                                      categorySelected: item.Category,
                                      tier: item.Tier,
                                      packageTitle: item.Title,
                                      packageDesc: item.Description,
                                      VideoSessions: item.NumOfSessions,
                                      deliverydays: item.DeliveryDays,
                                      packagePrice: item.Price,
                                      revisions: item.Revisions,
                                      subcategory: item.SubCategory,
                                      extraTitle: item.ExtraTitle,
                                      extraDescription: item.ExtraDescription,
                                      Extra: item.Extra
                                    });
                                  }}
                                >
                                  <Icon name="edit" size={16} color={"#222"} />
                                  <Text
                                    style={[
                                      styles.msgCustomePackageBtnText,
                                      { color: "#000", textAlign: "center" }
                                    ]}
                                  >
                                    Edit
                                  </Text>
                                </Pressable>
                              </View>

                              {/* <View key={i} style={{ bottom: 10 }}>
                          <Text
                            style={{
                              color:
                                item.Tier === "Bronze"
                                  ? "#cd7f32"
                                  : item.Tier === "Silver"
                                  ? "#D9D8D6"
                                  : item.Tier === "Gold"
                                  ? "#DFBD69"
                                  : item.Tier === "Platinum"
                                  ? "#E5E4E2"
                                  : "white",
                              alignSelf: "center",
                              fontWeight: "bold",
                              right: 5,
                              fontSize: 16,
                            }}
                          >
                            {item.Tier}
                          </Text>
                          <View>
                            <Text
                              style={{ color: "white", fontWeight: "bold" }}
                            >
                              {item.Category}
                              {item.SubCategory}
                            </Text>
                          </View>
                          <Text style={{ color: "white", fontWeight: "bold" }}>
                            {item.Title}
                          </Text>

                          <Text style={{ color: "white", top: 5 }}>
                            {item.Description}
                          </Text>

                          <Text style={{ color: "white", top: 5 }}>
                            Number of Video Sessions: {item.NumOfSessions}
                          </Text>
                          <Text style={{ color: "white", top: 5 }}>
                            Delivery Days: {item.DeliveryDays}
                          </Text>
                          <Text style={{ color: "white", top: 5 }}>
                            Number of Revisions: {item.Revisions}
                          </Text>
                          <Text style={{ color: "white", top: 5 }}>
                            Price: ${item.Price}
                          </Text>
                          <Card.Divider
                            style={{ top: 10, backgroundColor: "grey" }}
                          ></Card.Divider>
                        </View> */}
                            </>
                          );
                        })
                      : null}
                  </>
                )}
              </>
            </View>
          )}
        </Card>
        <WithdrawModal
          visible={visibleWithdawModal}
          close={() => setVisibleWithdrawModal(false)}
          userData={props.userData}
          availableBalance={balanceNumric}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  header: {
    top: 0,
    height: 240,
    width: "100%",
    backgroundColor: "#8dc6ff",
    alignItems: "center",
    justifyContent: "center"
  },

  msgCustomPackage: {
    backgroundColor: "#DFBD69",
    width: "100%",
    marginVertical: 15,
    // marginLeft: "5%",
    padding: 10,
    borderRadius: 10,
    elevation: 5
  },
  msgCustomPackageTop: {
    borderBottomWidth: 1,
    borderColor: "#0002",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexDirection: "row",
    paddingBottom: 10,
    width: "100%"
  },
  msgCustomPackageName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
    letterSpacing: 0.5
  },
  msgExtraHeading: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#222",
    letterSpacing: 0.5
  },
  msgCustomPackageTier: {
    fontSize: 14,
    color: "#222",
    letterSpacing: 0.5,
    textTransform: "uppercase"
  },
  msgCustomePackagePrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
    letterSpacing: 0.5
  },
  msgCustomePackageText: {
    fontSize: 14,
    color: "#222",
    letterSpacing: 0.5,
    marginVertical: 2
  },
  msgCustomPackageMiddle: {
    borderBottomWidth: 1,
    borderColor: "#0002",
    paddingBottom: 10
  },
  msgCustomPackageBottom: {
    paddingVertical: 10,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row"
  },
  msgCustomePackageBtn: {
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },

  msgCustomePackageBtnText: {
    fontSize: 14,
    color: "#2228",
    letterSpacing: 0.5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  }
});
