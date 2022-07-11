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
import YoutubePlayer from "react-native-youtube-iframe";
import { KeyboardAvoidingView } from "react-native";
import * as demodata from "../demodata.json";
import AdvancedList from "./AdvancedList";
import * as DocumentPicker from "expo-document-picker";
import moment from "moment";
import { Calendar } from "react-native-calendars";
import { BarChart, StackedBarChart } from "react-native-chart-kit";
import BarCharts from "./BarCharts";
import CrowdFundingEvent from "./CrowdFundingEvent";
import firestore, { firebase } from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import VideoPlayer from "react-native-video-controls";

// uddipan
import { copilot, walkthroughable, CopilotStep } from "react-native-copilot";
import { Linking } from "react-native";

const WalkthroughableText = walkthroughable(Text);
const WalkthroughableImage = walkthroughable(Image);
const WalkthroughableTouchableOpacity = walkthroughable(TouchableOpacity);
const WalkthroughableView = walkthroughable(View);

const TooltipComponent = ({
  isFirstStep,
  isLastStep,
  handleNext,
  handlePrev,
  handleStop,
  currentStep
}) => (
  <View
    style={{ width: 100, height: 100, borderWidth: 1, borderColor: "#f00" }}
  ></View>
);

import PasswordModal from "./passwordModal.js/PasswordModal";

