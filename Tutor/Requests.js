import React, { useContext, useState, useEffect } from "react";
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
  Alert
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

import firestore from "@react-native-firebase/firestore";
export default function Requests(props) {
  const { userData } = props;
  const route = useRoute();
  //const { requestparams } = route.params;
  const requestList = [];
  //requestList.push(requestparams);

  const [requestarray, setrequestarray] = useState([]);
  const ref = firestore().collection("Requests");
  const [array, setArray] = useState([]);
  const [isOn, setisOn] = useState(false);
  const [date, setDate] = useState("");
  const [isvisible, setVisible] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requeststatus, setrequestStatus] = useState(false);
  const [password, setPassword] = useState("");
  const [meetingID, setMeetingID] = useState("");
  const [studentID, setStudentID] = useState("");
  const [meetingarr, setmeetingarr] = useState([]);
  const [freerequest, setfreerequest] = useState([]);
  const [chosenMode, setChosenMode] = useState(false);
  const [timings, settimings] = useState(false);
  const [timevisibility, setTimePickerVisibility] = useState(false);
  const [isSessions, setsessionsrequest] = useState(true);
  const [isBidding, setbiddingrequests] = useState(false);
  const [datevisible, setDateVisibility] = useState(false);
  const [timeslot, setStartTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [average, setaverage] = useState("");
  const [title, settitle] = useState("");
  const [height, setheight] = useState("");
  const [requestcount, setrequestcount] = useState(0);
  const [countrequest, setcountrequest] = useState(0);
  const [selectedID, setselectedID] = useState("");
  const [upcomingtemp, setupcomingtemp] = useState(0);
  const [upcomingCount, setupcomingCount] = useState(0);
  const [upcomingTutee, setupcomingTutee] = useState(0);
  const [upcomingTuteeCount, setupcomingTuteeCount] = useState(0);
  const [tuteeID, settuteeID] = useState("");
  const [biddingID, setbiddingID] = useState([]);
  const [biddingArray, setbiddingArray] = useState([]);
  const [isbiddingFound, setbiddingfound] = useState(false);
  var studentlist = [];
  var MeetingInfo = [];
  var number;
  const newkey = [];
  const newList = [];
  var dataset;
  var newobj;
  var filtered;
  const updatedobj = [];

  const [earnings, setbool] = useState(true);
  const [profile, setbool1] = useState(true);
  const [account, setbool2] = useState(true);

  const navigation = useNavigation();

  const [name, setname] = useState("");
  const List = [];
  useEffect(() => {
    let isMounted = true;
    async function RequestFunction() {
      await loadRequestArray();
    }

    RequestFunction();
  }, []);
  useEffect(() => {
    if (tuteeID !== "") {
      firestore()
        .collection("Users")
        .doc(tuteeID)
        .onSnapshot((querySnapShot) => {
          setupcomingTutee(querySnapShot.data().UpcomingCount);

          var number3 = parseInt(querySnapShot.data().UpcomingCount);
          setupcomingTuteeCount(number3 + 1);
        });
    }
  }, []);

  useEffect(() => {
    async function getTutorInfo() {
      await loadtutorsInfo();
    }
    getTutorInfo();
  }, []);

  async function loadtutorsInfo() {
    await firestore()
      .collection("Users")
      .doc(props.userData.ID)
      .onSnapshot((querySnapShot) => {
        if (querySnapShot.exists) {
          setname(querySnapShot.data().Name);
          let totalaverage = (
            Math.round(querySnapShot.data().TotalAverage * 100) / 100
          ).toFixed(2);
          setaverage(totalaverage);
          setbiddingID(querySnapShot.data().BiddingID);
          getBiddingArray(querySnapShot.data().BiddingID);
          setbiddingfound(true);
          settitle(querySnapShot.data().Title);
          setrequestcount(querySnapShot.data().RequestCount);
          setupcomingtemp(querySnapShot.data().UpcomingCount);
        }
      });
  }

  async function getBiddingArray(biddingid) {
    await firestore()
      .collection("Bidding")
      .where(firestore.FieldPath.documentId(), "in", biddingid)
      .onSnapshot((querysnapshot) => {
        const List = [];
        querysnapshot.forEach((docsnap) => {
          List.push({ ...docsnap.data(), key: docsnap.id });
        });
        setbiddingArray(List.reverse());
      });
  }

  function navigate(earnings) {
    if (earnings === true) {
      navigation.navigate("Earnings");
    }
  }
  async function loadRequestArray() {
    console.log("LOAD for ", props.userData.ID);
    await firestore()
      .collection("Requests")
      .doc(props.userData.ID)
      .onSnapshot((querySnapShot) => {
        if (querySnapShot.exists) {
          setrequestarray(querySnapShot.data().Requests);
        }
      });
  }
  function navigatetoProfile(profile) {
    if (profile === true) {
      navigation.navigate("Profile");
    }
  }

  function navigateToAccount(account) {
    if (account === true) {
      navigation.navigate("Account");
    }
  }
  const showDatePicker = () => {
    setTimePickerVisibility(true);
  };
  const onShowDate = () => {
    setDateVisibility(true);
  };
  const handleDate = (date) => {
    var stringdate = moment(date).format("YYYY-MM-DD");
    setDate(stringdate);
    console.log(stringdate);
    hidePicker();
  };
  function sendParams() {
    var MeetingInfo = meetingarr;
    MeetingInfo = [
      {
        TutorID: props.userData.ID,
        MeetingID: meetingID,
        MeetingPass: password,
        StartTime: starttime,
        EndTime: endtime,
        Date: date
      }
    ];
    setmeetingarr(MeetingInfo);
    firestore()
      .collection("Meetings")
      .doc(studentID)
      .set(
        {
          MeetingInformation: firestore.FieldValue.arrayUnion(...MeetingInfo)
        },
        { merge: true }
      );
    setVisible(false);
  }
  const hideDatePicker = () => {
    setTimePickerVisibility(false);
  };

  const hidePicker = () => {
    setDateVisibility(false);
  };
  const [starttime, setstartformat] = useState("");
  const [endtime, setendformat] = useState("");
  const handleConfirm = (time) => {
    if (chosenMode) {
      var string = moment(time).format("h:mm a");
      //string
      setStartTime(string);
      //format
      setstartformat(time);
    } else {
      var string = moment(time).format("h:mm a");
      //string
      setendformat(time);
      setToTime(string);
      //format
    }
    hideDatePicker();
  };
  const [equal, isequal] = useState("");
  const objlist = [];
  const [objList, setobjlist] = useState({});
  const [update, setupdate] = useState(false);
  const [requestdata, setrequestdata] = useState("");
  function confirmBook(item) {
    setrequestStatus(true);
    //setVisible(true);
  }
  const [keys, setkeys] = useState([]);
  const [updatestatus, setstaus] = useState(false);
  const [tutorslist, setlist] = useState([]);
  const RightItem = ({ progress, drag }) => {
    return (
      <View style={{ backgroundColor: "white" }}>
        <Text style={{ color: "white" }}>Delete</Text>
      </View>
    );
  };
  const LeftItem = ({ progress, drag }) => {
    // drag = 0;
    if (drag > 50) {
      //setbookpopup(true);
      console.log("ITS SWIPED");
    }
    function openmodal() {}
    return (
      <View style={{ backgroundColor: "white" }}>
        <TouchableOpacity onPress={() => openmodal()}>
          <Text style={{ fontSize: 20, marginLeft: 20, color: "white" }}>
            Book
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  function rightrender(index) {
    var itemList = [...requestList];
    itemList.splice(index, 1);
    console.log("item left", "items", itemList);
    setrequestarray(itemList);
  }
  function opensessionRequests() {
    setsessionsrequest(true);
    console.log("session clicked");
    setbiddingrequests(false);
  }
  function openbiddingRequest() {
    setbiddingrequests(true);
    console.log("bidding clicked");
    setsessionsrequest(false);
  }
  async function leftrender(item) {
    settuteeID(item.StudentID);
    //request count
    var number1 = parseInt(requestcount);
    let selectedID = item.Topic;
    // setcountrequest(number1 - 1);
    let countrequest = number1 - 1;
    //upcoming sessioncount for tutor
    var number2 = parseInt(upcomingtemp);
    let upcomingCount = number2 + 1;
    //setupcomingCount(number2 + 1);
    await firestore()
      .collection("Requests")
      .doc(props.userData.ID)
      .onSnapshot((querySnapShot) => {
        List.push({ ...querySnapShot.data(), key: querySnapShot.id });
        var obj;
        //get list

        const dataset = querySnapShot.data().Requests;
        obj = Object.values(dataset);
        var Year, month, Day;
        const EventList = [];
        const TutorList = [];
        let number = obj.findIndex((e) => {
          return selectedID === e.Topic;
        });

        obj.forEach((snapshot) => {
          if (snapshot.Topic === selectedID) {
            Year = moment(snapshot.Date).format("YYYY");
            month = moment(snapshot.Date).format("MMM");
            Day = moment(snapshot.Date).format("DD");
            let newarray = [];
            let SessionID = Year + uuid.v4();
            newarray.push(SessionID);
            console.log("new sessionID", SessionID);
            firestore()
              .collection("Users")
              .doc(snapshot.StudentID)
              .update({ UpcomingCount: upcomingTuteeCount });

            EventList.push({
              Year: Year,
              Month: month,
              Day: Day,
              EndTime: snapshot.EndTime,
              StartTime: snapshot.StartTime,
              Date: snapshot.Date,
              StudentName: snapshot.StudentName,
              Category: snapshot.Category,
              SubCategory: snapshot.SubCategory,
              DefaultRoom: false,
              Password: "",
              CustomRoom: false,
              StudentID: snapshot.StudentID,
              TutorID: userData.ID,
              TutorName: userData.Name,
              TutorPic: userData.Photo,
              StudentPic: snapshot.StudentPic,
              Topic: snapshot.Topic,
              Request: snapshot.SpecialRequest,
              Document: snapshot.Document
            });
            firestore()
              .collection("Users")
              .doc(snapshot.StudentID)
              .update({
                SessionID: firestore.FieldValue.arrayUnion(...newarray)
              });
            firestore()
              .collection("Users")
              .doc(userData.ID)
              .update({
                SessionID: firestore.FieldValue.arrayUnion(...newarray)
              });
            Alert.alert("You accepted " + snapshot.StudentName + " 's request");
            firestore()
              .collection("Sessions")
              .doc(SessionID)
              .set(
                {
                  Upcoming: firestore.FieldValue.arrayUnion(...EventList)
                },
                { merge: true }
              );
          }
        });
      });

    console.log("ITEM SELECTED ", item.Topic);
    setrequestStatus(true);
  }
  return (
    <SafeAreaView
      style={{
        backgroundColor: "black",
        height: "auto",
        paddingTop: Platform.OS === "android" ? 15 : 10
      }}
    >
      <View
        onLayout={(event) => {
          var { x, y, width, height } = event.nativeEvent.layout;
          setheight(height);
          console.log("height", height);
        }}
        style={{ backgroundColor: "black", height: 1000 }}
      >
        <TouchableOpacity
          onPress={() => submitToggle()}
          style={{
            justifyContent: "flex-end",
            alignSelf: "flex-end",
            position: "absolute"
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              width: 35,
              height: 35,
              borderRadius: 35,
              justifyContent: "center",
              alignSelf: "flex-end"
            }}
          >
            <MaterialIcons
              name="home"
              size={25}
              style={{ alignSelf: "center" }}
              color={"black"}
            />
          </View>
        </TouchableOpacity>

        <View
          onLayout={(event) => {
            var { x, y, width, height } = event.nativeEvent.layout;
            console.log("text height", height);
          }}
          style={{ flexDirection: "row" }}
        >
          <Text
            style={{
              color: "white",
              alignSelf: "flex-start",
              right: 0,
              fontSize: 15,
              left: 5
            }}
          >
            Your
          </Text>
          <Text
            style={{
              color: "#F1C411",
              alignSelf: "flex-start",
              right: 0,
              fontSize: 15,
              left: 9,
              fontWeight: "bold"
            }}
          >
            PENDING SESSION REQUESTS.
          </Text>
        </View>
        <View
          onLayout={(event) => {
            var { x, y, width, height } = event.nativeEvent.layout;
            console.log(" second text height", height);
          }}
          style={{ flexDirection: "row", top: 0, left: 5 }}
        >
          <Text
            style={{
              color: "white",
              alignSelf: "center",
              right: 0,
              fontSize: 15
            }}
          >
            Swipe
          </Text>
          <Image
            source={require("../assets/swipe-right.png")}
            style={{
              left: 0,
              width: 25,
              height: 25,
              alignSelf: "flex-start",
              bottom: 1
            }}
          />
          <Text
            style={{
              color: "white",
              alignSelf: "center",
              right: 0,
              left: 0,
              fontSize: 15
            }}
          >
            to
          </Text>
          <Text
            style={{
              color: "white",
              alignSelf: "center",
              right: 0,
              left: 0,
              fontSize: 15
            }}
          >
            {" "}
            ACCEPT
          </Text>
          <Text
            style={{
              color: "white",
              alignSelf: "center",
              right: 0,
              left: 0,
              fontSize: 15
            }}
          >
            {" "}
            or
          </Text>

          <Text
            style={{
              color: "white",
              alignSelf: "center",
              right: 0,
              left: 0,
              fontSize: 15
            }}
          >
            {" "}
            swipe
          </Text>
          <Image
            source={require("../assets/swipe-left.png")}
            style={{
              left: 0,
              width: 25,
              height: 25,
              alignSelf: "flex-start",
              bottom: 1
            }}
          />
          <Text
            style={{
              color: "white",
              alignSelf: "center",
              right: 0,
              left: 0,
              fontSize: 15
            }}
          >
            {""}
            to
          </Text>
          <Text
            style={{
              color: "white",
              alignSelf: "center",
              right: 0,
              left: 0,
              fontSize: 15
            }}
          >
            {" "}
            REJECT.
          </Text>
        </View>

        <TouchableOpacity
          style={{
            alignSelf: "center",
            justifyContent: "center",
            top: 85 / 5,
            alignContent: "center",
            alignItems: "center"
          }}
          onPress={() => {
            setbool1(true), navigatetoProfile(profile);
          }}
        >
          <View style={{ flexDirection: "row", width: 75, height: 75 }}>
            <Image
              source={{ uri: props.userData.Photo }}
              style={{
                width: 70,
                height: 70,
                alignSelf: "center",
                borderRadius: 35
              }}
            />
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
                style={{ fontSize: 14, alignSelf: "center", color: "white" }}
              >
                {requestcount}
              </Text>
            </View>
          </View>
          <Text
            style={{
              color: "white",
              width: 100,
              height: "auto",
              bottom: 0,
              top: 5,
              alignSelf: "center",
              fontSize: 16,
              textAlign: "center"
            }}
          >
            {title} {name}
          </Text>
          <View
            style={{
              bottom: 35,
              backgroundColor: "white",
              borderRadius: 20,
              justifyContent: "center",
              flexDirection: "row",
              width: 50,
              height: "auto",
              alignSelf: "center",
              right: 2
            }}
          >
            <Text style={{ alignSelf: "center" }}> {average}</Text>
            <MaterialIcons
              name="star"
              style={{ color: "black", alignSelf: "center" }}
            />
          </View>
        </TouchableOpacity>
      </View>
      <Card
        containerStyle={{
          shadowColor: "grey",
          shadowOpacity: 0.5,
          shadowOffset: { width: 2, height: 2 },
          height: Dimensions.get("screen").height,
          backgroundColor: "white",
          borderColor: "white",
          width: Dimensions.get("screen").width,
          right: 15
        }}
      >
        <Card.Title style={{ textAlign: "left" }}>
          <View style={{ flexDirection: "row", marginLeft: 10 }}>
            <TouchableOpacity
              style={{
                backgroundColor: isSessions === true ? "#F1C411" : "black",
                width: "auto",
                height: 50,
                right: 12,
                left: 0,
                top: -10,
                borderRadius: 0,
                zIndex: 1,
                borderTopLeftRadius: 10,
                borderBottomLeftRadius: 10,
                justifyContent: "center"
              }}
              onPress={() => opensessionRequests()}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: isSessions === true ? "black" : "white",
                  alignSelf: "center",
                  paddingHorizontal: 20
                }}
              >
                {" "}
                Session Requests{" "}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => openbiddingRequest()}
              style={{
                backgroundColor: isBidding === true ? "#F1C411" : "black",
                width: "auto",
                height: 50,
                right: 5,
                top: -10,
                borderTopRightRadius: 10,
                borderBottomRightRadius: 10,
                borderRadius: 0,
                justifyContent: "center"
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: isBidding === true ? "black" : "white",
                  alignSelf: "center",
                  paddingHorizontal: 20
                }}
              >
                {" "}
                Bidding Requests{" "}
              </Text>
            </TouchableOpacity>
          </View>
        </Card.Title>

        <Card.Divider style={{ backgroundColor: "black", bottom: 20 }} />

        {isSessions === true ? (
          <View
            style={{ height: "auto", width: "100%", flexGrow: 1, bottom: 25 }}
          >
            <FlatList
              data={requestarray}
              removeClippedSubviews={false}
              style={{ height: "100%", flexGrow: 1 }}
              renderItem={({ item, index }) => {
                var endtimestring = moment(item.EndTime).format("hh:mm A");
                var starttimestring = moment(item.StartTime).format("hh:mm A");
                return (
                  <Swipeable
                    renderLeftActions={(progress, dragx) => <LeftItem />}
                    renderRightActions={(progress, dragx) => <RightItem />}
                    onSwipeableLeftWillOpen={() => {
                      leftrender(item);
                    }}
                    onSwipeableRightWillOpen={() => {
                      rightrender(index);
                    }}
                  >
                    <Card
                      containerStyle={{
                        borderRadius: 25,
                        backgroundColor: "#101820FF",
                        borderColor: "#101820FF",
                        width: "100%",
                        right: 15
                      }}
                    >
                      <View
                        style={{
                          marginRight: "auto",
                          marginLeft: 0,
                          flexDirection: "row",
                          marginVertical: 10
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "column",
                            alignSelf: "center",
                            right: 5
                          }}
                        >
                          <Image
                            source={{ uri: item.StudentPic }}
                            style={{
                              width: 50,
                              height: 50,
                              borderRadius: 30,
                              alignSelf: "center"
                            }}
                          />
                          <Text
                            style={{
                              alignItems: "flex-start",
                              color: "white"
                            }}
                          >
                            {" "}
                            {item.StudentName}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "column",
                            alignItems: "flex-start",
                            marginLeft: 0
                          }}
                        >
                          <View style={styles.column}>
                            <Text
                              style={{
                                color: "white",
                                width: "90%",
                                height: "auto",
                                textAlign: "left",
                                fontWeight: "bold",
                                top: 0,
                                bottom: 2
                              }}
                            >
                              {"  "}
                              {item.Category}{" "}
                              {
                                <Icon
                                  name="arrow-right"
                                  size={18}
                                  style={{
                                    color: "white",
                                    alignSelf: "center",
                                    top: 2,
                                    left: 2
                                  }}
                                />
                              }{" "}
                              {item.SubCategory}
                            </Text>
                            <Text
                              style={{
                                color: "#F1C411",
                                width: "90%",
                                height: "auto",
                                textAlign: "left",
                                fontWeight: "bold",
                                bottom: 0
                              }}
                            >
                              {" "}
                              {item.Topic}
                            </Text>
                          </View>
                          <View style={styles.column}>
                            <Text
                              style={{
                                color: "white",
                                width: "auto",
                                marginTop: 2
                              }}
                            >
                              {"  "}
                              Special Request:{" "}
                            </Text>
                            <Text
                              style={{
                                color: "white",
                                width: 250,
                                height: "auto",
                                textAlign: "left"
                              }}
                            >
                              {"  "}
                              {item.SpecialRequest}
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
                              {starttimestring} - {endtimestring}
                            </Text>
                          </View>

                          <View
                            style={
                              (styles.row, { top: 12, flexDirection: "row" })
                            }
                          >
                            <MaterialIcons
                              name="date-range"
                              size={18}
                              color={"#F1C411"}
                              style={{
                                alignSelf: "center",
                                left: 1
                              }}
                            />

                            <Text
                              style={{ color: "white", alignSelf: "center" }}
                            >
                              {" "}
                              {item.Date}{" "}
                            </Text>
                          </View>
                          {item.Document !== " " ? (
                            <View style={{ flexDirection: "row" }}>
                              <Text
                                style={{
                                  right: 0,
                                  marginTop: 5,
                                  color: "white",
                                  fontWeight: "400",
                                  fontStyle: "italic"
                                }}
                              >
                                {" "}
                                {item.Document}
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
                                  size={19}
                                  style={{
                                    alignSelf: "center",
                                    left: 0.5,
                                    top: 0.5
                                  }}
                                />
                              </TouchableOpacity>
                            </View>
                          ) : null}
                        </View>
                        <Card.Divider
                          style={{ marginBottom: 0, backgroundColor: "black" }}
                        />
                      </View>
                    </Card>
                  </Swipeable>
                );
              }}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        ) : isBidding === true ? (
          <View
            style={{
              height: "500%",
              width: "100%",
              flexGrow: 1,
              bottom: 25,
              maxHeight: 600
            }}
          >
            <FlatList
              data={biddingArray}
              removeClippedSubviews={false}
              style={{ height: "500%", flexGrow: 1, maxHeight: 450 }}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => {
                return (
                  <Card
                    containerStyle={{
                      borderRadius: 25,
                      backgroundColor: "#101820FF",
                      borderColor: "#101820FF",
                      width: "100%",
                      right: 15
                    }}
                  >
                    {item.BiddingInfo.map((item, i) => {
                      let numoftutors = item.List;
                      let newnum = numoftutors.filter(
                        (e) => e != props.userData.ID
                      );
                      let count = newnum.length;
                      return (
                        <View key={i}>
                          <View
                            style={{
                              flexDirection: "column",
                              alignSelf: "center",
                              right: 5
                            }}
                          >
                            <Image
                              source={{ uri: item.StudentPic }}
                              style={{
                                width: 50,
                                height: 50,
                                borderRadius: 30,
                                alignSelf: "center"
                              }}
                            />
                            <Text
                              style={{
                                alignItems: "flex-start",
                                color: "white"
                              }}
                            >
                              {" "}
                              {item.StudentName}
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: "column",
                              alignItems: "flex-start",
                              marginLeft: 0
                            }}
                          >
                            <View style={styles.column}>
                              <Text
                                style={{
                                  color: "white",
                                  width: "auto",
                                  height: "auto",
                                  textAlign: "left",
                                  fontWeight: "bold",
                                  top: 0,
                                  bottom: 2
                                }}
                              >
                                {"  "}
                                {item.Type}{" "}
                              </Text>
                              <Text
                                style={{
                                  color: "white",
                                  width: "90%",
                                  height: "auto",
                                  textAlign: "left",
                                  fontWeight: "bold",
                                  marginTop: 10,
                                  bottom: 0
                                }}
                              >
                                {"  "}
                                {item.Category}{" "}
                              </Text>
                              <Text
                                style={{
                                  color: "#F1C411",
                                  width: "90%",
                                  height: "auto",
                                  textAlign: "left",
                                  fontWeight: "bold",
                                  bottom: 0,
                                  left: 3
                                }}
                              >
                                {" "}
                                {item.Topic}
                              </Text>
                              <View style={styles.row}>
                                <Text
                                  style={{
                                    color: "white",
                                    width: "auto",
                                    marginTop: 2
                                  }}
                                >
                                  {"  "}
                                  Goal:{" "}
                                </Text>
                                <Text
                                  style={{
                                    color: "white",
                                    width: 250,
                                    height: "auto",
                                    textAlign: "left",
                                    alignSelf: "center"
                                  }}
                                >
                                  ${item.Goal}
                                </Text>
                              </View>
                              <View style={styles.row}>
                                <Text
                                  style={{
                                    color: "white",
                                    width: "auto",
                                    marginTop: 2
                                  }}
                                >
                                  {"  "}
                                  List of tutors contacted:{" "}
                                </Text>
                                <Text
                                  style={{
                                    color: "white",
                                    width: 250,
                                    height: "auto",
                                    textAlign: "left",
                                    alignSelf: "center"
                                  }}
                                >
                                  {count}
                                </Text>
                              </View>
                              <View style={styles.row}>
                                <TouchableOpacity
                                  onPress={() =>
                                    item.Type === "Bidding War Offer"
                                      ? navigation.navigate("BiddingDetails", {
                                          BiddingDetails: item
                                        })
                                      : navigation.navigate("AcceptBidding", {
                                          BiddingDetails: item
                                        })
                                  }
                                  style={{
                                    backgroundColor: "#F1C411",
                                    width: "auto",
                                    paddingHorizontal: 20,
                                    height: 30,
                                    borderRadius: 5,
                                    justifyContent: "center",
                                    marginTop: 10,
                                    alignSelf: "flex-start"
                                  }}
                                >
                                  <Text style={{ alignSelf: "center" }}>
                                    View details
                                  </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={{
                                    backgroundColor: "#F1C411",
                                    width: "auto",
                                    paddingHorizontal: 20,
                                    height: 30,
                                    borderRadius: 5,
                                    justifyContent: "center",
                                    marginTop: 10,
                                    alignSelf: "flex-start",
                                    left: 15
                                  }}
                                >
                                  <Text style={{ alignSelf: "center" }}>
                                    Reject
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        </View>
                      );
                    })}
                  </Card>
                );
              }}
            />
          </View>
        ) : null}
      </Card>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  column: {
    flexDirection: "column"
  },
  row: {
    flexDirection: "row"
  },

  selectTimings: {
    borderRadius: 5,
    shadowColor: "grey",
    shadowOpacity: 0.5,
    shadowOffset: { width: 5, height: 5 },
    backgroundColor: "black",
    marginLeft: 15
  },
  datePickerStyle: {
    width: 120,
    marginRight: 10,
    marginTop: 5
  }
});
