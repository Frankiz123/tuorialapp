import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef
} from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  ScrollView,
  Animated,
  Dimensions,
  TextInput,
  Platform,
  Pressable
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { Card } from "react-native-elements";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import Modal from "react-native-modal";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ToggleSwitch from "toggle-switch-react-native";
import ToggleSwitch2 from "toggle-switch-react-native/ToggleSwitch2";
import ToggleSwitchNav from "toggle-switch-react-native/ToggleSwitchNav";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ModalDropdown from "react-native-modal-dropdown";
import { KeyboardAvoidingView } from "react-native";
import LottieView from "lottie-react-native";
import moment from "moment";
import ToggleBidding from "../toggle-switch-react-native/ToggleBidding";
import Lists from "./Lists";
import uuid from "uuid";
import NormalList from "./NormalList";
import Share from "react-native-share";
import FastImage from "react-native-fast-image";
import * as DocumentPicker from "expo-document-picker";

//DASHBOARD FOR TUTEE
import firestore from "@react-native-firebase/firestore";
import PasswordModal from "./passwordModal.js/PasswordModal";
// uddipan st
import { REFERRAL_URL } from "../config";

import { copilot, walkthroughable, CopilotStep } from "react-native-copilot";
import { RadioButton } from "react-native-paper";
import SoundRecorder from "react-native-sound-recorder";
import storage from "@react-native-firebase/storage";
const WalkthroughableView = walkthroughable(View);

const storageGet = async (key) => {
  try {
    const result = await AsyncStorage.getItem(key);
    return result;
  } catch (error) {
    console.log(error);
  }
};
const ExpensiveTaskStates = {
  notStared: "not started",
  scheduled: "scheduled",
  done: "done"
};

