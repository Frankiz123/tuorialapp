import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Platform
} from "react-native";
import { Card } from "react-native-elements";
import { TextInput } from "react-native-gesture-handler";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Feather";
import moment from "moment";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ToggleSwitch from "toggle-switch-react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { MaterialIcons } from "@expo/vector-icons";
import * as demodata from "../demodata.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import { useLinkProps, useNavigation } from "@react-navigation/native";
import uuid from "uuid";
import LottieView from "lottie-react-native";
import firestore from "@react-native-firebase/firestore";
import SoundPlayer from "react-native-sound-player";
export default function BiddingsProgress(props) {
  const { userData } = props;
  const route = useRoute();
  const { BiddingDetails } = route.params;
  const [played, setplay] = useState("");
  const [meetingID, setMeetingID] = useState("");
  const [meetingPass, setMeetingPass] = useState("");
  const [meetingarr, setArray] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appState, setAppState] = useState("");
  const [tutorsID, settutorsID] = useState([]);
  const [tutorPIC, settutorpic] = useState([]);
  const [biddingID, setbiddingID] = useState(BiddingDetails.BiddingID);
  const [biddingArray, setbiddingArray] = useState([]);
  const [tutorsbid, settutorsbid] = useState([]);
  const [myBid, setmybid] = useState([]);
  const [isbiddingID, setbiddingbool] = useState(false);
  const [goal, setgoal] = useState("");
  const [hoursleft, sethoursleft] = useState("");
  const [isIDFound, setidfound] = useState(false);
  const [isTimeEnd, settimeEnd] = useState(false);
  const [playing, setplaying] = useState(false);
  let starttimer;
  let countdown;
  useEffect(() => {
    getYourBiddingInfo();
    getBiddingInfo();
    countdownTimer();
  }, []);

  function startTimer() {
    countdown = setInterval(countdownTimer, 1000);
  }

  function countdownTimer() {
    let temptimes = BiddingDetails.Timer;
    let mytemptimes = temptimes;
    //mytemptimes = mytemptimes - 1;
    let conversion = secondtoHHMM(mytemptimes);
    sethoursleft(conversion);
  }

  const string = hoursleft.split(",");
  function secondtoHHMM(d) {
    if (d != 0) {
      var date1 = d;
      var date2 = new Date();
      var diffInSeconds = Math.abs(date1 - date2) / 1000;

      var hours = Math.floor((diffInSeconds / 60 / 60) % 24);
      var minutes = Math.floor((diffInSeconds / 60) % 60);
      var seconds = Math.floor(diffInSeconds % 60);
      var hDisplay =
        hours > 0 ? hours + (hours == 1 ? " hour," : " hours,") : "";
      var mDisplay =
        minutes > 0 ? minutes + (minutes == 1 ? " min," : " mins,") : "";
      var sDisplay =
        seconds > 0 ? seconds + (seconds == 1 ? " sec" : " secs") : "";
      if (hours >= 0 && minutes >= 0 && seconds >= 0) {
        return hDisplay + mDisplay + sDisplay;
      } else if (hours === 0 && minutes === 0 && seconds === 0) {
        return null;
      }
    } else {
      var hours = 0;
      var minutes = 0;
      var seconds = 0;
      var hDisplay =
        hours > 0 ? hours + (hours == 1 ? " hour," : " hours,") : "0 hour,";
      var mDisplay =
        minutes > 0 ? minutes + (minutes == 1 ? " min," : " mins,") : "0 min,";
      var sDisplay =
        seconds > 0 ? seconds + (seconds == 1 ? " sec" : " secs") : "0 sec";

      return hDisplay + mDisplay + sDisplay;
    }
  }
  async function getYourBiddingInfo() {
    if (biddingID != null && biddingID.length) {
      await firestore()
        .collection("Bidding")
        .doc(biddingID)
        .onSnapshot((querysnapshot) => {
          let oldbids = querysnapshot.data().Bids;
          if (oldbids != undefined) {
            let newbids = oldbids.filter((e) => e.ID === props.userData.ID);
            let unique = getUnique(newbids, "ID");

            setmybid(unique);
          }
        });
    }
  }
  async function getBiddingInfo() {
    if (biddingID != null && biddingID.length) {
      await firestore()
        .collection("Bidding")
        .doc(biddingID)
        .onSnapshot((querysnapshot) => {
          setbiddingbool(true);
          let oldbids = querysnapshot.data().Bids;
          //if bids array exists
          if (oldbids != undefined) {
            // filter the duplicated bids and only taking the ones with the least values

            let unique = getUnique(oldbids, "ID");
            const minPrice = Math.min(...unique.map(({ Offer }) => Offer));
            console.log("minimum offer", minPrice);
            unique.sort((a, b) => (a.Offer > b.Offer ? 1 : -1));
            // let number = unique.findIndex((e) => e.Offer === minPrice);
            // const movingitem = unique[number];
            // console.log("inde", number);
            // unique.splice(number, 1);
            // unique.splice(0, 0, movingitem);
            settutorsbid(unique);
            //if no bids for other tutors
            if (!unique.length) {
              console.log("no arrays for other tutors");
              let newtutors = BiddingDetails.List;
              getTutorsInfo(newtutors);
            }
          }
          //if bid array doesnt exist, we display general tutors info
          else {
            let newtutors = BiddingDetails.List;
            //let updatedtutors = newtutors.filter((e) => e != props.userData.ID);
            getTutorsInfo(newtutors);
          }
          //console.log("unique", unique);
        });
    }
  }

  //to get general tutors info
  async function getTutorsInfo(updatedtutors) {
    await firestore()
      .collection("Users")
      .where(firestore.FieldPath.documentId(), "in", updatedtutors)
      .onSnapshot((querysnapshot) => {
        const TutorsList = [];
        querysnapshot.forEach((docsnap) => {
          TutorsList.push({ ...docsnap.data(), key: docsnap.id });
        });
        settutorsbid(TutorsList);
      });
  }
  //getting the unique arrays
  function getUnique(arr, index) {
    let updatedarray = arr.reverse();
    const unique = updatedarray
      .map((e) => e[index])

      // store the keys of the unique objects
      .map((e, i, final) => final.indexOf(e) === i && i)

      // eliminate the dead keys & store unique objects
      .filter((e) => arr[e])
      .map((e) => arr[e]);
    return unique;
  }
  async function Bidoffer() {
    let newbid = BiddingDetails.LastBid - 1;
    BiddingDetails.LastBid = newbid;

    //let newbid = biddingArray.LastBid - 1;
    const newBiddingArray = [BiddingDetails];
    firestore()
      .collection("Bidding")
      .doc(BiddingDetails.BiddingID)
      .update({ BiddingInfo: newBiddingArray });
    console.log();
    const biddinglist = [];
    var newBid = [
      {
        Offer: newbid,
        Name: props.userData.Name,
        Photo: props.userData.Photo,
        ID: props.userData.ID
      }
    ];

    console.log("no such obj. creating a new bid");
    firestore()
      .collection("Bidding")
      .doc(BiddingDetails.BiddingID)
      .update({
        Bids: firebase.firestore.FieldValue.arrayUnion(...newBid)
      });

    //console.log("obj now", obj);
  }

  const setPlay = () => {
    if (playing) {
      try {
        SoundPlayer.playUrl(BiddingDetails.fileUrlRec);
        SoundPlayer.onFinishedPlaying(() => {
          console.log("END");
          setplaying(false);
        });
        setplaying(!playing);
      } catch (e) {
        console.log(`cannot play the sound file`, e);
      }
    } else {
      try {
        SoundPlayer.pause();
        setplaying(!playing);
      } catch (e) {
        console.log(`cannot play the sound file`, e);
      }
    }
  };
  return (
    <SafeAreaView>
      <Image
        source={require("../assets/biddingBG.png")}
        style={{
          width: "100%",
          height: "110%",
          zIndex: 0,
          resizeMode: "cover",
          position: "absolute"
        }}
      />
      <View
        style={{
          zIndex: 1,
          width: "100%",
          height: "100%"
        }}
      >
        <View style={{ flexDirection: "row", height: "20%" }}>
          <FlatList
            data={tutorsbid}
            horizontal={true}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{
              flexGrow: 1,
              flexDirection: "row",
              justifyContent: "space-around",

              width: Dimensions.get("screen").width / 4
            }}
            style={{
              height: "auto"
            }}
            renderItem={({ item, index }) => {
              return (
                <View style={{ width: Dimensions.get("screen").width / 3 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignSelf: "center"
                    }}
                  >
                    <View style={{ flexDirection: "column" }}>
                      {index === 0 ? (
                        <LottieView
                          ref={(animation) => {
                            setplay(animation);
                          }}
                          autoPlay={true}
                          style={{
                            width: 100,
                            height: 100,
                            alignSelf: "center",
                            marginTop: Platform.OS === "android" ? -9 : -3,
                            position: "absolute"
                          }}
                          source={require("../assets/focus.json")}
                          loop={true}
                        />
                      ) : null}
                      <Image
                        source={{ uri: item.Photo }}
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 30,
                          alignSelf: "center",
                          zIndex: 1,
                          top: 10
                        }}
                      />
                      {item.Offer != null ? (
                        <View
                          style={{
                            backgroundColor: "#7a0000",
                            width: 50,
                            height: 20,
                            borderRadius: 10,
                            bottom: 5,
                            zIndex: 1,
                            alignSelf: "center",
                            justifyContent: "center"
                          }}
                        >
                          <Text
                            style={{
                              alignSelf: "center",
                              color: "white",
                              fontWeight: "bold"
                            }}
                          >
                            ${item.Offer}
                          </Text>
                        </View>
                      ) : (
                        <View
                          style={{
                            backgroundColor: "white",
                            width: 50,
                            height: 20,
                            borderRadius: 10,
                            bottom: 5,
                            zIndex: 1,
                            alignSelf: "center",
                            justifyContent: "center"
                          }}
                        >
                          <Text
                            style={{
                              alignSelf: "center",
                              color: "black",
                              fontWeight: "bold"
                            }}
                          >
                            ${BiddingDetails.Goal}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              );
            }}
          />
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: "#7a0000",
            width: "50%",
            paddingHorizontal: 30,
            height: 30,
            borderRadius: 5,
            left: 10,
            justifyContent: "center",
            bottom: 20
          }}
        >
          <Text style={{ alignSelf: "center", color: "white" }}>
            View Details
          </Text>
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 16,
            left: 50,
            fontWeight: "bold",

            bottom: 15
          }}
        >
          Minimum Bid
        </Text>
        <View>
          <View
            style={{
              width: 100,
              height: 50,
              borderRadius: 10,
              left: 50,
              bottom: 5,
              backgroundColor: "#F1C411",

              justifyContent: "center"
            }}
          >
            <Text
              style={{ fontSize: 16, alignSelf: "center", fontWeight: "bold" }}
            >
              {BiddingDetails.LastBid}$
            </Text>
          </View>
        </View>
        <View
          style={{
            justifyContent: "center",
            width: 250,
            left: -5
          }}
        >
          <Card
            containerStyle={{
              borderRadius: 25,
              width: "90%",
              backgroundColor: "#101820FF",
              borderColor: "#101820FF",
              paddingBottom: 40
            }}
          >
            <View
              style={{
                flexDirection: "column",
                alignSelf: "center",
                left: 0
              }}
            >
              <Image
                source={{ uri: BiddingDetails.StudentPic }}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 10,
                  alignSelf: "center"
                }}
              />
              <Text style={{ color: "white", fontSize: 14 }}>
                {BiddingDetails.StudentName}
              </Text>
            </View>
            <Text
              style={{
                fontWeight: "bold",
                alignSelf: "center",
                color: "white",
                fontSize: 17
              }}
            >
              {" "}
              {BiddingDetails.Topic}{" "}
            </Text>

            <View style={{ flexDirection: "row" }}>
              <View style={{ flexDirection: "column" }}>
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    top: 20
                  }}
                >
                  Category: {BiddingDetails.Category}{" "}
                </Text>
                <Text
                  style={{
                    color: "white",
                    top: 20
                  }}
                >
                  {BiddingDetails.Type}{" "}
                </Text>
                <Text
                  style={{
                    color: "white",
                    top: 20
                  }}
                >
                  Bidding starting at: {BiddingDetails.Goal}$/hr.{" "}
                </Text>

                <Text
                  style={{
                    color: "white",
                    top: 20
                  }}
                >
                  Delivery Days:{" "}
                  {BiddingDetails?.expectedDeliveryDate
                    ? BiddingDetails?.expectedDeliveryDate
                    : "N/A"}
                </Text>
                <Text
                  style={{
                    color: "white",
                    top: 20
                  }}
                >
                  No. of Video Sessions:{" "}
                  {BiddingDetails?.noOfVideo
                    ? BiddingDetails?.noOfVideo
                    : "N/A"}
                </Text>

                {BiddingDetails.fileUrl != "" && (
                  <View style={{ flexDirection: "row", top: 20 }}>
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "400",
                        fontStyle: "italic",
                        alignSelf: "center"
                      }}
                    >
                      Document
                    </Text>
                    <TouchableOpacity
                      style={{
                        width: 25,
                        height: 25,
                        backgroundColor: "#F1C411",
                        justifyContent: "center",
                        borderRadius: 20,
                        left: 5
                      }}
                    >
                      <MaterialIcons
                        name="file-download"
                        size={15}
                        style={{ alignSelf: "center" }}
                      />
                    </TouchableOpacity>
                  </View>
                )}
                {BiddingDetails.Timer != 0 ? (
                  <Text style={{ color: "#F1C411", width: 200, top: 20 }}>
                    Rittee's maximum budget has not been reached yet.
                  </Text>
                ) : (
                  <Text style={{ color: "white", top: 20 }}>
                    Rittee's maximum budget has been reached.
                  </Text>
                )}

                {BiddingDetails.fileUrlRec != "" && (
                  <View style={{ flexDirection: "row", top: 20 }}>
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "400",
                        fontStyle: "italic",
                        alignSelf: "center"
                      }}
                    >
                      Play Recording
                    </Text>

                    <TouchableOpacity
                      style={{
                        width: 25,
                        height: 25,
                        backgroundColor: "#F1C411",
                        justifyContent: "center",
                        borderRadius: 20,
                        left: 5
                      }}
                      onPress={setPlay}
                    >
                      <MaterialIcons
                        name={!playing ? "play-arrow" : "pause"}
                        size={15}
                        style={{ alignSelf: "center" }}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </Card>
        </View>
      </View>
      <View
        style={{
          zIndex: 1,
          position: "absolute",
          justifyContent: "center",
          top: "40%",
          width: "5%",
          height: "10%",
          right: "40%",
          alignSelf: "flex-end"
        }}
      >
        <View
          style={{
            flexDirection: "row",
            left: 10,
            width: 40
          }}
        >
          {string.map((item, i) => {
            const divided = item.split(" ");

            return (
              <View
                key={i}
                style={{
                  flexDirection: "row",
                  width: 48,
                  height: 50,
                  alignSelf: "center",
                  paddingHorizontal: 0,
                  top: 20
                }}
              >
                <Card
                  style={{ height: 30, width: 50 }}
                  containerStyle={{
                    backgroundColor: "white",
                    borderColor: "white",
                    width: 50,
                    height: 45,
                    borderRadius: 10,
                    justifyContent: "center",
                    alignSelf: "center"
                  }}
                >
                  <Text
                    style={{
                      alignSelf: "center",
                      color: "black",
                      top: 0,
                      bottom: 15,
                      width: "auto"
                    }}
                  >
                    {divided[0]}
                  </Text>
                </Card>
              </View>
            );
          })}
        </View>
        <View
          style={{
            flexDirection: "row",
            left: 28,
            top: 28
          }}
        >
          {string.map((item, i) => {
            const dividedstring = item.split(" ");

            return (
              <View
                key={i}
                style={{
                  width: 46,
                  alignSelf: "center"
                }}
              >
                <View
                  style={{
                    width: "auto",
                    height: 25,

                    backgroundColor: "white",

                    justifyContent: "center"
                  }}
                >
                  <Text
                    style={{
                      color: "black",
                      flexDirection: "row",
                      right: 2,
                      textAlign: "center",
                      width: "auto"
                    }}
                  >
                    {dividedstring[1]}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      <Image
        source={require("../assets/podium.png")}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          zIndex: 0,
          alignSelf: "flex-end",
          left: 105,
          top: 55,
          resizeMode: "contain"
        }}
      />
    </SafeAreaView>
  );
}