function Lists(props) {
  const [packagesModal, setPackagesModal] = useState(false);
  const [samolesModal, setSamolesModal] = useState(false);
  const [samolesModalTab, setSamolesModalTab] = useState(1);

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
  const [bookpopupTab, setBookpopupTab] = useState(1);
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
  const [requestcount, setrequestcount] = useState(0);
  const [q1average, setq1average] = useState(0);
  const [q2average, setq2average] = useState(0);
  const [q3average, setq3average] = useState(0);
  const [q4average, setq4average] = useState(0);
  const [totalaverage, settotalaverage] = useState(0);
  const [requestarray, setRequestArray] = useState([]);
  const [itemid, setitemid] = useState("");
  const [tutorid, settutorid] = useState("");
  const [name, setname] = useState([]);
  const [title, settitle] = useState("");
  const [tutorstring, setTutorString] = useState("");
  const [selectedGig, setSelectedGig] = useState({});
  const [pass, setPass] = useState(false);
  const [userSlots, setuserSlots] = useState([]);

  let markedEvents = {};
  let timeSlots = [];

  const Reviews = [];
  const Ratings1 = [];
  const Ratings2 = [];
  const Rating3 = [];
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
      var obj = null;
      //get list
      for (var i = 0; i < tutorLists.length; i++) {
        const dataset = tutorLists[i].availability;
        obj = Object.values(dataset);
      }
      if (obj) {
        obj.forEach((snapshot) => {
          if (date === snapshot.dateString && snapshot.booked === "false") {
            timeSlots.push(snapshot);
            SetTimeSlots(timeSlots);
            setTimeFound(true);
          }
        });
        let num = obj.findIndex((e) => date === e.dateString);
        if (num === -1) {
          setTimeFound(false);
        }
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

  const pickdoc = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({});

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
        // const url = await snapshot.ref.getDownloadURL();
        const url = await storage()
          .ref("BookingFile/" + userData.Name + result.name)
          .getDownloadURL();
        setdownloadurl(url);

        // console.log('url', url)
      }
    } catch (err) {
      console.log(err);
    }
  };

  //opening modals
  function openPopUp(item) {
    navigation.navigate("CrowdFundingEvent", {
      EventDetails: item,
      Timer: string,
      userData: props.userData.ID
    });
    // setmodaldata(item);

    setpopup(true);
  }
  const pushforSkills = async (item) => {
    isSkills(true);
    // setuserSlots(item.availability);
    await Timings.where("ID", "==", item.ID)
      .get()
      .then((snapshot) => {
        if (!snapshot.empty) {
          snapshot.docs.map((d) => {
            const availability = d.data()?.availability;
            setuserSlots(availability);
          });
        }
      });
    setskillarr(item);
  };
  function pushforXP(item) {
    isXP(true);
    setxparray(item);
    setexparray(item.Categories);
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
    setSelectedGig(item);
  }

  async function pushforReviews(item) {
    isreviews(true);
    setitemid(item.ID);
    //set the tutor title name
    setname(item.Name);
    settitle(item.Title || "");
    let stringName = (item?.Title || "") + " " + item.Name;
    setTutorString(stringName);
    return;
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
    if (props.startNextCopilot) props.start();
  }, [props.startNextCopilot]);
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
    var itemList = [...tutordata];
    itemList.splice(index, 1);
    updateTutor(itemList);
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
      var obj = null;
      //get list
      for (var i = 0; i < List.length; i++) {
        const dataset = List[i].availability;
        obj = Object.values(dataset);
      }
      //var objID = Object.keys(dataset);
      const dateList = [];
      if (obj) {
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
      }
    });
  }
  function leftrender(item) {
    setSelectedGig(item);
    setbookpopup(true);
    settutorid(item.ID);
    getTutorsTimings(item.ID);
  }
  const getMinimumPackage = (packages) => {
    let minPackage = packages.reduce(function (prev, curr) {
      return prev.Price < curr.Price ? prev : curr;
    });
    return minPackage;
  };
  return (
    <SafeAreaView>
      <FlatList
        data={tutordata}
        scrollEnabled={true}
        initialNumToRender={10}
        windowSize={5}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={30}
        removeClippedSubviews={false}
        style={{ width: "100%", height: "100%", flexGrow: 1 }}
        keyExtractor={(item, index) => {
          return index.toString();
        }}
        renderItem={({ item, index }) => {
          let min = 0;
          if (item.WithinHours) {
            // console.log(item.WithinHours, "--->");
            min = Math.min(...item.WithinHours.filter((hour) => hour !== 0));
          }
          if (index === tutordata.length - 1) {
            return (
              <View style={{ alignSelf: "center", width: "100%" }}>
                <CopilotStep
                  text="Confirm payment request to be submitted by the Tuto-Rittoe once the session is completed so that we release your payment to the Tuto-rittoes account."
                  order={18}
                  name="Card6"
                >
                  <WalkthroughableView>
                    <CopilotStep
                      text="Join your session as per the scheduled time from the app and enjoy or wait until the asynchronous service request has been completed."
                      order={16}
                      name="Card5"
                    >
                      <WalkthroughableView>
                        <CopilotStep
                          text="You can see your booked session in the upcoming sessions tab."
                          order={15}
                          name="Card4"
                        >
                          <WalkthroughableView>
                            <CopilotStep
                              text="You will be notified and request to pay the agreed upon amount ($) using Google Pay or PayPal. The amount will be blocked until the session is conducted or the order is completed.
                "
                              order={14}
                              name="Card3"
                            >
                              <WalkthroughableView>
                                <CopilotStep
                                  text="Wait until the Tutor-ruttoe chosen accepts your request."
                                  order={13}
                                  name="Card2"
                                >
                                  <WalkthroughableView>
                                    <CopilotStep
                                      text=" Once you are ready, you need to SWIPE RIGHT and choose your preferred timings as per the chosen Tuto-rittoes availability (for synchronous sessions)."
                                      order={12}
                                      name="Card1"
                                    >
                                      <WalkthroughableView>
                                        <Swipeable
                                          renderLeftActions={(
                                            progress,
                                            dragx
                                          ) => (
                                            <>
                                              <LeftItem index={index} />
                                            </>
                                          )}
                                          renderRightActions={(
                                            progress,
                                            dragx
                                          ) => (
                                            <>
                                              <RightItem index={index} />
                                            </>
                                          )}
                                          onSwipeableLeftWillOpen={() => {
                                            // setOnetoOne(true), leftrender(item);
                                            setSelectedGig(item);
                                            // setPass(!pass);
                                            leftrender(selectedGig);
                                            // console.log('left')
                                          }}
                                          onSwipeableRightWillOpen={() => {
                                            // setOnetoOne(true), rightrender(index);
                                            // console.log('right')
                                          }}
                                        >
                                          <Card
                                            containerStyle={{
                                              borderRadius: 20,
                                              shadowColor: "black",
                                              width: "90%",
                                              shadowOpacity: 0.5,
                                              shadowOffset: {
                                                width: 5,
                                                height: 5
                                              },
                                              backgroundColor: "#333939",
                                              borderColor: "#161a1d",
                                              elevation: 10,
                                              shadowRadius: 10
                                            }}
                                          >
                                            {Array.isArray(item.Package) && (
                                              <>
                                                <CopilotStep
                                                  text="You can see their offered packages that range from bronze to platinum."
                                                  order={2}
                                                  name="PricingPackage"
                                                >
                                                  <WalkthroughableTouchableOpacity
                                                    onPress={() => {
                                                      setSelectedGig(item);
                                                      setPackagesModal(
                                                        !packagesModal
                                                      );
                                                    }}
                                                    style={{
                                                      backgroundColor:
                                                        "#F1C411",
                                                      alignSelf: "flex-end",
                                                      borderRadius: 10,
                                                      height: 35,
                                                      width: 35,
                                                      alignContent: "center",
                                                      alignItems: "center",
                                                      justifyContent: "center",
                                                      top: 0,
                                                      right: 60,
                                                      position: "absolute"
                                                    }}
                                                  >
                                                    <View
                                                      style={{
                                                        backgroundColor: "red",
                                                        width: 20,
                                                        height: 20,
                                                        borderRadius: 15,
                                                        justifyContent:
                                                          "center",
                                                        position: "absolute",
                                                        top: -12,
                                                        right: -7,
                                                        zIndex: 9
                                                      }}
                                                    >
                                                      <Text
                                                        style={{
                                                          fontSize: 12,
                                                          alignSelf: "center",
                                                          color: "white"
                                                        }}
                                                      >
                                                        {item.Package.length}
                                                      </Text>
                                                    </View>
                                                    <Text
                                                      style={{
                                                        color: "black",
                                                        fontSize: 12
                                                      }}
                                                    >
                                                      From
                                                    </Text>
                                                    <Text
                                                      style={{
                                                        color: "black",
                                                        fontSize: 12
                                                      }}
                                                    >
                                                      $
                                                      {
                                                        getMinimumPackage(
                                                          item.Package
                                                        ).Price
                                                      }
                                                    </Text>
                                                  </WalkthroughableTouchableOpacity>
                                                </CopilotStep>
                                                <Text
                                                  style={{
                                                    fontSize: 10,
                                                    fontWeight: "bold",
                                                    color: "#fff",
                                                    position: "absolute",
                                                    top: 10,
                                                    right: 42
                                                  }}
                                                >
                                                  OR
                                                </Text>
                                              </>
                                            )}
                                            <CopilotStep
                                              text="You can see their hourly rate"
                                              order={3}
                                              name="PricingHourly"
                                            >
                                              <WalkthroughableTouchableOpacity
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

                                                  position: "absolute"
                                                }}
                                              >
                                                <Text
                                                  style={{
                                                    color: "black",
                                                    fontSize: 12
                                                  }}
                                                >
                                                  ${item.Rate}
                                                </Text>
                                                <Text
                                                  style={{
                                                    color: "black",
                                                    fontSize: 12
                                                  }}
                                                >
                                                  /hr
                                                </Text>
                                              </WalkthroughableTouchableOpacity>
                                            </CopilotStep>
                                            {/* </CopilotStep> */}

                                            <View
                                              style={{ flexDirection: "row" }}
                                            >
                                              <CopilotStep
                                                text="You can see their education background by clicking their profile picture"
                                                order={1}
                                                name="CardImg"
                                              >
                                                <WalkthroughableView
                                                  style={{
                                                    width: 50,
                                                    height: 50,
                                                    borderRadius: 25
                                                  }}
                                                >
                                                  <TouchableOpacity
                                                    onPress={() =>
                                                      pushforEducation(item)
                                                    }
                                                    style={{
                                                      borderColor:
                                                        item.level === "bronze"
                                                          ? "#cd7f32"
                                                          : item.level ===
                                                            "silver"
                                                          ? "#D9D8D6"
                                                          : item.level ===
                                                            "gold"
                                                          ? "#DFBD69"
                                                          : "",
                                                      borderRadius: 25,
                                                      borderWidth:
                                                        item.level?.length > 0
                                                          ? 5
                                                          : 0,
                                                      width: 55,
                                                      height: 55
                                                    }}
                                                  >
                                                    <Image
                                                      source={{
                                                        uri: item.Photo
                                                      }}
                                                      style={{
                                                        width: 45,
                                                        height: 45,
                                                        borderRadius: 25,
                                                        marginBottom: 5
                                                      }}
                                                    />
                                                  </TouchableOpacity>
                                                </WalkthroughableView>
                                              </CopilotStep>
                                              <View
                                                style={{
                                                  flexDirection: "column"
                                                }}
                                              >
                                                <View
                                                  style={{
                                                    flexDirection: "row",
                                                    left: 0
                                                  }}
                                                >
                                                  <Text
                                                    style={{
                                                      alignItems: "flex-start",
                                                      color: "white",
                                                      textAlign: "left",
                                                      fontSize: 12,
                                                      width: "55%"
                                                    }}
                                                  >
                                                    {" "}
                                                    {item.NameTitle}{" "}
                                                    {item?.Name?.split(" ")
                                                      ?.length >= 2
                                                      ? item?.Name?.split(
                                                          " "
                                                        )?.[1]
                                                      : item?.Name?.split(
                                                          " "
                                                        )?.[0]}
                                                    {/* {item.Name} */}{" "}
                                                    {/* {item.Country[0]} */}
                                                    {/* , PhD */}
                                                  </Text>
                                                  {item.isVerified && (
                                                    <MaterialIcons
                                                      name="verified-user"
                                                      style={{
                                                        alignSelf: "center",
                                                        marginLeft: 10,
                                                        position: "absolute",
                                                        top: 0,
                                                        left: -55
                                                      }}
                                                      size={14}
                                                      color="#39FF14"
                                                    />
                                                  )}
                                                </View>
                                                <View
                                                  style={{
                                                    flexDirection: "row",
                                                    left: 5
                                                  }}
                                                >
                                                  <CopilotStep
                                                    text="Make sure to submit reviews after so that others can benefit from your experience."
                                                    order={17}
                                                    name="rattings"
                                                  >
                                                    <WalkthroughableView>
                                                      <StarRating
                                                        maxStars={5}
                                                        starSize={12}
                                                        disabled={true}
                                                        rating={0}
                                                        fullStarColor="#F1C411"
                                                        emptyStarColor="white"
                                                        starStyle={{
                                                          alignItems: "center",
                                                          marginLeft: 0
                                                        }}
                                                      />
                                                    </WalkthroughableView>
                                                  </CopilotStep>
                                                  {min === 1 ? (
                                                    <Text
                                                      style={{
                                                        color: "white",
                                                        left: 7,
                                                        fontWeight: "bold",
                                                        fontSize: 12
                                                      }}
                                                    >
                                                      - Within1 {min} hour
                                                    </Text>
                                                  ) : (
                                                    <Text
                                                      style={{
                                                        color: "white",
                                                        left: 7,
                                                        fontWeight: "bold",
                                                        fontSize: 12
                                                      }}
                                                    >
                                                      - Within2 {min} hours
                                                    </Text>
                                                  )}
                                                </View>

                                                <View
                                                  style={{
                                                    flexDirection: "row",
                                                    marginTop: 17,
                                                    right: 42
                                                  }}
                                                >
                                                  <CopilotStep
                                                    text="You can see their unique skills"
                                                    order={4}
                                                    name="btn1"
                                                  >
                                                    <WalkthroughableTouchableOpacity
                                                      onPress={() =>
                                                        pushforReviews(item)
                                                      }
                                                      style={{
                                                        backgroundColor:
                                                          "#F1C411",
                                                        alignSelf: "center",
                                                        borderRadius: 10,
                                                        height: 35,
                                                        width: 35,
                                                        alignContent: "center",
                                                        alignItems: "center",
                                                        justifyContent:
                                                          "center",
                                                        marginRight: 20
                                                      }}
                                                    >
                                                      <MaterialIcons
                                                        name="rate-review"
                                                        style={{
                                                          alignSelf: "center"
                                                        }}
                                                        size={20}
                                                      />
                                                    </WalkthroughableTouchableOpacity>
                                                  </CopilotStep>
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
                                                  <CopilotStep
                                                    text="You can see their availability"
                                                    order={5}
                                                    name="btn2"
                                                  >
                                                    <WalkthroughableTouchableOpacity
                                                      onPress={() =>
                                                        pushforSkills(item)
                                                      }
                                                    >
                                                      <View
                                                        style={{
                                                          backgroundColor:
                                                            "#F1C411",
                                                          alignSelf: "center",
                                                          borderRadius: 10,
                                                          height: 35,
                                                          width: 35,
                                                          alignContent:
                                                            "center",
                                                          alignItems: "center",
                                                          justifyContent:
                                                            "center"
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
                                                    </WalkthroughableTouchableOpacity>
                                                  </CopilotStep>
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
                                                  <CopilotStep
                                                    text="You can see their experience"
                                                    order={6}
                                                    name="btn3"
                                                  >
                                                    <WalkthroughableTouchableOpacity
                                                      onPress={() =>
                                                        pushforXP(item)
                                                      }
                                                    >
                                                      <View
                                                        style={{
                                                          backgroundColor:
                                                            "#F1C411",
                                                          alignSelf: "center",
                                                          borderRadius: 10,
                                                          height: 35,
                                                          width: 35,
                                                          alignContent:
                                                            "center",
                                                          alignItems: "center",
                                                          justifyContent:
                                                            "center",
                                                          marginLeft: 5
                                                        }}
                                                      >
                                                        <Image
                                                          source={require("../assets/experience.png")}
                                                          style={{
                                                            alignSelf: "center",
                                                            width: 20,
                                                            height: 20,
                                                            resizeMode:
                                                              "contain",
                                                            left: 2
                                                          }}
                                                        />
                                                      </View>
                                                    </WalkthroughableTouchableOpacity>
                                                  </CopilotStep>
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
                                                            item?.Categories.map(
                                                              function (o) {
                                                                if (
                                                                  parseInt(
                                                                    o.experience
                                                                  )
                                                                ) {
                                                                  return parseInt(
                                                                    o.experience
                                                                  );
                                                                } else {
                                                                  return 0;
                                                                }
                                                              }
                                                            )
                                                          )
                                                        : "0"}
                                                    </Text>
                                                  </View>
                                                  <CopilotStep
                                                    text="You can see their experience"
                                                    order={7}
                                                    name="btn4"
                                                  >
                                                    <WalkthroughableTouchableOpacity
                                                      onPress={() =>
                                                        pushforExpertise(item)
                                                      }
                                                    >
                                                      <View
                                                        style={{
                                                          backgroundColor:
                                                            "#F1C411",
                                                          alignSelf:
                                                            "flex-start",
                                                          borderRadius: 10,
                                                          height: 35,
                                                          width: 35,
                                                          alignContent:
                                                            "center",
                                                          alignItems: "center",
                                                          justifyContent:
                                                            "center",
                                                          marginLeft: 5
                                                        }}
                                                      >
                                                        <Image
                                                          source={require("../assets/interests.png")}
                                                          style={{
                                                            alignSelf: "center",
                                                            width: 25,
                                                            height: 25,
                                                            resizeMode:
                                                              "contain"
                                                          }}
                                                        />
                                                      </View>
                                                    </WalkthroughableTouchableOpacity>
                                                  </CopilotStep>
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
                                                        ? item?.Categories
                                                            ?.length
                                                        : "0"}
                                                    </Text>
                                                  </View>
                                                  <CopilotStep
                                                    text="You can see their languages"
                                                    order={8}
                                                    name="btn5"
                                                  >
                                                    <WalkthroughableTouchableOpacity
                                                      onPress={() =>
                                                        pushforLanguage(item)
                                                      }
                                                    >
                                                      <View
                                                        style={{
                                                          backgroundColor:
                                                            "#F1C411",
                                                          alignSelf: "center",
                                                          borderRadius: 10,
                                                          height: 35,
                                                          width: 35,
                                                          alignContent:
                                                            "center",
                                                          alignItems: "center",
                                                          justifyContent:
                                                            "center",
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
                                                    </WalkthroughableTouchableOpacity>
                                                  </CopilotStep>
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
                                                  {/* Chat icon */}
                                                  {/* CODE ADDED BY UDDIPAN */}
                                                  {/* {item.ID !== props.userData.ID && ( */}
                                                  <>
                                                    <CopilotStep
                                                      text="You can see their samples"
                                                      order={9}
                                                      name="btn6"
                                                    >
                                                      <WalkthroughableTouchableOpacity
                                                        onPress={() => {
                                                          setSelectedGig(item);
                                                          setSamolesModal(
                                                            !samolesModal
                                                          );
                                                        }}
                                                      >
                                                        <View
                                                          style={{
                                                            backgroundColor:
                                                              "#F1C411",
                                                            alignSelf: "center",
                                                            borderRadius: 10,
                                                            height: 35,
                                                            width: 35,
                                                            alignContent:
                                                              "center",
                                                            alignItems:
                                                              "center",
                                                            justifyContent:
                                                              "center",
                                                            marginLeft: 5
                                                          }}
                                                        >
                                                          <Icon
                                                            name="play"
                                                            size={25}
                                                            style={{
                                                              alignSelf:
                                                                "center",
                                                              width: 25,
                                                              height: 25
                                                            }}
                                                          />
                                                        </View>
                                                      </WalkthroughableTouchableOpacity>
                                                    </CopilotStep>
                                                    <View
                                                      style={{
                                                        backgroundColor: "red",
                                                        width: 20,
                                                        height: 20,
                                                        borderRadius: 15,
                                                        right: 9,
                                                        justifyContent:
                                                          "center",
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
                                                        {Array.isArray(
                                                          item.Sample
                                                        )
                                                          ? item.Sample.length
                                                          : 0}
                                                      </Text>
                                                    </View>
                                                  </>
                                                  {/* )} */}
                                                  {/* CODE ADDED BY UDDIPAN */}
                                                </View>
                                              </View>
                                            </View>
                                            <View style={{ marginTop: 5 }}>
                                              {typeof item.Video ===
                                              "string" ? (
                                                <>
                                                  {item.Video.length > 0 && (
                                                    <VideoPlayer
                                                      source={{
                                                        uri: item.Video
                                                      }}
                                                      style={{
                                                        width: "100%",
                                                        height: 250,
                                                        borderRadius: 10,
                                                        marginVertical: 15
                                                      }}
                                                      disableFullscreen={true}
                                                      disableBack={true}
                                                      paused={true}
                                                      playInBackground={true}
                                                      resizeMode="cover"
                                                      poster={
                                                        item.VideoThumbnail
                                                      }
                                                    />
                                                  )}
                                                </>
                                              ) : (
                                                <YoutubePlayer
                                                  height={200}
                                                  play={playing}
                                                  videoId={"pVE92TNDwUk"}
                                                  onChangeState={onStateChange}
                                                  onFullScreenChange={(
                                                    status
                                                  ) => console.log("ok")}
                                                />
                                              )}
                                            </View>
                                            <CopilotStep
                                              text="You can even chat with them directly before any official request."
                                              order={10}
                                              name="btn7"
                                            >
                                              <WalkthroughableTouchableOpacity
                                                onPress={() =>
                                                  navigation.navigate("Chat", {
                                                    item
                                                  })
                                                }
                                                style={{
                                                  position: "absolute",
                                                  bottom: 0,
                                                  right: 0
                                                }}
                                              >
                                                <View
                                                  style={{
                                                    backgroundColor: "#fff",
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
                                                    name="message-square"
                                                    size={25}
                                                    color={"#000"}
                                                    style={{
                                                      alignSelf: "center",
                                                      width: 25,
                                                      height: 25
                                                    }}
                                                  />
                                                </View>
                                              </WalkthroughableTouchableOpacity>
                                            </CopilotStep>
                                          </Card>
                                        </Swipeable>
                                      </WalkthroughableView>
                                    </CopilotStep>
                                  </WalkthroughableView>
                                </CopilotStep>
                              </WalkthroughableView>
                            </CopilotStep>
                          </WalkthroughableView>
                        </CopilotStep>
                      </WalkthroughableView>
                    </CopilotStep>
                  </WalkthroughableView>
                </CopilotStep>
              </View>
            );
          } else {
            return (
              <View style={{ alignSelf: "center" }}>
                <Swipeable
                  renderLeftActions={(progress, dragx) => (
                    <>
                      <LeftItem index={index} />
                    </>
                  )}
                  renderRightActions={(progress, dragx) => (
                    <>
                      <RightItem index={index} />
                    </>
                  )}
                  onSwipeableLeftWillOpen={() => {
                    // setOnetoOne(true), leftrender(item);
                    setSelectedGig(item);
                    // setPass(!pass);
                    leftrender(selectedGig);
                    // console.log('left')
                  }}
                  onSwipeableRightWillOpen={() => {
                    // setOnetoOne(true), rightrender(index);
                    // console.log('right')
                  }}
                >
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
                    {Array.isArray(item.Package) && (
                      <>
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedGig(item);
                            setPackagesModal(!packagesModal);
                          }}
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
                            right: 60,
                            position: "absolute"
                          }}
                        >
                          <View
                            style={{
                              backgroundColor: "red",
                              width: 20,
                              height: 20,
                              borderRadius: 15,
                              justifyContent: "center",
                              position: "absolute",
                              top: -12,
                              right: -7,
                              zIndex: 9
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 12,
                                alignSelf: "center",
                                color: "white"
                              }}
                            >
                              {item.Package.length}
                            </Text>
                          </View>
                          <Text style={{ color: "black", fontSize: 12 }}>
                            From
                          </Text>
                          <Text style={{ color: "black", fontSize: 12 }}>
                            ${getMinimumPackage(item.Package).Price}
                          </Text>
                        </TouchableOpacity>
                        <Text
                          style={{
                            fontSize: 10,
                            fontWeight: "bold",
                            color: "#fff",
                            position: "absolute",
                            top: 10,
                            right: 42
                          }}
                        >
                          OR
                        </Text>
                      </>
                    )}
                    {/* <CopilotStep
                      text="Hey! This is the first step of the tour!"
                      order={1}
                      name="openApp"
                    > */}
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
                        position: "absolute"
                      }}
                    >
                      <Text style={{ color: "black", fontSize: 12 }}>
                        ${item.Rate}
                      </Text>
                      <Text style={{ color: "black", fontSize: 12 }}>/hr</Text>
                    </TouchableOpacity>
                    {/* </CopilotStep> */}
                    <View style={{ flexDirection: "row" }}>
                      <TouchableOpacity
                        onPress={() => pushforEducation(item)}
                        style={{
                          borderColor:
                            item.level === "bronze"
                              ? "#cd7f32"
                              : item.level === "silver"
                              ? "#D9D8D6"
                              : item.level === "gold"
                              ? "#DFBD69"
                              : "",
                          borderRadius: 25,
                          borderWidth: item.level?.length > 0 ? 5 : 0,
                          width: 55,
                          height: 55
                        }}
                      >
                        <Image
                          source={{ uri: item.Photo }}
                          style={{
                            width: 45,
                            height: 45,
                            borderRadius: 25,
                            marginBottom: 5
                          }}
                        />
                      </TouchableOpacity>
                      <View style={{ width: "100%" }}>
                        <View style={{ flexDirection: "row", left: 0 }}>
                          <Text
                            style={{
                              alignItems: "flex-start",
                              color: "white",
                              textAlign: "left",
                              width: "55%",
                              backgroundColor: "#f0f0",
                              fontSize: 12
                            }}
                          >
                            {" "}
                            {item.NameTitle}{" "}
                            {item?.Name?.split(" ")?.length >= 2
                              ? item?.Name?.split(" ")?.[1]
                              : item?.Name?.split(" ")?.[0]}
                            {/* {item.Name},  */}
                            {/* {item.Country[0]} */}
                            {/* , PhD */}
                          </Text>
                          {item.isVerified && (
                            <MaterialIcons
                              name="verified-user"
                              style={{
                                alignSelf: "center",
                                marginLeft: 10,
                                position: "absolute",
                                top: 0,
                                left: 0
                              }}
                              size={20}
                              color="#39FF14"
                            />
                          )}
                        </View>
                        <View style={{ flexDirection: "row", left: 5 }}>
                          <StarRating
                            maxStars={5}
                            starSize={12}
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
                                fontWeight: "bold",
                                fontSize: 12
                              }}
                            >
                              - Within3 {min} hour
                            </Text>
                          ) : (
                            <Text
                              style={{
                                color: "white",
                                left: 7,
                                fontWeight: "bold",
                                fontSize: 12
                              }}
                            >
                              - Within4 10 {/* {min} */}
                              hours
                            </Text>
                          )}
                        </View>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        marginBottom: 10
                      }}
                    >
                      {/* BOXES FROM HERE */}
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
                          justifyContent: "center"
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
                            justifyContent: "center",
                            marginLeft: 25
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
                            borderRadius: 10,
                            height: 35,
                            width: 35,
                            alignContent: "center",
                            alignItems: "center",
                            justifyContent: "center"
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
                          {item?.Categories?.length}
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
                          {item.Categories?.length}
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
                          {item?.Languages?.length
                            ? item?.Languages?.length
                            : "0"}
                        </Text>
                      </View>
                      {/* Chat icon */}
                      {/* CODE ADDED BY UDDIPAN */}
                      {/* {item.ID !== props.userData.ID && ( */}
                      <>
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedGig(item);
                            setSamolesModal(!samolesModal);
                          }}
                        >
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
                              name="play"
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
                            {Array.isArray(item.Sample)
                              ? item.Sample.length
                              : 0}
                          </Text>
                        </View>
                      </>
                      {/* )} */}
                      {/* CODE ADDED BY UDDIPAN */}
                    </View>
                    <View style={{ marginTop: 5 }}>
                      {typeof item.Video === "string" ? (
                        <>
                          {item.Video.length > 0 && (
                            <VideoPlayer
                              source={{
                                uri: item.Video
                              }}
                              style={{
                                width: "100%",
                                height: 250,
                                borderRadius: 10,
                                marginVertical: 15
                              }}
                              disableFullscreen={true}
                              disableBack={true}
                              paused={true}
                              playInBackground={true}
                              resizeMode="cover"
                              poster={item.VideoThumbnail}
                            />
                          )}
                        </>
                      ) : (
                        <YoutubePlayer
                          height={200}
                          play={playing}
                          videoId={"pVE92TNDwUk"}
                          onChangeState={onStateChange}
                          onFullScreenChange={(status) => console.log("ok")}
                        />
                      )}
                      {/* <YoutubePlayer
                        height={200}
                        play={playing}
                        videoId={"pVE92TNDwUk"}
                        onChangeState={onStateChange}
                        onFullScreenChange={(status) => console.log("ok")}
                      /> */}
                    </View>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("Chat", { item })}
                      style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: "#fff",
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
                          name="message-square"
                          size={25}
                          color={"#000"}
                          style={{
                            alignSelf: "center",
                            width: 25,
                            height: 25
                          }}
                        />
                      </View>
                    </TouchableOpacity>
                  </Card>
                </Swipeable>
              </View>
            );
          }
        }}
        onEndReachedThreshold={0.1}
      />
      {/* uddipan st */}
      <Modal isVisible={packagesModal}>
        <View
          style={{
            backgroundColor: "#333939",
            width: "100%",
            minHeight: "50%",
            alignSelf: "center",
            borderRadius: 10,
            padding: 5
          }}
        >
          <TouchableOpacity onPress={() => setPackagesModal(!packagesModal)}>
            <MaterialIcons
              name="clear"
              size={25}
              style={{ alignSelf: "flex-end" }}
              color={"#F1C411"}
            />
          </TouchableOpacity>
          {Array.isArray(selectedGig.Package) && (
            <ScrollView
              style={{
                maxHeight: Dimensions.get("window").height - 70,
                paddingBottom: 20
              }}
            >
              {selectedGig.Package.map((item, i) => (
                <Card
                  containerStyle={{
                    borderRadius: 20,
                    shadowColor: "black",
                    width: "90%",
                    shadowOpacity: 0.5,
                    shadowOffset: { width: 5, height: 5 },
                    backgroundColor:
                      item.Tier === "Bronze"
                        ? "#cd7f32"
                        : item.Tier === "Silver"
                        ? "#D9D8D6"
                        : item.Tier === "Gold"
                        ? "#DFBD69"
                        : item.Tier === "Platinum"
                        ? "#E5E4E2"
                        : "#333939",
                    borderColor: "#161a1d02",
                    elevation: 10,
                    shadowRadius: 10,
                    padding: 10,
                    marginBottom: 5
                  }}
                >
                  <View
                    style={{
                      borderBottomColor: "#0002",
                      borderBottomWidth: 1,
                      paddingBottom: 5,
                      marginBottom: 5
                    }}
                  >
                    <View
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        flexDirection: "row",
                        width: "100%"
                      }}
                    >
                      <Text
                        style={{
                          color: "#222",
                          fontWeight: "bold",
                          fontSize: 20,
                          Width: "85%"
                        }}
                      >
                        {" "}
                        {item.Title}
                      </Text>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "bold",
                          color: "#222"
                          // textShadowColor: '#0005',
                          // textShadowOffset: [{width: 20, height: 20 }],
                          // textShadowRadius: 0.5,
                        }}
                      >
                        ${item.Price}
                      </Text>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        flexDirection: "row",
                        width: "100%"
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#222"
                        }}
                      >
                        {item.Category}
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#222"
                        }}
                      >
                        {item.Tier}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                      flexDirection: "column",
                      width: "100%"
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#222"
                        }}
                      >
                        {" "}
                        Live Sessions:{" "}
                        <Text style={{ fontWeight: "bold", color: "#222" }}>
                          {" "}
                          {item.NumOfSessions}
                        </Text>{" "}
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#222"
                        }}
                      >
                        {" "}
                        Delivery Days:{" "}
                        <Text style={{ fontWeight: "bold", color: "#222" }}>
                          {" "}
                          {item.DeliveryDays}
                        </Text>{" "}
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#222"
                        }}
                      >
                        {" "}
                        Number of revisions:{" "}
                        <Text style={{ fontWeight: "bold", color: "#222" }}>
                          {" "}
                          {item.Revisions}
                        </Text>{" "}
                      </Text>
                    </View>
                  </View>
                  <View>
                    <Text
                      style={{
                        fontSize: 10,
                        color: "#222",
                        lineHeight: 20
                      }}
                    >
                      {item.Description}
                    </Text>
                  </View>
                </Card>
              ))}
            </ScrollView>
          )}
        </View>
      </Modal>
      {/*  */}
      <Modal isVisible={samolesModal}>
        <View
          style={{
            backgroundColor: "#333939",
            width: "100%",
            minHeight: "50%",
            alignSelf: "center",
            borderRadius: 10,
            padding: 5,
            height: "90%"
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setSelectedGig({});
              setSamolesModal(!samolesModal);
            }}
          >
            <MaterialIcons
              name="clear"
              size={25}
              style={{ alignSelf: "flex-end" }}
              color={"#F1C411"}
            />
          </TouchableOpacity>
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              width: "100%"
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setSamolesModalTab(1);
              }}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                borderBottomColor: samolesModalTab === 2 ? "#fff5" : "#F1C411",
                borderBottomWidth: 2,
                paddingBottom: 10,
                flex: 1
              }}
            >
              <Icon
                name="image"
                size={14}
                color={samolesModalTab === 2 ? "#fff" : "#F1C411"}
                style={{
                  alignSelf: "center",
                  marginRight: 7
                }}
              />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "bold",
                  color: samolesModalTab === 2 ? "#fff" : "#F1C411"
                }}
              >
                Images
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSamolesModalTab(2);
              }}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                borderBottomColor: samolesModalTab === 1 ? "#fff5" : "#F1C411",
                borderBottomWidth: 2,
                paddingBottom: 10,
                flex: 1
              }}
            >
              <Icon
                name="video"
                size={14}
                color={samolesModalTab === 1 ? "#fff" : "#F1C411"}
                style={{
                  alignSelf: "center",
                  marginRight: 7
                }}
              />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "bold",
                  color: samolesModalTab === 1 ? "#fff" : "#F1C411"
                }}
              >
                Videos
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            style={{ maxHeight: Dimensions.get("window").height - 100 }}
          >
            {samolesModalTab === 1 ? (
              <View
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  flexDirection: "row"
                }}
              >
                {Array.isArray(selectedGig.Sample) ? (
                  <>
                    {selectedGig.Sample.filter(
                      (sample) => sample.MediaType === "Image"
                    ).length > 0 ? (
                      <>
                        {selectedGig.Sample.filter(
                          (sample) => sample.MediaType === "Image"
                        ).map((item, i) => (
                          <TouchableOpacity
                            style={{
                              width: "48%",
                              margin: "1%"
                            }}
                            onPress={() => {
                              setSamolesModal(false);
                              navigation.push("FullScreenImage", {
                                press: () => setSamolesModal(true),
                                uri: item.Url
                              });
                            }}
                          >
                            <Image
                              source={{
                                uri: item.Url
                              }}
                              style={{
                                width: "100%",
                                height: 150,
                                resizeMode: "contain"
                              }}
                              key={i}
                            />
                          </TouchableOpacity>
                        ))}
                      </>
                    ) : (
                      <Text style={{ color: "#fff", padding: 20 }}>
                        No samples available!
                      </Text>
                    )}
                  </>
                ) : (
                  <Text style={{ color: "#fff", padding: 20 }}>
                    No samples available!
                  </Text>
                )}
              </View>
            ) : (
              <View
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  flexDirection: "row"
                }}
              >
                {Array.isArray(selectedGig.Sample) ? (
                  <>
                    {selectedGig.Sample.filter(
                      (sample) => sample.MediaType === "Video"
                    ).length > 0 ? (
                      <>
                        {selectedGig.Sample.filter(
                          (sample) => sample.MediaType === "Video"
                        ).map((item, i) => (
                          <React.Fragment key={i}>
                            <View
                              style={{
                                margin: "1%",
                                width: "48%",
                                backgroundColor: "#ff00"
                              }}
                            >
                              <YoutubePlayer
                                height={200}
                                play={playing}
                                videoId={"rdrlJA8TuC0"}
                                // onChangeState={onStateChange}
                                onFullScreenChange={(status) =>
                                  console.log("ok")
                                }
                              />
                            </View>
                          </React.Fragment>
                        ))}
                      </>
                    ) : (
                      <Text style={{ color: "#fff", padding: 20 }}>
                        No samples available!
                      </Text>
                    )}
                  </>
                ) : (
                  <Text style={{ color: "#fff", padding: 20 }}>
                    No samples available!
                  </Text>
                )}
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
      {/* uddipan st */}
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
          <View style={{ width: "100%", flexGrow: 1 }}>
            <ScrollView style={{ height: "70%" }}>
              {userSlots.map((item, i) => {
                var dateS = new Date(item.startTime);
                var dateE = new Date(item.endTime);
                return (
                  <View
                    key={i}
                    style={{
                      flexDirection: "row",
                      height: 30,
                      backgroundColor: "#F1C411",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 10,
                      marginLeft: 5,
                      marginTop: 10,
                      width: "75%"
                    }}
                  >
                    <TouchableOpacity>
                      <Text
                        style={{
                          color: "black",
                          alignSelf: "center",
                          paddingHorizontal: 10,
                          width: "100%"
                        }}
                      >
                        {item.dateString} - {dateS.getUTCHours()}:
                        {dateS.getUTCMinutes()} to {dateE.getUTCHours()}:
                        {dateE.getUTCMinutes()}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
                return;
                const values = Object.values(item);
                const id = Object.keys(item);

                return;
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
            </ScrollView>
          </View>
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
          {Array.isArray(selectedGig?.Education) && (
            <>
              {selectedGig.Education.map((edu, i) => (
                <View key={i}>
                  <View
                    style={{
                      width: "90%",
                      alignSelf: "flex-start",
                      borderRadius: 10,
                      shadowOffset: { width: 0, height: 2 },
                      shadowColor: "black",
                      shadowRadius: 2,
                      shadowOpacity: 0.5,
                      elevation: 3,
                      backgroundColor: "#444949",
                      borderColor: "#444949",
                      height: "auto",
                      bottom: 0,
                      marginBottom: 20,
                      left: 3,
                      padding: 10,
                      marginLeft: "5%"
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignSelf: "flex-start",
                        right: 0,
                        top: 5
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: "#F1C411",
                          justifyContent: "center",
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          marginRight: 10,
                          alignSelf: "flex-start"
                        }}
                      >
                        <MaterialIcons
                          name="school"
                          style={{ alignSelf: "center" }}
                          size={20}
                          color={"black"}
                        />
                      </View>
                      <View style={{ flexDirection: "column" }}>
                        <Text
                          style={{
                            fontSize: 16,
                            marginTop: 0,
                            fontWeight: "bold",
                            left: 5,
                            width: "100%",
                            color: "#fff"
                          }}
                        >
                          {edu.University} - {edu.End}
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            marginTop: 5,
                            left: 5,
                            color: "#fff8"
                          }}
                        >
                          {edu.Degree}
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            marginTop: 5,
                            left: 5
                          }}
                        ></Text>
                      </View>
                    </View>
                    {typeof edu.Document === "string" && (
                      <View
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "center",
                          flexDirection: "row",
                          paddingHorizontal: 0
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => Linking.openURL(edu.Document)}
                          style={{
                            flex: 1,
                            marginRight: 5,
                            height: 35,
                            backgroundColor: "#0002",
                            borderRadius: 10,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "row"
                          }}
                        >
                          <MaterialIcons
                            name="remove-red-eye"
                            size={20}
                            style={{ right: 0, left: 0 }}
                            color={"#fff"}
                            style={{ marginRight: 7 }}
                          />
                          <Text style={{ color: "#fff" }}>View Document</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </>
          )}
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
                        {item?.experience ? item.experience : "N/A"}
                      </Text>
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
                            <Text style={{ color: "white" }}>{string}</Text>
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
              {XParray.Hours}
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
                            <Text style={{ color: "white" }}>{string}</Text>
                            {/* {string.map((strvalue, i) => {
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
                            })} */}
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

          <View style={{ flexDirection: "row", width: "100%" }}>
            <FlatList
              style={{ width: "50%" }}
              data={languagearr?.Languages}
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
            <Image
              source={require("../assets/mrtt.png")}
              style={{ height: 150, width: 100 }}
              resizeMode="contain"
            />
          </View>
        </View>
      </Modal>
      <Modal key={(name, title, tutorstring)} isVisible={reviews}>
        <View
          style={{
            backgroundColor: "#333939",
            width: "110%",
            height: "100%",
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
            <Text style={{ color: "white", left: 5, bottom: 10 }}>
              {tutorstring} -
            </Text>
            <Text
              style={{
                color: "white",
                left: 10,
                bottom: 10,
                fontWeight: "bold"
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
                zIndex: 1
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
                bottom: 15
              }}
              textStyle={{
                color: "white",
                width: "auto",
                alignSelf: "center",
                right: 10
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
                  right: 40
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
                zIndex: 1
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
                bottom: 20
              }}
              textStyle={{
                color: "white",
                width: "auto",
                alignSelf: "center",
                right: 10
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
                  right: 40
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
                zIndex: 1
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
                bottom: 20
              }}
              textStyle={{
                color: "white",
                width: "auto",
                alignSelf: "center",
                right: 10
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
                  right: 40
                }}
              />
            </View>
          </View>
          {/* <BarCharts
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
          /> */}

          <FlatList
            data={reviewData}
            style={{ bottom: Platform.OS === "ios" ? 30 : 15 }}
            renderItem={({ item }) => (
              <View>
                <View
                  style={{
                    marginRight: "auto",
                    marginLeft: 10,
                    flexDirection: "row"
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
                      marginLeft: 9
                    }}
                  >
                    <Text
                      style={{
                        alignItems: "flex-start",
                        fontWeight: "bold",
                        color: "white"
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
                          marginLeft: 5
                        }}
                      />
                    </View>
                    <View style={styles.row}>
                      <Text style={{ color: "white" }}> Quality: </Text>
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
                          marginLeft: 5
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
                          marginLeft: 5
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
                          marginLeft: 5
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
      </Modal>
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
            contentContainerStyle={{ flexGrow: 1, height: "130%" }}
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
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  width: "100%",
                  marginVertical: 10,
                  paddingHorizontal: 10
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setBookpopupTab(1);
                  }}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    borderColor: bookpopupTab === 2 ? "#fff5" : "#F1C411",
                    backgroundColor: bookpopupTab === 2 ? "#fff0" : "#F1C411",
                    borderWidth: 1,
                    paddingVertical: 10,
                    flex: 1,
                    marginRight: 5,
                    borderRadius: 5
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "bold",
                      color: bookpopupTab === 2 ? "#F1C411" : "#fff"
                    }}
                  >
                    Packages
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setBookpopupTab(2);
                  }}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    borderColor: bookpopupTab === 1 ? "#fff5" : "#F1C411",
                    backgroundColor: bookpopupTab === 1 ? "#fff0" : "#F1C411",
                    borderWidth: 1,
                    paddingVertical: 10,
                    flex: 1,
                    marginLeft: 5,
                    borderRadius: 5
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "bold",
                      color: bookpopupTab === 1 ? "#F1C411" : "#fff"
                    }}
                  >
                    Hourly Rate
                  </Text>
                </TouchableOpacity>
              </View>
              {bookpopupTab === 1 && (
                <>
                  <Text
                    style={{
                      color: "white",
                      marginTop: 0,
                      textAlign: "center",
                      marginBottom: 5,
                      marginTop: 15
                    }}
                  >
                    Choose Package:
                  </Text>
                  <ModalDropdown
                    options={(() => {
                      if (Array.isArray(selectedGig?.Package))
                        return selectedGig.Package.map(
                          (pckg) =>
                            `${pckg.Tier} - ${pckg.Title} - $${pckg.Price}`
                        );
                      else return [];
                    })()}
                    style={{
                      backgroundColor: "#0000",
                      height: 28,
                      justifyContent: "center",
                      width: "100%",
                      alignSelf: "flex-end",
                      borderRadius: 0,
                      borderWidth: 1.5,
                      borderColor: "#F1C411",
                      height: 40,
                      marginBottom: 10
                    }}
                    textStyle={{
                      color: "white",
                      alignSelf: "flex-start",
                      left: 5,
                      fontSize: 14
                    }}
                    dropdownStyle={{
                      width: "95%",
                      marginTop: 10
                    }}
                    dropdownTextStyle={{
                      backgroundColor: "white",
                      color: "black",
                      borderRadius: 0,
                      fontSize: 14
                    }}
                    dropdownTextHighlightStyle={{
                      color: "#F1C411",
                      backgroundColor: "black"
                    }}
                    // onSelect={(index, string) => setTier(string)}
                    defaultValue="Package Name"
                  />
                </>
              )}
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
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row"
                }}
              >
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
                    alignSelf: "center",
                    marginRight: 10
                  }}
                >
                  <MaterialIcons
                    name="mic"
                    size={15}
                    style={{ alignSelf: "center" }}
                  />
                  {filename != "" ? (
                    <Text>{filename}</Text>
                  ) : (
                    <Text style={{ alignSelf: "center" }}>Voice Note</Text>
                  )}
                </TouchableOpacity>
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
                    alignSelf: "center",
                    marginLeft: 10
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
              </View>
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
                  paddingHorizontal: 100,
                  marginBottom: 50
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
          setOnetoOne(true);
          leftrender(selectedGig);
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
  }
});

export default copilot({
  animated: true, // Can be true or false
  overlay: "svg", // Can be either view or svg
  verticalOffset: Platform.OS == "ios" ? 0 : 24
})(Lists);
