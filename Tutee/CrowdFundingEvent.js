import React, { useContext, useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Alert,
  Platform,
  Animated,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { SearchBar, Card } from "react-native-elements";
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
import StarRating from "react-native-star-rating";
import firestore from '@react-native-firebase/firestore';

export default function CrowdFundingEvent(props) {
  const { userData } = props;
  const route = useRoute();
  const { EventDetails, Timer } = route.params;
  const navigation = useNavigation();
  const [mycontribution, setmycontribution] = useState([]);
  const [isFocus, setfocus] = useState(false);
  const [isSchedule, setSchedule] = useState(false);
  const [isothercontributor, setothercontributor] = useState(false);
  const [tuteescontributions, setTuteesContributions] = useState([]);
  const [contributionArray, setcontributionArray] = useState([]);
  const [isContributors, setContributorsBool] = useState(false);
  const [startTime, setstarttime] = useState([]);
  const [hoursleft, sethoursleft] = useState("");
  const [played, setplay] = useState("");
  const [date, setdate] = useState("");
  const [balance, setbalance] = useState(0);
  const [updatedBalance, setupdatedbalance] = useState(0);
  const [isContributed, setcontributed] = useState(false);
  const [allcontributions, setallcontributions] = useState([]);
  const [allmycontributions, setallmycontributions] = useState([]);
  const [is1X, set1x] = useState(false);
  const [is2X, set2x] = useState(false);
  const [is3X, set3x] = useState(false);
  let starttimer;
  var currentDate = new Date();
  let animation = useRef(new Animated.Value(0)).current;
  let width = animation.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
    extrapolate: "clamp",
  });

  Animated.timing(animation, {
    toValue: contributionArray.map(
      (item, i) => (item.LastContribution / item.Goal) * 100
    ),
    duration: 100,
  }).start();
  let countdown;
  let string;
  let EventList;
  //console.log("id that got here", EventDetails.EventID);
  useEffect(() => {
    getUsersInfo();
  }, []);
  async function getUsersInfo() {
    console.log("user data", props.userData.ID);
    console.log("event id", EventDetails.EventID);
    await firestore()
      .collection("Users")
      .doc(props.userData.ID)
      .onSnapshot((querysnapshot) => {
        setbalance(querysnapshot.data().Balance);
      });
  }

  useEffect(() => {
    async function getTimer() {
      if (currentDate <= EventDetails.EndsIn) {
        console.log("date 2", currentDate);
        await startTimer();
      } else {
        null;
      }
    }
    getTimer();
  }, []);
  useEffect(() => {
    checkFundingGoal();
  }, []);

  async function checkFundingGoal() {
    console.log(
      "length of sessions",
      EventDetails.Time.length,
      EventDetails.LastContribution
    );
    {
      contributionArray.map((item, i) => {
        if (item.LastContribution === item.Goal) {
          console.log("uhh");
          let sum = 0;
          allmycontributions.forEach((snapshot) => {
            sum += snapshot.Offer;
          });
          var newbalance = parseInt(balance);
          let updatedbalance = newbalance - sum;
          let SessionID = "2021" + uuid.v4();
          console.log("sessions?", item);
          let sessionIDarray = [];
          sessionIDarray.push(SessionID);
          let Notifarray = [
            {
              Message:
                "The group session " +
                item.Title +
                " that you initiated has reached its goal. Please check your upcoming sessions for more details",
              Type: "CrowdFunding",
              EventID: EventDetails.EventID,
            },
          ];
          let tuteeNotifs = [
            {
              Message:
                "The group session " +
                item.Title +
                " that you contributed for has reached its goal. Please check your upcoming sessions for more details",
              Type: "CrowdFunding",
              EventID: EventDetails.EventID,
            },
          ];
          for (var i = 0; i < EventDetails.Time.length; i++) {
            let timestring = EventDetails.Time[i].toString();
            const string = timestring.split("-");
            EventList = {
              Time1: string,
              StudentName: userData.Name,
              Category: EventDetails.Category,
              SubCategory: "",
              DefaultRoom: false,
              Password: "",
              CustomRoom: false,
              StudentID: userData.ID,
              TutorID: EventDetails.ID,
              TutorName: EventDetails.Name,
              TutorPic: EventDetails.Photo,
              StudentPic: userData.Photo,
              Topic: EventDetails.Title,
              Document: "",
              Participants: item.Participants,
            };
          }
          console.log("event list", EventList);

          for (var i = 0; i < item.Participants.length; i++) {
            firestore()
              .collection("Users")
              .doc(item.Participants[i])
              .update({
                SessionID: firestore.FieldValue.arrayUnion(
                  ...sessionIDarray
                ),
              });
            // firebase
            //   .firestore()
            //   .collection("Notifications")
            //   .doc(item.Participants[i])
            //   .set(
            //     {
            //       Messages: firebase.firestore.FieldValue.arrayUnion(
            //         ...tuteeNotifs
            //       ),
            //     },
            //     { merge: true }
            //   );
          }

          firestore()
            .collection("Users")
            .doc(EventDetails.ID)
            .update({
              SessionID: firestore.FieldValue.arrayUnion(
                ...sessionIDarray
              ),
            });

          // firebase
          //   .firestore()
          //   .collection("Notifications")
          //   .doc(EventDetails.ID)
          //   .set(
          //     {
          //       Messages: firebase.firestore.FieldValue.arrayUnion(
          //         ...Notifarray
          //       ),
          //     },
          //     { merge: true }
          //   );

          firestore().collection("Sessions").doc(SessionID).set(
            {
              Upcoming: EventList,
            },
            { merge: true }
          );
          // firebase
          //   .firestore()
          //   .collection("Users")
          //   .doc(props.userData.ID)
          //   .update({ Balance: updatedbalance });
          // navigation.navigate("Student");
          console.log("goal reached");
          let newarray = [];
        }
      });
    }
  }
  function startTimer() {
    countdown = setInterval(countdownTimer, 1000);
  }
  let conversion;
  function countdownTimer() {
    let temptimes = EventDetails.EndsIn;
    let mytemptimes = temptimes;
    mytemptimes = mytemptimes - 1;
    conversion = secondtoHHMM(mytemptimes);
    sethoursleft(conversion);
    if (conversion === null) {
      clearInterval(countdown);
    }
  }
  if (hoursleft != undefined) {
    string = hoursleft.split(",");
  }

  //console.log(hoursleft);
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

  useEffect(() => {
    const time = EventDetails.Time;
    //  const
    var timearray;
    var dateStr;
    var starttimestring;
    var endtimestring;
    const array = [];
    for (var i = 0; i < time.length; i++) {
      let timestring = time[i].toString();
      const string = timestring.split("-");
      dateStr = moment(parseInt(string)).format("dddd Do YYYY");
      starttimestring = moment(parseInt(string)).format("hh:mm a");
      endtimestring = moment(parseInt(string[1])).format("hh:mm a");
      //const string = time.split("-");
      timearray = [
        {
          Date: dateStr,
          startTime: starttimestring,
          endTime: endtimestring,
        },
      ];
      array.push(timearray);
    }
    setstarttime(array);
  }, []);

  //

  useEffect(() => {
    async function getYourContribution() {
      await getyourcontributions();
    }
    getYourContribution();
  }, []);

  useEffect(() => {
    async function getMaximumContribution() {
      await getMaximum();
    }
    getMaximumContribution();
  }, []);

  useEffect(() => {
    async function getOthersContributions() {
      await getotherscontributions();
    }
    getOthersContributions();
  }, []);

  async function getMaximum() {
    await firestore()
      .collection("CrowdFunding")
      .doc(EventDetails.EventID)
      .onSnapshot((querysnapshot) => {
        setcontributionArray(querysnapshot.data().CrowdFundingInfo);
      });
  }

  async function getyourcontributions() {
    if (EventDetails.EventID != null) {
      await firestore()
        .collection("CrowdFunding")
        .doc(EventDetails.EventID)
        .onSnapshot((querysnapshot) => {
          let oldcontributors = querysnapshot.data().Contributors;
          if (oldcontributors != undefined) {
            let newcontributors = oldcontributors.filter(
              (e) => e.TuteeID === userData.ID
            );
            setcontributed(true);
            setallmycontributions(newcontributors);

            let unique = getUnique(newcontributors, "TuteeID");
            unique.map((item, i) => {
              if (item.OfferType === "1X") {
                set1x(true);
                set2x(false);
                set3x(false);
              }
              if (item.OfferType === "2X") {
                set1x(false);
                set2x(true);
                set3x(false);
              }
              if (item.OfferType === "3X") {
                set1x(false);
                set2x(false);
                set3x(true);
              }
            });
            setmycontribution(unique);
          }
        });
    }
  }

  async function getotherscontributions() {
    if (EventDetails.EventID != null) {
      await firestore()
        .collection("CrowdFunding")
        .doc(EventDetails.EventID)
        .onSnapshot((querysnapshot) => {
          setallcontributions(querysnapshot.data().Contributors);
          let oldcontributors = querysnapshot.data().Contributors;
          //if contribution array exists
          if (oldcontributors != undefined) {
            // filter the duplicated contributions and only taking the ones with the most values
            var lastcontributor =
              oldcontributors[oldcontributors.length - 1].TuteeID;
            console.log("last bidder is", lastcontributor);
            if (lastcontributor === userData.ID) {
              setfocus(true);
              setothercontributor(false);
            }
            if (lastcontributor != userData.ID) {
              setothercontributor(true);
              setfocus(false);
            }
            let newcontributors = oldcontributors.filter(
              (e) => e.TuteeID != userData.ID
            );
            let unique = getUnique(newcontributors, "TuteeID");
            const maxPrice = Math.max(...unique.map(({ Offer }) => Offer));
            unique.sort((a, b) => (a.Offer > b.Offer ? 1 : -1));

            setTuteesContributions(unique);
            setContributorsBool(true);
            //if no contributions from other tutees
            if (!unique.length) {
              console.log("no arrays for other tutees");
              setTuteesContributions([]);
            }
          }
          //if contribution array doesnt exist, we display nothing
          else {
            setTuteesContributions([]);
            setContributorsBool(false);

            // let newtutors = BiddingDetails.List;
            // let updatedtutors = newtutors.filter((e) => e != props.userData.ID);
            // getTutorsInfo(updatedtutors);
            // setnobidder(true);
          }
          //console.log("unique", unique);
        });
    }
  }

  function getUnique(arr, index) {
    const updatedarray = arr.reverse();
    const unique = updatedarray
      .map((e) => e[index])

      // store the keys of the unique objects
      .map((e, i, final) => final.indexOf(e) === i && i)

      // eliminate the dead keys & store unique objects
      .filter((e) => arr[e])
      .map((e) => arr[e]);
    return unique;
  }

  async function ContributeOffer1X() {
    if (balance > 10) {
      let newcontribution = parseInt(EventDetails.Minimum);
      var sum = EventDetails.Minimum;
      let idarrays = [];
      if (allcontributions != undefined) {
        let unique = getUnique(allcontributions, "TuteeID");

        unique.map((item, i) => {
          console.log("TuteeID", item.TuteeID);
          idarrays.push(item.TuteeID);
        });
        allcontributions.forEach((snapshot) => {
          console.log("checking all contributors", snapshot);
          sum += snapshot.Offer;
        });
      }

      console.log("sum of all offers", sum);

      var newbalance = parseInt(balance);
      let updatedbalance = newbalance - 5;
      setupdatedbalance(updatedbalance);
      if (idarrays.includes(userData.ID) === true) {
        console.log("yes it does");
      } else {
        idarrays.push(userData.ID);
      }
      let participantID = [userData.ID];
      EventDetails.Participants = [participantID];
      //let newbid = biddingArray.LastBid - 1;
      const newContributingArray = [
        {
          Category: EventDetails.Category,
          Title: EventDetails.Title,
          URL: EventDetails.URL,
          MediaType: EventDetails.MediaType,
          EventID: EventDetails.EventID,
          Time: EventDetails.Time,
          TutorID: EventDetails.TutorID,
          DoubleIncentive: EventDetails.DoubleIncentive,
          TripleIncentive: EventDetails.TripleIncentive,
          Goal: EventDetails.Goal,
          LastContribution: sum,
          Participants: idarrays,
          EndsIn: EventDetails.EndsIn,
          Minimum: EventDetails.Minimum,
        },
      ];
      firestore()
        .collection("CrowdFunding")
        .doc(EventDetails.EventID)
        .update({ CrowdFundingInfo: newContributingArray });
      console.log();
      const crowdfundingList = [];
      var newContribution = [
        {
          Offer: newcontribution,
          OfferType: "1X",
          Name: userData.Name,
          Photo: userData.Photo,
          TuteeID: userData.ID,
        },
      ];
      console.log("no such obj. creating a new contribution");
      firestore()
        .collection("CrowdFunding")
        .doc(EventDetails.EventID)
        .update({
          Contributors: firestore.FieldValue.arrayUnion(
            ...newContribution
          ),
        });

      Alert.alert("You have successfully contributed.");
    } else {
      Alert.alert("Your balance is too low.");
    }
    //console.log("obj now", obj);
  }

  async function Confirm1X() {
    if (
      currentDate <= EventDetails.EndsIn &&
      EventDetails.LastContribution != EventDetails.Goal
    ) {
      var sum = parseInt(EventDetails.Minimum);
      Alert.alert(
        "Confirm your contribution",
        "You are about to contribute " +
          EventDetails.Minimum +
          "$ dollars to the group session " +
          EventDetails.Title +
          ". Are you sure you want to proceed?",
        [
          {
            text: "Ask me later",
            onPress: () => console.log("Ask me later pressed"),
          },
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "OK", onPress: () => ContributeOffer1X() },
        ]
      );
    } else {
      Alert.alert("Sorry, you can not contribute anymore.");
    }
  }

  async function ContributeOffer2X() {
    if (balance > 10) {
      var sum = parseInt(EventDetails.Minimum) + parseInt(EventDetails.Minimum);
      console.log("sum now for 2x offer", sum);
      let idarrays = [];
      if (allcontributions != undefined) {
        let unique = getUnique(allcontributions, "TuteeID");

        unique.map((item, i) => {
          console.log("TuteeID", item.TuteeID);
          idarrays.push(item.TuteeID);
        });
        allcontributions.forEach((snapshot) => {
          sum += snapshot.Offer;
        });
      }
      console.log("ids", idarrays);
      let newcontribution =
        parseInt(EventDetails.Minimum) + parseInt(EventDetails.Minimum);
      console.log("sum of all offers", sum);
      var newbalance = parseInt(balance);
      let updatedbalance = newbalance - 5;
      setupdatedbalance(updatedbalance);
      if (idarrays.includes(userData.ID) === true) {
        console.log("yes it does");
      } else {
        idarrays.push(userData.ID);
      }
      console.log("updated array", idarrays);
      //EventDetails.Participants = [...participantID];
      //let newbid = biddingArray.LastBid - 1;
      const newContributingArray = [
        {
          Category: EventDetails.Category,
          Title: EventDetails.Title,
          URL: EventDetails.URL,
          MediaType: EventDetails.MediaType,
          EventID: EventDetails.EventID,
          Time: EventDetails.Time,
          TutorID: EventDetails.TutorID,
          DoubleIncentive: EventDetails.DoubleIncentive,
          TripleIncentive: EventDetails.TripleIncentive,
          Goal: EventDetails.Goal,
          LastContribution: sum,
          Participants: idarrays,
          EndsIn: EventDetails.EndsIn,
          Minimum: EventDetails.Minimum,
        },
      ];

      console.log(
        "now new contribution",
        newContributingArray,
        EventDetails.Participants
      );
      firestore()
        .collection("CrowdFunding")
        .doc(EventDetails.EventID)
        .update({ CrowdFundingInfo: newContributingArray });
      console.log();
      const crowdfundingList = [];
      var newContribution = [
        {
          Offer: newcontribution,
          OfferType: "2X",
          Name: userData.Name,
          Photo: userData.Photo,
          TuteeID: userData.ID,
        },
      ];
      console.log("no such obj. creating a new contribution");
      firestore()
        .collection("CrowdFunding")
        .doc(EventDetails.EventID)
        .update({
          Contributors: firestore.FieldValue.arrayUnion(
            ...newContribution
          ),
        });

      Alert.alert("You have successfully contributed.");
    }
  }

  function confirm2X() {
    var sum = parseInt(EventDetails.Minimum) + parseInt(EventDetails.Minimum);
    console.log("sum now for 2x offer", sum);
    if (
      currentDate <= EventDetails.EndsIn &&
      EventDetails.LastContribution != EventDetails.Goal
    ) {
      Alert.alert(
        "Confirm your contribution",
        "You are about to contribute " +
          sum +
          "$ dollars to the group session " +
          EventDetails.Title +
          ". Are you sure you want to proceed?",
        [
          {
            text: "Ask me later",
            onPress: () => console.log("Ask me later pressed"),
          },
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "Yes", onPress: () => ContributeOffer2X() },
        ]
      );
    } else {
      Alert.alert("Sorry, you can not contribute anymore.");
    }
  }

  function confirm3X() {
    console.log("sum now for 3x offer", sum);
    if (
      currentDate <= EventDetails.EndsIn &&
      EventDetails.LastContribution != EventDetails.Goal
    ) {
      var sum =
        parseInt(EventDetails.Minimum) +
        parseInt(EventDetails.Minimum) +
        parseInt(EventDetails.Minimum);
      Alert.alert(
        "Confirm your contribution",
        "You are about to contribute " +
          sum +
          "$ dollars to the group session " +
          EventDetails.Title +
          ". Are you sure you want to proceed?",
        [
          {
            text: "Ask me later",
            onPress: () => console.log("Ask me later pressed"),
          },
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "Yes", onPress: () => ContributeOffer3X() },
        ]
      );
    } else {
      Alert.alert("Sorry, you can not contribute anymore.");
    }
  }

  async function ContributeOffer3X() {
    if (balance > 10) {
      var sum =
        parseInt(EventDetails.Minimum) +
        parseInt(EventDetails.Minimum) +
        parseInt(EventDetails.Minimum);
      console.log("sum now for 3x offer", sum);
      let idarrays = [];
      if (allcontributions != undefined) {
        let unique = getUnique(allcontributions, "TuteeID");

        unique.map((item, i) => {
          console.log("TuteeID", item.TuteeID);
          idarrays.push(item.TuteeID);
        });
        allcontributions.forEach((snapshot) => {
          sum += snapshot.Offer;
        });
      }
      console.log("ids", idarrays);
      let newcontribution =
        parseInt(EventDetails.Minimum) +
        parseInt(EventDetails.Minimum) +
        parseInt(EventDetails.Minimum);
      console.log("sum of all offers", sum);
      var newbalance = parseInt(balance);
      let updatedbalance = newbalance - 5;
      setupdatedbalance(updatedbalance);
      if (idarrays.includes(userData.ID) === true) {
        console.log("yes it does");
      } else {
        idarrays.push(userData.ID);
      }
      console.log("updated array", idarrays);
      //EventDetails.Participants = [...participantID];
      //let newbid = biddingArray.LastBid - 1;
      const newContributingArray = [
        {
          Category: EventDetails.Category,
          Title: EventDetails.Title,
          URL: EventDetails.URL,
          MediaType: EventDetails.MediaType,
          EventID: EventDetails.EventID,
          Time: EventDetails.Time,
          TutorID: EventDetails.TutorID,
          DoubleIncentive: EventDetails.DoubleIncentive,
          TripleIncentive: EventDetails.TripleIncentive,
          Goal: EventDetails.Goal,
          LastContribution: sum,
          Participants: idarrays,
          EndsIn: EventDetails.EndsIn,
          Minimum: EventDetails.Minimum,
        },
      ];

      console.log(
        "now new contribution",
        newContributingArray,
        EventDetails.Participants
      );
      firestore()
        .collection("CrowdFunding")
        .doc(EventDetails.EventID)
        .update({ CrowdFundingInfo: newContributingArray });
      console.log();
      const crowdfundingList = [];
      var newContribution = [
        {
          Offer: newcontribution,
          OfferType: "3X",
          Name: userData.Name,
          Photo: userData.Photo,
          TuteeID: userData.ID,
        },
      ];
      console.log("no such obj. creating a new contribution");
      firestore()
        .collection("CrowdFunding")
        .doc(EventDetails.EventID)
        .update({
          Contributors: firestore.FieldValue.arrayUnion(
            ...newContribution
          ),
        });
      setcontributed(true);
      Alert.alert("You have successfully contributed.");
    }
  }

  function Pass() {
    let newparticipants = EventDetails.Participants.filter(
      (e) => e != props.userData.ID
    );
    firestore()
      .collection("CrowdFunding")
      .doc(EventDetails.EventID)
      .update({});
  }

  return (
    <SafeAreaView style={{ paddingTop: Platform.OS === "android" ? 25 : 0 }}>
      <Image
        source={require("../assets/biddingBG.png")}
        style={{
          width: "100%",
          height: "110%",
          zIndex: 0,
          resizeMode: "cover",
          position: "absolute",
        }}
      />
      <View
        style={{
          zIndex: 1,
          width: "100%",
          height: "100%",
        }}
      >
        <View style={{ flexDirection: "row", height: "20%" }}>
          {isContributors === true ? (
            <FlatList
              data={tuteescontributions}
              horizontal={true}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{
                flexGrow: 1,
                flexDirection: "row",
                justifyContent: "space-around",

                width: Dimensions.get("screen").width / 4,
              }}
              style={{
                height: "auto",
              }}
              renderItem={({ item, index }) => {
                return (
                  <View style={{ width: Dimensions.get("screen").width / 3 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignSelf: "center",
                      }}
                    >
                      <View style={{ flexDirection: "column" }}>
                        {index === 0 ? (
                          isothercontributor === true ? (
                            <LottieView
                              ref={(animation) => {
                                setplay(animation);
                              }}
                              autoPlay={true}
                              style={{
                                width: 100,
                                height: 100,
                                alignSelf: "center",
                                marginTop: Platform.OS === "android" ? -5 : -3,
                                position: "absolute",
                              }}
                              source={require("../assets/focus.json")}
                              loop={true}
                            />
                          ) : null
                        ) : null}

                        <Image
                          source={{ uri: item.Photo }}
                          style={{
                            width: 60,
                            height: 60,
                            borderRadius: 30,
                            alignSelf: "center",
                            zIndex: 1,
                            top: 10,
                          }}
                        />
                        <View
                          style={{
                            backgroundColor: "#7a0000",
                            width: 50,
                            height: 20,
                            borderRadius: 10,
                            bottom: 5,
                            zIndex: 1,
                            alignSelf: "center",
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
                            ${item.Offer}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              }}
            />
          ) : null}
        </View>
        <View style={{ width: "60%" }}>
          <Text
            style={{
              fontSize: 16,
              right: 2,
              fontWeight: "bold",
              textAlign: "center",
              bottom: 15,
            }}
          >
            Total Collected
          </Text>
          <View>
            <View
              style={{
                width: 180,
                height: 50,
                borderRadius: 10,
                alignSelf: "center",
                bottom: 5,
                backgroundColor: "#F1C411",

                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 22,
                  alignSelf: "center",
                  fontWeight: "bold",
                }}
              >
                {contributionArray.map((item, i) => item.LastContribution)}$
              </Text>
            </View>
          </View>
        </View>
        <View style={{ width: "27%" }}>
          <View
            style={{
              flexDirection: "row",
              alignSelf: "center",
              width: 40,
            }}
          >
            {currentDate <= EventDetails.EndsIn ? (
              string.map((item, i) => {
                const divided = item.split(" ");

                return (
                  <View
                    key={i}
                    style={{
                      flexDirection: "row",
                      width: 55,
                      height: 50,
                      alignSelf: "center",
                      paddingHorizontal: 0,
                    }}
                  >
                    <View
                      style={{
                        width: 50,
                        height: 40,

                        backgroundColor: "white",

                        justifyContent: "center",
                        borderRadius: 10,
                      }}
                    >
                      <Text
                        style={{
                          alignSelf: "center",
                          color: "black",
                          top: 0,
                          bottom: 0,

                          width: "auto",
                        }}
                      >
                        {divided[0]}
                      </Text>
                    </View>
                  </View>
                );
              })
            ) : (
              <View
                style={{
                  width: 120,
                  height: 40,
                  alignSelf: "center",
                  backgroundColor: "white",
                  left: 30,
                  justifyContent: "center",
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    color: "black",
                    top: 0,
                    bottom: 0,

                    width: "auto",
                  }}
                >
                  Times Up!
                </Text>
              </View>
            )}
          </View>
          <View
            style={{
              flexDirection: "row",
              width: 38,
              alignSelf: "center",
              bottom: 5,
            }}
          >
            {currentDate <= EventDetails.EndsIn &&
              string.map((item, i) => {
                const dividedstring = item.split(" ");

                return (
                  <View
                    key={i}
                    style={{
                      width: 52,
                      alignSelf: "center",
                      left: 0,
                    }}
                  >
                    <View
                      style={{
                        width: "auto",
                        height: 25,

                        backgroundColor: "white",

                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: "black",
                          flexDirection: "row",
                          right: 2,
                          textAlign: "center",
                          width: "auto",
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
        <View style={{ flexDirection: "row", width: "100%", left: 18 }}>
          <View
            style={{
              height: 20,
              width: "50%",
              backgroundColor: "white",
              borderColor: "white",
              borderWidth: 0.5,
              borderRadius: 3,
              flexDirection: "row",
              marginTop: 5,
            }}
          >
            <Animated.View
              style={
                ([StyleSheet.absoluteFill],
                { backgroundColor: "#F1C411", width })
              }
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "50%",
            left: 20,
          }}
        >
          <Text style={{ color: "black" }}>
            {contributionArray.map((item, i) => item.LastContribution)}$
          </Text>
          <Text style={{ color: "black" }}>{EventDetails.Goal}$</Text>
        </View>
        <View
          style={{
            justifyContent: "center",

            position: "absolute",

            width: "65%",
            height: "60%",
            top: 260,
            left: -5,
          }}
        >
          <Card
            containerStyle={{
              borderRadius: 25,
              height: "auto",
              width: "95%",
              backgroundColor: "#101820FF",
              borderColor: "#101820FF",
            }}
          >
            <View
              style={{
                flexDirection: "column",
                alignSelf: "center",
                left: 0,
              }}
            >
              <Image
                source={{ uri: EventDetails.Photo }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  alignSelf: "center",
                }}
              />
              <Text style={{ color: "white", fontSize: 14 }}>
                {EventDetails.NameTitle} {EventDetails.Name}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignSelf: "center" }}>
              <Text
                style={{
                  color: "white",
                  fontSize: 14,
                  alignSelf: "center",
                  fontWeight: "bold",
                }}
              >
                {EventDetails.Title}
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: "#F1C411",
                  width: 25,
                  height: 25,
                  borderRadius: 10,
                  justifyContent: "center",
                  alignSelf: "flex-start",
                  left: 5,
                }}
              >
                <MaterialIcons
                  name="video-collection"
                  size={18}
                  style={{ alignSelf: "center" }}
                  color={"black"}
                />
              </TouchableOpacity>
            </View>

            <Text
              style={{
                fontWeight: "bold",
                alignSelf: "center",
                color: "white",
                fontSize: 17,
              }}
            >
              {EventDetails.Topic}{" "}
            </Text>

            <View style={{ flexDirection: "column" }}>
              <Text
                style={{
                  color: "white",
                  fontSize: 15,
                  bottom: 10,
                  fontWeight: "bold",
                }}
              >
                Summary{" "}
              </Text>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{
                    color: "white",
                  }}
                >
                  Number of hours: {EventDetails.NumOfHours}{" "}
                </Text>

                <TouchableOpacity
                  onPress={() => setSchedule(true)}
                  style={{
                    backgroundColor: "#F1C411",
                    width: 25,
                    height: 25,
                    borderRadius: 10,
                    justifyContent: "center",
                    alignSelf: "flex-start",
                    bottom: 5,
                  }}
                >
                  <MaterialIcons
                    name="calendar-today"
                    size={18}
                    style={{ alignSelf: "center" }}
                    color={"black"}
                  />
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  color: "white",
                  bottom: 2,
                }}
              >
                Funding Goal: {EventDetails.Goal}${" "}
              </Text>
              <Modal isVisible={isSchedule}>
                <View
                  style={{
                    width: "100%",
                    height: "40%",
                    backgroundColor: "#333939",
                    alignSelf: "center",
                    borderRadius: 15,
                  }}
                >
                  <TouchableOpacity onPress={() => setSchedule(false)}>
                    <MaterialIcons
                      name="clear"
                      size={25}
                      style={{ alignSelf: "flex-end" }}
                      color={"#F1C411"}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      alignSelf: "center",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    Schedule
                  </Text>
                  {startTime.map((item, i) => {
                    return (
                      <View key={i}>
                        {item.map((item, i) => {
                          return (
                            <View
                              key={i}
                              style={{
                                backgroundColor: "#F1C411",
                                width: "80%",
                                height: 40,
                                marginVertical: 5,
                                alignSelf: "center",
                                justifyContent: "center",
                                borderRadius: 10,
                              }}
                            >
                              <Text
                                style={{
                                  color: "black",
                                  textAlign: "center",
                                  width: "100%",
                                  alignSelf: "center",
                                }}
                              >
                                {item.Date} {item.startTime} {"- "}
                                {item.endTime}
                              </Text>
                            </View>
                          );
                        })}
                      </View>
                    );
                  })}
                </View>
              </Modal>

              <View style={{ flexDirection: "row", top: 0 }}>
                <View style={{ flexDirection: "row", top: 5 }}>
                  <StarRating
                    maxStars={2}
                    starSize={13}
                    disabled={true}
                    rating={2}
                    fullStarColor="#F1C411"
                    emptyStarColor="white"
                    starStyle={{}}
                  />
                </View>
                <Text
                  style={{
                    color: "white",
                    top: 3,
                    alignSelf: "center",
                    left: 5,
                  }}
                >
                  {EventDetails.DoubleIncentive}
                </Text>
              </View>

              <View style={{ flexDirection: "row", top: 5 }}>
                <View style={{ flexDirection: "row", top: 5 }}>
                  <StarRating
                    maxStars={3}
                    starSize={13}
                    disabled={true}
                    rating={3}
                    fullStarColor="#F1C411"
                    emptyStarColor="white"
                    starStyle={{}}
                  />
                </View>
                <Text
                  style={{
                    color: "white",
                    top: 3,
                    left: 5,
                  }}
                >
                  {EventDetails.TripleIncentive}
                </Text>
              </View>

              {contributionArray.map((item, i) => (
                <View key={i}>
                  {item.LastContribution != item.Goal ? (
                    <Text style={{ color: "#F1C411", width: 200, top: 12 }}>
                      Rittoe's funding goal has not been reached yet
                    </Text>
                  ) : (
                    <Text style={{ color: "#F1C411", top: 15 }}>
                      Rittoe's funding goal has been reached.
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </Card>
        </View>

        <View
          style={{
            width: "100%",
            zIndex: 1,
            justifyContent: "flex-end",
            alignContent: "flex-end",
            position: "absolute",
            bottom: 0,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignContent: "space-between",
              flexGrow: 1,
            }}
          >
            {isContributed === false && (
              <TouchableOpacity
                style={{
                  backgroundColor: "red",
                  width: 25,
                  height: 25,
                  borderRadius: 15,
                  position: "absolute",

                  left: is1X === true ? 55 : is2X ? 145 : is3X ? 235 : null,

                  justifyContent: "center",
                  top: Platform.OS === "android" ? -7 : -7,
                  zIndex: 2,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    alignSelf: "center",
                    color: "white",
                  }}
                >
                  {mycontribution.map((item, i) => item.Offer)}$
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => Confirm1X()}
              style={{
                backgroundColor: "#089000",
                width: "20%",
                paddingHorizontal: 20,
                height: 50,
                left: 0,
                borderRadius: 5,
                justifyContent: "center",
                alignSelf: "center",
                zIndex: 1,
              }}
            >
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  alignSelf: "center",
                  color: "white",
                }}
              >
                1x
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => confirm2X()}
              style={{
                backgroundColor: "#0a5d00",
                width: "20%",
                paddingHorizontal: 20,
                height: 50,
                left: 0,
                borderRadius: 5,
                justifyContent: "center",
                alignSelf: "center",
                zIndex: 1,
              }}
            >
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  alignSelf: "center",
                  color: "white",
                }}
              >
                2x
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => confirm3X()}
              style={{
                backgroundColor: "#063b00",
                width: "20%",
                paddingHorizontal: 20,
                height: 50,
                left: 0,
                borderRadius: 5,
                justifyContent: "center",
                alignSelf: "center",
                zIndex: 1,
              }}
            >
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  alignSelf: "center",
                  color: "white",
                }}
              >
                3x
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Pass()}
              style={{
                backgroundColor: "red",
                width: "25%",
                paddingHorizontal: 20,
                height: 50,
                left: 0,
                borderRadius: 5,
                justifyContent: "center",
                alignSelf: "center",
                zIndex: 1,
              }}
            >
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  alignSelf: "center",
                  color: "white",
                }}
              >
                Pass
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Image
        source={require("../assets/crowdfunding.png")}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          zIndex: 0,
          alignSelf: "flex-end",
          left: 105,
          top: 55,
          resizeMode: "contain",
        }}
      />
    </SafeAreaView>
  );
}