const Home = (props) => {
  const flatListRef = useRef(null);
  const { userData, updateType } = props;
  const [category, setCategory] = useState([]);
  const [biddingTopic, setbiddingTopic] = useState("");
  const [biddingDesc, setbiddingDesc] = useState("");
  const [biddingPrice, setbiddingprice] = useState("");
  const [isBiddingType, setbiddingtype] = useState(false);
  const [biddingTimer, setbiddingTimer] = useState("");
  const [biddingTimerR, setbiddingTimerR] = useState("");
  const [noOfVideo, setNoOfVideo] = useState("");
  const [biddingExpectedDate, setBiddingExpectedDate] = useState(0);
  const [biddingExtraFeatures, setBiddingExtraFeatures] = useState([]);
  const [toTimeFormat, setToTimeFormat] = useState("");
  const [isvisible, setVisible] = useState(false);
  const [pressed, SetPressed] = useState(false);
  const [iconindex, seticonindex] = useState("");
  const [allaverage, setallaverage] = useState(0);
  const navigation = useNavigation();
  const [timings, setTimings] = useState([]);
  const [listofkeys, setKeyList] = useState([]);
  const [arraybook, setbookarray] = useState([]);
  const [tutornames, SetName] = useState([]);
  const KeyList = [];
  const bookingArray = [];
  const [advanced, setadvanced] = useState(false);
  const [found, setfound] = useState(false);
  const ref = firestore().collection("Users");
  const Timings = firestore().collection("Slots");
  const [subcategories, setsubcategories] = useState([]);
  const [relation, setrelation] = useState(false);
  const [categoryAVG, setcategoryAVG] = useState(0);
  const [q1allaverage, setq1allaverage] = useState(0);
  const [q2allaverage, setq2allaverage] = useState(0);
  const [q3allaverage, setq3allaverage] = useState(0);
  const [q4allaverage, setq4allaverage] = useState(0);
  const [q1catavg, setq1catavg] = useState(0);
  const [q2catavg, setq2catavg] = useState(0);
  const [q3catavg, setq3catavg] = useState(0);
  const [q4catavg, setq4catavg] = useState(0);
  const fadeAnim = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current
  ];
  const MarginAnim = useRef(new Animated.Value(0)).current;
  const OrganizationAnim = useRef(new Animated.Value(0)).current;
  const [tutordata, settutordata] = useState([]);
  const [isOn, setisOn] = useState(false);
  const [icon, seticon] = useState("");
  const [catselect, setcatselect] = useState(false);
  const [subcatselect, setsubcatselect] = useState(false);
  const [filename, setfilename] = useState("");
  const List = [];
  let CatList = [];
  const subcatList = [];
  const [subcategorylist, setsubcategorylist] = useState("");
  const [categorypick, setSelected] = useState();
  const [value, setValue] = useState("");
  const [categoryselected, setcatagery] = useState(false);
  const indexList = [];
  const [topic, settopic] = useState("");
  const [timevisibility, istimevisibility] = useState(false);
  const [datevisibility, isdatevisibility] = useState(false);
  const [filtered, isfiltered] = useState(false);
  const [date, setdate] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, settoTime] = useState("");
  const [timeMode, setTimeMode] = useState(false);
  const [endBool, setendbool] = useState(false);
  const [startBool, setstartbool] = useState(false);
  const [biddingwar, isbiddingwar] = useState(false);
  const [animationState, setAnimationState] = useState(false);
  const [filterbyRate, setfilterbyRate] = useState("");
  const [ratepicked, isRatePicked] = useState(false);
  const [dateString, setDates] = useState({});
  const [organization, setorganization] = useState("");
  const [tutoraverages, settutoraverages] = useState(0);
  const [isAllAverage, setAllAverage] = useState(false);
  const [bidprice, isprice] = useState(false);
  const [played, setplay] = useState("");
  const [played2, setplay2] = useState("");
  const [minimumHour, setminimumhour] = useState("");
  const [withinHours, setwithinhoursarray] = useState([]);
  const [isTimeVisible, settimevisible] = useState(false);
  const [isExpectedDateVisible, setExpectedDateVisible] = useState(false);
  const [isBidsProgress, setbidsprogress] = useState(false);
  const [groupsessionID, setgroupsessionID] = useState([]);
  const [groupsessionInfo, setgroupsessionInfo] = useState([]);
  const [grouptutorID, setgrouptutorID] = useState("");
  const [grouptutorArray, setgrouptutorArray] = useState([]);
  const [crowdfundingcount, setcrowdfundingcount] = useState(0);
  const [yourbiddingcount, setyourbiddingcount] = useState(0);
  const [yourBiddings, setYourBiddings] = useState([]);
  const [startNextCopilot, setStartNextCopilot] = useState(false);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [copyarray, setcopyarray] = useState([]);
  const [pass, setPass] = useState(false);
  const [passAction, setPassAction] = useState("BiddingWar");
  const [showList, setShowList] = useState(false);
  const [searchCount, setSearchCount] = useState(0);
  const [organizationCount, setOrganizationCount] = useState(0);
  const [searchText, setsearchText] = useState("");
  const [newBid, setnewBid] = useState(true);
  const [recording, setRecording] = useState(false);
  const [recordedVice, setRecordedVice] = useState("");
  const [fileUrl, setdownloadurl] = useState("");
  const [fileUrlRec, setdownloadurlRec] = useState("");
  const [loading, setloading] = useState(false);

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
        setloading(true);
        const ref = storage()
          .ref()
          .child("BiddingWar/" + userData.Name + result.name);
        let snapshot = await ref.put(blob);
        const url = await storage()
          .ref("BiddingWar/" + userData.Name + result.name)
          .getDownloadURL()
          .finally(() => {
            setloading(false);
          });
        setdownloadurl(url);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const [expensiveTaskState, setExpensiveTaskState] = useState(
    ExpensiveTaskStates.notStared
  );
  const average = [];
  const Q1AllAverage = [];
  const Q2AllAverage = [];
  const Q3AllAverage = [];
  const Q4Allaverage = [];
  const Q1Average = [];
  const Q2Average = [];
  const Q3Average = [];
  const Q4Average = [];

  function openDate() {
    isdatevisibility(true);
  }
  const startRecording = async () => {
    if (recording) {
      SoundRecorder.stop().then(async function (result) {
        setRecording(false);
        setRecordedVice(result.path);

        console.log("stopped recording, audio file saved at: " + result.path);
        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = () => {
            resolve(xhr.response);
          };
          xhr.responseType = "blob";
          xhr.open("GET", result.path, true);
          xhr.send(null);
        });
        setloading(true);
        const ref = storage()
          .ref()
          .child(
            "BiddingWarVoices/" + userData.Name + result.path.split("/").pop()
          );
        let snapshot = await ref.put(blob);
        const url = await storage()
          .ref(
            "BiddingWarVoices/" + userData.Name + result.path.split("/").pop()
          )
          .getDownloadURL()
          .finally(() => {
            setloading(false);
          });
        setdownloadurlRec(url);
      });
    } else {
      SoundRecorder.start(SoundRecorder.PATH_CACHE + "/recorded.mp4")
        .then(function () {
          setRecording(true);
          console.log("started recording");
        })
        .catch((e) => {
          console.log("Recording Error ", e);
        });
    }
  };

  function updateTutor(tutordata) {
    settutordata(tutordata);
  }
  function openTime() {
    istimevisibility(true);
  }
  //selects the category
  let newcategory;
  const stringid = JSON.stringify(newcategory);
  function categorySelect(item, index) {
    setSelected(item.item.ID);
    setValue(item.item.Category);
    setcatagery(true);
    setcatselect(true);
  }
  function subcategoryselect(value, i, keys) {}
  function RatePick(string) {
    isRatePicked(true);
    setfilterbyRate(string);
    setadvanced(true);
  }
  const handleDate = (date) => {
    var stringdate = moment(date).format("YYYY-MM-DD");
    setdate(stringdate);
    hidePicker();
  };
  const [timeformat, setStartTimeFormat] = useState("");

  const handleTimer = (time) => {
    const unixTime = new Date(time).valueOf();
    const tim = new Date(time);
    const timm =
      tim.getDate() +
      "/" +
      tim.getMonth() +
      1 +
      "/" +
      tim.getFullYear() +
      "/ " +
      tim.getHours().toString() +
      ":" +
      tim.getMinutes().toString();
    setbiddingTimerR(timm);
    setbiddingTimer(unixTime);
    settimevisible(false);
  };

  const handleExpectedDeliveryDate = (date) => {
    // const unixTime = new Date(time).valueOf();
    // setbiddingTimer(unixTime);
    setBiddingExpectedDate(new Date(date));
    setExpectedDateVisible(false);
  };

  const handleConfirm = (time) => {
    if (timeMode) {
      setstartbool(true);
      const stringtime = moment(time).format("HH:mm A");
      setFromTime(stringtime);
      //timeformat
      var starttimestring = moment(time).format("HH:mm");
      setStartTimeFormat(starttimestring);
    } else {
      setendbool(true);
      const stringtime = moment(time).format("HH:mm A");
      settoTime(stringtime);
      //format
      var endtimestring = moment(time).format("HH:mm");
      setToTimeFormat(endtimestring);
    }
    hideDatePicker();
  };
  const hidePicker = () => {
    isdatevisibility(false);
    istimevisibility(false);
  };
  function hideDatePicker() {
    istimevisibility(false);
    isdatevisibility(false);
    settimevisible(false);
    setExpectedDateVisible(false);
  }
  function filteritems() {
    isfiltered(true);
  }
  function resetfilter() {
    isfiltered(false);
    setendbool(false);
    setstartbool(false);
    setadvanced(false);
    setdate("");
    setStartTimeFormat("");
    setToTimeFormat("");
    setfilterbyRate("");
  }
  //selects subcategory
  function iconSelect(item, i, keys) {
    seticon(item);
    seticonindex(i);
    setsubcategorylist(keys[i]);
    setsubcatselect(true);
  }

  //bidding war popup
  function BiddingWar() {
    isbiddingwar(true);
  }
  //closes popup for groupsession
  function closePopup() {
    isbiddingwar(false);
    setbidsprogress(false);
  }

  //gets subcategories in the selected categories
  async function getCategories(newcategory, index) {
    setSelected(newcategory);
    getTutorsinCat(newcategory);
    flatListRef.current.scrollToIndex({
      animated: true,
      index: index.toString()
      // viewOffset: Dimensions.get('window').width - 500,
    });
    await firestore()
      .collection("SubCategories")
      .where("CategoryID", "==", newcategory)
      .onSnapshot((querysnap) => {
        const subcatList = [];
        querysnap.forEach((docsnap) => {
          subcatList.push({ ...docsnap.data(), key: docsnap.id });
        });
        setsubcategories(subcatList);
      });
    if (newcategory !== "22") {
      // setPass(!pass);
      setPassAction("ShowList");
      setShowList(true);
    }
  }

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim[0], {
        toValue: 1,
        duration: 1000,
        delay: (0 * 1000) / 5
      }),
      Animated.timing(fadeAnim[1], {
        toValue: 1,
        duration: 1000,
        delay: (1 * 1000) / 5
      }),
      Animated.timing(fadeAnim[2], {
        toValue: 1,
        duration: 1000,
        delay: (2 * 1000) / 5
      }),
      Animated.timing(fadeAnim[3], {
        toValue: 1,
        duration: 1000,
        delay: (3 * 1000) / 5
      }),
      Animated.timing(fadeAnim[4], {
        toValue: 1,
        duration: 1000,
        delay: (4 * 1000) / 5
      })
    ]).start(() => {
      setAnimationState(!animationState);
    });
    Animated.timing(MarginAnim, {
      toValue: Dimensions.get("screen").width / 4,
      duration: 500,
      delay: (4 * 500) / 4,
      useNativeDriver: false
    }).start(() => {
      setAnimationState(!animationState);
    });
    //margin anim for organization
    Animated.timing(OrganizationAnim, {
      toValue: 380,
      duration: 500,
      delay: (4 * 400) / 5,
      useNativeDriver: false
    }).start(() => {
      setAnimationState(!animationState);
    });
  }, []);

  useEffect(() => {
    async function checkCounts() {
      if (props.userData.ID != undefined) {
        await getYourInfo();
      }
    }
    checkCounts();
  }, [props.userData.ID]);
  //get all your counts!
  async function getYourInfo() {
    await firestore()
      .collection("Users")
      .doc(props.userData.ID)
      .onSnapshot((querysnapshot) => {
        let List;
        List = querysnapshot.data().BiddingID;
        if (querysnapshot.data().BiddingID != undefined) {
          setyourbiddingcount(List.length);
        }
        let inbox = querysnapshot.data().inbox;
        if (Array.isArray(inbox)) {
          let totalUnread = 0;
          totalUnread = inbox.reduce((a, b) => +a + +b.unread, 0);
          if (totalUnread > 0) {
            setUnreadMessageCount(totalUnread);
          }
        }
      });
  }
  useEffect(() => {
    ref
      .where("Type", "==", "Tutor")
      .where("Organization", "==", organization)
      .onSnapshot((querysnap) => {
        setOrganizationCount(querysnap.size);
      });

    ref.get().then((querysnap) => {
      setSearchCount(querysnap.size);
    });
  }, []);
  //gets tutors in selected categories
  async function getTutorsinCat(newcategory) {
    if (newcategory === "21") {
      await ref
        .where("Type", "==", "Tutor")
        .where("Organization", "==", organization)
        .onSnapshot((querysnap) => {
          const tutorittoelist = [];
          querysnap.forEach((docsnap) => {
            tutorittoelist.push({ ...docsnap.data(), key: docsnap.id });
          });
          settutordata(tutorittoelist);
          setcatselect(false);
          setadvanced(false);
        });
    } else {
      await ref
        .where("CategoryID", "array-contains", newcategory)
        .onSnapshot((querysnapshot) => {
          let tutorlist = [];
          let groupID = [];
          querysnapshot.forEach((docsnap) => {
            tutorlist.push({ ...docsnap.data(), key: docsnap.id });
            if (docsnap.data().CrowdFundingID != null) {
              groupID.push(docsnap.data().CrowdFundingID);
              getGroupSessions(docsnap.data().CrowdFundingID);
            }
            average.push(docsnap.data().TotalAverage);
            Q1Average.push(docsnap.data().Q1Average);

            Q2Average.push(docsnap.data().Q2Average);
            Q3Average.push(docsnap.data().Q3Average);
            Q4Average.push(docsnap.data().Q4Average);
          });
          setq1catavg(Q1Average);
          setq2catavg(Q2Average);
          setgroupsessionID(groupID);

          setq3catavg(Q3Average);
          setq3catavg(Q4Average);
          setq4catavg(Q4Average);
          settutoraverages(average);
          settutordata(tutorlist);

          setadvanced(false);
        });
    }
    setcatselect(true);
  }
  async function getGroupSessions(groupID) {
    var obj = [];

    var idList = [];
    await firestore()
      .collection("CrowdFunding")
      // .where(firestore.FieldPath.documentId(), "in", groupID)
      .onSnapshot((querysnapshot) => {
        const List = [];

        querysnapshot.forEach((docsnap) => {
          List.push({ ...docsnap.data(), key: docsnap.id });
        });
        setgroupsessionInfo(List);
        getTutorsInfo(groupID, List);
      });
  }
  let finalarray = [];

  async function getTutorsInfo(groupID, SessionArray) {
    //console.log("before check", groupID, SessionArray);

    const tutorlist = [];
    await firestore()
      .collection("Users")
      // .where("CrowdFundingID", "array-contains-any", groupID)
      .onSnapshot((querysnapshot) => {
        querysnapshot.forEach((docsnap) => {
          tutorlist.push({ ...docsnap.data(), key: docsnap.id });
        });
        setgrouptutorArray(tutorlist);
        tutorlist.forEach((snapshot) => {
          SessionArray.forEach((snap) => {
            snap.CrowdFundingInfo.map((item) => {
              if (
                snapshot.ID === item.TutorID &&
                item.LastContribution != item.Goal
              ) {
                finalarray.push({ ...snapshot, ...item });
                const count = finalarray.length;
                setcrowdfundingcount(count);
                setwholegroupinfo(finalarray);
              }
            });
          });
        });
      });
  }
  const [wholegroupinfo, setwholegroupinfo] = useState([]);

  //gets tutors from selected subcategories
  async function getTutorsInSubCat(item, subcategorylist) {
    //setsubcategorylist(subcategorylist);
    seticon(item);

    await ref
      .where("SubCategoryID", "array-contains", subcategorylist)
      .onSnapshot((querysnap) => {
        const newList = [];
        querysnap.forEach((docsnap) => {
          newList.push({ ...docsnap.data(), key: docsnap.id });
        });
        settutordata(newList);
        setadvanced(false);
      });
  }

  function ViewBids() {
    navigation.navigate("BiddingsProgress");
  }
  const [bidArray, setbidarray] = useState([]);
  const [biddingID, setbiddingID] = useState([]);
  async function viewAllBids() {
    setbidsprogress(true);
    await firestore()
      .collection("Users")
      .doc(props.userData.ID)
      .onSnapshot((querySnapshot) => {
        setbiddingID(querySnapshot.data().BiddingID);
        getBiddingInfo(querySnapshot.data().BiddingID);
        //setbiddingfound(true);
      });
  }

  async function getBiddingInfo(biddingid) {
    await firestore()
      .collection("Bidding")
      .where(firestore.FieldPath.documentId(), "in", biddingid)
      .onSnapshot((querysnapshot) => {
        const List = [];
        querysnapshot.forEach((docsnap) => {
          List.push({ ...docsnap.data(), key: docsnap.id });
        });
        setbidarray(List);
      });
  }

  const endBid = async (id) => {
    await firestore()
      .collection("Bidding")
      .doc(id)
      .update({ status: "END" })
      .then(async () => {
        await firestore()
          .collection("Users")
          .doc(props.userData.ID)
          .update({
            BiddingID: biddingID.filter((b) => b != id)
          });
      });
  };

  function sendRequest() {
    if (biddingTopic !== "" && biddingTimer !== "" && biddingPrice !== "") {
      if (isBiddingType === true) {
        const keys = [];
        let idArray = [];
        let BiddingID = "BiddingWar" + uuid.v4();
        idArray.push(BiddingID);
        tutordata.map((item, i) => keys.push(item.key));
        let number = Math.random();

        let maximumbudget =
          parseInt(biddingPrice) + parseFloat(number) * parseInt(biddingPrice);
        let IntNumber = parseInt(maximumbudget);
        const newarray = [
          {
            Topic: biddingTopic,
            Desc: biddingDesc,
            Goal: IntNumber,
            Timer: biddingTimer,
            Type: "Bidding War Offer",
            StudentName: userData.Name,
            StudentPic: userData.Photo,
            StudentID: userData.ID,
            List: keys,
            BiddingID: BiddingID,
            LastBid: IntNumber,
            expectedDeliveryDate: biddingExpectedDate,
            extra: biddingExtraFeatures,
            noOfVideo,
            fileUrlRec,
            fileUrl
          }
        ];
        if (keys != null) {
          for (var index in keys) {
            firestore()
              .collection("Users")
              .doc(keys[index])
              .update({
                BiddingID: firestore.FieldValue.arrayUnion(...idArray)
              });
            let Message =
              "You've been matched with " +
              userData.Name +
              " on " +
              biddingTopic +
              " and a bidding war has been initiated with a maximum budget of $" +
              biddingPrice +
              "/hr.";

            let Notifarray = [
              {
                Message,
                Type: "Bidding",
                EventID: BiddingID
              }
            ];
            firestore()
              .collection("Notifications")
              .doc(keys[index])
              .set(
                {
                  Messages: firestore.FieldValue.arrayUnion(...Notifarray)
                },
                { merge: true }
              );
          }
        }
        firestore()
          .collection("Users")
          .doc(props.userData.ID)
          .update({
            BiddingID: firestore.FieldValue.arrayUnion(...idArray)
          });
        firestore()
          .collection("Bidding")
          .doc(BiddingID)
          .set({
            BiddingInfo: firestore.FieldValue.arrayUnion(...newarray)
          });
        Alert.alert("Youve successfully started a bidding war");
      } else {
        const keys = [];
        let idArray = [];
        let BiddingID = "BiddingWar" + uuid.v4();
        idArray.push(BiddingID);
        tutordata.map((item, i) => keys.push(item.key));
        let number = Math.random();
        let maximumbudget =
          parseInt(biddingPrice) + parseFloat(number) * parseInt(biddingPrice);
        let IntNumber = parseInt(maximumbudget);
        const newarray = [
          {
            Topic: biddingTopic,
            Desc: biddingDesc,
            Goal: parseInt(biddingPrice),
            Timer: biddingTimer,
            Type: "Yes/No Offer",
            StudentName: userData.Name,
            StudentPic: userData.Photo,
            StudentID: userData.ID,
            List: keys,
            BiddingID: BiddingID,
            LastBid: 0,
            expectedDeliveryDate: biddingExpectedDate,
            extra: biddingExtraFeatures,
            noOfVideo,
            fileUrlRec,
            fileUrl
          }
        ];

        if (keys != null) {
          for (var index in keys) {
            firestore()
              .collection("Users")
              .doc(keys[index])
              .update({
                BiddingID: firestore.FieldValue.arrayUnion(...idArray)
              });
            let Notifarray = [
              {
                Message:
                  "You've been matched with " +
                  userData.Name +
                  " on " +
                  biddingTopic +
                  " and a bidding war has been initiated with a maximum budget of $" +
                  biddingPrice +
                  "/hr.",
                Type: "Bidding",
                EventID: BiddingID
              }
            ];
            firestore()
              .collection("Notifications")
              .doc(keys[index])
              .set(
                {
                  Messages: firestore.FieldValue.arrayUnion(...Notifarray)
                },
                { merge: true }
              );
          }
        }
        firestore()
          .collection("Users")
          .doc(props.userData.ID)
          .update({
            BiddingID: firestore.FieldValue.arrayUnion(...idArray)
          });
        firestore()
          .collection("Bidding")
          .doc(BiddingID)
          .set({
            BiddingInfo: firestore.FieldValue.arrayUnion(...newarray)
          });
        Alert.alert("Youve successfully started a bidding war");
      }
      setbiddingTopic("");
      setbiddingTimer("");
      setbiddingprice("");
      setbiddingDesc("");
      setBiddingExpectedDate("");
      setNoOfVideo("");
      setbiddingTimerR("");
      setRecordedVice("");
      setfilename("");
      setdownloadurl("");
      setdownloadurlRec("");
      setRecording(false);
      setnewBid(false);
      viewAllBids();
    } else {
      alert("Enter complete information to start Bidding War");
    }
  }

  //gets categories
  async function getLists() {
    await firestore()
      .collection("Categories")
      .onSnapshot((querysnapshot) => {
        CatList = [];
        querysnapshot.forEach((docsnap) => {
          CatList.push({ ...docsnap.data(), key: docsnap.id });
        });

        let sorted = CatList.sort((a, b) => {
          if (a.Category < b.Category) {
            return -1;
          }
          if (a.Category > b.Category) {
            return 1;
          }
          return 0;
        });
        let tempOrg = sorted.findIndex((e) => e.Category === "My organisation");
        const movingItem = sorted[tempOrg];
        sorted.splice(tempOrg, 1);
        sorted.splice(0, 0, movingItem);
        let tempSearch = sorted.findIndex((e) => e.Category === "Search");
        const movingsearch = sorted[tempSearch];
        sorted.splice(tempSearch, 1);
        sorted.splice(1, 0, movingsearch);
        setCategory(sorted);
      });
  }

  //when clicked submit filter
  async function SubmitFilter() {
    //if tutee filtered by timings
    if (endBool === true && startBool === true) {
      await Timings.onSnapshot((querySnapshot) => {
        querySnapshot.forEach((documentSnapshot) => {
          List.push({ ...documentSnapshot.data(), key: documentSnapshot.id });
        });
        setTimings(List);
        var key;
        var idkey;
        var obj;
        //get list
        for (var i = 0; i < List.length; i++) {
          const dataset = List[i].availability;
          obj = Object.values(dataset);
        }

        obj.forEach((snapshot) => {
          setDates(snapshot.dateString);

          if (
            timeformat >= snapshot.startTime &&
            toTimeFormat <= snapshot.endTime &&
            date === snapshot.dateString &&
            snapshot.booked === false
          ) {
            key = Object.keys(List[i]);
            var objkey = Object.keys(snapshot);
            bookingArray.push(snapshot);
            idkey = List[i].key;
            KeyList.push(idkey);
            setbookarray(bookingArray);
            setKeyList(KeyList);
            setfound(true);
          } else {
            console.log("no result");
          }
        });
      });
      getTutorsInTimings();
    }
    //if tutee filtered by rating and also timings
    if (ratepicked === true && found === true) {
      await ref
        .where(firestore.FieldPath.documentId(), "in", listofkeys)
        .where("TotalAverage", ">=", filterbyRate)
        .orderBy("TotalAverage", "desc")
        .limit(10)
        .onSnapshot((querySnapshot) => {
          const Names = [];

          querySnapshot.forEach((documentSnapshot) => {
            Names.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id
            });
          });
          SetName(Names);
          setadvanced(true);
          isRatePicked(false);
        });
    }
    //if tutee only filtered by rating
    else if (ratepicked === true) {
      await ref
        .where("TotalAverage", ">=", filterbyRate)
        .orderBy("TotalAverage", "desc")
        .onSnapshot((querySnapshot) => {
          const Names = [];

          querySnapshot.forEach((documentSnapshot) => {
            Names.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id
            });
          });
          SetName(Names);
          setadvanced(true);
          isRatePicked(false);
        });
    }
  }
  //to find tutors in timings that a tutee selected
  async function getTutorsInTimings() {
    if (found === true) {
      await ref
        .where(firestore.FieldPath.documentId(), "in", listofkeys)
        .where("CategoryID", "array-contains", JSON.stringify(newcategory))
        .onSnapshot((querySnapshot) => {
          const Names = [];
          querySnapshot.forEach((documentSnapshot) => {
            Names.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id
            });
          });
          SetName(Names);
          setadvanced(true);
        });
    }
  }
  async function getAllTutorAverages() {
    await ref
      .where("Type", "==", "Tutor")
      .orderBy("TotalAverage", "desc")
      .onSnapshot((querySnapshot) => {
        const list = [];
        const hoursarray = [];
        querySnapshot.forEach((docsnap) => {
          list.push(docsnap.data().TotalAverage);
          Q1AllAverage.push(docsnap.data().Q1Average);
          Q2AllAverage.push(docsnap.data().Q2Average);
          Q3AllAverage.push(docsnap.data().Q3Average);
          Q4Allaverage.push(docsnap.data().Q4Average);
        });
        setq1allaverage(Q1AllAverage);
        setq2allaverage(Q2AllAverage);
        setq3allaverage(Q3AllAverage);
        setq4allaverage(Q4Allaverage);
        setAllAverage(true);
        setallaverage(list);
      });
  }

  //to find the closest timing a tutor is available in
  useEffect(() => {
    async function getuserCategories() {
      await getLists();
    }

    getuserCategories();
  }, []);
  useEffect(() => {
    async function getuseraverages() {
      await getAllTutorAverages();
    }

    getuseraverages();
  }, []);
  //function to toggle between tutor and tuttee
  async function submitToggle(isOn) {
    await AsyncStorage.setItem("Type", "Tutor").then(() => {});
    var type = "Tutor";

    updateType(type);
  }
  //finding average based on all categories for every questions
  function q1allavg(q1allaverage) {
    let sum = 0;
    let count = q1allaverage.length;

    for (let i = 0; i < q1allaverage.length; i++) {
      sum += q1allaverage[i];
    }
    let avg4 = sum / count;
    return avg4;
  }
  function q2allavg(q2allaverage) {
    let sum = 0;
    let count = q2allaverage.length;

    for (let i = 0; i < q2allaverage.length; i++) {
      sum += q2allaverage[i];
    }
    let avg4 = sum / count;
    return avg4;
  }
  function q3allavg(q3allaverage) {
    let sum = 0;
    let count = q3allaverage.length;

    for (let i = 0; i < q3allaverage.length; i++) {
      sum += q3allaverage[i];
    }
    let avg4 = sum / count;
    return avg4;
  }
  function q4allavg(q4allaverage) {
    let sum = 0;
    let count = q4allaverage.length;

    for (let i = 0; i < q4allaverage.length; i++) {
      sum += q4allaverage[i];
    }
    let avg4 = sum / count;
    return avg4;
  }
  let q1allAVG = q1allavg(q1allaverage);
  let q2allAVG = q2allavg(q2allaverage);
  let q3allAVG = q3allavg(q3allaverage);
  let q4allAVG = q4allavg(q4allaverage);

  //finding average based on selected category for overall tutor average
  function avg(tutoraverages) {
    let sum = 0;
    let count = tutoraverages.length;

    for (let i = 0; i < tutoraverages.length; i++) {
      sum += tutoraverages[i];
    }
    let avg4 = sum / count;
    return avg4;
  }
  let categoryavg = avg(tutoraverages);
  // finding average of every question based on selected category
  function q1avg(q1catavg) {
    let sum = 0;
    let count = q1catavg.length;

    for (let i = 0; i < q1catavg.length; i++) {
      sum += q1catavg[i];
    }
    let avg4 = sum / count;
    return avg4;
  }
  function q2avg(q2catavg) {
    let sum = 0;
    let count = q2catavg.length;

    for (let i = 0; i < q2catavg.length; i++) {
      sum += q2catavg[i];
    }
    let avg4 = sum / count;
    return avg4;
  }
  function q3avg(q3catavg) {
    let sum = 0;
    let count = q3catavg.length;

    for (let i = 0; i < q3catavg.length; i++) {
      sum += q3catavg[i];
    }
    let avg4 = sum / count;
    return avg4;
  }
  function q4avg(q4catavg) {
    let sum = 0;
    let count = q4catavg.length;

    for (let i = 0; i < q4catavg.length; i++) {
      sum += q4catavg[i];
    }
    let avg4 = sum / count;
    return avg4;
  }
  let q1catAVG = q1avg(q1catavg);
  let q2catAVG = q2avg(q2catavg);
  let q3catAVG = q3avg(q3catavg);
  let q4catAVG = q4avg(q4catavg);
  // finding average based on all categories for overall tutor average
  function avg2(allaverage) {
    let sum = 0;
    let count = allaverage.length;

    for (let i = 0; i < allaverage.length; i++) {
      sum += allaverage[i];
    }
    let avg4 = sum / count;
    return avg4;
  }
  const handleCopilotStop = (step) => {
    setStartNextCopilot(true);
  };
  async function openReferModal() {
    Share.open({
      message: `Download the patent pending TUTORITTO APP using my referral link to share your skills & start EARNING $ or to explore undiscovered talents.\n`,
      title: "Tutoritto Referral",
      url: `${REFERRAL_URL}${userData.ID}`
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        err && console.log(err);
      });
  }
  let everyAVG = avg2(allaverage);
  const handleSetSearch = (text) => {
    setsearchText(text);
    const newdata = category.filter((item) => {
      let itemdata = item.Category.toString().toUpperCase();
      let textdata = text.toUpperCase();
      return itemdata.indexOf(textdata) > -1;
    });
    setcopyarray(newdata);
  };

  const handleAddExtraFeatures = () => {
    let exFeatures = biddingExtraFeatures;
    exFeatures.push({
      title: "",
      description: "",
      price: ""
    });
    setBiddingExtraFeatures([...exFeatures]);
  };
  const handleDeleteExtraFeatures = (index) => {
    let prevArr = biddingExtraFeatures;
    let newArr = [...prevArr.slice(0, index), ...prevArr.slice(index + 1)];
    setBiddingExtraFeatures([...newArr]);
  };
  return (
    <SafeAreaView
      style={{
        backgroundColor: "black",
        height: "100%",
        paddingTop: Platform.OS === "android" ? 15 : 0
      }}
    >
      <View style={styles.header}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 15
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
              <Image
                source={{ uri: props.userData.Photo }}
                style={{ width: 45, height: 45, borderRadius: 40, top: 10 }}
              />
            </TouchableOpacity>
            <View style={{ flexDirection: "column", top: 15, right: -5 }}>
              <Text style={{ color: "#F1C411", fontWeight: "bold" }}>
                Tuto-Rittees,
              </Text>
              {/* uddipan st */}
              <View style={{ flexDirection: "row", marginTop: 0, right: 0 }}>
                <Text style={{ color: "white" }}>Let's start </Text>
                <Text style={{ color: "#F1C411", fontWeight: "bold", left: 4 }}>
                  EXPLORING.
                </Text>
              </View>
              {/* uddipan st */}
            </View>
          </View>

          <View
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              position: "relative"
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
                marginRight: 4
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
                marginRight: 4
              }}
              onPress={() => {
                openReferModal();
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
            </TouchableOpacity>
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
                marginRight: 4,
                position: "relative"
              }}
              onPress={() => {
                navigation.navigate("ChatListing");
              }}
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
            </TouchableOpacity>
            <View>
              <ToggleSwitch
                isOn={isOn} // There should be a state like this.state.isOn(Set default value)
                onColor="black"
                offColor="#F1C411"
                labelStyle={{ color: "black" }}
                size="large"
                onToggle={() => {
                  setisOn(!isOn);
                  submitToggle(isOn);
                }} //To update state
              />
            </View>
            {/* <Image source={require("../assets/giphy.gif")} style={{
              width: 80,
              height: 20,
              position: "absolute",
              right: 20,
              top: 50,
              transform: [{ rotate: '-45deg'}]
            }} /> */}
            {/* <LottieView
              ref={(animation) => {
                setplay(animation);
              }}
              autoPlay={true}
              style={{
                width: 80,
                height: 80,
                alignSelf: "center",
                position: "absolute",
              }}
              source={require("../assets/arrpw.gif")}
              loop={true}
            /> */}
          </View>
        </View>
        {/* header ends */}

        {/* categories */}
        <CopilotStep
          text="Choose the category you are looking for or SEARCH directly."
          order={1}
          name="Categories"
        >
          <WalkthroughableView
            style={{
              marginTop: 30,
              backgroundColor: "white",
              height: 65,
              padding: 5,

              alignContent: "center",
              zIndex: 1,
              opacity: 0.8
            }}
          >
            <FlatList
              style={{ height: 160 }}
              data={category}
              ref={flatListRef}
              renderItem={({ item, index }) => {
                newcategory = item.ID;
                return (
                  <TouchableOpacity
                    onPress={() => {
                      getCategories(item.ID, index);
                    }}
                    style={{
                      width: Dimensions.get("screen").width / 4,
                      position: "relative"
                    }}
                  >
                    <View
                      style={{
                        borderRadius: categorypick === item.ID ? 20 : 25,
                        width: categorypick === item.ID ? 70 : "auto",
                        alignSelf: "center"
                      }}
                    >
                      {categorypick === item.ID ? (
                        <LottieView
                          ref={(animation) => {
                            setplay(animation);
                          }}
                          autoPlay={true}
                          style={{
                            width: 80,
                            height: 80,
                            alignSelf: "center",
                            marginTop: Platform.OS === "android" ? -9 : -6,
                            position: "absolute"
                          }}
                          source={require("../assets/focus3.json")}
                          loop={true}
                        />
                      ) : null}

                      <FastImage
                        style={{
                          width: 35,
                          height: 40,
                          alignSelf: "center",
                          resizeMode: "contain",
                          alignContent: "center",
                          alignItems: "center"
                        }}
                        source={{
                          uri: item.Icon,
                          priority: FastImage.priority.normal
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                      />
                    </View>

                    <Text
                      style={{
                        color: "black",
                        alignSelf: "center",
                        paddingHorizontal: 0,
                        fontSize: 10,
                        marginLeft: 0
                      }}
                    >
                      {item.Category}
                    </Text>
                    {item.Category !== "Search" &&
                    item.Category !== "My organisation" ? (
                      <>
                        {item?.Count > 0 && (
                          <View
                            style={{
                              position: "absolute",
                              top: 0,
                              right: 15,
                              width: 25,
                              height: 25,
                              backgroundColor: "#f00",
                              borderRadius: 20,
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center"
                            }}
                          >
                            <Text
                              style={{
                                fontWeight: "bold",
                                fontSize: 10,
                                color: "#fff"
                              }}
                            >
                              {item.Count}
                            </Text>
                          </View>
                        )}
                      </>
                    ) : (
                      <View
                        style={{
                          position: "absolute",
                          top: 0,
                          right: 15,
                          width: 25,
                          height: 25,
                          backgroundColor: "#f00",
                          borderRadius: 20,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                      >
                        <Text
                          style={{
                            fontWeight: "bold",
                            fontSize: 10,
                            color: "#fff"
                          }}
                        >
                          {item.Category === "Search"
                            ? searchCount
                            : organizationCount}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              }}
              horizontal={true}
              keyExtractor={(item, index) => {
                return index.toString();
              }}
            />
          </WalkthroughableView>
        </CopilotStep>
        {/* Categories ended */}

        {/* sub categories */}
        <CopilotStep
          text="Choose the sub category which includes specific skills you are looking for."
          order={2}
          name="Sub-categories"
        >
          <WalkthroughableView style={{ width: "100%" }}>
            {categorypick != null ? (
              <ScrollView
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={true}
                horizontal={true}
                contentContainerStyle={{
                  flexDirection: "column",
                  backgroundColor: newcategory != null ? "#F1C411" : "#F1C411",
                  height: 68.5,
                  marginTop: 5,
                  paddingTop: 5,
                  alignContent: "center",
                  width: "auto",
                  zIndex: 1
                  // width: Dimensions.get("window").width
                }}
              >
                {categorypick === "21" ? (
                  <Animated.View
                    style={{
                      width: OrganizationAnim,
                      marginLeft: 0,
                      width: Dimensions.get("window").width
                    }}
                  >
                    <Text style={{ marginTop: 15, textAlign: "center" }}>
                      Check out your organisation's tuto-rittoes and group
                      tutoring sessions below
                    </Text>
                  </Animated.View>
                ) : categorypick === "22" ? (
                  <View
                    style={{
                      width: Dimensions.get("window").width,
                      justifyContent: "center",
                      alignItems: "center",
                      display: "flex",
                      backgroundColor: "#000",
                      minHeight: "110%",
                      marginTop: -5,
                      paddingBottom: 15,
                      position: "relative",
                      elevation: 5
                    }}
                  >
                    <TextInput
                      textAlign={"left"}
                      value={searchText}
                      onChangeText={(text) => {
                        handleSetSearch(text);
                      }}
                      placeholder="Search here ... "
                      style={{
                        borderWidth: 1,
                        width: "85%",
                        height: 40,
                        right: 0,
                        left: 1,
                        top: 5,
                        backgroundColor: "#fff",
                        borderRadius: 10,
                        paddingHorizontal: 10
                      }}
                    />
                  </View>
                ) : (
                  <>
                    {Array.isArray(subcategories) ? (
                      <>
                        {subcategories.length > 0 ? (
                          <>
                            {subcategories.map((item, i) => {
                              const keys = Object.values(item.General || {});
                              const string = Object.values(item.Icon || {});
                              return (
                                <View
                                  key={i}
                                  style={{ flexDirection: "column" }}
                                >
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      paddingHorizontal: 0
                                    }}
                                  >
                                    {string.map((item, i) => {
                                      indexList.push(i);
                                      return (
                                        <Animated.View
                                          key={i}
                                          style={{
                                            width: MarginAnim,
                                            alignSelf: "center",
                                            position: "relative",
                                            width:
                                              Dimensions.get("window").width /
                                              3.5,
                                            alignSelf: "center",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center"
                                          }}
                                        >
                                          <TouchableOpacity
                                            onPress={() => {
                                              getTutorsInSubCat(item, keys[i]);
                                            }}
                                            style={{
                                              backgroundColor: "#F1C411",
                                              borderRadius:
                                                icon === item ? 20 : 0,
                                              width:
                                                Dimensions.get("window").width /
                                                3.5,
                                              alignSelf: "center",
                                              display: "flex",
                                              justifyContent: "center",
                                              alignItems: "center"
                                            }}
                                          >
                                            <Animated.View
                                              style={{
                                                opacity: fadeAnim[i],
                                                width:
                                                  Dimensions.get("window")
                                                    .width / 3.5,
                                                alignSelf: "center",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center"
                                              }}
                                            >
                                              {icon === item ? (
                                                <LottieView
                                                  ref={(animation) => {
                                                    setplay(animation);
                                                  }}
                                                  autoPlay={true}
                                                  style={{
                                                    width: 80,
                                                    height: 80,
                                                    alignSelf: "center",
                                                    marginTop:
                                                      Platform.OS === "android"
                                                        ? -3
                                                        : -6,
                                                    position: "absolute"
                                                  }}
                                                  source={require("../assets/focus2.json")}
                                                  loop={true}
                                                />
                                              ) : null}
                                              <FastImage
                                                style={{
                                                  width: 35,
                                                  height: 40,
                                                  resizeMode: "contain",
                                                  alignSelf: "center",
                                                  width:
                                                    Dimensions.get("window")
                                                      .width / 3.5,
                                                  alignSelf: "center",
                                                  display: "flex",
                                                  justifyContent: "center",
                                                  alignItems: "center"
                                                }}
                                                source={{
                                                  uri: item,
                                                  priority:
                                                    FastImage.priority.normal
                                                }}
                                                resizeMode={
                                                  FastImage.resizeMode.contain
                                                }
                                              />
                                            </Animated.View>
                                          </TouchableOpacity>
                                          {item.Count > 0 && (
                                            <View
                                              style={{
                                                position: "absolute",
                                                top: 0,
                                                right: 15,
                                                width: 25,
                                                height: 25,
                                                backgroundColor: "#f00",
                                                borderRadius: 20,
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center"
                                              }}
                                            >
                                              <Text
                                                style={{
                                                  fontWeight: "bold",
                                                  fontSize: 10,
                                                  color: "#fff"
                                                }}
                                              >
                                                {item.Count}
                                              </Text>
                                            </View>
                                          )}
                                        </Animated.View>
                                      );
                                    })}
                                  </View>
                                  <View style={{ flexDirection: "row" }}>
                                    {keys.map((value, i) => {
                                      return (
                                        <Animated.View
                                          key={i}
                                          style={{
                                            flexGrow: 1,
                                            width:
                                              Dimensions.get("window").width /
                                              3.5,
                                            alignSelf: "center"
                                          }}
                                        >
                                          <TouchableOpacity
                                            onPress={() =>
                                              subcategoryselect(value, i, keys)
                                            }
                                          >
                                            <Animated.Text
                                              style={{
                                                color:
                                                  subcategorylist === value
                                                    ? "black"
                                                    : "black",
                                                fontSize: 10.5,
                                                width:
                                                  Dimensions.get("window")
                                                    .width / 3.5,
                                                alignContent: "center",
                                                right: 0,
                                                // alignSelf: "center",
                                                opacity: fadeAnim[i],
                                                width:
                                                  Dimensions.get("window")
                                                    .width / 3.5,
                                                // alignSelf: "center",
                                                textAlign: "center"
                                                // backgroundColor: '#f00'
                                              }}
                                            >
                                              {value}
                                            </Animated.Text>
                                          </TouchableOpacity>
                                        </Animated.View>
                                      );
                                    })}
                                  </View>
                                </View>
                              );
                            })}
                          </>
                        ) : (
                          <></>
                        )}
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                )}
              </ScrollView>
            ) : (
              <Image
                source={require("../assets/yellowbox.png")}
                style={{
                  width: "auto",
                  height: 180,
                  zIndex: 0,
                  resizeMode: "cover",
                  bottom: 37
                }}
              />
            )}
          </WalkthroughableView>
        </CopilotStep>
        {/* sub categories ended */}

        {/* body starts */}
        <View>
          {/* walk through able */}
          {categorypick != null ? (
            <View
              style={{
                flexDirection: "row",
                bottom: 5,
                marginTop: 20,
                marginLeft: 0,
                // marginLeft: Dimensions.get("screen").width / 0,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <View>
                <ToggleSwitch2
                  isOn={relation} // There should be a state like this.state.isOn(Set default value)
                  onColor="white"
                  offColor="white"
                  labelStyle={{ color: "black", fontWeight: "900" }}
                  size="large"
                  onToggle={() => {
                    setrelation(!relation);
                  }} //To update state
                />
              </View>
              <View>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    onPress={() => viewAllBids()}
                    style={{
                      backgroundColor: "red",
                      width: 20,
                      height: 20,
                      borderRadius: 15,
                      position: "absolute",
                      left: -79,
                      right: 20,
                      justifyContent: "center",
                      top: Platform.OS === "android" ? -5 : -7,
                      zIndex: 1
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        alignSelf: "center",
                        color: "white"
                      }}
                    >
                      {crowdfundingcount}
                    </Text>
                  </TouchableOpacity>
                  <View style={{ marginLeft: 20 }}>
                    <ToggleSwitchNav
                      isOn={filtered} // There should be a state like this.state.isOn(Set default value)
                      onColor={advanced ? "green" : "white"}
                      offColor={advanced ? "green" : "white"}
                      labelStyle={{
                        color: advanced ? "green" : "black",
                        fontWeight: "900",
                        left: 10
                      }}
                      size="large"
                      disabled={false}
                      onToggle={() => {
                        // setPass(!pass);
                        setPassAction("SetFilter");
                        isfiltered(!filtered);
                        // isfiltered(!filtered);
                        // console.log("status toggle", filtered);
                      }} //To update state
                    />
                  </View>
                </View>
              </View>
              <CopilotStep
                text=" In a minmum offer bidding, it gets more exciting. Relax and watch other Tuto-rittoes fight over you. Once the bidding time. is done, you can see the final results and make your final selection accordingly by swiping right."
                order={8}
                name="Bidding5"
              >
                <WalkthroughableView style={{ position: "relative" }}>
                  <CopilotStep
                    text="You can track who accepted/rejected your request and make your final choice by swiping right same as a normal booking process."
                    order={7}
                    name="Bidding4"
                  >
                    <WalkthroughableView style={{ position: "relative" }}>
                      <CopilotStep
                        text="In Yes/No bidding war, you set your maximum budget and broadcast your request to all matching Tuto-rittoes where they will either accept or reject your request."
                        order={6}
                        name="Bidding3"
                      >
                        <WalkthroughableView style={{ position: "relative" }}>
                          <CopilotStep
                            text="This will allow you to choose one of two bidding options (Yes/No Bidding ) or (Minimum offer Bid) with a time frame."
                            order={5}
                            name="Bidding2"
                          >
                            <WalkthroughableView
                              style={{ position: "relative" }}
                            >
                              <CopilotStep
                                text="Also, our UNIQUE features allow you to START A BIDDING WAR by pushing on the bidding war icon"
                                order={4}
                                name="Bidding1"
                              >
                                <WalkthroughableView
                                  style={{ position: "relative" }}
                                >
                                  <View style={{ flexDirection: "row" }}>
                                    <LottieView
                                      ref={(animation) => {
                                        setplay(animation);
                                      }}
                                      autoPlay={true}
                                      style={{
                                        left:
                                          Platform.OS === "android" ? -2 : -2,
                                        position: "absolute",
                                        width: 60,
                                        height: 60,
                                        marginTop:
                                          Platform.OS === "android" ? -8 : -4,
                                        alignSelf: "center"
                                      }}
                                      source={require("../assets/fireeffect.json")}
                                      loop={true}
                                    />
                                    <LottieView
                                      ref={(animation) => {
                                        setplay2(animation);
                                      }}
                                      autoPlay={true}
                                      style={{
                                        left:
                                          Platform.OS === "android" ? 45 : 35,
                                        position: "absolute",
                                        width: 60,
                                        height: 60,
                                        marginTop:
                                          Platform.OS === "android" ? -8 : -4,
                                        alignSelf: "center",
                                        opacity: 1
                                      }}
                                      source={require("../assets/fireeffect.json")}
                                      loop={true}
                                    />
                                  </View>
                                  <TouchableOpacity
                                    onPress={() => viewAllBids()}
                                    style={{
                                      backgroundColor: "red",
                                      width: 20,
                                      height: 20,
                                      borderRadius: 15,

                                      alignSelf: "center",
                                      justifyContent: "center",
                                      position: "absolute",
                                      top: -5,
                                      right: -25,
                                      zIndex: 99
                                    }}
                                  >
                                    <Text
                                      style={{
                                        fontSize: 12,
                                        alignSelf: "center",
                                        color: "white"
                                      }}
                                    >
                                      {yourbiddingcount}
                                    </Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={() => {
                                      // setPass(!pass);
                                      setPassAction("BiddingWar");
                                      BiddingWar();
                                    }}
                                    style={{
                                      width: "auto",
                                      backgroundColor: "white",
                                      borderRadius: 10,
                                      left: 20,
                                      flexDirection: "row",
                                      paddingVertical: 5,
                                      paddingHorizontal: 8,
                                      zIndex: 1
                                    }}
                                  >
                                    <Text
                                      style={{
                                        fontWeight: "bold",
                                        alignSelf: "center"
                                      }}
                                    >
                                      Bidding War
                                    </Text>
                                    <MaterialIcons
                                      name="gavel"
                                      size={20}
                                      color={"#000000"}
                                      style={{ alignSelf: "center", left: 2 }}
                                    />
                                  </TouchableOpacity>
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
              <Modal isVisible={isBidsProgress}>
                <KeyboardAvoidingView
                  enabled={Platform.OS === "ios" ? true : false}
                  behavior={Platform.OS === "ios" ? "padding" : "height"}
                  style={{
                    backgroundColor: "#333939",
                    width: "100%",
                    height: "60%",
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
                  <Text
                    style={{
                      alignSelf: "center",
                      fontWeight: "bold",
                      fontSize: 16,
                      color: "white",
                      bottom: 15
                    }}
                  >
                    Bidding War
                  </Text>
                  <FlatList
                    data={bidArray}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => {
                      return (
                        <Card
                          containerStyle={{
                            borderRadius: 25,
                            backgroundColor: "#101820FF",
                            borderColor: "#101820FF",
                            width: "90%",
                            alignSelf: "center"
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "column",
                              alignItems: "flex-start",
                              marginLeft: 0
                            }}
                          >
                            {item.BiddingInfo.map((item, i) => {
                              let numoftutors = item.List;
                              let count = numoftutors.length;
                              return (
                                <View key={i} style={{ width: "100%" }}>
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
                                      width: "100%",
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
                                      width: "auto",
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

                                        marginTop: 2
                                      }}
                                    >
                                      {"  "}
                                      Maximum Budget: ${item.Goal}
                                    </Text>
                                  </View>
                                  <View style={styles.row}>
                                    <Text
                                      style={{
                                        color: "white"
                                      }}
                                    >
                                      {"  "}
                                      List of Tuto-rittoes contacted: {count}
                                    </Text>
                                  </View>

                                  <TouchableOpacity
                                    onPress={() => {
                                      setbidsprogress(false);
                                      navigation.navigate("BiddingsProgress", {
                                        BiddingDetails: item
                                      });
                                    }}
                                    style={{
                                      backgroundColor: "#F1C411",
                                      width: "70%",
                                      paddingHorizontal: 30,
                                      height: 30,
                                      borderRadius: 5,
                                      justifyContent: "center",
                                      marginTop: 10,
                                      alignSelf: "center"
                                    }}
                                  >
                                    <Text style={{ alignSelf: "center" }}>
                                      View Progress
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              );
                            })}
                          </View>
                        </Card>
                      );
                    }}
                  />
                </KeyboardAvoidingView>
              </Modal>
              <Modal isVisible={biddingwar}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={{
                    backgroundColor: "#333939",
                    width: "100%",
                    height: "100%",
                    alignSelf: "center",
                    borderRadius: 10,
                    paddingBottom: 5
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
                  <View
                    style={{
                      width: "100%",
                      alignItems: "center",
                      flexDirection: "row",
                      marginVertical: 20
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => setnewBid(true)}
                      style={{ width: "50%", borderRightWidth: 1 }}
                    >
                      <Text
                        style={{
                          color: !newBid ? "white" : "#F1C411",
                          alignSelf: "center",
                          fontWeight: "bold",
                          fontSize: 16
                        }}
                      >
                        New Bidding War
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setnewBid(false);
                        viewAllBids();
                      }}
                      style={{ width: "50%" }}
                    >
                      <Text
                        style={{
                          color: newBid ? "white" : "#F1C411",
                          alignSelf: "center",
                          fontWeight: "bold",
                          fontSize: 13
                        }}
                      >
                        Existing Bidding Wars ({yourbiddingcount})
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {newBid ? (
                    <View
                      style={{
                        flexDirection: "column",
                        width: "100%",
                        justifyContent: "center",
                        alignSelf: "center"
                      }}
                    >
                      {yourbiddingcount > 1 ? (
                        <View
                          style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          <Text style={{ color: "white" }}>
                            2 Bids in progress...
                          </Text>
                        </View>
                      ) : (
                        <View style={{ flex: 1 }}>
                          <View
                            style={{
                              marginTop: 15,
                              width: "100%",
                              left: 10
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                marginBottom: 10
                              }}
                            >
                              <View
                                style={{
                                  backgroundColor: "#fdc500",
                                  width: 25,
                                  height: 25,
                                  justifyContent: "center",
                                  borderRadius: 20,
                                  alignSelf: "center",
                                  marginLeft: 5
                                }}
                              >
                                <MaterialIcons
                                  name="topic"
                                  size={20}
                                  style={{ opacity: 1, alignSelf: "center" }}
                                />
                              </View>

                              <Text
                                style={{
                                  left: 5,
                                  color: "white",
                                  fontWeight: "bold",
                                  alignSelf: "center"
                                }}
                              >
                                Select a topic
                              </Text>
                            </View>
                            <View style={{ bottom: 0, alignSelf: "center" }}>
                              <TextInput
                                value={biddingTopic}
                                onChangeText={(text) => setbiddingTopic(text)}
                                multiline={true}
                                style={{
                                  borderWidth: 1,
                                  width: 300,
                                  height: "auto",
                                  left: 10,
                                  top: 0,
                                  alignSelf: "center",
                                  color: "white",
                                  borderColor: "white"
                                }}
                              />
                            </View>
                          </View>
                          <Card.Divider
                            style={{
                              top: 15,
                              width: "90%",
                              alignSelf: "center",
                              marginBottom: 15
                            }}
                          ></Card.Divider>
                          <View
                            style={{
                              marginTop: 0,
                              width: "100%",
                              left: 10,
                              marginTop: 15
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                marginBottom: 10
                              }}
                            >
                              <View
                                style={{
                                  backgroundColor: "#fdc500",
                                  width: 25,
                                  height: 25,
                                  justifyContent: "center",
                                  borderRadius: 20,
                                  alignSelf: "center",
                                  marginLeft: 5
                                }}
                              >
                                <MaterialIcons
                                  name="topic"
                                  size={20}
                                  style={{ opacity: 1, alignSelf: "center" }}
                                />
                              </View>

                              <Text
                                style={{
                                  left: 5,
                                  color: "white",
                                  fontWeight: "bold",
                                  alignSelf: "center"
                                }}
                              >
                                Add description
                              </Text>
                            </View>
                            <View style={{ bottom: 0, alignSelf: "center" }}>
                              <TextInput
                                value={biddingDesc}
                                onChangeText={(text) => setbiddingDesc(text)}
                                multiline={true}
                                style={{
                                  borderWidth: 1,
                                  width: 300,
                                  height: 80,
                                  left: 10,
                                  top: 0,
                                  alignSelf: "center",
                                  color: "white",
                                  borderColor: "white"
                                }}
                              />
                            </View>
                          </View>
                          <Card.Divider
                            style={{
                              top: 15,
                              width: "90%",
                              alignSelf: "center",
                              marginBottom: 15
                            }}
                          ></Card.Divider>
                          <View
                            style={{
                              top: 15,
                              left: 10,
                              width: 330,
                              display: "flex",
                              justifyContent: "flex-start",
                              alignItems: "flex-start",
                              marginBottom: 10
                            }}
                          >
                            {/* <ToggleBidding
                        isOn={isBiddingType} // There should be a state like this.state.isOn(Set default value)
                        onColor="#F1C411"
                        offColor="#F1C411"
                        labelStyle={{ color: "black", fontWeight: "900" }}
                        size="large"
                        onToggle={() => {
                          setbiddingtype(!isBiddingType),
                            console.log("status toggle", isBiddingType);
                        }} //To update state
                      /> */}
                            <Text style={{ marginRight: 20, color: "white" }}>
                              Select type of Bidding war:
                            </Text>
                            <View
                              style={{
                                flexDirection: "row",
                                marginTop: 10,
                                alignItems: "center",
                                justifyContent: "center",
                                alignSelf: "center"
                              }}
                            >
                              <View
                                style={
                                  Platform.OS == "ios"
                                    ? {
                                        width: 40,
                                        height: 40,
                                        borderWidth: 1,
                                        marginRight: 10,
                                        borderColor: "#F1C411"
                                      }
                                    : {
                                        marginRight: 10
                                      }
                                }
                              >
                                <RadioButton
                                  onPress={() => {
                                    setbiddingtype(true);
                                  }}
                                  status={
                                    isBiddingType ? "checked" : "unchecked"
                                  }
                                />
                              </View>
                              <Text style={{ marginRight: 10, color: "white" }}>
                                Min Bid
                              </Text>
                              <View
                                style={
                                  Platform.OS == "ios"
                                    ? {
                                        width: 40,
                                        height: 40,
                                        borderWidth: 1,
                                        marginRight: 10,
                                        borderColor: "#F1C411"
                                      }
                                    : {
                                        marginRight: 10
                                      }
                                }
                              >
                                <RadioButton
                                  onPress={() => {
                                    setbiddingtype(false);
                                  }}
                                  status={
                                    !isBiddingType ? "checked" : "unchecked"
                                  }
                                />
                              </View>
                              <Text style={{ marginRight: 10, color: "white" }}>
                                Yes/No Bid
                              </Text>
                            </View>
                          </View>
                          <Card.Divider
                            style={{
                              top: 15,
                              width: "90%",
                              alignSelf: "center"
                            }}
                          ></Card.Divider>
                          <View style={{ left: 10, top: 5 }}>
                            <View style={{ flexDirection: "row" }}>
                              <View
                                style={{
                                  backgroundColor: "#F1C411",
                                  width: 25,
                                  height: 25,
                                  justifyContent: "center",
                                  borderRadius: 20,
                                  alignSelf: "center",
                                  marginLeft: 5,
                                  top: 5
                                }}
                              >
                                <MaterialIcons
                                  name="attach-money"
                                  size={25}
                                  style={{ alignSelf: "center" }}
                                />
                              </View>
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignSelf: "center"
                                }}
                              >
                                <Text
                                  style={{
                                    left: 5,
                                    color: "white",
                                    fontWeight: "bold",
                                    alignSelf: "center",
                                    top: 5
                                  }}
                                >
                                  Set a price
                                </Text>
                              </View>
                            </View>
                            <View
                              style={{
                                flexDirection: "row",
                                alignSelf: "center",
                                width: 300,
                                justifyContent: "center",
                                alignItems: "center"
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 15,
                                  color: "white"
                                }}
                              >
                                $
                              </Text>
                              <TextInput
                                onChangeText={setbiddingprice}
                                keyboardType="decimal-pad"
                                value={biddingPrice}
                                placeholderTextColor="white"
                                style={{
                                  borderWidth: 1,
                                  height: "auto",
                                  color: "white",
                                  borderColor: "white",
                                  flex: 1
                                }}
                              />
                            </View>
                          </View>
                          <Card.Divider
                            style={{
                              top: 50,
                              width: "90%",
                              alignSelf: "center"
                            }}
                          ></Card.Divider>
                          <View
                            style={{
                              flexDirection: "row",
                              marginTop: 55,
                              left: 10
                            }}
                          >
                            <View
                              style={{
                                backgroundColor: "#F1C411",
                                width: 25,
                                height: 25,
                                justifyContent: "center",
                                borderRadius: 20,
                                alignSelf: "center",
                                marginLeft: 5
                              }}
                            >
                              <MaterialIcons
                                name="timer"
                                size={20}
                                style={{ alignSelf: "center" }}
                              />
                            </View>
                            <Text
                              style={{
                                left: 5,
                                color: "white",
                                fontWeight: "bold",
                                alignSelf: "center"
                              }}
                            >
                              Add expected delivery days
                            </Text>
                            {/* <TouchableOpacity
                        onPress={() => setExpectedDateVisible(true)}
                        style={{
                          backgroundColor: "#F1C411",
                          width: 40,
                          height: 40,
                          justifyContent: "center",
                          borderRadius: 20,
                          alignSelf: "center",
                          marginLeft: 10
                        }}
                      >
                        <MaterialIcons
                          name="calendar-today"
                          size={30}
                          style={{ color: "black", alignSelf: "center" }}
                        />
                      </TouchableOpacity>
                      <DateTimePickerModal
                        isVisible={isExpectedDateVisible}
                        mode="date"
                        input={true}
                        onConfirm={handleExpectedDeliveryDate}
                        onCancel={hideDatePicker}
                      /> */}
                            <TextInput
                              value={biddingExpectedDate}
                              onChangeText={(text) =>
                                setBiddingExpectedDate(text)
                              }
                              style={{
                                borderWidth: 1,
                                width: 50,
                                height: "auto",
                                left: 10,
                                top: 0,
                                alignSelf: "center",
                                color: "white",
                                borderColor: "white"
                              }}
                              keyboardType="decimal-pad"
                            />
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              marginTop: 55,
                              left: 10
                            }}
                          >
                            <View
                              style={{
                                backgroundColor: "#F1C411",
                                width: 25,
                                height: 25,
                                justifyContent: "center",
                                borderRadius: 20,
                                alignSelf: "center",
                                marginLeft: 5
                              }}
                            >
                              <MaterialIcons
                                name="timer"
                                size={20}
                                style={{ alignSelf: "center" }}
                              />
                            </View>
                            <Text
                              style={{
                                left: 5,
                                color: "white",
                                fontWeight: "bold",
                                alignSelf: "center"
                              }}
                            >
                              No. of Real time video sessions
                            </Text>

                            <TextInput
                              value={noOfVideo}
                              onChangeText={(text) => setNoOfVideo(text)}
                              style={{
                                borderWidth: 1,
                                width: 50,
                                height: "auto",
                                left: 10,
                                top: 0,
                                alignSelf: "center",
                                color: "white",
                                borderColor: "white"
                              }}
                              keyboardType="decimal-pad"
                              placeholder="No of videos"
                            />
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              marginTop: 55,
                              left: 10
                            }}
                          >
                            <View
                              style={{
                                backgroundColor: "#F1C411",
                                width: 25,
                                height: 25,
                                justifyContent: "center",
                                borderRadius: 20,
                                alignSelf: "center",
                                marginLeft: 5
                              }}
                            >
                              <MaterialIcons
                                name="timer"
                                size={20}
                                style={{ alignSelf: "center" }}
                              />
                            </View>
                            <Text
                              style={{
                                left: 5,
                                color: "white",
                                fontWeight: "bold",
                                alignSelf: "center"
                              }}
                            >
                              {biddingTimerR ? biddingTimerR : "Set a timer"}
                            </Text>
                            <TouchableOpacity
                              onPress={() => settimevisible(true)}
                              style={{
                                backgroundColor: "#F1C411",
                                width: 40,
                                height: 40,
                                justifyContent: "center",
                                borderRadius: 20,
                                alignSelf: "center",
                                marginLeft: 10
                              }}
                            >
                              <MaterialIcons
                                name="calendar-today"
                                size={30}
                                style={{ color: "black", alignSelf: "center" }}
                              />
                            </TouchableOpacity>
                            <DateTimePickerModal
                              isVisible={isTimeVisible}
                              mode="datetime"
                              input={true}
                              onConfirm={handleTimer}
                              onCancel={hideDatePicker}
                            />
                          </View>
                          <Card.Divider
                            style={{
                              top: 20,
                              width: "90%",
                              alignSelf: "center"
                            }}
                          ></Card.Divider>
                          <Pressable
                            style={[styles.AddinputWrapper]}
                            onPress={() => {
                              handleAddExtraFeatures();
                            }}
                          >
                            <MaterialCommunityIcons
                              name="plus"
                              size={25}
                              color={"#fff"}
                              style={{ marginRight: 10 }}
                            />
                            <Text style={styles.inputLable}>
                              Add extra packge feature
                            </Text>
                          </Pressable>
                          {biddingExtraFeatures.map((extra, i) => (
                            <View
                              style={{
                                display: "flex",
                                backgroundColor: "#ccc",
                                padding: 10,
                                borderRadius: 10,
                                marginBottom: 20,
                                marginHorizontal: 20
                              }}
                              key={i}
                            >
                              <Pressable
                                onPress={() => handleDeleteExtraFeatures(i)}
                              >
                                <MaterialCommunityIcons
                                  name="delete"
                                  size={18}
                                  color={"#000"}
                                  style={{ textAlign: "right" }}
                                />
                              </Pressable>
                              <View style={styles.inputWrapper}>
                                <Text
                                  style={[styles.inputLable, { color: "#222" }]}
                                >
                                  Title:
                                </Text>
                                <TextInput
                                  style={styles.input}
                                  value={extra.title}
                                  onChangeText={(value) => {
                                    biddingExtraFeatures[i].title = value;
                                    setBiddingExtraFeatures([
                                      ...biddingExtraFeatures
                                    ]);
                                  }}
                                />
                              </View>
                              <View style={styles.inputWrapper}>
                                <Text
                                  style={[styles.inputLable, { color: "#222" }]}
                                >
                                  Description:
                                </Text>
                                <TextInput
                                  style={styles.input}
                                  value={extra.description}
                                  onChangeText={(value) => {
                                    biddingExtraFeatures[i].description = value;
                                    setBiddingExtraFeatures([
                                      ...biddingExtraFeatures
                                    ]);
                                  }}
                                />
                              </View>
                            </View>
                          ))}
                          <View
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center"
                            }}
                          >
                            {/* <TouchableOpacity
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
                            marginRight: 10,
                            alignItems: "center"
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
                            <Text style={{ alignSelf: "center" }}>
                              Pick Voice Note
                            </Text>
                          )}
                        </TouchableOpacity> */}
                            <TouchableOpacity
                              disabled={loading}
                              onPress={startRecording}
                              style={{
                                paddingHorizontal: 20,
                                height: 30,
                                backgroundColor: "#fdc500",
                                justifyContent: "center",
                                borderRadius: 10,
                                marginTop: 10,
                                flexDirection: "row",
                                alignSelf: "center",
                                alignItems: "center",
                                width: 250
                              }}
                            >
                              <MaterialIcons
                                name="mic"
                                size={15}
                                style={{ alignSelf: "center" }}
                              />
                              {recordedVice != "" && !recording ? (
                                <Text>{recordedVice.split("/").pop()}</Text>
                              ) : (
                                <Text style={{ alignSelf: "center" }}>
                                  {recording
                                    ? "Stop Recording"
                                    : "Start Voice Recording"}
                                </Text>
                              )}
                            </TouchableOpacity>
                            <TouchableOpacity
                              disabled={loading}
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
                                alignItems: "center",
                                width: 250
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
                                <Text style={{ alignSelf: "center" }}>
                                  Documents
                                </Text>
                              )}
                            </TouchableOpacity>
                          </View>
                          {loading ? (
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center"
                              }}
                            >
                              <Text style={{ color: "white" }}>
                                File Uploading...
                              </Text>
                              <ActivityIndicator
                                style={{ marginTop: 10 }}
                                size="small"
                                color="#fdc500"
                              />
                            </View>
                          ) : (
                            <TouchableOpacity
                              onPress={sendRequest}
                              style={{
                                alignSelf: "center",
                                marginTop: 25,
                                backgroundColor: "white",
                                width: "70%",
                                height: 30,
                                borderRadius: 10,
                                justifyContent: "center",
                                flexDirection: "row",
                                shadowOffset: { width: 2, height: 2 },
                                shadowColor: "red",
                                shadowRadius: 2,
                                shadowOpacity: 0.5,
                                paddingHorizontal: 5
                              }}
                            >
                              <Text style={{ alignSelf: "center" }}>
                                Start Now
                              </Text>
                              <MaterialIcons
                                name="gavel"
                                size={15}
                                style={{ alignSelf: "center" }}
                                color={"black"}
                              />
                            </TouchableOpacity>
                          )}
                        </View>
                      )}
                    </View>
                  ) : (
                    <View style={{ flex: 1 }}>
                      <FlatList
                        data={bidArray}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => {
                          // console.log("count of tutors", mappedObject);

                          return (
                            <Card containerStyle={styles.bidItemContainer}>
                              <View
                                style={{
                                  flexDirection: "column",
                                  alignItems: "flex-start",
                                  marginLeft: 0
                                }}
                              >
                                {item.BiddingInfo.map((item, i) => {
                                  let numoftutors = item.List;
                                  let count = numoftutors.length;
                                  return (
                                    <View key={i} style={{ width: "100%" }}>
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
                                        {item.Type}
                                      </Text>
                                      <Text
                                        style={{
                                          color: "white",
                                          width: "100%",
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
                                          width: "auto",
                                          height: "auto",
                                          textAlign: "left",
                                          fontWeight: "bold",
                                          bottom: 0,
                                          left: 3
                                        }}
                                      >
                                        {item.Topic}
                                      </Text>
                                      <View style={styles.row}>
                                        <Text
                                          style={{
                                            color: "white",
                                            marginTop: 2
                                          }}
                                        >
                                          Maximum Budget: ${item.Goal}
                                        </Text>
                                      </View>
                                      <View style={styles.row}>
                                        <Text
                                          style={{
                                            color: "white"
                                          }}
                                        >
                                          List of Tuto-rittoes contacted:{" "}
                                          {count}
                                        </Text>
                                      </View>

                                      <TouchableOpacity
                                        onPress={() => {
                                          endBid(item.BiddingID);
                                        }}
                                        style={{
                                          alignSelf: "flex-end",
                                          borderWidth: 1,
                                          borderColor: "white",
                                          padding: 2,
                                          paddingHorizontal: 5
                                        }}
                                      >
                                        <Text style={{ color: "white" }}>
                                          END
                                        </Text>
                                      </TouchableOpacity>

                                      <TouchableOpacity
                                        onPress={() => {
                                          setbidsprogress(false);
                                          closePopup();
                                          navigation.navigate(
                                            "BiddingsProgress",
                                            {
                                              BiddingDetails: item
                                            }
                                          );
                                        }}
                                        style={{
                                          backgroundColor: "#F1C411",
                                          width: "70%",
                                          paddingHorizontal: 30,
                                          height: 30,
                                          borderRadius: 5,
                                          justifyContent: "center",
                                          marginTop: 10,
                                          alignSelf: "center"
                                        }}
                                      >
                                        <Text style={{ alignSelf: "center" }}>
                                          View Progress
                                        </Text>
                                      </TouchableOpacity>
                                    </View>
                                  );
                                })}
                              </View>
                            </Card>
                          );
                        }}
                      />
                    </View>
                  )}
                </ScrollView>
              </Modal>
            </View>
          ) : null}
          {filtered === true ? (
            <View
              style={{
                height: "auto",
                alignSelf: "center",
                width: "90%",
                marginBottom: 40
              }}
            >
              <Text style={{ color: "white", alignSelf: "center" }}>
                Filter by
              </Text>
              <Text style={{ top: 10, color: "white", alignSelf: "center" }}>
                Hourly rate
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  marginHorizontal: 10,
                  marginLeft: 10,
                  padding: 10,
                  alignSelf: "center",
                  marginTop: 10
                }}
              >
                <TextInput
                  placeholder="$"
                  placeholderTextColor="white"
                  style={{
                    borderWidth: 1,
                    width: "20%",
                    height: "100%",
                    borderColor: "white"
                  }}
                ></TextInput>
                <Text style={{ color: "white", left: 4, alignSelf: "center" }}>
                  to
                </Text>
                <TextInput
                  placeholder="$"
                  placeholderTextColor="white"
                  style={{
                    borderWidth: 1,
                    width: "20%",
                    height: "100%",
                    borderColor: "white",
                    marginLeft: 10
                  }}
                ></TextInput>
              </View>
              <Card.Divider style={{ backgroundColor: "white" }}></Card.Divider>
              <Text style={{ color: "white", alignSelf: "center" }}>
                Ratings
              </Text>
              <ModalDropdown
                options={[1, 2, 3, 4, 5]}
                style={{
                  backgroundColor: "white",
                  height: 25,
                  borderRadius: 10,
                  justifyContent: "center",
                  width: 100,
                  alignSelf: "center",
                  marginTop: 10
                }}
                textStyle={{
                  color: "black",
                  alignSelf: "center",
                  marginLeft: 10
                }}
                dropdownStyle={{
                  width: "auto",
                  backgroundColor: "white",
                  width: 100,
                  borderRadius: 10,
                  height: 100,
                  bottom: 100
                }}
                dropdownTextStyle={{ backgroundColor: "white", color: "black" }}
                dropdownTextHighlightStyle={{
                  color: "#fdc500",
                  backgroundColor: "black"
                }}
                onSelect={(index, string) => RatePick(string)}
                defaultValue="Pick"
              ></ModalDropdown>
              <Card.Divider
                style={{ backgroundColor: "white", marginTop: 8 }}
              ></Card.Divider>
              <Text style={{ color: "white", alignSelf: "center" }}>
                Availability
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 5,
                  alignSelf: "center"
                }}
              >
                <TouchableOpacity onPress={() => openDate()}>
                  <Icon name="calendar" size={25} style={{ color: "white" }} />
                </TouchableOpacity>
                <Text
                  style={{
                    borderWidth: 1,
                    width: "auto",
                    marginTop: 1,
                    borderColor: "white",
                    color: "white",
                    height: 20,
                    alignSelf: "center"
                  }}
                >
                  {" "}
                  {date}
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    setTimeMode(true);
                    openTime();
                  }}
                  style={styles.selectTimings}
                >
                  <Text style={{ color: "black", padding: 5 }}> From </Text>
                </TouchableOpacity>
                <Text
                  style={{
                    borderWidth: 1,
                    width: "auto",
                    borderColor: "white",
                    color: "white",
                    alignSelf: "center",
                    height: 20,
                    left: 2
                  }}
                >
                  {" "}
                  {fromTime}{" "}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setTimeMode(false);
                    openTime();
                  }}
                  style={styles.selectTimings}
                >
                  <Text style={{ color: "black", padding: 5 }}> To </Text>
                </TouchableOpacity>
                <Text
                  style={{
                    borderWidth: 1,
                    width: "auto",
                    borderColor: "white",
                    color: "white",
                    height: 20,
                    alignSelf: "center",
                    left: 2
                  }}
                >
                  {" "}
                  {toTime}{" "}
                </Text>
              </View>

              <DateTimePickerModal
                isVisible={datevisibility}
                mode="date"
                input={true}
                locale={"en_GB"}
                onConfirm={handleDate}
                onCancel={hidePicker}
              />
              <DateTimePickerModal
                isVisible={timevisibility}
                mode="time"
                input={true}
                locale={"en_GB"}
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />
              <Card.Divider
                style={{ backgroundColor: "white", marginTop: 8 }}
              ></Card.Divider>
              <TouchableOpacity
                onPress={() => SubmitFilter()}
                style={{
                  alignSelf: "center",
                  marginTop: 8,
                  backgroundColor: "white",
                  width: "50%",
                  height: 30,
                  borderRadius: 10,
                  justifyContent: "center",
                  flexDirection: "row",
                  shadowOffset: { width: 2, height: 2 },
                  shadowColor: "grey",
                  shadowRadius: 2,
                  shadowOpacity: 0.5,
                  paddingHorizontal: 5
                }}
              >
                <Text style={{ alignSelf: "center" }}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => resetfilter()}
                style={{
                  alignSelf: "center",
                  marginTop: 8,
                  backgroundColor: "white",
                  width: "50%",
                  height: 30,
                  borderRadius: 10,
                  justifyContent: "center",
                  flexDirection: "row",
                  shadowOffset: { width: 2, height: 2 },
                  shadowColor: "grey",
                  shadowRadius: 2,
                  shadowOpacity: 0.5,
                  paddingHorizontal: 5
                }}
              >
                <Text style={{ alignSelf: "center" }}>Reset</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </View>
      {showList && (
        <CopilotStep
          text="You can see now below a list of all the matching Tuto-rittoes."
          order={3}
          name="Listing"
        >
          <WalkthroughableView style={{ flex: 1 }}>
            {relation === true ? (
              <Lists
                userData={userData}
                filtered={filtered}
                relation={relation}
                advanced={advanced}
                tutordata={tutordata}
                minimumhour={minimumHour}
                updateTutor={updateTutor}
                filteredList={tutornames}
                category={value}
                q1allAVG={q1allAVG}
                q2allAVG={q2allAVG}
                q3allAVG={q3allAVG}
                q4allAVG={q4allAVG}
                q1catAVG={q1catAVG}
                q2catAVG={q2catAVG}
                q3catAVG={q3catAVG}
                q4catAVG={q4catAVG}
                allAverages={everyAVG}
                categoryAVG={categoryavg}
                groupsessionInfo={wholegroupinfo}
                subcategory={subcategorylist}
              />
            ) : (
              <NormalList
                userData={userData}
                filtered={filtered}
                relation={relation}
                advanced={advanced}
                tutordata={tutordata}
                minimumhour={minimumHour}
                updateTutor={updateTutor}
                filteredList={tutornames}
                category={value}
                q1allAVG={q1allAVG}
                q2allAVG={q2allAVG}
                q3allAVG={q3allAVG}
                q4allAVG={q4allAVG}
                q1catAVG={q1catAVG}
                q2catAVG={q2catAVG}
                q3catAVG={q3catAVG}
                q4catAVG={q4catAVG}
                allAverages={everyAVG}
                categoryAVG={categoryavg}
                groupsessionInfo={wholegroupinfo}
                subcategory={subcategorylist}
                startNextCopilot={startNextCopilot}
              />
            )}
          </WalkthroughableView>
        </CopilotStep>
      )}
      {searchText === "" ? null : (
        <View
          style={{
            position: "absolute",
            top: 220,
            left: 0,
            paddingHorizontal: 10,
            backgroundColor: "#fff",
            width: "85%",
            marginLeft: "7%",
            elevation: 10,
            borderRadius: 10
          }}
        >
          <ScrollView style={{ flex: 1, width: "100%", maxHeight: 200 }}>
            {copyarray
              .filter((e) => e.Category != "Search")
              .map((item, i) => (
                <TouchableWithoutFeedback
                  style={{
                    width: "100%",
                    borderBottomColor: "#0005",
                    borderBottomWidth: 1,
                    paddingVertical: 10
                  }}
                  onPress={() => {
                    var actualIndex = category.findIndex(function (cat) {
                      return cat.Category.includes(item.Category);
                    });
                    setsearchText("");
                    getCategories(item.ID, actualIndex);
                  }}
                >
                  <Text>{item.Category}</Text>
                </TouchableWithoutFeedback>
              ))}
          </ScrollView>
        </View>
      )}
      <PasswordModal
        open={pass}
        close={() => {
          setPass(!pass);
        }}
        onSuccess={() => {
          if (passAction === "BiddingWar") BiddingWar();
          else if (passAction === "ShowList") setShowList(true);
          else if (passAction === "SetFilter") isfiltered(!filtered);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "100%"
  },
  selectTimings: {
    borderRadius: 5,
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowOffset: { width: 5, height: 5 },
    backgroundColor: "white",
    marginLeft: 15
  },
  TextInput: {
    width: "50%",
    left: 10,
    alignItems: "baseline",
    borderBottomColor: "#e8a80c",
    borderBottomWidth: 2,
    color: "white",
    textAlign: "left"
  },
  AddinputWrapper: {
    // width: "80%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 7,
    marginHorizontal: 20
  },
  inputWrapper: {
    marginBottom: 15,
    marginTop: 10,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },
  inputLable: {
    color: "#fff",
    fontSize: 12,
    marginBottom: 5
  },
  input: {
    width: "100%",
    padding: 0,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#fff",
    borderRadius: 7,
    elevation: 3,
    color: "#222"
  },
  bidItemContainer: {
    borderRadius: 25,
    backgroundColor: "#101820FF",
    borderColor: "#101820FF",
    width: "90%",
    alignSelf: "center"
  }
});

export default copilot({
  animated: true, // Can be true or false
  overlay: "svg", // Can be either view or svg
  verticalOffset: Platform.OS == "ios" ? 0 : 24
})(Home);
