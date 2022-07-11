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
  Animated,
  Platform,
  Pressable,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Card, ListItem, Button, List } from "react-native-elements";
import { AntDesign } from "@expo/vector-icons";
import { useLinkProps, useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import LottieView from "lottie-react-native";
import * as Notifications from "expo-notifications";
import Icon from "react-native-vector-icons/Feather";
import { MaterialIcons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import Modal from "react-native-modal";
import firestore from "@react-native-firebase/firestore";

import RewardsRules from '../rewardsRules/RewardsRules';

import SendNotification from "../utils/SendNotification";
import SendEmail from "../utils/SendEmail";
import GetEmailTemplate from "../utils/GetEmailTemplate";

const Tab = createMaterialTopTabNavigator();
export default function Rewards(props) {
  const navigation = useNavigation();
  const { userData } = props;
  const [visibilityRules, setVisibilityRules] = useState(false);
  const [ishour, sethour] = useState(false);
  const [toggleWallet, settogglewallet] = useState(false);
  const [toggleHour, setToggleHour] = useState(false);
  const [toggleRewards, setToggleRewards] = useState(true);
  const [rate, setrate] = useState("");
  const [height, setheight] = useState("");
  const [usertype, setusertype] = useState("");
  const [rewardsArray, setRewards] = useState([]);
  const [isMounted, setMounted] = useState(true);
  const [play, setplay] = useState(false);
  const [isEndorsed, setEndorsed] = useState(false);
  const [hoursRewards, setrewards] = useState([]);
  const [tuteepics, settuteepics] = useState([]);
  const [ishoursreset, sethoursreset] = useState(false);
  const [endorsementCount, setendorsementcount] = useState(0);
  let difference;
  const [endorsedreward, setendorsedreward] = useState(0);
  const [endorsedObject, setendoresedObject] = useState([]);
  const [hourrewardcound, sethourreward] = useState(0);
  const [totalCount, settotalreward] = useState(0);
  const [totalRewardCount, settotalRewardCount] = useState(0);
  const [isGoalReached, setgoalreached] = useState(false);
  const [isCashPopUp, setpopupbool] = useState(false);
  const [rewardsleft, setrewardsleft] = useState(0);
  const [totalbalance, settotalbalance] = useState("");
  const [updatedbalance, setupdatedbalance] = useState(0);
  const [isNoReward, setNoReward] = useState(0);
  const [isRewardsReached, setrewardsreached] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [isWithdrawlModalOpen, setWithdrawlModalOpen] = useState(false);
  const list = [];
  const [ishours, sethoursbool] = useState(false);
  let animation = useRef(new Animated.Value(0)).current;
  let animation2 = useRef(new Animated.Value(0)).current;
  let overallanimation = useRef(new Animated.Value(0)).current;
  let totalreward;
  let animatingwidth;

  useEffect(() => {
    if (isMounted) {
      firestore()
        .collection("Users")
        .doc(props.userData.ID)
        .onSnapshot((querysnapshot) => {
          settotalbalance(querysnapshot.data().Balance);
          setendorsementcount(querysnapshot.data().EndorsementCount);
          settotalRewardCount(querysnapshot.data().RewardCount);
          setendorsedreward(querysnapshot.data().EndorsedReward);
          setUserInfo(querysnapshot.data());
        });
    }
  }, []);
  const handleWithdrawRewards = () => {
    if (userInfo.RewardCount >= 100) {
      let totalAmount = (5 / 100) * userInfo.RewardCount;
      firestore()
        .collection("Users")
        .doc(props.userData.ID)
        .update({
          RewardCount: 0,
          Balance: firestore.FieldValue.increment(totalAmount),
        });
      SendNotification(
        `Reward worth $${totalAmount} succesfully added to your wallet!`,
        [props.userData.ID]
      );

      let emailBody = GetEmailTemplate({title: `Congratulation! Your reward withdrawal is successfully processed by our system.`, subtitle: `Hi ${userInfo?.Name}, Your reward worth $${totalAmount} succesfully added to your wallet!`, content: `You can cash out your wallet balance from Tutoritto app using PayPal or Western Union!`})

      SendEmail(
        userInfo.Email,
        "Reward withdrawal successful",
        emailBody
      );
    }
  };
  // useEffect(() => {
  //   firebase
  //     .firestore()
  //     .collection("Rewards")
  //     .doc(userData.ID)
  //     .onSnapshot((querysnapshot) => {
  //       if (querysnapshot.exists) {
  //         setNoReward(false);
  //         list.push(querysnapshot.data());
  //         settotalRewardCount(querysnapshot.data().TotalRewards);
  //         if (totalRewardCount <= 100) {
  //           setgoalreached(false);
  //           difference =
  //             querysnapshot.data().Goal - querysnapshot.data().TotalRewards;
  //           console.log("difference", difference);
  //           setrewardsleft(difference);
  //           const progress =
  //             (querysnapshot.data().TotalRewards / querysnapshot.data().Goal) *
  //             100;
  //           Animated.timing(overallanimation, {
  //             toValue: progress,
  //             duration: 100,
  //           }).start();
  //         }
  //         if (totalRewardCount === 100) {
  //           setgoalreached(true);
  //           var balancenumber = parseInt(totalbalance);
  //           console.log("total balance", totalbalance);
  //           setupdatedbalance(balancenumber + 10);
  //           console.log("updated balanace", updatedbalance, totalbalance);
  //           firebase
  //             .firestore()
  //             .collection("Users")
  //             .doc(props.userData.ID)
  //             .update({ Balance: updatedbalance });
  //         }
  //         firebase
  //           .firestore()
  //           .collection("Rewards")
  //           .doc(props.userData.ID)
  //           .update({ TotalRewards: 0 });
  //         var obj;
  //         for (var i = 0; i < list.length; i++) {
  //           var dataset = list[i].Rewards;
  //           console.log("data ", dataset, "object", Object.values(dataset));
  //           obj = Object.values(dataset);
  //           console.log("new obj", obj);
  //         }
  //         if (obj !== undefined) {
  //           obj.forEach((snapshot) => {
  //             if (snapshot.Reward === "Endorsement") {
  //               console.log("that reward is endorsement reward", snapshot);
  //               setEndorsed(true);
  //               setendorsedreward(snapshot.RewardPoint);
  //               setendoresedObject(snapshot);
  //               const Progress = (snapshot.Accessed / snapshot.Goal) * 100;
  //               Animated.timing(animation2, {
  //                 toValue: Progress,
  //                 duration: 100,
  //               }).start();
  //             }
  //             if (snapshot.Reward === "Hours") {
  //               setrewards(snapshot);
  //               sethourreward(snapshot.RewardPoint);
  //               sethoursbool(true);
  //               console.log(snapshot);
  //               const Progress = (snapshot.Accessed / snapshot.Goal) * 100;
  //               if (Progress === 100) {
  //                 snapshot.Accessed = 0;
  //                 console.log("snapshot", snapshot);
  //                 sethoursreset(true);
  //               }
  //               Animated.timing(animation, {
  //                 toValue: Progress,
  //                 duration: 100,
  //               }).start();

  //               console.log("what is this", animation, Progress);
  //             }
  //             console.log("new snapshot", snapshot);

  //             // firebase.firestore().collection('Rewards').doc(props.userData.ID).
  //           });
  //         }

  //         if (isMounted === true && ishoursreset === true) {
  //           firebase
  //             .firestore()
  //             .collection("Rewards")
  //             .doc(props.userData.ID)
  //             .update({ Rewards: obj });
  //           sethoursreset(false);
  //         }
  //         totalreward = parseInt(endorsedreward) + parseInt(hourrewardcound);
  //         settotalreward(totalreward);
  //         setRewards(list);
  //       } else {
  //         setNoReward(true);
  //       }
  //     });
  // }, []);

  // useEffect(() => {
  //   if (isMounted && isEndorsed === true) {
  //     console.log("is endorsed true");
  //     const Endorsedlist = [];

  //     firebase
  //       .firestore()
  //       .collection("Users")
  //       .doc(props.userData.ID)
  //       .onSnapshot((querysnapshot) => {
  //         Endorsedlist.push(querysnapshot.data().Endorsements);
  //         var obj;
  //         for (var i = 0; i < Endorsedlist.length; i++) {
  //           var dataset = Endorsedlist[i];
  //           obj = Object.values(dataset);
  //         }
  //         settuteepics(obj);

  //         setEndorsed(false);
  //       });
  //   }
  // }, [isEndorsed]);
  return (
    <View style={{minHeight: Dimensions.get("screen").height - 300}}>
      <Card
        containerStyle={{
          width: "90%",
          alignSelf: "center",
          borderRadius: 10,
          shadowOffset: { width: 0, height: 2 },
          shadowColor: "black",
          shadowRadius: 2,
          shadowOpacity: 0.5,
          backgroundColor: "#7a0000",
          borderColor: "#F1C411",
          borderWidth: 2,
          position: "relative",
        }}
      >
        <Pressable
          onPress={() => setVisibilityRules(true)}
          style={{
            width: 20,
            height: 20,
            backgroundColor: "#F1C411",
            borderRadius: 20,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: '90%',
            marginBottom: -15,
            elevation: 5
          }}
        >
          <Text>?</Text>
        </Pressable>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 20,

            color: "white",
            alignSelf: "center",
          }}
        >
          Rewards
        </Text>
        

        <Image
          source={require("../assets/crowdfunding.png")}
          style={{
            width: "100%",
            height: 150,
            marginBottom: -65,
          }}
          resizeMode="contain"
        />

        <View
          style={{
            width: 60,
            height: 60,
            flexDirection: "row",
            alignSelf: "flex-start",
            left: 70,
          }}
        >
          <View
            style={{
              backgroundColor: "red",
              width: "auto",
              height: 20,
              borderRadius: 15,
              justifyContent: "center",
              position: "absolute",

              right: -43,
              zIndex: 1,
              top: 0,
              padding: 5,
            }}
          >
            <Text style={{ fontSize: 14, alignSelf: "center", color: "white" }}>
              {totalRewardCount}
            </Text>
          </View>
          <LottieView
            ref={(animation) => {
              setplay(animation);
            }}
            autoPlay={true}
            style={{
              width: "auto",
              height: 150,
              alignSelf: "center",

              position: "absolute",
            }}
            source={require("../assets/treasureCHEST.json")}
            loop={false}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            setWithdrawlModalOpen(true);
            handleWithdrawRewards();
          }}
          style={{
            backgroundColor: "#F1C411",
            width: "100%",
            height: 30,
            borderRadius: 5,
            justifyContent: "center",
            marginBottom: 15,
            alignSelf: "flex-start",
            top: 10,
          }}
        >
          <Text style={{ alignSelf: "center", fontWeight: "bold" }}>
            Convert to Cash
          </Text>
        </TouchableOpacity>
      </Card>

      <Card
        containerStyle={{
          width: "95%",
          alignSelf: "center",
          borderRadius: 10,
          shadowOffset: { width: 0, height: 2 },
          shadowColor: "black",
          shadowRadius: 2,
          shadowOpacity: 0.5,
          backgroundColor: "#101820FF",
          borderColor: "#101820FF",
          borderWidth: 2,
        }}
      >
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <View
            style={{
              width: "49%",
              padding: 10,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRightWidth: 1,
              borderColor: "#fff",
            }}
          >
            <Text style={{ color: "white" }}>Packages</Text>
            {/* progressbar */}
            <View
              style={{
                flexDirection: "row",
                alignSelf: "center",
                width: "70%",
                marginTop: 10,
                position: "relative",
              }}
            >
              <View
                style={{
                  height: 30,
                  width: "100%",
                  backgroundColor: "white",
                  borderColor: "black",
                  borderWidth: 0.5,
                  borderRadius: 3,
                  flexDirection: "row",
                }}
              >
                <Animated.View
                  style={
                    ([StyleSheet.absoluteFill],
                    {
                      backgroundColor: "#F1C411",
                      marginLeft: 0,
                      borderRadius: 3,
                      width: animation.interpolate({
                        inputRange: [0, 100],
                        outputRange: ["10%", "100%"],
                        extrapolate: "clamp",
                      }),
                    })
                  }
                />
              </View>
              <View
                style={{
                  width: 30,
                  height: 30,
                  backgroundColor: "#7a0000",
                  borderRadius: 15,
                  alignSelf: "center",
                  justifyContent: "center",
                  position: "absolute",
                  left: -18,
                  top: 0,
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  0
                </Text>
              </View>
            </View>
            {/* progressbar */}
          </View>
          <View
            style={{
              width: "49%",
              padding: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white" }}>Hours</Text>
            {/* progressbar */}
            <View
              style={{
                flexDirection: "row",
                alignSelf: "center",
                width: "70%",
                marginTop: 10,
                position: "relative",
              }}
            >
              <View
                style={{
                  height: 30,
                  width: "100%",
                  backgroundColor: "white",
                  borderColor: "black",
                  borderWidth: 0.5,
                  borderRadius: 3,
                  flexDirection: "row",
                }}
              >
                <Animated.View
                  style={
                    ([StyleSheet.absoluteFill],
                    {
                      backgroundColor: "#F1C411",
                      marginLeft: 0,
                      borderRadius: 3,
                      width: animation.interpolate({
                        inputRange: [0, 100],
                        outputRange: ["10%", "100%"],
                        extrapolate: "clamp",
                      }),
                    })
                  }
                />
              </View>
              <View
                style={{
                  width: 30,
                  height: 30,
                  backgroundColor: "#7a0000",
                  borderRadius: 15,
                  alignSelf: "center",
                  justifyContent: "center",
                  position: "absolute",
                  left: -18,
                  top: 0,
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  0
                </Text>
              </View>
            </View>
            {/* progressbar */}
          </View>
        </View>
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            marginTop: 15,
          }}
        >
          <View
            style={{
              width: "49%",
              padding: 10,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRightWidth: 1,
              borderColor: "#fff",
            }}
          >
            <Text style={{ color: "white" }}>Referrals</Text>
            {/* progressbar */}
            <View
              style={{
                flexDirection: "row",
                alignSelf: "center",
                width: "70%",
                marginTop: 10,
                position: "relative",
              }}
            >
              <View
                style={{
                  height: 30,
                  width: "100%",
                  backgroundColor: "white",
                  borderColor: "black",
                  borderWidth: 0.5,
                  borderRadius: 3,
                  flexDirection: "row",
                }}
              >
                <Animated.View
                  style={
                    ([StyleSheet.absoluteFill],
                    {
                      backgroundColor: "#F1C411",
                      marginLeft: 0,
                      borderRadius: 3,
                      width: animation.interpolate({
                        inputRange: [0, 100],
                        outputRange: [
                          typeof userInfo?.referralReward === "number"
                            ? `${userInfo.referralReward * 20}%`
                            : "0%",
                          "100%",
                        ],
                        extrapolate: "clamp",
                      }),
                    })
                  }
                />
              </View>
              <View
                style={{
                  width: 30,
                  height: 30,
                  backgroundColor: "#7a0000",
                  borderRadius: 15,
                  alignSelf: "center",
                  justifyContent: "center",
                  position: "absolute",
                  left: -18,
                  top: 0,
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  {typeof userInfo?.referralReward === "number"
                    ? userInfo.referralReward
                    : 0}
                </Text>
              </View>
            </View>
            {/* progressbar */}
          </View>
          <View
            style={{
              width: "49%",
              padding: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white" }}>Talents</Text>
            {/* progressbar */}
            <View
              style={{
                flexDirection: "row",
                alignSelf: "center",
                width: "70%",
                marginTop: 10,
                position: "relative",
              }}
            >
              <View
                style={{
                  height: 30,
                  width: "100%",
                  backgroundColor: "white",
                  borderColor: "black",
                  borderWidth: 0.5,
                  borderRadius: 3,
                  flexDirection: "row",
                }}
              >
                <Animated.View
                  style={
                    ([StyleSheet.absoluteFill],
                    {
                      backgroundColor: "#F1C411",
                      marginLeft: 0,
                      borderRadius: 3,
                      width: animation.interpolate({
                        inputRange: [0, 100],
                        outputRange: [
                          typeof userInfo?.EndorsedReward === "number"
                            ? `${userInfo.EndorsedReward * 20}%`
                            : "0%",
                          "100%",
                        ],
                        extrapolate: "clamp",
                      }),
                    })
                  }
                />
              </View>
              <View
                style={{
                  width: 30,
                  height: 30,
                  backgroundColor: "#7a0000",
                  borderRadius: 15,
                  alignSelf: "center",
                  justifyContent: "center",
                  position: "absolute",
                  left: -18,
                  top: 0,
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  {typeof userInfo?.EndorsedReward === "number"
                    ? userInfo.EndorsedReward
                    : 0}
                </Text>
              </View>
            </View>
            {/* progressbar */}
          </View>
        </View>
        {/* <View
          style={{
            borderWidth: 1,
            width: 0,
            height: "100%",
            left: "30%",
            top: Platform.OS === "android" ? -10 : -13,
            borderColor: "white",
            position: "absolute",
          }}
        ></View> */}
        {/* <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "column" }}>
            <Text style={{ color: "white", left: 15 }}>Referrals</Text>
            <View
              style={{
                flexDirection: "row",
                left: 67,
                alignSelf: "center",
                bottom: 10,
              }}
            >
              <View
                style={{
                  height: 30,
                  marginLeft: -15,
                  width: "150%",
                  backgroundColor: "white",
                  borderColor: "black",
                  borderWidth: 0.5,
                  position: "absolute",
                  borderRadius: 3,
                  flexDirection: "row",
                  top: 40,
                  right: Platform.OS === "android" ? -0 : 0,
                }}
              >
                <Animated.View
                  style={
                    ([StyleSheet.absoluteFill],
                    {
                      backgroundColor: "#F1C411",
                      marginLeft: 0,
                      borderRadius: 3,
                      width: animation.interpolate({
                        inputRange: [0, 100],
                        outputRange: ["50%", "100%"],
                        extrapolate: "clamp",
                      }),
                    })
                  }
                />
                <View
                  style={{
                    width: 30,
                    height: 30,
                    backgroundColor: "#7a0000",
                    left: -15,
                    borderRadius: 15,
                    alignSelf: "center",
                    position: "absolute",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      alignSelf: "center",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    0
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={{ flexDirection: "column" }}>
            <Text
              style={{
                color: "white",
                paddingRight: 1,
              }}
            >
              Hours
            </Text>

            <View
              style={{
                flexDirection: "row",
                left: 30,
                alignSelf: "center",
                bottom: 10,
              }}
            >
              <View
                style={{
                  height: 30,
                  width: "235%",
                  backgroundColor: "white",
                  borderColor: "black",
                  borderWidth: 0.5,
                  position: "absolute",
                  borderRadius: 3,
                  flexDirection: "row",
                  top: 40,
                  right: Platform.OS === "android" ? -15 : 0,
                  // overflow: 'hidden',
                }}
              >
                <Animated.View
                  style={
                    ([StyleSheet.absoluteFill],
                    {
                      backgroundColor: "#F1C411",
                      marginLeft: 0,
                      borderRadius: 3,
                      width: animation.interpolate({
                        inputRange: [0, 100],
                        outputRange: ["90%", "100%"],
                        extrapolate: "clamp",
                      }),
                    })
                  }
                />
                <View
                  style={{
                    width: 30,
                    height: 30,
                    backgroundColor: "#7a0000",
                    left: -15,
                    borderRadius: 15,
                    alignSelf: "center",
                    position: "absolute",
                    justifyContent: "center",
                  }}
                >
                  {hoursRewards.Accessed === undefined ? (
                    <Text
                      style={{
                        alignSelf: "center",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      0
                    </Text>
                  ) : (
                    <Text
                      style={{
                        alignSelf: "center",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      {hoursRewards.Accessed}
                    </Text>
                  )}
                </View>

                {hoursRewards.Accessed != undefined ? (
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 14,
                      alignSelf: "center",
                      left: 52,
                      position: "absolute",
                    }}
                  >
                    {hoursRewards.Accessed}/{hoursRewards.Goal}
                  </Text>
                ) : null}
              </View>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "column" }}>
            <Text style={{ color: "white", right: 20 }}>Talents</Text>
            <View style={{ flexDirection: "row", left: 10, bottom: 10 }}>
              <View
                style={{
                  height: 30,
                  width: Platform.OS === "android" ? "200%" : "200%",
                  backgroundColor: "white",
                  borderColor: "black",
                  borderWidth: 0.5,
                  position: "absolute",
                  borderRadius: 3,
                  flexDirection: "row",
                  top: 40,
                  right: Platform.OS === "android" ? 0 : 0,
                }}
              >
                <Animated.View
                  style={
                    ([StyleSheet.absoluteFill],
                    {
                      backgroundColor: "#F1C411",
                      marginLeft: 0,
                      borderRadius: 3,
                      width: animation.interpolate({
                        inputRange: [0, 100],
                        outputRange: ["30%", "100%"],
                        extrapolate: "clamp",
                      }),
                    })
                  }
                />
                <View
                  style={{
                    width: 30,
                    height: 30,
                    backgroundColor: "#7a0000",
                    right: 65,
                    borderRadius: 15,
                    alignSelf: "center",
                    position: "absolute",
                    justifyContent: "center",
                    left: -15,
                  }}
                >
                  {endorsedObject.Accessed === undefined ? (
                    <Text
                      style={{
                        alignSelf: "center",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      0
                    </Text>
                  ) : (
                    <Text
                      style={{
                        alignSelf: "center",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      {endorsedObject.Accessed}
                    </Text>
                  )}
                </View>
                {endorsedObject.Accessed != undefined ? (
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 14,
                      alignSelf: "center",
                      left: 54,
                      position: "absolute",
                    }}
                  >
                    {endorsedObject.Accessed}/{endorsedObject.Goal}
                  </Text>
                ) : null}
              </View>
            </View>
          </View>
        </View> */}
        {/* <View
          style={{
            borderWidth: 1,
            width: 0,
            height: "100%",
            bottom: 28,
            backgroundColor: "white",
            borderColor: "white",
            left: Platform.OS === "android" ? "68%" : 240,
          }}
        ></View> */}
      </Card>
      {isNoReward === false ? (
        <View style={{ height: "100%" }}>
          <Card
            containerStyle={{
              width: "99%",
              alignSelf: "center",
              borderRadius: 10,
              height: "8.5%",
              shadowOffset: { width: 0, height: 2 },
              shadowColor: "black",
              shadowRadius: 2,
              shadowOpacity: 0.5,
              backgroundColor: "#101820FF",
              borderColor: "#101820FF",
              borderWidth: 2,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 15,
                alignSelf: "center",
                fontWeight: "bold",
              }}
            >
              Endorsements
            </Text>
            <View
              style={{
                flexDirection: "row",
                width: "auto",
              }}
            >
              <View
                style={{
                  backgroundColor: "#F1C411",
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  alignSelf: "center",
                  top: 10,
                  justifyContent: "center",
                  flexDirection: "row",
                }}
              >
                <Image
                  source={require("../assets/medal.png")}
                  style={{ alignSelf: "center", width: 40, height: 40 }}
                />
              </View>
              <View
                style={{
                  backgroundColor: "red",
                  width: 25,
                  height: 25,
                  borderRadius: 15,
                  justifyContent: "center",
                  position: "absolute",
                  left: 40,
                  top: 0,
                }}
              >
                <Text
                  style={{ fontSize: 14, alignSelf: "center", color: "white" }}
                >
                  {endorsementCount}
                </Text>
              </View>
              <View
                style={{
                  width: Dimensions.get("screen").width / 5,
                  flexDirection: "row",
                }}
              >
                {tuteepics.map((item, i) => {
                  return (
                    <View
                      key={i}
                      style={{
                        flexDirection: "column",
                        marginLeft: 15,
                        top: 20,
                        left: 0,
                      }}
                    >
                      <Image
                        source={{ uri: item.TuteePic }}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 20,
                          right: 4,
                        }}
                      />
                      <Text
                        style={{
                          color: "white",
                          textAlign: "left",
                          right: 5,
                          fontSize: 12.5,
                        }}
                      >
                        {item.TuteeName}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </Card>
          <Card
            containerStyle={{
              width: "99%",
              alignSelf: "center",
              borderRadius: 10,
              height: "8.5%",
              shadowOffset: { width: 0, height: 2 },
              shadowColor: "black",
              shadowRadius: 2,
              shadowOpacity: 0.5,
              backgroundColor: "#101820FF",
              borderColor: "#101820FF",
              borderWidth: 2,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 15,
                alignSelf: "center",
                fontWeight: "bold",
              }}
            >
              Hours
            </Text>
            <View style={{ flexDirection: "row", width: "auto" }}>
              <View
                style={{
                  backgroundColor: "#F1C411",
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  alignSelf: "center",
                  top: 10,
                  justifyContent: "center",
                  flexDirection: "row",
                }}
              >
                <Image
                  source={require("../assets/medal.png")}
                  style={{ alignSelf: "center", width: 40, height: 40 }}
                />
              </View>
              <View
                style={{
                  backgroundColor: "red",
                  width: 25,
                  height: 25,
                  borderRadius: 15,
                  justifyContent: "center",
                  position: "absolute",
                  left: 40,
                  top: 0,
                }}
              >
                <Text
                  style={{ fontSize: 14, alignSelf: "center", color: "white" }}
                >
                  5
                </Text>
              </View>
              <Text
                style={{
                  color: "white",
                  fontSize: 14,
                  width: "80%",
                  alignSelf: "center",
                  left: 8,
                  top: 12,
                }}
              >
                Congratulations! You completed 50 hours on Tutoritto and earned
                5 reward points.
              </Text>
            </View>
          </Card>
        </View>
      ) : null}
      <Modal isVisible={isWithdrawlModalOpen}>
        <View
          style={{
            backgroundColor: "#333939",
            width: "110%",
            alignSelf: "center",
            borderRadius: 10,
          }}
        >
          {userInfo.RewardCount < 100 ? (
            <Entypo
              name={"warning"}
              size={30}
              color={"#F1C411"}
              style={{ alignSelf: "center", margin: 15 }}
            />
          ) : (
            <Entypo
              name={"check"}
              size={30}
              color={"green"}
              style={{ alignSelf: "center", margin: 15 }}
            />
          )}
          <Pressable
            onPress={() => setWithdrawlModalOpen(false)}
            style={{ position: "absolute", top: 10, right: 10 }}
          >
            <Entypo name={"cross"} size={25} color={"#F1C411"} />
          </Pressable>
          {userInfo.RewardCount < 100 ? (
            <Text
              style={{
                padding: 15,
                textAlign: "center",
                color: "#fff",
                lineHeight: 20,
                letterSpacing: 1.2,
                marginBottom: 50,
              }}
            >
              {100 - userInfo.RewardCount} more reward points to go until you
              can convert them to cash
            </Text>
          ) : (
            <Text
              style={{
                padding: 15,
                textAlign: "center",
                color: "#fff",
                lineHeight: 20,
                letterSpacing: 1.2,
                marginBottom: 50,
              }}
            >
              Congratulations! Youve reached your goal and converted your
              rewards to cash{" "}
            </Text>
          )}
        </View>
      </Modal>
      <RewardsRules
        visible={visibilityRules}
        onClose={() => setVisibilityRules(false)}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    top: 0,
    height: 240,
    width: "100%",
    backgroundColor: "#8dc6ff",
    alignItems: "center",
    justifyContent: "center",
  },
});
