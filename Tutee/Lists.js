import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  PureComponent
} from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Animated,
  TextInput,
  LayoutAnimation,
  Alert,
  Platform,
  Dimensions
} from "react-native";
import { useLinkProps, useNavigation } from "@react-navigation/native";
import { Card, ListItem, Button, List, CheckBox } from "react-native-elements";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import Swipeable from "react-native-gesture-handler/Swipeable";
import StarRating from "react-native-star-rating";
import Icon from "react-native-vector-icons/Feather";
import { useRoute } from "@react-navigation/native";
import Modal from "react-native-modal";
import ModalDropdown from "react-native-modal-dropdown";
import { KeyboardAvoidingView } from "react-native";
import * as demodata from "../demodata.json";
import AdvancedList from "./AdvancedList";
import * as DocumentPicker from "expo-document-picker";
import moment from "moment";
import { Calendar } from "react-native-calendars";
import { Video, AVPlaybackStatus } from "expo-av";
import { BarChart, StackedBarChart } from "react-native-chart-kit";
import BarCharts from "./BarCharts";
import CrowdFundingEvent from "./CrowdFundingEvent";
import uuid from "uuid";
import PasswordModal from "./passwordModal.js/PasswordModal";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
export default function Lists(props) {
  const {
    filtered,
    relation,
    advanced,
    tutordata,
    updateTutor,
    filteredList,
    userData,
    category,
    allAverages,
    subcategory,
    categoryAVG,
    q1catAVG,
    q2catAVG,
    q3catAVG,
    q4catAVG,
    q1allAVG,
    q2allAVG,
    q3allAVG,
    q4allAVG,
    minimumhour,
    groupsessionInfo
  } = props;
  const navigation = useNavigation();
  //formatting the averages to display only 2 decimal places
  let q1catavg = (Math.round(q1catAVG * 100) / 100).toFixed(2);
  let q2catavg = (Math.round(q2catAVG * 100) / 100).toFixed(2);
  let q3catavg = (Math.round(q3catAVG * 100) / 100).toFixed(2);
  let q4catavg = (Math.round(q4catAVG * 100) / 100).toFixed(2);
  let q1allavg = (Math.round(q1allAVG * 100) / 100).toFixed(2);
  let q2allavg = (Math.round(q2allAVG * 100) / 100).toFixed(2);
  let q3allavg = (Math.round(q3allAVG * 100) / 100).toFixed(2);
  let q4allavg = (Math.round(q4allAVG * 100) / 100).toFixed(2);
  let categoryaverage = (Math.round(categoryAVG * 100) / 100).toFixed(2);
  const [status, setStatus] = React.useState({});
  let allaverage = (Math.round(allAverages * 100) / 100).toFixed(2);

  //setting variables
  const [modaldata, setmodaldata] = useState([]);
  const [skills, isSkills] = useState(false);
  const [isCategory, setcategory] = useState(true);
  const [isThisTutor, setisthistutor] = useState(true);
  const [isAlltutors, setisalltutors] = useState(true);
  const [XP, isXP] = useState(false);
  const [expertise, isExpertise] = useState(false);
  const [expertisearray, setexparray] = useState([]);
  const [language, islanguage] = useState(false);
  const [topic, settopic] = useState("");
  const [languagearr, setlanguagearr] = useState([]);
  const [reviews, isreviews] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [ratings2, setRatings2] = useState([]);
  const [ratings3, setRatings3] = useState([]);
  const [popup, setpopup] = useState(false);
  const [reviewData, setReviewData] = useState([]);
  const [modalkey, setmodalkey] = useState([]);
  const [XParray, setxparray] = useState([]);
  const [skillarray, setskillarr] = useState([]);
  const [educationarr, seteducationarr] = useState([]);
  const [education, iseducation] = useState(false);
  const [hours, sethours] = useState("");
  const [playing, setPlaying] = useState(false);
  const [bookpopup, setbookpopup] = useState(false);
  const [filename, setfilename] = useState("");
  const [downloadurl, setdownloadurl] = useState("");
  const [isOnetoOne, setOnetoOne] = useState(false);
  const [dateString, setDates] = useState({});
  const [isday, setDate] = useState("");
  const [marked, setmarked] = useState({});
  const [daypicked, isdaypicked] = useState(false);
  const [istimefound, setTimeFound] = useState(false);
  const [specialrequest, setspecialrequest] = useState("");
  const [slots, setslots] = useState({});
  const [isbooked, setbooked] = useState(false);
  const [tempCount, setrequestTempCount] = useState(0);
  const [groupsessionarray, setgroupsessionarray] = useState(groupsessionInfo);
  const [requestcount, setrequestcount] = useState(0);
  const [q1average, setq1average] = useState(0);
  const [q2average, setq2average] = useState(0);
  const [q3average, setq3average] = useState(0);
  const [q4average, setq4average] = useState(0);
  const [totalaverage, settotalaverage] = useState(0);
  const [requestarray, setRequestArray] = useState([]);
  const video = React.useRef(null);
  const [itemid, setitemid] = useState("");
  const [tutorid, settutorid] = useState("");
  const [name, setname] = useState([]);
  const [title, settitle] = useState("");
  const [tutorstring, setTutorString] = useState("");
  const [pass, setPass] = useState(false);
  const [selectedGig, setSelectedGig] = useState({});
  var conversion2;
  let markedEvents = {};
  let timeSlots = [];
  const [hours2, sethours2] = useState("");
  const string = hours.split(",");
  const Reviews = [];
  const Ratings1 = [];
  const Ratings2 = [];
  const Rating3 = [];
  let animation = useRef(new Animated.Value(0)).current;
  let animation2 = useRef(new Animated.Value(0)).current;
  let mytemptimes = [];
  var conversion;
  const Timings = firestore().collection("Slots");
  const [TimeSlots, SetTimeSlots] = useState([]);
  async function onDayPress(day) {
    let date = day.dateString;
    setDate(day.dateString);
    let markedate = day.dateString;
    let newdates = markedEvents;
    isdaypicked(true);
    await Timings.where("ID", "==", tutorid).onSnapshot((querySnapshot) => {
      const tutorLists = [];
      if (querySnapshot.empty) {
        console.log("empty");
      }
      querySnapshot.forEach((documentSnapshot) => {
        tutorLists.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id
        });
      });
      var key;
      var idkey;
      var obj;
      //get list
      for (var i = 0; i < tutorLists.length; i++) {
        const dataset = tutorLists[i].availability;
        obj = Object.values(dataset);
      }
      console.log(date);
      obj.forEach((snapshot) => {
        if (date === snapshot.dateString && snapshot.booked === "false") {
          timeSlots.push(snapshot);
          console.log("yes time", snapshot);
          SetTimeSlots(timeSlots);
          setTimeFound(true);
        }
      });
      let num = obj.findIndex((e) => date === e.dateString);
      console.log("number of index", num);
      if (num === -1) {
        setTimeFound(false);
      }
    });
  }
  function selectTimings(item) {
    setslots(item);
  }
  //for booking the session
  function BookSession() {
    setbooked(true);
    var RequestArray = requestarray;
    RequestArray = [
      {
        StudentID: props.userData.ID,
        StudentName: props.userData.Name,
        StudentPic: props.userData.Photo,
        Date: slots.dateString,
        StartTime: slots.startTime,
        EndTime: slots.endTime,
        Status: "In Progress",
        Topic: topic,
        SpecialRequest: specialrequest,
        Document: downloadurl !== "" ? downloadurl : " ",
        Category: category,
        SubCategory: subcategory
      }
    ];
    setRequestArray(RequestArray);
    console.log("name ", props.userData.Name);
    console.log("category ", RequestArray);
    if (tutorid !== undefined && props.userData.Name !== undefined) {
      var number1 = parseInt(tempCount);
      setrequestcount(number1 + 1);

      firestore()
        .collection("Requests")
        .doc(tutorid)
        .set(
          {
            Requests: firestore.FieldValue.arrayUnion(...RequestArray)
          },
          { merge: true }
        );
    }
    Alert.alert("You've successfully made a booking");
  }

  //
  function secondtoHHMM(d) {
    var date1 = d;
    var date2 = new Date();
    var diffInSeconds = Math.abs(date1 - date2) / 1000;
    var days = Math.floor(diffInSeconds / 60 / 60 / 24);
    var hours = Math.floor((diffInSeconds / 60 / 60) % 24);
    var minutes = Math.floor((diffInSeconds / 60) % 60);
    var seconds = Math.floor(diffInSeconds % 60);

    var dDisplay = days > 0 ? days + (days == 1 ? " day," : " days,") : "";
    var hDisplay = hours > 0 ? hours + (hours == 1 ? " hour," : " hours,") : "";

    var mDisplay =
      minutes > 0 ? minutes + (minutes == 1 ? " min," : " mins,") : "";
    var sDisplay =
      seconds > 0 ? seconds + (seconds == 1 ? " sec" : " secs") : "";
    return hDisplay + mDisplay + sDisplay;
  }
  const pickdoc = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({});
      console.log(
        "result info",
        result.uri,
        result.type,
        result.name,
        result.size,
        result
      );
      if (result.size > 2000000) {
        Alert.alert("File too big. Please compress it");
      } else {
        setfilename(result.name);
        const username = userData.Name;
        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = () => {
            resolve(xhr.response);
          };
          xhr.responseType = "blob";
          xhr.open("GET", result.uri, true);
          xhr.send(null);
        });
        const ref = storage()
          .ref()
          .child("BookingFile/" + userData.Name + result.name);
        let snapshot = await ref.put(blob);
        const url = await storage()
          .ref("BookingFile/" + userData.Name + result.name)
          .getDownloadURL();
        // const url = await snapshot.ref.getDownloadURL();
        setdownloadurl(url);

        // console.log('url', url)
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // let mytemptime = groupsessionInfo.map((item, i) => item.EndsIn);
    // let conversion;
    // let interval = setInterval(() => {
    //   for (var i = 0; i < groupsessionInfo.length; i++) {
    //     mytemptime[i] = mytemptime[i] - 1;
    //     conversion = secondtoHHMM(mytemptime[i]);
    //     sethours(conversion);
    //   }
    // }, 1000);
    // return () => {
    //   clearInterval(interval);
    // };
  }, []);

  // useEffect(() => {
  //   groupsessionInfo.map((item, i) => {
  //     if (item.LastContribution === item.Goal) {
  //       console.log("goal reached");
  //       let newarray = [];
  //       const EventList = [];
  //       // console.log("new item", item.Date);
  //       //console.log("how many times", i);
  //       for (var i = 0; i < item.Time.length; i++) {
  //         //console.log("count sessions ids", SessionID);
  //         let timestring = item.Time[i].toString();
  //         const string = timestring.split("-");
  //         let dateStr = moment(parseInt(string)).format("dddd Do YYYY");
  //         let starttimestring = moment(parseInt(string)).format("hh:mm a");
  //         let endtimestring = moment(parseInt(string[1])).format("hh:mm a");
  //         EventList.push({
  //           Time1: string,
  //           Time2: string[1],
  //           StudentName: userData.Name,
  //           Category: item.Category,
  //           SubCategory: "",
  //           DefaultRoom: false,
  //           Password: "",
  //           CustomRoom: false,
  //           StudentID: userData.ID,
  //           TutorID: item.ID,
  //           TutorName: item.Name,
  //           TutorPic: item.Photo,
  //           StudentPic: userData.Photo,
  //           Topic: item.Title,
  //           Document: "",
  //           Participants: item.Participants,
  //         });
  //         //console.log("event check", EventList);
  //       }
  //       console.log("how many times, ");

  //       let SessionID = "2021" + uuid.v4();
  //       console.log("sessions?", item);
  //       let sessionIDarray = [];
  //       sessionIDarray.push(SessionID);
  //       // for (var i = 0; i < item.Participants.length; i++) {
  //       //   firebase
  //       //     .firestore()
  //       //     .collection("Users")
  //       //     .doc(item.Participants[i])
  //       //     .update({
  //       //       SessionID: firestore.FieldValue.arrayUnion(
  //       //         ...sessionIDarray
  //       //       ),
  //       //     });
  //       //   firebase
  //       //     .firestore()
  //       //     .collection("Notifications")
  //       //     .doc(item.Participants[i])
  //       //     .set(
  //       //       {
  //       //         Messages:
  //       //           "The group session " +
  //       //           item.Title +
  //       //           " that you participated in has reached its goal. Please check your upcoming sessions for more details",
  //       //         Type: "CrowdFunding",
  //       //         EventID: item.EventID,
  //       //       },
  //       //       { merge: true }
  //       //     );
  //       // }

  //       // firebase
  //       //   .firestore()
  //       //   .collection("Users")
  //       //   .doc(item.ID)
  //       //   .update({
  //       //     SessionID: firestore.FieldValue.arrayUnion(
  //       //       ...sessionIDarray
  //       //     ),
  //       //   });

  //       let Notifarray = [
  //         {
  //           Message:
  //             "The group session " +
  //             item.Title +
  //             " that you initiated has reached its goal. Please check your upcoming sessions for more details",
  //           Type: "CrowdFunding",
  //           EventID: item.EventID,
  //         },
  //       ];
  //       // firebase
  //       //   .firestore()
  //       //   .collection("Notifications")
  //       //   .doc(item.ID)
  //       //   .set(
  //       //     {
  //       //       Messages:
  //       //         "The group session " +
  //       //         item.Title +
  //       //         " that you initiated has reached its goal. Please check your upcoming sessions for more details",
  //       //       Type: "CrowdFunding",
  //       //       EventID: item.EventID,
  //       //     },
  //       //     { merge: true }
  //       //   );
  //       // let updatedarray = groupsessionarray.filter(
  //       //   (e) => e.EventID != item.EventID
  //       // );
  //       // setgroupsessionarray(updatedarray);
  //       //console.log("new group session array", updatedinfo);
  //     }
  //   });
  // }, []);
  //opening modals
  function openPopUp(item) {
    console.log("modal function", item);
    console.log("userdata", userData);
    navigation.navigate("CrowdFundingEvent", {
      EventDetails: item,
      Timer: string,
      userData: props.userData.ID
    });
    // setmodaldata(item);

    setpopup(true);
  }
  function pushforSkills(item) {
    isSkills(true);
    setskillarr(item);
  }
  function pushforXP(item) {
    isXP(true);
    setxparray(item);
  }
  function pushforExpertise(item) {
    isExpertise(true);
    setexparray(item.Categories);
    setmodalkey(item);
  }
  function pushforLanguage(item) {
    islanguage(true);
    setlanguagearr(item);
  }
  function pushforEducation(item) {
    iseducation(true);
    seteducationarr(item);
  }

  async function pushforReviews(item) {
    isreviews(true);
    setitemid(item.ID);
    //set the tutor title name
    setname(item.Name);
    console.log(item.ID);
    settitle(item.Title);
    let stringName = item.Title + " " + item.Name;
    setTutorString(stringName);
    await Promise.all([
      firestore()
        .collection("Users")
        .doc(item.ID)
        .onSnapshot((querysnapshot) => {
          let q1AVG = (
            Math.round(querysnapshot.data().Q1Average * 100) / 100
          ).toFixed(2);
          let q2AVG = (
            Math.round(querysnapshot.data().Q2Average * 100) / 100
          ).toFixed(2);
          let q3AVG = (
            Math.round(querysnapshot.data().Q3Average * 100) / 100
          ).toFixed(2);
          let Q4AVG = (
            Math.round(querysnapshot.data().Q4Average * 100) / 100
          ).toFixed(2);
          let totalAVG = (
            Math.round(querysnapshot.data().TotalAverage * 100) / 100
          ).toFixed(2);
          setq1average(q1AVG);
          setq2average(q2AVG);
          setq3average(q3AVG);
          setq4average(Q4AVG);
          settotalaverage(totalAVG);
        }),
      firestore()
        .collection("Ratings")
        .where("TutorID", "==", item.ID)
        .limit(5)
        .onSnapshot((querySnapShot) => {
          querySnapShot.forEach((documentSnapShot) => {
            Reviews.push({
              ...documentSnapShot.data(),
              key: documentSnapShot.id
            });
            Ratings1.push(documentSnapShot.data().CommunicationSkill);
            Ratings2.push(documentSnapShot.data().TeachingSkill);
            Rating3.push(documentSnapShot.data().WorkEthic);
          });

          setRatings(Ratings1);
          setRatings2(Ratings2);
          setRatings3(Rating3);
          setReviewData(Reviews);
        })
    ]);
  }
  function closePopup() {
    setpopup(false);
    isSkills(false);
    isExpertise(false);
    islanguage(false);
    isreviews(false);
    isXP(false);
    iseducation(false);
  }

  const TutorList = [];
  //for updating timer

  async function getRequestCount() {
    if (tutorid !== "") {
      await firestore()
        .collection("Users")
        .doc(tutorid)
        .onSnapshot((querySnapShot) => {
          setrequestTempCount(querySnapShot.data().RequestCount);
        });
    }
  }
  const List = [];
  useEffect(() => {
    getRequestCount();
  }, []);

  useEffect(() => {
    getTutorsInfo();
  }, []);
  async function getTutorsInfo() {}
  // useEffect(() => {
  //   let unsubscribe;
  //   if (reviews == true) {
  //     unsubscribe = firebase
  //       .firestore()
  //       .collection("Users")
  //       .doc(itemid)
  //       .onSnapshot((querysnapshot) => {
  //         let q1AVG = (
  //           Math.round(querysnapshot.data().Q1Average * 100) / 100
  //         ).toFixed(2);
  //         let q2AVG = (
  //           Math.round(querysnapshot.data().Q2Average * 100) / 100
  //         ).toFixed(2);
  //         let q3AVG = (
  //           Math.round(querysnapshot.data().Q3Average * 100) / 100
  //         ).toFixed(2);
  //         let Q4AVG = (
  //           Math.round(querysnapshot.data().Q4Average * 100) / 100
  //         ).toFixed(2);
  //         let totalAVG = (
  //           Math.round(querysnapshot.data().TotalAverage * 100) / 100
  //         ).toFixed(2);
  //         setq1average(q1AVG);
  //         setq2average(q2AVG);
  //         setq3average(q3AVG);
  //         setq4average(Q4AVG);
  //         settotalaverage(totalAVG);
  //       });
  //     unsubscribe = firebase
  //       .firestore()
  //       .collection("Ratings")
  //       .where("TutorID", "==", itemid)
  //       .limit(5)
  //       .onSnapshot((querySnapShot) => {
  //         querySnapShot.forEach((documentSnapShot) => {
  //           Reviews.push({
  //             ...documentSnapShot.data(),
  //             key: documentSnapShot.id,
  //           });
  //           Ratings1.push(documentSnapShot.data().CommunicationSkill);
  //           Ratings2.push(documentSnapShot.data().TeachingSkill);
  //           Rating3.push(documentSnapShot.data().WorkEthic);
  //         });

  //         setRatings(Ratings1);
  //         setRatings2(Ratings2);
  //         setRatings3(Rating3);
  //         setReviewData(Reviews);
  //       });
  //   }
  //   return () => {
  //     unsubscribe;
  //   };
  // }, []);
  // useEffect(() => {
  //   let unsubscribe;
  //   if (isbooked === true && tutorid !== undefined) {
  //     firebase
  //       .firestore()
  //       .collection("Users")
  //       .doc(tutorid)
  //       .update({ RequestCount: requestcount });
  //     unsubscribe = Timings.where("ID", "==", tutorid).onSnapshot(
  //       (querySnapshot) => {
  //         querySnapshot.forEach((documentSnapshot) => {
  //           TutorList.push({
  //             ...documentSnapshot.data(),
  //             key: documentSnapshot.id,
  //           });
  //         });
  //         var obj;
  //         //get list
  //         for (var i = 0; i < TutorList.length; i++) {
  //           const dataset = TutorList[i].availability;
  //           obj = Object.values(dataset);
  //         }
  //         let number = obj.findIndex((e) => {
  //           return (
  //             slots.startTime >= e.startTime &&
  //             slots.endTime <= e.endTime &&
  //             slots.dateString == e.dateString
  //           );
  //         });
  //         var bool = "true";
  //         obj[number].booked = bool;
  //         if (
  //           slots.startTime > obj[number].startTime &&
  //           slots.endTime == obj[number].endTime
  //         ) {
  //           obj[number].endTime = slots.startTime;
  //         }
  //         if (
  //           slots.startTime == obj[number].startTime &&
  //           slots.endTime < obj[number].endTime
  //         ) {
  //           obj[number].startTime = slots.endTime;
  //         }
  //         if (
  //           slots.startTime > obj[number].startTime &&
  //           slots.endTime < obj[number].endTime
  //         ) {
  //           const start = {
  //             booked: false,
  //             startTime: obj[number].startTime,
  //             endTime: slots.startTime,
  //             dateString: slots.dateString,
  //           };
  //           const end = {
  //             booked: false,
  //             startTime: slots.endTime,
  //             endTime: obj[number].endTime,
  //             dateString: slots.dateString,
  //           };
  //           obj.splice(number, 1, start, end);
  //         }
  //         Timings.doc(tutorid).update({ availability: obj });
  //         setbooked(false);
  //       }
  //     );
  //   }
  //   return () => {
  //     unsubscribe;
  //   };
  // }, []);
  const data = {
    labels: ["Total Average", "Q1", "Q2", "Q3", "Q4"],
    datasets: [
      {
        data: [totalaverage, q1average, q2average, q3average, q4average]
      }
    ]
  };
  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
      Alert.alert("video has finished playing!");
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying((prev) => !prev);
  }, []);
  const RightItem = ({ index, progress, drag }) => {
    drag = 0;
    var itemList = [...arrayofdemodata];
    let id = itemList.findIndex((e) => e.ID == index);
    itemList.splice(id, 1);

    return (
      <View style={{ backgroundColor: "black" }}>
        <Text>Delete</Text>
      </View>
    );
  };
  const LeftItem = ({ progress, drag }) => {
    // drag = 0;
    if (drag > 50) {
      //setbookpopup(true);
    }
    function openmodal() {}
    return (
      <View style={{ backgroundColor: "black" }}>
        <TouchableOpacity onPress={() => openmodal()}>
          <Text style={{ fontSize: 20, marginLeft: 20, color: "black" }}>
            Book
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  function rightrender(index) {
    if (isOnetoOne == false) {
      var itemList = [...arrayofdemodata];
      let id = itemList.findIndex((e) => e.ID == index);
      itemList.splice(id, 1);
      setdemodata(itemList);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    } else {
      var itemList = [...tutordata];
      itemList.splice(index, 1);
      updateTutor(itemList);
    }
  }
  async function getTutorsTimings(tutorid) {
    await Timings.where("ID", "==", tutorid).onSnapshot((querySnapshot) => {
      if (querySnapshot.empty) {
        console.log("empty");
      }
      querySnapshot.forEach((documentSnapshot) => {
        List.push({ ...documentSnapshot.data(), key: documentSnapshot.id });
      });
      var key;
      var idkey;
      var obj;
      //get list
      for (var i = 0; i < List.length; i++) {
        const dataset = List[i].availability;
        obj = Object.values(dataset);
      }
      //var objID = Object.keys(dataset);
      const dateList = [];
      console.log(isday);
      obj.forEach((snapshot) => {
        if (snapshot.booked === "false") {
          dateList.push(snapshot.dateString);
        }

        const uniqueDates = dateList.filter(
          (val, id, array) => array.indexOf(val) == id
        );

        uniqueDates.forEach((date) => {
          let dots = [];
          let markedDate = {};
          dots.push({
            color: "white",
            selectedDayBackgroundColor: "green"
          });
          markedDate["dots"] = dots;
          markedEvents[date] = {
            selected: true,
            marked: true,
            color: "#fdc500",
            day: date
          };

          setDates(markedEvents);
        });
      });
    });
  }
  function leftrender(item) {
    setbookpopup(true);
    settutorid(item.ID);
    getTutorsTimings(item.ID);
  }
  console.log(groupsessionarray?.length, "==>>");
  return (
    <SafeAreaView>
      <FlatList
        data={groupsessionarray}
        scrollEnabled={true}
        style={{ width: "100%", height: "100%", flexGrow: 1 }}
        keyExtractor={(item, index) => {
          return index.toString();
        }}
        renderItem={({ item, index }) => {
          let min = 0;
          if (item.WithinHours) min = Math.min(...item.WithinHours);
          const hours = item.EndsIn;
          // const animation = item.Animation.toString();
          // console.log("animation", animation);
          //console.log("animated", item.Animation);
          //console.log("last", item.LastContribution);
          // //sethours(conversion);
          // console.log("my temp time", hours);
          //const string = hours.split(",");
          //const timeleft = secondtoHHMM(splittime[0]);

          //console.log("split", splittime[0]);
          // const pics = Object.values(item.Student);

          let width = animation.interpolate({
            inputRange: [0, 100],
            outputRange: ["0%", "100%"],
            extrapolate: "clamp"
          });

          Animated.timing(animation, {
            toValue: item.LastContribution,
            duration: 100
          }).start();
          //let width = 20;
          return (
            <View>
              {/* <Swipeable
                  renderLeftActions={(progress, dragx) => (
                    <LeftItem index={index} />
                  )}
                  renderRightActions={(progress, dragx) => (
                    <RightItem index={index} />
                  )}
                  onSwipeableLeftWillOpen={() => {
                    setOnetoOne(false), leftrender(index);
                  }}
                  onSwipeableRightWillOpen={() => {
                    setOnetoOne(false), rightrender(index);
                  }}
                > */}
              <Card
                containerStyle={{
                  borderRadius: 20,
                  shadowColor: "black",
                  width: "90%",
                  shadowOpacity: 0.5,
                  shadowOffset: { width: 5, height: 5 },
                  backgroundColor: "#333939",
                  borderColor: "#161a1d",
                  elevation: 10,
                  shadowRadius: 10
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity onPress={() => pushforEducation(item)}>
                    <Image
                      source={{ uri: item.Photo }}
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        marginBottom: 5
                      }}
                    />
                  </TouchableOpacity>
                  <View style={{ flexDirection: "column" }}>
                    <View style={{ flexDirection: "row", left: 0 }}>
                      <Text
                        style={{
                          alignItems: "flex-start",
                          color: "white",
                          textAlign: "left"
                        }}
                      >
                        {" "}
                        {item.NameTitle}
                      </Text>
                      <Text style={{ color: "white" }}> {item.Name}</Text>
                      <Text style={{ color: "white" }}></Text>

                      <TouchableOpacity
                        style={{
                          backgroundColor: "#F1C411",
                          alignSelf: "flex-end",
                          borderRadius: 10,
                          height: 35,
                          width: 35,
                          alignContent: "center",
                          alignItems: "center",
                          justifyContent: "center",
                          top: 0,
                          right: 0,
                          left: 20
                        }}
                      >
                        <Text style={{ color: "black", fontSize: 12 }}>
                          $60
                        </Text>
                        <Text style={{ color: "black", fontSize: 12 }}>
                          /hr
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: "row", left: 6, bottom: 15 }}>
                      <StarRating
                        maxStars={5}
                        starSize={15}
                        disabled={true}
                        rating={item.TotalAverage}
                        fullStarColor="#F1C411"
                        emptyStarColor="white"
                        starStyle={{ alignItems: "center", marginLeft: 0 }}
                      />
                      {min === 1 ? (
                        <Text
                          style={{
                            color: "white",
                            left: 7,
                            fontWeight: "bold"
                          }}
                        >
                          - Within {min} hour
                        </Text>
                      ) : (
                        <Text
                          style={{
                            color: "white",
                            left: 7,
                            fontWeight: "bold"
                          }}
                        >
                          - Within {min} hours
                        </Text>
                      )}
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        marginTop: 6,
                        right: 42
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => pushforReviews(item)}
                        style={{
                          backgroundColor: "#F1C411",
                          alignSelf: "center",
                          borderRadius: 10,
                          height: 35,
                          width: 35,
                          alignContent: "center",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: 20
                        }}
                      >
                        <MaterialIcons
                          name="rate-review"
                          style={{ alignSelf: "center" }}
                          size={20}
                        />
                      </TouchableOpacity>
                      <View
                        style={{
                          backgroundColor: "red",
                          width: 20,
                          height: 20,
                          borderRadius: 15,
                          position: "absolute",
                          left: 23,
                          bottom: 20,
                          justifyContent: "center"
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            alignSelf: "center",
                            color: "white"
                          }}
                        >
                          {item.ReviewCount}
                        </Text>
                      </View>
                      <TouchableOpacity onPress={() => pushforSkills(item)}>
                        <View
                          style={{
                            backgroundColor: "#F1C411",
                            alignSelf: "center",
                            borderRadius: 10,
                            height: 35,
                            width: 35,
                            alignContent: "center",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          <Image
                            source={require("../assets/availability.png")}
                            style={{
                              alignSelf: "center",
                              width: 25,
                              height: 25,
                              left: 2,
                              top: 2
                            }}
                          />
                        </View>
                      </TouchableOpacity>
                      <View
                        style={{
                          backgroundColor: "red",
                          width: 20,
                          height: 20,
                          borderRadius: 15,
                          position: "relative",
                          right: 9,
                          justifyContent: "center",
                          bottom: 5
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            alignSelf: "center",
                            color: "white"
                          }}
                        >
                          {item.SkillCount}
                        </Text>
                      </View>
                      <TouchableOpacity onPress={() => pushforXP(item)}>
                        <View
                          style={{
                            backgroundColor: "#F1C411",
                            alignSelf: "center",
                            borderRadius: 10,
                            height: 35,
                            width: 35,
                            alignContent: "center",
                            alignItems: "center",
                            justifyContent: "center",
                            marginLeft: 5
                          }}
                        >
                          <Image
                            source={require("../assets/experience.png")}
                            style={{
                              alignSelf: "center",
                              width: 20,
                              height: 20,
                              resizeMode: "contain",
                              left: 2
                            }}
                          />
                        </View>
                      </TouchableOpacity>
                      <View
                        style={{
                          backgroundColor: "red",
                          width: 20,
                          height: 20,
                          borderRadius: 15,
                          right: 9,
                          justifyContent: "center",
                          position: "relative",
                          bottom: 5
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            alignSelf: "center",
                            color: "white"
                          }}
                        >
                          {item?.Categories?.length
                            ? Math.max.apply(
                                Math,
                                item?.Categories.map(function (o) {
                                  if (parseInt(o.experience)) {
                                    return parseInt(o.experience);
                                  } else {
                                    return 0;
                                  }
                                })
                              )
                            : "0"}
                        </Text>
                      </View>
                      <TouchableOpacity onPress={() => pushforExpertise(item)}>
                        <View
                          style={{
                            backgroundColor: "#F1C411",
                            alignSelf: "flex-start",
                            borderRadius: 10,
                            height: 35,
                            width: 35,
                            alignContent: "center",
                            alignItems: "center",
                            justifyContent: "center",
                            marginLeft: 5
                          }}
                        >
                          <Image
                            source={require("../assets/interests.png")}
                            style={{
                              alignSelf: "center",
                              width: 25,
                              height: 25,
                              resizeMode: "contain"
                            }}
                          />
                        </View>
                      </TouchableOpacity>
                      <View
                        style={{
                          backgroundColor: "red",
                          width: 20,
                          height: 20,
                          borderRadius: 15,
                          right: 9,
                          justifyContent: "center",
                          position: "relative",
                          bottom: 5
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            alignSelf: "center",
                            color: "white"
                          }}
                        >
                          {item?.Categories?.length
                            ? item?.Categories?.length
                            : "0"}
                        </Text>
                      </View>
                      <TouchableOpacity onPress={() => pushforLanguage(item)}>
                        <View
                          style={{
                            backgroundColor: "#F1C411",
                            alignSelf: "center",
                            borderRadius: 10,
                            height: 35,
                            width: 35,
                            alignContent: "center",
                            alignItems: "center",
                            justifyContent: "center",
                            marginLeft: 5
                          }}
                        >
                          <Icon
                            name="globe"
                            size={25}
                            style={{
                              alignSelf: "center",
                              width: 25,
                              height: 25
                            }}
                          />
                        </View>
                      </TouchableOpacity>
                      <View
                        style={{
                          backgroundColor: "red",
                          width: 20,
                          height: 20,
                          borderRadius: 15,
                          right: 9,
                          justifyContent: "center",
                          position: "relative",
                          bottom: 5
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            alignSelf: "center",
                            color: "white"
                          }}
                        >
                          {item.LanguageCount}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={{ marginTop: 5 }}>
                  {item.MediaType === "image" ? (
                    <Image
                      source={{ uri: item.URL }}
                      style={{ width: 300, height: 200 }}
                    />
                  ) : (
                    <Video
                      ref={video}
                      style={styles.backgroundVideo}
                      source={{
                        uri: item.URL
                      }}
                      useNativeControls
                      resizeMode="contain"
                      isLooping
                      onPlaybackStatusUpdate={(status) =>
                        setStatus(() => status)
                      }
                    />
                  )}
                </View>
                <View style={{ flexDirection: "column" }}>
                  <Text
                    style={{
                      color: "white",
                      paddingHorizontal: 0,
                      fontWeight: "bold",
                      bottom: 1,
                      alignSelf: "center"
                    }}
                  >
                    {item.Title}
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <View
                    style={{
                      height: 20,
                      width: "100%",
                      backgroundColor: "white",
                      borderColor: "red",
                      borderWidth: 0.5,
                      borderRadius: 3,
                      flexDirection: "row",
                      marginTop: 5
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
                    justifyContent: "space-between"
                  }}
                >
                  <Text style={{ color: "white" }}>
                    {item.LastContribution}
                  </Text>
                  <Text style={{ color: "white" }}>{item.Goal}</Text>
                </View>
                <View style={{ alignSelf: "center" }}>
                  <View
                    style={{
                      flexDirection: "row",

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
                            width: 55,
                            height: 50,
                            alignSelf: "center",
                            paddingHorizontal: 0
                          }}
                        >
                          <View
                            style={{
                              width: 50,
                              height: 40,

                              backgroundColor: "white",

                              justifyContent: "center",
                              borderRadius: 10
                            }}
                          >
                            <Text
                              style={{
                                alignSelf: "center",
                                color: "black",
                                top: 0,
                                bottom: 0,

                                width: "auto"
                              }}
                            >
                              {divided[0]}
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                  <View
                    style={{
                      flexDirection: "row",

                      bottom: 5
                    }}
                  >
                    {string.map((item, i) => {
                      const dividedstring = item.split(" ");

                      return (
                        <View
                          key={i}
                          style={{
                            width: 52,
                            alignSelf: "center",
                            left: 0
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
                <TouchableOpacity
                  onPress={() => {
                    // setPass(!pass);
                    setSelectedGig(item);
                    openPopUp(selectedGig);
                  }}
                  style={{
                    width: 90,
                    height: 30,
                    justifyContent: "center",
                    backgroundColor: "white",
                    paddingHorizontal: 10,
                    borderRadius: 10,
                    alignSelf: "center"
                  }}
                >
                  <Text>View more</Text>
                </TouchableOpacity>
              </Card>
              {/* {popup === true ? (
                  <View
                    style={{
                      height: "200%",
                      width: "200%",
                      backgroundColor: "white",
                      zIndex: 1,
                      overflow: "visible",
                      position: "absolute",
                    }}
                  >
                    <CrowdFundingEvent />
                  </View>
                ) : null} */}
              {/* <Modal key={modaldata} isVisible={popup}>
                  <View
                    style={{
                      width: "100%",
                      height: "70%",
                      backgroundColor: "#333939",
                      alignSelf: "center",
                      borderRadius: 15,
                      shadowColor: "grey",
                      shadowOffset: { width: 1, height: 1 },
                      shadowRadius: 1,
                      shadowOpacity: 0.5,
                      elevation: 5,
                    }}
                  >
                    <TouchableOpacity onPress={() => closePopup()}>
                      <MaterialIcons
                        name="clear"
                        size={25}
                        style={{ alignSelf: "flex-end" }}
                        color={"#F1C411"}
                      />
                    </TouchableOpacity>
                    <Text
                      style={{
                        fontSize: 20,
                        alignSelf: "center",
                        bottom: 15,
                        color: "white",
                      }}
                    >
                      {modaldata.Title}
                    </Text>
                    <Image
                      source={{ uri: modaldata.URL }}
                      style={{
                        width: 300,
                        height: 200,
                        alignSelf: "center",
                      }}
                    /> */}
              {/* <Text
                        style={{
                          width: "90%",
                          textAlign: "left",
                          left: 15,
                          color: "white",
                          marginTop: 10,
                        }}
                      >
                        {modaldata.Abstract}
                      </Text> */}
              {/* <Text
                      style={{
                        width: "auto",
                        textAlign: "left",
                        left: 15,
                        color: "white",
                        top: 10,
                      }}
                    >
                      Number of hours: {modaldata.NumOfHours}
                    </Text>
                  </View>
                </Modal> */}

              <View style={{ flexDirection: "row", marginTop: 15 }}>
                {/* {pics.map((item, i) => {
                        return (
                          <View
                            key={i}
                            style={{
                              flexDirection: "row",
                              width: 35,
                              backgroundColor: "#F1C411",
                              marginLeft: 0,
                              justifyContent: "center",
                              height: 35,
                              borderRadius: 20,
                              paddingHorizontal: 5,
                            }}
                          >
                            <Image
                              source={item}
                              style={{
                                width: 25,
                                height: 25,
                                alignSelf: "center",
                                resizeMode: "contain",
                              }}
                            />
                          </View>
                        );
                      })}
                      <Text
                        style={{ alignSelf: "center", left: 0, color: "white" }}
                      >
                        +3 Funders
                      </Text> */}
              </View>

              {/* </Swipeable> */}
            </View>
          );
        }}
      />

      <Modal isVisible={skills}>
        <View
          style={{
            backgroundColor: "#333939",
            width: "100%",
            height: "50%",
            alignSelf: "center",
            borderRadius: 10
          }}
        >
          <TouchableOpacity onPress={() => closePopup()}>
            <MaterialIcons
              name="clear"
              size={25}
              style={{ alignSelf: "flex-end" }}
              color={"#F1C411"}
            />
          </TouchableOpacity>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ color: "white", left: 10, bottom: 10 }}>
              {skillarray.Name} -
            </Text>
            <Text
              style={{
                color: "white",
                left: 15,
                bottom: 10,
                fontWeight: "bold"
              }}
            >
              Availability
            </Text>
          </View>

          {demodata[0].Schedule.map((item, i) => {
            const values = Object.values(item);
            const id = Object.keys(item);
            return (
              <View key={i}>
                {id.map((keys, i) => {
                  return (
                    <View key={i} style={{ marginVertical: 10 }}>
                      <Text style={{ color: "white", marginLeft: 10 }}>
                        {keys}
                      </Text>
                      {values.map((times, i) => {
                        return (
                          <View key={i} style={{ flexDirection: "row" }}>
                            {times.map((slots, i) => {
                              return (
                                <View
                                  key={i}
                                  style={{
                                    flexDirection: "row",
                                    width: "auto",
                                    height: 30,
                                    backgroundColor: "#F1C411",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: 10,
                                    marginLeft: 5
                                  }}
                                >
                                  <TouchableOpacity>
                                    <Text
                                      style={{
                                        color: "black",
                                        alignSelf: "center",
                                        paddingHorizontal: 10
                                      }}
                                    >
                                      {slots}
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              );
                            })}
                          </View>
                        );
                      })}
                    </View>
                  );
                })}
              </View>
            );
          })}
        </View>
      </Modal>
      <Modal isVisible={education}>
        <View
          style={{
            backgroundColor: "#333939",
            width: "100%",
            height: "50%",
            alignSelf: "center",
            borderRadius: 10
          }}
        >
          <TouchableOpacity onPress={() => closePopup()}>
            <MaterialIcons
              name="clear"
              size={25}
              style={{ alignSelf: "flex-end" }}
              color={"#fdc500"}
            />
          </TouchableOpacity>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ color: "white", left: 10, bottom: 10 }}>
              {educationarr.Name} -
            </Text>
            <Text
              style={{
                color: "white",
                left: 15,
                bottom: 10,
                fontWeight: "bold"
              }}
            >
              Academic Background
            </Text>
          </View>

          <Text style={{ color: "white", fontSize: 18, left: 10 }}>
            Institution Name
          </Text>
        </View>
      </Modal>

      <Modal key={XParray.ID} isVisible={XP}>
        <View
          style={{
            backgroundColor: "#333939",
            width: "100%",
            height: "50%",
            alignSelf: "center",
            borderRadius: 10
          }}
        >
          <TouchableOpacity onPress={() => closePopup()}>
            <MaterialIcons
              name="clear"
              size={25}
              style={{ alignSelf: "flex-end" }}
              color={"#fdc500"}
            />
          </TouchableOpacity>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ color: "white", left: 10, bottom: 10 }}>
              {XParray.Name} -
            </Text>
            <Text
              style={{
                color: "white",
                left: 15,
                bottom: 10,
                fontWeight: "bold"
              }}
            >
              Experience
            </Text>
          </View>
          <Text style={{ left: 5, color: "white", fontWeight: "bold" }}>
            Years of experience
          </Text>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 25,
              borderWidth: 1,
              justifyContent: "center",
              borderColor: "white",
              left: 5,
              top: 5
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 18,
                alignSelf: "center",
                color: "#fdc500"
              }}
            >
              {XParray.Experience}
            </Text>
          </View>
          <Card.Divider
            style={{ backgroundColor: "black", top: 10 }}
          ></Card.Divider>
          <View style={{ flexDirection: "row", top: 5 }}>
            <Text
              style={{
                color: "white",
                left: 5,
                fontWeight: "bold",
                alignSelf: "center"
              }}
            >
              Tutoritto hours
            </Text>
            <View
              style={{
                backgroundColor: "#fdc500",
                width: 25,
                height: 25,
                justifyContent: "center",
                borderRadius: 20,
                left: 10,
                alignSelf: "center"
              }}
            >
              <Image
                source={require("../assets/blacklogo.png")}
                style={{
                  width: 25,
                  height: 25,
                  opacity: 1,
                  position: "relative",
                  alignSelf: "center",
                  resizeMode: "contain"
                }}
              />
            </View>
          </View>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 25,
              borderWidth: 1,
              justifyContent: "center",
              borderColor: "white",
              left: 5,
              top: 5
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 18,
                alignSelf: "center",
                color: "#fdc500"
              }}
            >
              20
            </Text>
          </View>
        </View>
      </Modal>

      <Modal isVisible={expertise}>
        <View
          style={{
            backgroundColor: "#333939",
            width: "100%",
            height: "50%",
            alignSelf: "center",
            borderRadius: 10
          }}
        >
          <TouchableOpacity onPress={() => closePopup()}>
            <MaterialIcons
              name="clear"
              size={25}
              style={{ alignSelf: "flex-end" }}
              color={"#fdc500"}
            />
          </TouchableOpacity>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ color: "white", left: 10, bottom: 10 }}>
              {modalkey.Name} -
            </Text>
            <Text
              style={{
                color: "white",
                left: 15,
                bottom: 10,
                fontWeight: "bold"
              }}
            >
              Expertise & Skills
            </Text>
          </View>
          <FlatList
            data={expertisearray}
            renderItem={({ item }) => {
              const string = Object.values(item.Specific);
              return (
                <View
                  style={{
                    alignSelf: "center",
                    alignSelf: "center",
                    justifyContent: "center",
                    left: 20
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <View
                      style={{
                        backgroundColor: "#fdc500",
                        width: 40,
                        height: 40,
                        justifyContent: "center",
                        borderRadius: 20,
                        left: 5,
                        alignSelf: "flex-start"
                      }}
                    >
                      <Image
                        source={{ uri: item.Icon }}
                        style={{
                          width: 25,
                          height: 25,
                          opacity: 1,
                          position: "relative",
                          alignSelf: "center",
                          resizeMode: "contain"
                        }}
                      />
                    </View>
                    <View style={{ flexDirection: "column", marginLeft: 10 }}>
                      <Text style={{ fontWeight: "bold", color: "white" }}>
                        {item.Name}
                      </Text>

                      <View
                        style={{ flexDirection: "row", alignSelf: "center" }}
                      >
                        <View
                          style={{ flexDirection: "column", width: "100%" }}
                        >
                          <Text style={{ color: "white" }}>
                            General: {item.General}{" "}
                          </Text>

                          <Text style={{ color: "white" }}>Specific:- </Text>
                          <View style={{ flexDirection: "column" }}>
                            {string.map((strvalue, i) => {
                              return (
                                <View
                                  key={i}
                                  style={{ flexDirection: "column" }}
                                >
                                  <Text style={{ color: "white", right: 5 }}>
                                    {"\u2022"}
                                    {strvalue}
                                  </Text>
                                </View>
                              );
                            })}
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                  <Card.Divider
                    style={{ backgroundColor: "black", marginTop: 5 }}
                  />
                </View>
              );
            }}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </Modal>
      <Modal isVisible={language}>
        <View
          style={{
            backgroundColor: "#333939",
            width: "100%",
            height: "50%",
            alignSelf: "center",
            borderRadius: 10
          }}
        >
          <TouchableOpacity onPress={() => closePopup()}>
            <MaterialIcons
              name="clear"
              size={25}
              style={{ alignSelf: "flex-end" }}
              color={"#fdc500"}
            />
          </TouchableOpacity>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ color: "white", left: 10, bottom: 10 }}>
              {languagearr.Name} -
            </Text>
            <Text
              style={{
                color: "white",
                left: 15,
                bottom: 10,
                fontWeight: "bold"
              }}
            >
              Spoken Languages
            </Text>
          </View>

          <FlatList
            data={languagearr.Language}
            renderItem={({ item }) => {
              return (
                <View style={{ top: 5, left: 10 }}>
                  <Text
                    style={{
                      color: "white",
                      fontSize: 14,
                      paddingVertical: 10
                    }}
                  >
                    {"\u2022"} {item}
                  </Text>
                </View>
              );
            }}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </Modal>

      {/* <Modal key={(name, title, tutorstring)} isVisible={reviews}>
        <View
          style={{
            backgroundColor: "#333939",
            width: "110%",
            height: "100%",
            alignSelf: "center",
            borderRadius: 10,
          }}
        >
          <TouchableOpacity onPress={() => closePopup()}>
            <MaterialIcons
              name="clear"
              size={25}
              style={{ alignSelf: "flex-end" }}
              color={"#fdc500"}
            />
          </TouchableOpacity>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ color: "white", left: 5, bottom: 10 }}>
              {tutorstring} -
            </Text>
            <Text
              style={{
                color: "white",
                left: 10,
                bottom: 10,
                fontWeight: "bold",
              }}
            >
              Tutoritto Reviews
            </Text>
          </View>
          <Text style={{ color: "white", bottom: 10, left: 5, zIndex: 1 }}>
            The average review scores of:
          </Text>
          <View style={{ flexDirection: "row", bottom: 4 }}>
            <Text
              style={{
                color: "white",
                top: 4,
                fontWeight: "bold",
                left: 8,
                zIndex: 1,
              }}
            >
              A-
            </Text>
            <CheckBox
              onPress={() => setisthistutor(!isThisTutor)}
              title={tutorstring}
              checkedColor={"#F1C411"}
              checked={isThisTutor}
              containerStyle={{
                width: "auto",
                right: 5,
                backgroundColor: "#333939",
                borderColor: "#333939",
                bottom: 15,
              }}
              textStyle={{
                color: "white",
                width: "auto",
                alignSelf: "center",
                right: 10,
              }}
              style={{}}
            />
            <View style={styles.row}>
              <StarRating
                maxStars={5}
                starSize={13}
                disabled={true}
                rating={totalaverage}
                fullStarColor="#fdc500"
                emptyStarColor="white"
                starStyle={{
                  top: 6,
                  right: 40,
                }}
              />
            </View>
          </View>
          <View style={{ flexDirection: "row", bottom: 20 }}>
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                left: 8,
                zIndex: 1,
              }}
            >
              B-
            </Text>
            <CheckBox
              onPress={() => setcategory(!isCategory)}
              title="Same Category Tuto-rittoes"
              checkedColor={"#F1C411"}
              checked={isCategory}
              containerStyle={{
                width: "auto",
                right: 5,
                backgroundColor: "#333939",
                borderColor: "#333939",
                bottom: 20,
              }}
              textStyle={{
                color: "white",
                width: "auto",
                alignSelf: "center",
                right: 10,
              }}
              style={{}}
            />
            <View style={styles.row}>
              <StarRating
                maxStars={5}
                starSize={13}
                disabled={true}
                rating={categoryaverage}
                fullStarColor="#fdc500"
                emptyStarColor="white"
                starStyle={{
                  top: 2,
                  right: 40,
                }}
              />
            </View>
          </View>
          <View style={{ flexDirection: "row", bottom: 38 }}>
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                left: 8,
                zIndex: 1,
              }}
            >
              C-
            </Text>
            <CheckBox
              onPress={() => setisalltutors(!isAlltutors)}
              title="All Tuto-rittoes"
              checkedColor={"#F1C411"}
              checked={isAlltutors}
              containerStyle={{
                width: "auto",
                alignSelf: "center",
                right: 5,
                backgroundColor: "#333939",
                borderColor: "#333939",
                bottom: 20,
              }}
              textStyle={{
                color: "white",
                width: "auto",
                alignSelf: "center",
                right: 10,
              }}
              style={{ alignSelf: "center" }}
            />
            <View style={styles.row}>
              <StarRating
                maxStars={5}
                starSize={13}
                disabled={true}
                rating={allaverage}
                fullStarColor="#fdc500"
                emptyStarColor="white"
                starStyle={{
                  top: 2,
                  right: 40,
                }}
              />
            </View>
          </View>
          <BarCharts
            userData={userData}
            isCategory={isCategory}
            isAlltutors={isAlltutors}
            isThisTutor={isThisTutor}
            totalaverage={totalaverage}
            q1average={q1average}
            q2average={q2average}
            q3average={q3average}
            q4average={q4average}
            q1allavg={q1allavg}
            q2allavg={q2allavg}
            q3allavg={q3allavg}
            q4allavg={q4allavg}
            q1catavg={q1catavg}
            q2catavg={q2catavg}
            q3catavg={q3catavg}
            q4catavg={q4catavg}
            allaverage={allaverage}
            categoryaverage={categoryaverage}
          />

          <FlatList
            data={reviewData}
            style={{ bottom: Platform.OS === "ios" ? 30 : 15 }}
            renderItem={({ item }) => (
              <View>
                <View
                  style={{
                    marginRight: "auto",
                    marginLeft: 10,
                    flexDirection: "row",
                  }}
                >
                  <Image
                    source={{ uri: item.StudentPic }}
                    style={{ width: 50, height: 50, borderRadius: 30 }}
                  />
                  <View
                    style={{
                      flexDirection: "column",
                      alignItems: "flex-start",
                      marginLeft: 9,
                    }}
                  >
                    <Text
                      style={{
                        alignItems: "flex-start",
                        fontWeight: "bold",
                        color: "white",
                      }}
                    >
                      {" "}
                      {item.StudentName}
                    </Text>
                    <View style={styles.row}>
                      <Text style={{ color: "white" }}>
                        {" "}
                        Communication Skills{" "}
                      </Text>
                      <StarRating
                        maxStars={5}
                        starSize={10}
                        disabled={true}
                        rating={item.CommunicationSkill}
                        fullStarColor="#fdc500"
                        emptyStarColor="white"
                        starStyle={{
                          alignItems: "flex-start",
                          marginTop: 5,
                          marginLeft: 5,
                        }}
                      />
                    </View>
                    <View style={styles.row}>
                      <Text style={{ color: "white" }}> Teaching Skills </Text>
                      <StarRating
                        maxStars={5}
                        starSize={10}
                        disabled={true}
                        rating={item.TeachingSkill}
                        fullStarColor="#fdc500"
                        emptyStarColor="white"
                        starStyle={{
                          alignItems: "flex-start",
                          marginTop: 5,
                          marginLeft: 5,
                        }}
                      />
                    </View>
                    <View style={styles.row}>
                      <Text style={{ color: "white" }}> Work Ethics </Text>
                      <StarRating
                        maxStars={5}
                        starSize={10}
                        disabled={true}
                        rating={item.WorkEthic}
                        fullStarColor="#fdc500"
                        emptyStarColor="white"
                        starStyle={{
                          alignItems: "flex-start",
                          marginTop: 5,
                          marginLeft: 5,
                        }}
                      />
                    </View>
                    <View style={styles.row}>
                      <Text style={{ color: "white" }}>
                        {" "}
                        Subject Knowledge{" "}
                      </Text>
                      <StarRating
                        maxStars={5}
                        starSize={10}
                        disabled={true}
                        rating={item.KnowledgeSubject}
                        fullStarColor="#fdc500"
                        emptyStarColor="white"
                        starStyle={{
                          alignItems: "flex-start",
                          marginTop: 5,
                          marginLeft: 5,
                        }}
                      />
                    </View>
                    <Text style={{ marginLeft: 5, color: "white" }}>
                      {item.Review}
                    </Text>
                  </View>
                </View>
                <Card.Divider
                  style={{ backgroundColor: "black", marginTop: 5 }}
                />
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </Modal> */}

      <Modal
        isVisible={bookpopup}
        style={{ width: "100%", height: "100%", right: 5 }}
      >
        <KeyboardAvoidingView
          enabled={Platform.OS === "ios" ? true : false}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{
            width: "95%",
            height: "150%",
            backgroundColor: "#333939",
            right: 5,
            borderRadius: 10,
            flex: 1
          }}
        >
          <TouchableOpacity onPress={() => setbookpopup(false)}>
            <MaterialIcons
              name="clear"
              size={25}
              style={{ alignSelf: "flex-end" }}
              color={"#fdc500"}
            />
          </TouchableOpacity>
          <ScrollView
            scrollToOverflowEnabled={true}
            contentContainerStyle={{ flexGrow: 1, height: "120%" }}
          >
            <View style={{ height: "auto" }}>
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "center",
                  alignSelf: "center"
                }}
              >
                Add your booking details
              </Text>
              <Text
                style={{
                  color: "white",
                  marginTop: 10,
                  fontWeight: "bold",
                  textAlign: "center",
                  alignSelf: "center"
                }}
              >
                Choose your preferred session timings
              </Text>
              <Calendar
                onDayPress={(day) => onDayPress(day)}
                style={{
                  width: "auto",
                  height: "auto",
                  marginTop: 10,
                  borderRadius: 10
                }}
                hideExtraDays
                enableSwipeMonths={true}
                markedDates={{
                  ...dateString,
                  [isday]: {
                    selected: true,
                    marked: true,
                    selectedColor: "green"
                  }
                }}
                theme={{
                  "stylesheet.day.period": {
                    base: {
                      overflow: "hidden",
                      height: "10%"
                    },
                    wrapper: {
                      borderRadius: 2,
                      backgroundColor: "blue",
                      overflow: "hidden",
                      height: "10%"
                    }
                  },
                  "monthTitleTextStyle": {
                    color: "#6d95da",
                    fontWeight: "300",
                    fontSize: 16
                  },

                  "selectedDayBackgroundColor": "#fdc500",
                  "todayTextColor": "#4d194d",
                  "arrowColor": "#6d95da",
                  "dayTextColor": "#6d95da",
                  "textSectionTitleColor": "#6d95da"
                }}
              />

              {istimefound ? (
                <View
                  style={{
                    flexDirection: "column",
                    marginTop: 10,
                    width: "auto",
                    marginRight: 20
                  }}
                >
                  {TimeSlots.map((item, i) => {
                    var endtimestring = moment(item.endTime).format("hh:mm a");
                    var starttimestring = moment(item.startTime).format(
                      "hh:mm a"
                    );

                    const startTime = new Date(
                      item.startTime
                    ).toLocaleTimeString("en-US");
                    const endTime = new Date(item.endTime).toLocaleTimeString(
                      "en-US"
                    );
                    return (
                      <TouchableOpacity
                        key={i}
                        onPress={() => selectTimings(item)}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            width: 150,
                            height: 30,
                            backgroundColor:
                              slots === item ? "green" : "#fdc500",

                            borderRadius: 10,
                            marginTop: 5
                          }}
                        >
                          <Text
                            style={{
                              color: "black",
                              alignSelf: "center",
                              paddingHorizontal: 5
                            }}
                          >
                            {starttimestring}-{endtimestring}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : null}
              <Text
                style={{ color: "white", marginTop: 0, textAlign: "center" }}
              >
                Topic:
              </Text>
              <TextInput
                style={styles.TextInput}
                onChangeText={(text) => settopic(text)}
                value={topic}
              />
              <Text
                style={{ color: "white", marginTop: 10, textAlign: "center" }}
              >
                Special request:
              </Text>
              <TextInput
                multiline={true}
                style={{
                  borderWidth: 2,
                  marginTop: 5,
                  borderColor: "#e8a80c",
                  height: "8%",
                  textAlign: "justify",
                  color: "white"
                }}
                onChangeText={(text) => setspecialrequest(text)}
                value={specialrequest}
              />
              <TouchableOpacity
                onPress={() => pickdoc()}
                style={{
                  paddingHorizontal: 20,
                  height: 30,
                  backgroundColor: "#fdc500",
                  justifyContent: "center",
                  borderRadius: 10,
                  marginTop: 10,
                  flexDirection: "row",
                  alignSelf: "center"
                }}
              >
                <MaterialIcons
                  name="folder"
                  size={15}
                  style={{ alignSelf: "center" }}
                />
                {filename != "" ? (
                  <Text>{filename}</Text>
                ) : (
                  <Text style={{ alignSelf: "center" }}>Documents</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => BookSession()}
                style={{
                  top: 10,
                  backgroundColor: "#fdc500",
                  height: 30,
                  borderRadius: 10,
                  justifyContent: "center",
                  flexDirection: "row",
                  alignSelf: "center",
                  width: "80%",
                  paddingHorizontal: 100
                }}
              >
                <MaterialIcons
                  name="book-online"
                  size={15}
                  style={{ alignSelf: "center" }}
                />
                <Text style={{ alignSelf: "center" }}>Book</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
      <PasswordModal
        open={pass}
        close={() => {
          setPass(!pass);
        }}
        onSuccess={() => {
          setPass(false);
          openPopUp(selectedGig);
        }}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  row: {
    flexDirection: "row"
  },
  TextInput: {
    borderColor: "#e8a80c",
    borderWidth: 2,
    marginTop: 5,
    color: "white",
    textAlign: "left"
  },
  backgroundVideo: {
    alignSelf: "center",
    left: 0,
    bottom: 0,
    right: 0,
    width: 300,
    height: 200
  }
});
