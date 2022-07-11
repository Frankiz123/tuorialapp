import React, { useContext, useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  Pressable
} from "react-native";
import ToggleSwitch from "toggle-switch-react-native";
import { useNavigation } from "@react-navigation/native";
import { Card } from "react-native-elements";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/Feather";
import { FlatList } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Share from "react-native-share";

import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import { REFERRAL_URL } from "../config";
const Tab = createMaterialTopTabNavigator();
const { height } = Dimensions.get("screen").height;
const storageGet = async (key) => {
  try {
    const result = await AsyncStorage.getItem(key);
    console.log("result ", result);
    return result;
  } catch (error) {
    console.log(error);
  }
};

// uddipan st

import { copilot, walkthroughable, CopilotStep } from "react-native-copilot";
import ComingModal from "../components/ComingModal.js/ComingModal";

const WalkthroughableText = walkthroughable(Text);
const WalkthroughableImage = walkthroughable(Image);
const WalkthroughableTouchableOpacity = walkthroughable(TouchableOpacity);
const WalkthroughableView = walkthroughable(View);
const WalkthroughableToggleSwitch = walkthroughable(ToggleSwitch);

function Tutor(props) {
  const { userData, updateType } = props;
  const [isOn, setisOn] = useState(true);
  const [earnings, setbool] = useState(true);
  const [profile, setbool1] = useState(true);
  const [account, setbool2] = useState(true);
  const [average, setaverage] = useState("");
  const [requests, setrequests] = useState([]);
  const [BalanceFormat, setBalance] = useState("");
  const [skillcount, setskillcount] = useState("");
  const [sessionCount, setSessionCount] = useState(0);
  const [notifications, setnotifications] = useState([]);
  const [notifcount, setnotifcount] = useState(0);
  const [ispicChanged, setpicchanged] = useState(false);
  const [uploaduri, setuploadURI] = useState(null);
  const [filePath, setFilePath] = useState(null);
  const [picked, setPicked] = useState(false);
  const [url, setUrl] = useState(null);
  const [isreferral, setreferral] = useState(false);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [userInfo, setUserInfo] = useState({});
  const [openComingSoon, setOpenComingSoon] = useState(false);

  let balance;
  let balanceformat;
  const navigation = useNavigation();
  async function openReferModal() {
    Share.open({
      message: `Download the patent pending TUTORITTO APP to share your skills & start EARNING $ or to explore undiscovered talents instantly.\n Apple Appstore/Google Playstore download links can be found in:\n `,
      title: "Tutoritto Referral",
      url: `${REFERRAL_URL}`
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        err && console.log(err);
      });
  }
  //CODE ADDED BY UDDIPAN
  //sends you to tutees side!
  async function submitToggle(isOn) {
    console.log("function toggle", isOn);
    AsyncStorage.setItem("Type", "Student").then(() => {
      console.log("It was saved");
    });
    var type = "Student";
    updateType(type);
  }

  const goToBiddingDetails = async (BiddingID) => {
    await firestore()
      .collection("Bidding")
      .doc(BiddingID)
      .get()
      .then((querysnapshot) => {
        if (querysnapshot.exists) {
          const bid = querysnapshot.data();
          const bidding = bid?.BiddingInfo[0];

          if (bidding.Type == "Yes/No Offer") {
            navigation.navigate("AcceptBidding", {
              BiddingDetails: bid?.BiddingInfo[0]
            });
          } else {
            navigation.navigate("BiddingDetails", {
              BiddingDetails: bid?.BiddingInfo[0]
            });
          }
        }
      });

    return;
  };

  //formatting tutors balance
  function kFormatter(num) {
    return Math.abs(num) > 999
      ? "$" + Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
      : "$" + Math.sign(num) * Math.abs(num);
  }
  //edit your profile pic
  let openImagePickerAsync = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log("clickable");
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }
    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.cancelled === true) {
      console.log("not allowed");
      return;
    }
    console.log("image daata", pickerResult);

    let source = { uri: pickerResult.uri };
    let uri = pickerResult.uri;
    let uploadUri = Platform.OS === "ios" ? uri.replace("file://", "") : uri;
    setuploadURI(uploadUri);
    setFilePath(source.uri);
    setPicked(true);
    // uriToBlob(pickerResult.uri);
    var ID = userData.ID;
    _handlePhotoChoice(uri, ID);
  };
  //converting pic url to data that can be stored in firebase storage
  const _handlePhotoChoice = async (uri, ID) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        resolve(xhr.response);
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
    let ref = storage()
      .ref()
      .child("userimages " + ID);
    let snapshot = await ref.put(blob);
    // console.log("database", snapshot.ref.getDownloadURL());
    // const url = await snapshot.ref.getDownloadURL();
    const url = await storage()
      .ref("userimages " + ID)
      .getDownloadURL();
    console.log("download url ", url);
    setUrl(url);
    firestore()
      .collection("Users")
      .doc(props.userData.ID)
      .update({ ProfileChanged: true, Photo: url });
  };

  const removeNotifications = () => {
    firestore()
      .collection("Notifications")
      .doc(props.userData.ID)
      .delete()
      .then(async () => {
        await getuserInfo();
      });
  };

  // getting user data from firebase to display it in the page
  async function getuserInfo() {
    if (props.userData.ID != undefined) {
      await Promise.all([
        firestore()
          .collection("Notifications")
          .doc(props.userData.ID)
          .onSnapshot((querySnapShot) => {
            if (
              querySnapShot.exists &&
              querySnapShot.data().Messages.length &&
              querySnapShot.data().Messages != null
            ) {
              setnotifications(querySnapShot.data().Messages);
            }
          }),
        firestore()
          .collection("Requests")
          .doc(props.userData.ID)
          .onSnapshot((querySnapShot) => {
            if (querySnapShot.exists) {
              setrequests(querySnapShot.data().Requests);
            }
          }),
        firestore()
          .collection("Users")
          .doc(props.userData.ID)
          .onSnapshot((querySnapShot) => {
            if (querySnapShot.data()) {
              setUserInfo(querySnapShot.data());
              balance = querySnapShot.data().Balance;
              setpicchanged(querySnapShot.data().ProfileChanged);
              balanceformat = kFormatter(balance);
              setBalance(balanceformat);
              setskillcount(querySnapShot.data().SkillCount);
              setSessionCount(querySnapShot.data().SessionCount);
              setnotifcount(querySnapShot.data().NotifCount);
              let totalavg = (
                Math.round(querySnapShot.data().TotalAverage * 100) / 100
              ).toFixed(2);
              setaverage(totalavg);
              let inbox = querySnapShot.data().inbox;
              if (Array.isArray(inbox)) {
                let totalUnread = 0;
                totalUnread = inbox.reduce((a, b) => +a + +b.unread, 0);
                if (totalUnread > 0) {
                  setUnreadMessageCount(totalUnread);
                }
              }
            }
          })
      ]);
    }
  }

  useEffect(() => {
    if (notifications.length > 0 && typeof userInfo.ID !== "undefined") {
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
        firestore()
          .collection("Notifications")
          .doc(userInfo.ID)
          .get()
          .then((querySnapShot) => {
            if (querySnapShot.data()) {
              let messages = querySnapShot.data().Messages;
              if (Array.isArray(messages)) {
                messages = messages.filter(
                  (message) => message.Type !== "StartUp"
                );
                querySnapShot.ref.update({ Messages: messages });
              }
            }
          });
      }
    }
  }, [userInfo, notifications]);
  useEffect(() => {
    async function getUserInfo() {
      await getuserInfo();
    }
    getUserInfo();
  }, [props.userData.ID]);

  //navigates to earnings page
  function navigate(earnings) {
    if (earnings === true) {
      navigation.navigate("Earnings", { usersType: "Tutor" });
    }
  }

  //navigates to profile page
  function navigatetoProfile(profile) {
    if (profile === true) {
      navigation.navigate("Profile");
    }
  }

  const welcome = "𝐓𝐮𝐭𝐨-𝐑𝐢𝐭𝐭𝐨𝐞𝐬, Lets start 𝐄𝐀𝐑𝐍𝐈𝐍𝐆";

  return (
    <View
      style={{
        backgroundColor: "black",
        flex: 1,
        paddingTop: Platform.OS === "android" ? 25 : 0
      }}
    >
      <SafeAreaView />
      {/* MODAL */}
      <ComingModal
        open={openComingSoon}
        close={() => {
          setOpenComingSoon(false);
          setisOn(!isOn);
        }}
      />
      {/* header */}
      <View style={{ backgroundColor: "black" }}>
        <View style={{ flexDirection: "column" }}>
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
              <Text
                style={{
                  color: "#F1C411",
                  fontWeight: "bold",
                  left: 10,
                  fontSize: 15
                }}
              >
                Tuto-Rittoes,
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 0,
                  left: 10
                }}
              >
                <Text style={{ color: "white", fontSize: 15 }}>Lets start</Text>
                <Text
                  style={{
                    color: "#F1C411",
                    fontWeight: "bold",
                    left: 4,
                    top: 0,
                    fontSize: 15
                  }}
                >
                  EARNING.
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              justifyContent: "flex-end",
              alignSelf: "flex-end",
              position: "absolute",
              flexDirection: "row"
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "white",
                display: "flex",
                justifyContent: "center",
                alignSelf: "center",
                borderRadius: 35,
                height: 30,
                width: 30,
                justifyContent: "center",
                right: 12
              }}
              onPress={() => {
                props.start();
              }}
            >
              <Feather
                name="help-circle"
                size={20}
                color={"#000"}
                style={{ marginLeft: 5 }}
              />
            </TouchableOpacity>

            <CopilotStep
              text="You can refer a freind to join tutoritto and get reward points that you can convert to cash ($) in your earnings."
              order={1}
              name="share"
            >
              <WalkthroughableTouchableOpacity
                onPress={openReferModal}
                style={{
                  backgroundColor: "white",
                  alignSelf: "center",
                  borderRadius: 35,
                  height: 30,
                  width: 30,
                  justifyContent: "center",
                  right: 8
                }}
              >
                <Image
                  source={require("../assets/referrals.png")}
                  style={{
                    width: 25,
                    height: 25,
                    alignSelf: "center",
                    borderRadius: 35
                  }}
                />
              </WalkthroughableTouchableOpacity>
            </CopilotStep>

            <CopilotStep
              text="You can check your private chat messages and any special requests."
              order={2}
              name="chat"
            >
              <WalkthroughableTouchableOpacity
                style={{
                  backgroundColor: "white",
                  alignSelf: "center",
                  borderRadius: 35,
                  height: 30,
                  width: 30,
                  right: 4,
                  justifyContent: "center",
                  position: "relative"
                }}
                onPress={() => navigation.navigate("ChatListing")}
              >
                {unreadMessageCount > 0 && (
                  <View
                    style={{
                      backgroundColor: "red",
                      width: 22,
                      height: 22,
                      borderRadius: 15,
                      top: -10,
                      right: -9,
                      justifyContent: "center",
                      position: "absolute",
                      zIndex: 9
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        alignSelf: "center",
                        color: "white"
                      }}
                    >
                      {unreadMessageCount}
                    </Text>
                  </View>
                )}
                <MaterialIcons
                  name="chat"
                  size={25}
                  color={"black"}
                  style={{
                    width: 25,
                    height: 25,
                    alignSelf: "center",
                    borderRadius: 35
                  }}
                />
              </WalkthroughableTouchableOpacity>
            </CopilotStep>

            <View style={{}}>
              <CopilotStep
                text="You can alway toggle to the Tuto-Rittee portal anytime to search for other skills."
                order={3}
                name="toggle"
              >
                <WalkthroughableView>
                  <ToggleSwitch
                    isOn={isOn} // There should be a state like this.state.isOn(Set default value)
                    onColor="#F1C411"
                    offColor="#F1C411"
                    labelStyle={{ color: "black", fontWeight: "900" }}
                    size="large"
                    onToggle={() => {
                      setisOn(!isOn);
                      submitToggle(isOn);
                    }} //To update state
                  />
                </WalkthroughableView>
              </CopilotStep>
              {/* <TouchableOpacity
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  backgroundColor: "#F1C411",
                  marginTop: 5,
                  marginBottom: -20,
                  padding: 5,
                  borderRadius: 50,
                }}
                onPress={() => {
                  props.start();
                }}
              >
                <Feather
                  name="help-circle"
                  size={16}
                  color={"#0008"}
                  style={{ marginRight: 5 }}
                />
                <Text
                  style={{ fontSize: 14, fontWeight: "700", color: "#0008" }}
                >
                  Help
                </Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </View>

        <View //still needs to be updated
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            top: 25
          }}
        >
          <View
            style={{
              flexDirection: "column",
              alignSelf: "center",
              marginTop: 5,
              justifyContent: "center"
            }}
          >
            <View style={{ width: 65, height: 65, flexDirection: "row" }}>
              <CopilotStep
                text="You can track your earnings($) in your tuto-wallet (tallet), reward points collected for +ve activities and associated transactions /invoices."
                order={4}
                name="earnings"
              >
                <WalkthroughableTouchableOpacity
                  onPress={() => {
                    setbool(true), navigate(earnings);
                  }}
                  style={{
                    backgroundColor: "#F1C411",
                    alignSelf: "center",
                    borderRadius: 45,
                    height: 55,
                    width: 55,
                    justifyContent: "center"
                  }}
                >
                  <Icon
                    name="bar-chart-2"
                    size={40}
                    style={{ alignSelf: "center", color: "black" }}
                  />
                </WalkthroughableTouchableOpacity>
              </CopilotStep>
              <View
                style={{
                  backgroundColor: "red",
                  minWidth: 25,
                  height: 25,
                  borderRadius: 30,
                  right: 0,

                  justifyContent: "center",
                  position: "absolute",

                  paddingHorizontal: 0
                }}
              >
                <Text
                  style={{ fontSize: 12, alignSelf: "center", color: "white" }}
                >
                  {BalanceFormat}
                </Text>
              </View>
            </View>
            <Text
              style={{
                color: "white",
                alignSelf: "center",
                bottom: 0,
                left: -5,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              Earnings
            </Text>
          </View>

          <CopilotStep
            text="You MUST update your profile including 30-second promo video, skills and expertise"
            order={5}
            name="Profile"
          >
            <WalkthroughableView
              style={{
                flexDirection: "column",
                alignSelf: "center",
                width: 75,
                right: 0
              }}
            >
              <View style={{ flexDirection: "row", width: 75, height: 75 }}>
                <TouchableOpacity
                  onPress={() => {
                    setbool1(true), navigatetoProfile(profile);
                  }}
                >
                  <Image
                    source={require("../assets/Untitled.png")}
                    style={{
                      width: 70,
                      height: 70,
                      alignSelf: "center",
                      borderRadius: ispicChanged === true ? 50 : 50,
                      backgroundColor: "#F1C411"
                    }}
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
                    top: 0
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      alignSelf: "center",
                      color: "white"
                    }}
                  >
                    {skillcount}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  bottom: 15,
                  backgroundColor: "white",
                  borderRadius: 25,
                  justifyContent: "center",
                  flexDirection: "row",
                  width: 50,
                  alignSelf: "center"
                }}
              >
                <Text style={{ alignSelf: "center", color: "black" }}>
                  {" "}
                  {average}
                </Text>
                <MaterialIcons
                  name="star"
                  style={{ color: "black", alignSelf: "center" }}
                />
              </View>
              <Text style={{ color: "white", alignSelf: "center", bottom: 10 }}>
                {" "}
                Profile{" "}
              </Text>

              {/* <TouchableOpacity
              onPress={openImagePickerAsync}
              style={{
                position: "absolute",
                top: -5,
                right: 0,
                left: 0,
                backgroundColor: "#F1C411",
                borderRadius: 20,
                width: 23,
                height: 23,
                justifyContent: "center",
              }}
            >
              <Icon
                name="edit-2"
                size={15}
                style={{
                  color: "black",

                  top: 0,

                  alignSelf: "center",
                }}
              />
            </TouchableOpacity> */}
            </WalkthroughableView>
          </CopilotStep>

          <CopilotStep
            text="You can check any pending, upcoming or previous sessions. You can also start a crowd funding group session here."
            order={6}
            name="sessions"
          >
            <WalkthroughableView
              style={{
                flexDirection: "column",
                alignSelf: "center",
                marginTop: 5,
                right: 0
              }}
            >
              <View style={{ width: 60, height: 60, flexDirection: "row" }}>
                <TouchableOpacity
                  onPress={() => {
                    //CODE ADDED BY UDDIPAN
                    // navigation.navigate("TutorSessions");
                    navigation.navigate("TutorSessionsTest");
                    //CODE ADDED BY UDDIPAN
                  }}
                  style={{
                    backgroundColor: "#F1C411",
                    alignSelf: "center",
                    borderRadius: 35,
                    height: 55,
                    width: 55,
                    alignContent: "center",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Image
                    source={require("../assets/laptop.png")}
                    style={{
                      alignSelf: "center",
                      left: 2,
                      width: 40,
                      height: 40
                    }}
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
                    top: 0,
                    marginLeft: 0,
                    right: 0
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      alignSelf: "center",
                      color: "white"
                    }}
                  >
                    {sessionCount}
                  </Text>
                </View>
              </View>
              <Text style={{ color: "white", alignSelf: "center" }}>
                Sessions
              </Text>
            </WalkthroughableView>
          </CopilotStep>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <Card
          containerStyle={{
            shadowColor: "grey",
            shadowOpacity: 0.5,
            shadowOffset: { width: 2, height: 2 },
            top: 20,
            backgroundColor: "white",
            borderColor: "white",
            width: "100%",
            right: 15
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                fontSize: 16,
                color: "black",
                alignSelf: "center",
                fontWeight: "bold",
                bottom: 5
              }}
            >
              Notifications{" "}
            </Text>
            <View style={{ width: 45, height: 45, flexDirection: "row" }}>
              <CopilotStep
                text="All notifications are automatically updated here so make sure to check regularly "
                order={7}
                name="notification"
              >
                <WalkthroughableView>
                  <MaterialIcons
                    name="circle-notifications"
                    size={40}
                    style={{ alignSelf: "flex-start", bottom: 5 }}
                    color={"#F1C411"}
                  />
                </WalkthroughableView>
              </CopilotStep>
              <View
                style={{
                  backgroundColor: "red",
                  width: 18,
                  height: 18,
                  borderRadius: 15,
                  justifyContent: "center",
                  position: "absolute",
                  marginLeft: 0,
                  right: 0,
                  top: -5
                }}
              >
                <Text
                  style={{ fontSize: 12, alignSelf: "center", color: "white" }}
                >
                  {notifications.length}
                </Text>
              </View>
            </View>
            {notifications.length > 0 && (
              <TouchableOpacity onPress={removeNotifications}>
                <MaterialCommunityIcons
                  name="delete-circle"
                  size={40}
                  style={{ alignSelf: "flex-start", bottom: 5 }}
                  color={"#F1C411"}
                />
              </TouchableOpacity>
            )}
          </View>

          <Card.Divider style={{ backgroundColor: "black" }} />
          <View style={{ height: "auto", flexGrow: 1 }}>
            <FlatList //list for notifications! checks the types of notifications and displays icons accordingly
              data={notifications}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => {
                return index.toString();
              }}
              style={{ height: "87%" }}
              renderItem={({ item, i }) => {
                // if (i == notifications.length - ) {
                //   return (
                //     <CopilotStep
                //       text="Most icons have badges indicating the count within each category so make sure to update where needed."
                //       order={8}
                //       name="edit-badges"
                //     >
                //       <WalkthroughableView style={{ flexDirection: "column" }}>
                //         <View
                //           style={{
                //             flexDirection: "row",
                //             width: "auto",
                //             marginRight: 30
                //           }}
                //         >
                //           <View
                //             style={{
                //               alignSelf: "center",
                //               backgroundColor: "#F1C411",
                //               width: 40,
                //               height: 40,
                //               borderRadius: 20,
                //               justifyContent: "center"
                //             }}
                //           >
                //             {item.Type === "CrowdFunding" ? (
                //               <Image
                //                 source={require("../assets/balance.png")}
                //                 style={{
                //                   alignSelf: "center",
                //                   width: 28,
                //                   height: 28,
                //                   resizeMode: "contain"
                //                 }}
                //               />
                //             ) : item.Type === "Bidding" ? (
                //               <MaterialIcons
                //                 name="gavel"
                //                 size={30}
                //                 style={{ alignSelf: "center" }}
                //               />
                //             ) : item.Type === "StartUp" ? (
                //               <View
                //                 style={{
                //                   alignSelf: "center",
                //                   backgroundColor: "#F1C411",
                //                   width: 40,
                //                   height: 40,
                //                   borderRadius: 20,
                //                   justifyContent: "center"
                //                 }}
                //               >
                //                 <Image
                //                   source={{
                //                     uri:
                //                       url != null ? url : props.userData.Photo
                //                   }}
                //                   style={{
                //                     alignSelf: "center",
                //                     top: 0,
                //                     width: 40,
                //                     height: 40,
                //                     borderRadius: 20
                //                   }}
                //                 />
                //               </View>
                //             ) : null}
                //           </View>
                //           <View style={{ flexDirection: "row" }}>
                //             <Text
                //               style={{
                //                 height: "100%",
                //                 width: "90%",
                //                 textAlign: "left",
                //                 marginLeft: 10
                //               }}
                //             >
                //               {typeof item === "string" ? item : item.Message}
                //             </Text>
                //           </View>
                //         </View>
                //         {typeof item !== "string" && (
                //           <TouchableOpacity
                //             onPress={() =>
                //               item.Type === "CrowdFunding"
                //                 ? navigation.navigate("TutorSessions")
                //                 : item.Type === "Bidding"
                //                 ? goToBiddingDetails(item.EventID)
                //                 : item.Type === "StartUp"
                //                 ? navigation.navigate("Profile")
                //                 : console.log("notype")
                //             }
                //             style={{
                //               marginLeft: 50,
                //               borderColor: "#F1C411",
                //               borderWidth: 2,
                //               borderRadius: 10,
                //               justifyContent: "center",
                //               paddingHorizontal: 0,
                //               width: "55%",
                //               bottom: 0
                //             }}
                //           >
                //             {item.Type === "StartUp" ? (
                //               <Text
                //                 style={{
                //                   alignSelf: "center",
                //                   fontWeight: "bold"
                //                 }}
                //               >
                //                 Edit profile.
                //               </Text>
                //             ) : (
                //               <Text
                //                 style={{
                //                   alignSelf: "center",
                //                   fontWeight: "bold"
                //                 }}
                //               >
                //                 Check Details
                //               </Text>
                //             )}
                //           </TouchableOpacity>
                //         )}
                //         <Card.Divider style={{ top: 5 }}></Card.Divider>
                //       </WalkthroughableView>
                //     </CopilotStep>
                //   );
                // } else {
                return (
                  <View style={{ flexDirection: "column" }}>
                    <View
                      style={{
                        flexDirection: "row",
                        width: "auto",
                        marginRight: 30
                      }}
                    >
                      <View
                        style={{
                          alignSelf: "center",
                          backgroundColor: "#F1C411",
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          justifyContent: "center"
                        }}
                      >
                        {item.Type === "CrowdFunding" ? (
                          <Image
                            source={require("../assets/balance.png")}
                            style={{
                              alignSelf: "center",
                              width: 28,
                              height: 28,
                              resizeMode: "contain"
                            }}
                          />
                        ) : item.Type === "Bidding" ? (
                          <MaterialIcons
                            name="gavel"
                            size={30}
                            style={{ alignSelf: "center" }}
                          />
                        ) : item.Type === "StartUp" ? (
                          <View
                            style={{
                              alignSelf: "center",
                              backgroundColor: "#F1C411",
                              width: 40,
                              height: 40,
                              borderRadius: 20,
                              justifyContent: "center"
                            }}
                          >
                            <Image
                              source={{
                                uri: url != null ? url : props.userData.Photo
                              }}
                              style={{
                                alignSelf: "center",
                                top: 0,
                                width: 40,
                                height: 40,
                                borderRadius: 20
                              }}
                            />
                          </View>
                        ) : null}
                      </View>
                      <View style={{ flexDirection: "row" }}>
                        <Text
                          style={{
                            height: "100%",
                            width: "90%",
                            textAlign: "left",
                            marginLeft: 10
                          }}
                        >
                          {typeof item === "string" ? item : item.Message}
                        </Text>
                      </View>
                    </View>
                    {typeof item !== "string" && (
                      <TouchableOpacity
                        onPress={() =>
                          item.Type === "CrowdFunding"
                            ? navigation.navigate("TutorSessions")
                            : item.Type === "Bidding"
                            ? goToBiddingDetails(item.EventID)
                            : item.Type === "StartUp"
                            ? navigation.navigate("Profile")
                            : console.log("notype")
                        }
                        style={{
                          marginLeft: 50,
                          borderColor: "#F1C411",
                          borderWidth: 2,
                          borderRadius: 10,
                          justifyContent: "center",
                          paddingHorizontal: 0,
                          width: "55%",
                          bottom: 0
                        }}
                      >
                        {item.Type === "StartUp" ? (
                          <Text
                            style={{
                              alignSelf: "center",
                              fontWeight: "bold"
                            }}
                          >
                            Edit profile.
                          </Text>
                        ) : (
                          <Text
                            style={{
                              alignSelf: "center",
                              fontWeight: "bold"
                            }}
                          >
                            Check Details
                          </Text>
                        )}
                      </TouchableOpacity>
                    )}
                    <Card.Divider style={{ top: 5 }}></Card.Divider>
                  </View>
                );
              }}
              // }
            />
          </View>
        </Card>
      </View>
    </View>
  );
}

export default copilot({
  animated: true, // Can be true or false
  overlay: "svg", // Can be either view or svg
  verticalOffset: Platform.OS == "android" ? 24 : 0
})(Tutor);
