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
  Alert,
  PermissionsAndroid,
  Platform,
  Dimensions,
  Linking
} from "react-native";
import StarRating from "react-native-star-rating";
import { Card, ListItem, Button, List, CheckBox } from "react-native-elements";
import { AntDesign } from "@expo/vector-icons";
import { useLinkProps, useNavigation } from "@react-navigation/native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import * as Notifications from "expo-notifications";
import Icon from "react-native-vector-icons/Feather";
import { MaterialIcons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import * as ImagePicker from "expo-image-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Modal from "react-native-modal";
import ModalDropdown from "react-native-modal-dropdown";
import moment, { relativeTimeRounding } from "moment";
import * as FileSystem from "expo-file-system";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";
import { Video, AVPlaybackStatus } from "expo-av";
import LottieView from "lottie-react-native";
import uuid from "uuid";
import MyLoader from "../components/loader/MyLoader";

import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
const Tab = createMaterialTopTabNavigator();
export default function Earnings(props) {
  const [crowdfunding, isCrowdfunding] = useState(false);
  const [upcoming, isUpcoming] = useState(true);
  const [filePath, setFilePath] = useState(null);
  const [previous, isprevious] = useState(false);
  const [videoURL, setURL] = useState(null);
  const [picked, setPicked] = useState(false);
  const [endSlot, setEndSlot] = useState();
  const [StartingTime, setStartingTime] = useState("");
  const [type, settype] = useState("");
  const [title, settitle] = useState("");
  const [price, setprice] = useState("");
  const [datepicker, setdatepicker] = useState(false);
  const [startslot, setstartSlot] = useState("");
  const [endslot, setendslot] = useState("");
  const [time, settime] = useState();
  const [datevisibility, setdatevisibility] = useState(false);
  const [currenttime, setcurrent] = useState(moment());
  const [hours, sethours] = useState([5, 10, 15, 20, 25]);
  const [selected, setselected] = useState(0);
  const [events, setevents] = useState();
  const [isprofile, setprofile] = useState(false);
  const [selectedID, setID] = useState("");
  const [tuteeData, setData] = useState([]);
  const [timeleft, settimeleft] = useState("");
  const [isdaysleft, setdaysleft] = useState(false);
  const [upcomingCount, setupcomingCount] = useState(0);
  const [editcrowdfunding, setcrowdfunding] = useState(false);
  const [size, setsize] = useState("");
  const [meetingLink, setmeetinglink] = useState("");
  const [isMeetingDetail, setmeetingdetail] = useState(false);
  const [ismeetingSet, setMeetingInfo] = useState(false);
  const [sessionsID, setsessionsID] = useState([]);
  const [meetingpass, setmeetingpass] = useState("");
  const [isdefaultroom, setdefault] = useState(false);
  const [ispassSet, setpassbool] = useState(false);
  const [sessionfound, setsessionfound] = useState(false);
  const [eventsfound, seteventsfound] = useState(false);
  const [meetingID, setmeetingID] = useState("");
  const [detailsset, setdetailsbool] = useState(false);
  const [chosenMode, setChosenMode] = useState(false);
  const [linkset, setlinkbool] = useState(false);
  const [play, setplay] = useState(false);
  const [category, setCategory] = useState([]);
  const [minimum, setminimum] = useState("");
  const [selectedcategory, setCatselect] = useState("");
  const [timestring, settimestring] = useState("");
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [datestring, setdatestring] = useState("");
  const [TimeArray, setTimeArray] = useState([]);
  const [doubleIncentive, setdoubleincentive] = useState("");
  const [tripleIncentive, settripleincentive] = useState("");
  const [index, setindex] = useState(0);
  const [dbTime, setDBTime] = useState([]);
  const [previousCount, setpreviouscount] = useState(0);
  const [groupsessioncount, setgroupsessioncount] = useState(0);
  const [groupsessionInfo, setgroupsessionInfo] = useState([]);
  const [crowdfundingids, setcrowdfundingids] = useState([]);
  const [isTimer, settimer] = useState(false);
  const [timeUnix, settimerUnix] = useState("");
  const [timerpicker, settimerpicker] = useState(false);
  const [timerTime, settimertime] = useState("");
  const [timerDate, settimerdate] = useState("");
  const [isSchedule, setschedule] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addextra, setAddextra] = useState(false);

  const video = React.useRef(null);

  let List;

  const handleTimer = (time) => {
    const unixtime = new Date(time).valueOf();
    settimerUnix(unixtime);
    var timerstring = moment(unixtime).format("hh:mm a");
    settimertime(timerstring);
    var dateStr = moment(unixtime).format("dddd Do YYYY");
    settimerdate(dateStr);
    hidetimerpicker();
  };

  function showTimer() {
    settimerpicker(true);
  }
  function hidetimerpicker() {
    settimerpicker(false);
  }
  const handleDate = (time) => {
    setindex(index + 1);
    if (chosenMode) {
      const unixTime = new Date(time).valueOf();
      setstartSlot(unixTime);
      var starttimestring = moment(unixTime).format("hh:mm a");
      settime(starttimestring);
      var dateStr = moment(unixTime).format("dddd Do YYYY");
      setdatestring(dateStr);
      setStartingTime(starttimestring);

      console.log(unixTime);
    } else {
      const unixTime = new Date(time).valueOf();
      setendslot(unixTime);
      var endtimestring = moment(unixTime).format("hh:mm a");
      setEndSlot(endtimestring);
    }
    hideDateTime();
  };
  console.log();

  const showDatePicker = () => {
    setTimePickerVisibility(true);
  };
  const hideDateTime = () => {
    setTimePickerVisibility(false);
  };
  const hidePicker = () => {
    setdatevisibility(false);
    setdatepicker(false);
  };

  function addTimer() {
    closeTimer();
  }
  function addTimings() {
    let timestring = startslot + "-" + endslot;
    const newdbarray = [timestring];
    newdbarray.push(newdbarray);
    setDBTime([...dbTime, timestring]);
    const newarray = [
      {
        Date: datestring,
        StartTime: StartingTime,
        EndTime: endSlot
      }
    ];
    const List = [...TimeArray];
    List.push({ key: (TimeArray.length + 1).toString(), Value: newarray });
    setTimeArray(List);
  }
  function openTimerPicker() {
    settimer(true);
  }
  function closeTimer() {
    settimer(false);
  }

  function startCrowdFunding() {
    if (
      selectedcategory != "" &&
      title != "" &&
      videoURL != "" &&
      price != "" &&
      doubleIncentive != "" &&
      tripleIncentive != "" &&
      minimum != ""
    ) {
      firestore()
        .collection("Users")
        .doc(props.userData.ID)
        .get()
        .then((querySnapshot) => {
          setLoading(true);
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
            let CrowdFunding = "Group" + uuid.v4();
            let numberprice = parseInt(numberprice);
            const newCrowdFunding = [
              {
                Category: selectedcategory,
                Title: title,
                URL: videoURL,
                MediaType: type,
                Time: dbTime,
                TutorID: props.userData.ID,
                DoubleIncentive: doubleIncentive,
                TripleIncentive: tripleIncentive,
                Goal: numberprice,
                Minimum: minimum,
                EventID: CrowdFunding,
                LastContribution: 0,
                NumOfHours: dbTime.length,
                EndsIn: timeUnix
              }
            ];
            console.log("inside");
            var number2 = parseInt(groupsessioncount);
            var groupcounttemp = number2 + 1;
            firestore()
              .collection("Users")
              .doc(props.userData.ID)
              .update({ GroupSessionCount: groupcounttemp });
            firestore()
              .collection("CrowdFunding")
              .doc(CrowdFunding)
              .set({
                CrowdFundingInfo: firestore.FieldValue.arrayUnion(
                  ...newCrowdFunding
                )
              });
            let crowdfundArray = [CrowdFunding];
            firestore()
              .collection("Users")
              .doc(props.userData.ID)
              .update({
                CrowdFundingID: firestore.FieldValue.arrayUnion(
                  ...crowdfundArray
                )
              });
            Alert.alert("You've initiated a crowd-funding session.");
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }

  const navigation = useNavigation();
  function submitToggle() {
    navigation.navigate("Tutor");
  }
  function addcrowdfunding() {
    setcrowdfunding(true);
  }
  function openCrowdfunding() {
    isCrowdfunding(true);
    isUpcoming(false);
    isprevious(false);
  }

  function closePopup() {
    setprofile(false);
  }

  function ViewProfile(ID) {
    setprofile(true);
    setID(ID);
  }

  function openPrevious() {
    isprevious(true);
    isCrowdfunding(false);
    isUpcoming(false);
  }
  function opendatepicker() {
    setdatepicker(true);
  }

  function closemodal() {
    setdatepicker(false);
  }

  function openactualdatepicker() {
    setdatevisibility(true);
  }
  function openUpcoming() {
    isprevious(false);
    isCrowdfunding(false);
    isUpcoming(true);
  }
  const downloadFile = (uri) => {
    // Get today's date to add the time suffix in filename
    const url = uri;
    let fileUri = FileSystem.documentDirectory + "Tutteefile.docx";
    FileSystem.downloadAsync(url, fileUri)
      .then(({ url }) => {
        saveFile(url);
      })
      .catch((error) => {
        console.log(error);
      });

    // File URL which we want to download
  };

  const saveFile = async (uri) => {
    const { status } = await Permissions;
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      videoMaxDuration: 30,
      thumbnail: true,
      aspect: [4, 3],
      quality: 1
    });
    settype(result.type);
    console.log("image data ", result.type);
    if (!result.cancelled) {
      let source = { uri: result.uri };
      setFilePath(source.uri);
      let uri = result.uri;
      const ID = props.userData.ID;
      getFileSize(uri);
      if (size <= 5537813) {
        handleVideoDatabase(uri, ID);
      } else {
        console.log("sorry");
        Alert.alert("Choose a file size less than 5MB");
      }
    } else {
      console.log("too big");
    }
  };
  const getFileSize = async (fileUri) => {
    let fileInfo = await FileSystem.getInfoAsync(fileUri);
    console.log("size ", fileInfo.size);
    setsize(fileInfo.size);
    return fileInfo.size;
  };
  let duration;
  const [eventtime, seteventtime] = useState({});
  const calculateTimeLeft = () => {
    const mins = selected * 60;
    const seconds = selected * 3600000;
    var currenthour = new Date();
    var currentHH = +currenthour;

    var total = seconds + currentHH;

    var final = total - currentHH;
  };

  const studentList = [];
  async function getLists() {
    await firestore()
      .collection("Categories")
      .onSnapshot((querysnapshot) => {
        const CatList = [];
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

        let tempSearch = sorted.findIndex((e) => e.Category === "Search");
        sorted.splice(tempSearch, 1);
        setCategory(sorted);
      });
  }
  useEffect(() => {
    async function GetCategories() {
      await getLists();
    }
    GetCategories();
  }, []);
  async function getUserInfos() {
    await firestore()
      .collection("Users")
      .doc(props.userData.ID)
      .onSnapshot((querysnapshot) => {
        setupcomingCount(querysnapshot.data().UpcomingCount);
        setsessionsID(querysnapshot.data().SessionID);
        setpreviouscount(querysnapshot.data().PreviousCount);
        setcrowdfundingids(querysnapshot.data().CrowdFundingID);
        console.log("crowdfunding", querysnapshot.data().CrowdFundingID);
        if (querysnapshot.data().CrowdFundingID != null) {
          getCrowdFundedSessions(querysnapshot.data().CrowdFundingID);
        }
        setgroupsessioncount(querysnapshot.data().GroupSessionCount);
        setsessionfound(true);
        if (querysnapshot.data().SessionID != undefined) {
          getSessionInfo(querysnapshot.data().SessionID);
        }
        console.log(sessionsID, upcomingCount);
      });
  }

  async function getCrowdFundedSessions(crowdIDS) {
    console.log("group", crowdIDS);
    await firestore()
      .collection("CrowdFunding")
      .where(firestore.FieldPath.documentId(), "in", crowdIDS)
      .onSnapshot((querysnap) => {
        let groupList;
        querysnap.forEach((docsnap) => {
          groupList = docsnap.data().CrowdFundingInfo;
        });
        console.log(groupList);
        setgroupsessionInfo(groupList);
      });
  }

  async function getSessionInfo(sessionsid) {
    await firestore()
      .collection("Sessions")
      .where(firestore.FieldPath.documentId(), "in", sessionsid)
      .onSnapshot((querysnapshot) => {
        if (querysnapshot.empty) {
          console.log("empty");
        }
        const SessionList = [];
        let List;
        querysnapshot.forEach((docsnap) => {
          SessionList.push(docsnap.data().Upcoming);
          List = docsnap.data().Upcoming;
        });

        setevents(SessionList);

        seteventsfound(true);
      });
  }
  useEffect(() => {
    async function getuserinfo() {
      await getUserInfos();
    }

    getuserinfo();
  }, []);

  // useEffect(() => {
  //   let mounted = true;
  //   if (sessionsID.length && sessionsID != null) {
  //     firebase
  //       .firestore()
  //       .collection("Sessions")
  //       .where(firestore.FieldPath.documentId(), "in", sessionsID)
  //       .onSnapshot((querysnapshot) => {
  //         if (querysnapshot.empty) {
  //           console.log("empty");
  //         }

  //         const SessionList = [];
  //         let key;
  //         querysnapshot.forEach((docsnap) => {
  //           SessionList.push(docsnap.data().Upcoming);
  //           key = docsnap.id;
  //         });
  //         let obj;
  //         for (var i = 0; i < SessionList.length; i++) {
  //           let dataset = SessionList[i];
  //           obj = Object.values(dataset);
  //         }
  //         let num = obj.findIndex((e) => props.userData.ID === e.TutorID);
  //         obj[num].MeetingInfo = meetingLink;
  //         obj[num].DefaultRoom = true;
  //         obj[num].CustomRoom = false;

  //         console.log("key of this session", key);
  //         firebase
  //           .firestore()
  //           .collection("Sessions")
  //           .doc(key)
  //           .update({ Upcoming: obj });
  //         console.log("chosen obj", obj[num].Request);
  //         setMeetingInfo(false);
  //         setmeetingdetail(false);
  //       });
  //   }
  // }, []);
  // useEffect(() => {
  //   if (sessionsID != null && sessionsID.length) {
  //     firebase
  //       .firestore()
  //       .collection("Sessions")
  //       .where(firestore.FieldPath.documentId(), "in", sessionsID)
  //       .onSnapshot((querysnapshot) => {
  //         if (querysnapshot.empty) {
  //           console.log("empty");
  //         }

  //         const SessionList = [];
  //         let key;

  //         querysnapshot.forEach((docsnap) => {
  //           SessionList.push(docsnap.data().Upcoming);
  //           key = docsnap.id;
  //         });
  //         let obj;
  //         for (var i = 0; i < SessionList.length; i++) {
  //           let dataset = SessionList[i];
  //           obj = Object.values(dataset);
  //         }
  //         let num = obj.findIndex((e) => props.userData.ID === e.TutorID);
  //         obj[num].Password = meetingpass;
  //         obj[num].DefaultRoom = false;
  //         obj[num].CustomRoom = true;
  //         firebase
  //           .firestore()
  //           .collection("Sessions")
  //           .doc(key)
  //           .update({ Upcoming: obj });
  //         setmeetingdetail(false);
  //         setmeetingpass("");
  //         setmeetingID("");
  //         setdetailsbool(true);
  //       });
  //   }
  // }, [detailsset, ispassSet]);
  // useEffect(() => {
  //   if (selectedID !== "" && mounted) {
  //     return firebase
  //       .firestore()
  //       .collection("Users")
  //       .doc(selectedID)
  //       .onSnapshot((querysnapshot) => {
  //         studentList.push({ ...querysnapshot.data(), key: querysnapshot.id });
  //         setData(studentList);
  //       });
  //   }
  // }, []);
  function secondsToHms(duration) {
    var extraTime = duration % (24 * 60 * 60);
    var hours = Math.floor(extraTime / 3600);
    var minutes = Math.floor((extraTime % 3600) / 60);
    var seconds = Math.floor((extraTime % 3600) % 60);

    if (hours != "") {
      return hours + ":" + minutes + ":" + seconds;
    }
    return minutes + ":" + seconds;
  }

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
    return dDisplay + hDisplay + mDisplay + sDisplay;
  }
  let mytemptimes = [];
  let conversion;
  let currentdate = new Date();
  const [hoursleft, sethoursleft] = useState("");
  useEffect(() => {
    if (events != "" && eventsfound === true) {
      let starttime;
      let participantList = events.map((item, i) => {
        let participants = item.map((item, i) => item.Participants);
        let newtuteedata;
        // console.log("new participant list", anothercopy.toString());
        let stringparticipants = participants.toString();
        let split = stringparticipants.split(",");

        let tuteelist = [];
      });
      starttime = events.map((item, i) =>
        item.map((item, i) => item.StartTime)
      );
      let starttimestring = starttime.toString();
      let splitstart = starttimestring.split(",");
      console.log("start time", splitstart, starttimestring);
      //mytemptimes = splitstart;

      var date2 = new Date();

      console.log("time left");
      setInterval(() => {
        if (splitstart.length > 0) {
          for (const time in splitstart) {
            if (date2 <= splitstart[time]) {
              //console.log("splitstart", splitstart[time]);

              splitstart[time] = splitstart[time] - 1;
              conversion = secondtoHHMM(splitstart[0]);
              sethoursleft(conversion);
            } else {
              console.log("no more time left");
            }
          }
        }
      }, 1000);
    }
  }, [eventsfound]);
  const string = hoursleft.split(",");
  const handleVideoDatabase = async (uri, ID) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        resolve(xhr.response);
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
    const ref = storage()
      .ref()
      .child("CrowdFunding/" + ID);
    let snapshot = await ref.put(blob);
    // const url = await snapshot.ref.getDownloadURL();
    const url = await storage()
      .ref("CrowdFunding/" + ID)
      .getDownloadURL();
    console.log("url", url);
    setURL(url);
    setPicked(true);
  };
  const [status, setStatus] = React.useState({});
  function onBuffer() {
    console.log("video buffered");
  }

  function videoError() {
    console.log("video error");
  }
  const [participants, setparticipants] = useState([]);

  //console.log("is participant", participants);
  function openLink(item) {
    if (item.DefaultRoom === true && item.CustomRoom === false) {
      console.log("youve used default room");
      return Linking.openURL(item.MeetingInfo);
    } else if (item.DefaultRoom === false && item.CustomRoom === true) {
      console.log("youve used custom room");
      let url =
        "https://us04web.zoom.us/j/" + item.MeetingID + "?pwd=" + item.Password;
      return Linking.openURL(url);
    }
  }
  function SaveMeetingDetails(item) {
    if (isdefaultroom === true) {
      setMeetingInfo(true);
    } else if (isdefaultroom === false && meetingpass !== "") {
      setMeetingInfo(false);
      setpassbool(true);
    }
    console.log("meeting detail set for session", item);
  }
  function openPopUp(item) {
    console.log("modal function", item);
    console.log("userdata", userData);
    navigation.navigate("CrowdFundingEvent", {
      EventDetails: item,
      Timer: string,
      userData: props.userData.ID
    });
  }
  return (
    <SafeAreaView
      style={{
        backgroundColor: "black",
        height: "100%",
        paddingTop: Platform.OS === "android" ? 25 : 0
      }}
    >
      <MyLoader loading={loading} color={"#fff"} />
      <View
        onLayout={(event) => {
          var { x, y, width, height } = event.nativeEvent.layout;
          console.log("view height", height);
        }}
        style={{ backgroundColor: "black", height: 180 }}
      >
        <View
          style={{ alignSelf: "flex-end", position: "absolute", right: 45 }}
        >
          <TouchableOpacity
            style={{ justifyContent: "flex-end", alignSelf: "flex-end" }}
            onPress={() => navigation.navigate("Schedule")}
          >
            <View
              style={{
                backgroundColor: "#F1C411",
                width: 35,
                height: 35,
                borderRadius: 10,
                justifyContent: "center",
                alignSelf: "flex-end"
              }}
            >
              <MaterialIcons
                name="calendar-today"
                size={25}
                style={{ alignSelf: "center" }}
                color={"black"}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            alignSelf: "flex-end",
            position: "absolute",
            right: 2,
            zIndex: 1
          }}
        >
          <TouchableOpacity
            onPress={() => submitToggle()}
            style={{ justifyContent: "flex-end", alignSelf: "flex-end" }}
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
        </View>

        <View style={{ flexDirection: "row", top: 0 }}>
          <Text
            style={{
              color: "white",
              left: 10,
              top: 0,
              fontSize: 15
            }}
          >
            Your
          </Text>
          <Text
            style={{
              color: "#F1C411",
              left: 10,
              top: 0,
              fontSize: 15,
              fontWeight: "bold"
            }}
          >
            {" "}
            SESSIONS.
          </Text>
        </View>
        <Text style={{ color: "white", left: 10, fontSize: 15, top: 0 }}>
          Add, View or Edit Sessions Info.
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            top: 30,
            right: 5
          }}
        >
          <View
            style={{
              flexDirection: "column",
              alignSelf: "center",
              justifyContent: "center"
            }}
          >
            <TouchableOpacity
              onPress={() => openPrevious()}
              style={{
                backgroundColor: "#F1C411",
                alignSelf: "center",
                borderRadius: 35,
                height: 55,
                width: 55,
                justifyContent: "center"
              }}
            >
              <MaterialIcons
                name="skip-previous"
                size={40}
                style={{ alignSelf: "center", color: "black" }}
              />
            </TouchableOpacity>
            {previous === true ? (
              <LottieView
                ref={(animation) => {
                  setplay(animation);
                }}
                autoPlay={true}
                style={{
                  width: 115,
                  height: 115,
                  alignSelf: "center",
                  marginTop: -4.5,
                  zIndex: -1,
                  position: "absolute"
                }}
                source={require("../assets/focus2.json")}
                loop={true}
              />
            ) : null}
            <View
              style={{
                backgroundColor: "red",
                width: 25,
                height: 25,
                borderRadius: 15,
                justifyContent: "center",
                position: "absolute",
                left: 38,
                top: -8
              }}
            >
              <Text
                style={{ fontSize: 14, alignSelf: "center", color: "white" }}
              >
                {previousCount}
              </Text>
            </View>
            <Text
              style={{
                color: "white",
                alignSelf: "center",
                bottom: 0,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {" "}
              Previous{" "}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "column",
              alignSelf: "center",
              width: "auto",
              bottom: 5
            }}
          >
            <TouchableOpacity
              onPress={() => openUpcoming()}
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
                source={require("../assets/event.png")}
                style={{
                  width: 40,
                  height: 40,
                  alignSelf: "center",
                  resizeMode: "contain"
                }}
              />
            </TouchableOpacity>
            {upcoming === true ? (
              <LottieView
                ref={(animation) => {
                  setplay(animation);
                }}
                autoPlay={true}
                style={{
                  width: 130,
                  height: 130,
                  alignSelf: "center",
                  marginTop: Platform.OS === "android" ? -15 : -10,
                  zIndex: -1,
                  position: "absolute"
                }}
                source={require("../assets/focus2.json")}
                loop={true}
              />
            ) : null}
            <View
              style={{
                backgroundColor: "red",
                width: 25,
                height: 25,
                borderRadius: 15,
                justifyContent: "center",
                position: "absolute",
                left: 46,
                top: -8
              }}
            >
              <Text
                style={{ fontSize: 14, alignSelf: "center", color: "white" }}
              >
                {upcomingCount}
              </Text>
            </View>
            <Text style={{ color: "white", alignSelf: "center" }}>
              Upcoming
            </Text>
          </View>
          <View
            style={{
              flexDirection: "column",
              alignSelf: "center"
            }}
          >
            <TouchableOpacity
              onPress={() => openCrowdfunding()}
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
                source={require("../assets/balance.png")}
                style={{ alignSelf: "center", left: 2, width: 40, height: 40 }}
              />
            </TouchableOpacity>
            {crowdfunding === true ? (
              <LottieView
                ref={(animation) => {
                  setplay(animation);
                }}
                autoPlay={true}
                style={{
                  width: 115,
                  height: 115,
                  alignSelf: "center",
                  marginTop: Platform.OS === "android" ? -15 : -10,
                  zIndex: -1,
                  position: "absolute"
                }}
                source={require("../assets/focus2.json")}
                loop={true}
              />
            ) : null}
            <View
              style={{
                backgroundColor: "red",
                width: 25,
                height: 25,
                borderRadius: 15,
                justifyContent: "center",
                position: "absolute",
                left: 40,
                top: -8
              }}
            >
              <Text
                style={{ fontSize: 14, alignSelf: "center", color: "white" }}
              >
                {groupsessioncount}
              </Text>
            </View>
            <Text
              style={{
                color: "white",
                alignSelf: "center",
                width: "auto",
                textAlign: "center"
              }}
            >
              Crowd
            </Text>
          </View>
        </View>
      </View>
      {upcoming ? (
        // <FlatList
        //   data={events}
        //   style={{ backgroundColor: "white" }}
        //   renderItem={({ item, index }) => {
        //     const uri = item.Document;
        //     const StudentID = item.StudentID;
        //     let starttime = item.map((item, i) => item.StartTime);
        //     let endtime = item.map((item, i) => item.EndTime);
        //     //starttimestring = moment(starttime).format("hh:mm A");
        //     var endtimestring = moment(parseInt(endtime)).format("hh:mm A ");
        //     var starttimestring = moment(parseInt(starttime)).format("hh:mm A");
        //     let Month = moment(parseInt(starttime)).format("MMMM");
        //     let Year = moment(parseInt(starttime)).format("YYYY");
        //     let Day = moment(parseInt(starttime)).format("Do");
        //     let document = item.map((item, i) => item.Document);
        //     //console.log("now split array", split);

        //     //console.log("tutee data", participants);
        //     return (
        //       <View style={{ alignSelf: "center" }}>
        //         <Text style={{ top: 10, fontSize: 20 }}>
        //           {Month}, {Year}
        //         </Text>
        //         <Card
        //           containerStyle={{
        //             backgroundColor: "#101820FF",
        //             borderColor: "#101820FF",
        //             width: "auto",
        //             borderRadius: 15,
        //             shadowOffset: { width: 0, height: 2 },
        //             shadowColor: "black",
        //             shadowRadius: 2,
        //             shadowOpacity: 0.5,
        //           }}
        //         >
        //           <Text
        //             style={{
        //               alignSelf: "flex-start",
        //               right: 5,
        //               fontSize: 20,
        //               color: "white",
        //             }}
        //           >
        //             {" "}
        //             {Day}{" "}
        //           </Text>
        //           <Text style={{ fontSize: 14, color: "white" }}>{Month}</Text>
        //           <View style={{ flexDirection: "row" }}>
        //             <Text
        //               style={{
        //                 color: "white",
        //                 top: 15,
        //                 right: 5,
        //                 fontWeight: "bold",
        //               }}
        //             >
        //               {item.Category}
        //             </Text>
        //             {item.map((item, i) => {
        //               item.SubCategory != null && (
        //                 <View key={i}>
        //                   <Icon
        //                     name="arrow-right"
        //                     size={18}
        //                     style={{
        //                       color: "white",
        //                       alignSelf: "center",
        //                       top: 15,
        //                       right: 2,
        //                     }}
        //                   />
        //                   <Text
        //                     style={{
        //                       color: "white",
        //                       top: 15,
        //                       right: 0,
        //                       fontWeight: "bold",
        //                     }}
        //                   >
        //                     {item.SubCategory}
        //                   </Text>
        //                 </View>
        //               );
        //             })}
        //             <View
        //               style={{
        //                 right: 0,
        //                 position: "absolute",
        //                 alignSelf: "flex-end",
        //                 top: -5,
        //                 bottom: 0,
        //               }}
        //             >
        //               <TouchableOpacity
        //                 onPress={() => setmeetingdetail(true)}
        //                 style={{
        //                   width: 50,
        //                   height: 50,
        //                   backgroundColor: "#fdc500",
        //                   justifyContent: "center",
        //                   borderRadius: 5,
        //                   alignSelf: "center",
        //                 }}
        //               >
        //                 <Image
        //                   source={require("../assets/settingsicon1.png")}
        //                   style={{
        //                     width: 35,
        //                     height: 35,
        //                     alignSelf: "center",
        //                   }}
        //                 />
        //               </TouchableOpacity>
        //               <Modal key={item} isVisible={isMeetingDetail}>
        //                 <View
        //                   style={{
        //                     width: "100%",
        //                     height: "auto",
        //                     backgroundColor: "#101820FF",
        //                     alignSelf: "center",
        //                     borderRadius: 15,
        //                     shadowColor: "grey",
        //                     shadowOffset: { width: 1, height: 1 },
        //                     shadowRadius: 1,
        //                     shadowOpacity: 0.5,
        //                     elevation: 5,
        //                   }}
        //                 >
        //                   <TouchableOpacity
        //                     onPress={() => setmeetingdetail(false)}
        //                   >
        //                     <MaterialIcons
        //                       name="clear"
        //                       size={25}
        //                       style={{ alignSelf: "flex-end" }}
        //                       color={"#F1C411"}
        //                     />
        //                   </TouchableOpacity>
        //                   <Text
        //                     style={{
        //                       color: "white",
        //                       fontWeight: "bold",
        //                       alignSelf: "center",
        //                       left: 2,
        //                       textAlign: "center",
        //                     }}
        //                   >
        //                     Add your meeting information for Tuto-ritees to
        //                     join.
        //                   </Text>
        //                   <View
        //                     style={{
        //                       flexDirection: "row",
        //                       justifyContent: "center",
        //                       top: 10,
        //                       alignSelf: "center",
        //                       left: 10,
        //                       bottom: 10,
        //                     }}
        //                   >
        //                     <Text
        //                       style={{
        //                         color: "white",
        //                         fontWeight: "bold",
        //                         alignSelf: "center",
        //                         left: 0,
        //                       }}
        //                     >
        //                       Meeting ID:
        //                     </Text>
        //                     <TextInput
        //                       value={meetingID}
        //                       onChangeText={(text) => setmeetingID(text)}
        //                       placeholder={"Ex. 4482840006"}
        //                       placeholderTextColor="grey"
        //                       multiline={true}
        //                       style={{
        //                         width: "auto",
        //                         left: 10,
        //                         top: 2,
        //                         borderWidth: 1,
        //                         borderColor: "#F1C411",
        //                         height: 30,
        //                         color: "white",
        //                       }}
        //                     />
        //                   </View>
        //                   <View
        //                     style={{
        //                       flexDirection: "row",
        //                       justifyContent: "center",
        //                       top: 20,
        //                       alignSelf: "center",
        //                       left: 10,
        //                     }}
        //                   >
        //                     <Text
        //                       style={{
        //                         color: "white",
        //                         fontWeight: "bold",
        //                         alignSelf: "center",
        //                         left: 0,
        //                       }}
        //                     >
        //                       Meeting Password:
        //                     </Text>
        //                     <TextInput
        //                       value={meetingpass}
        //                       onChangeText={(text) => setmeetingpass(text)}
        //                       placeholder={"Ex. n12tw"}
        //                       placeholderTextColor="grey"
        //                       textContentType="password"
        //                       multiline={true}
        //                       style={{
        //                         width: "30%",
        //                         left: 10,
        //                         top: 2,
        //                         borderWidth: 1,
        //                         borderColor: "#F1C411",
        //                         height: 30,
        //                         color: "white",
        //                       }}
        //                     />
        //                   </View>
        //                   <Text
        //                     style={{
        //                       color: "white",
        //                       left: 10,
        //                       alignSelf: "center",
        //                       top: 35,
        //                       color: "white",
        //                       fontWeight: "bold",
        //                     }}
        //                   >
        //                     Or
        //                   </Text>
        //                   <View
        //                     style={{
        //                       flexDirection: "column",
        //                       justifyContent: "center",
        //                       top: 28,
        //                       alignSelf: "center",
        //                       left: 10,
        //                       zIndex: 0,
        //                     }}
        //                   >
        //                     <CheckBox
        //                       onPress={() => setdefault(!isdefaultroom)}
        //                       title="Use default room"
        //                       center
        //                       checkedColor={"#F1C411"}
        //                       checked={isdefaultroom}
        //                       containerStyle={{
        //                         width: "auto",
        //                         alignSelf: "center",
        //                         height: 50,
        //                         left: 10,
        //                         backgroundColor: "#101820FF",
        //                         borderColor: "#101820FF",
        //                       }}
        //                       textStyle={{
        //                         color: "white",
        //                         width: "auto",
        //                         alignSelf: "center",
        //                         right: 10,
        //                       }}
        //                       style={{ alignSelf: "center" }}
        //                     />
        //                     {item.MeetingInfo === "" &&
        //                     isdefaultroom === true ? (
        //                       <View>
        //                         <Text
        //                           style={{
        //                             color: "white",
        //                             fontWeight: "bold",
        //                             alignSelf: "flex-start",
        //                             left: 2,
        //                           }}
        //                         >
        //                           Meeting Link
        //                         </Text>
        //                         <TextInput
        //                           value={meetingLink}
        //                           onChangeText={(text) => setmeetinglink(text)}
        //                           placeholder={
        //                             "Ex. https://us04web.zoom.us/..."
        //                           }
        //                           placeholderTextColor="grey"
        //                           textContentType="URL"
        //                           multiline={true}
        //                           style={{
        //                             width: "auto",
        //                             left: 2,
        //                             top: 2,
        //                             borderWidth: 1,
        //                             borderColor: "#F1C411",
        //                             height: 60,
        //                             color: "white",
        //                           }}
        //                         />
        //                       </View>
        //                     ) : null}
        //                   </View>

        //                   <TouchableOpacity
        //                     onPress={() => SaveMeetingDetails(item)}
        //                     style={{
        //                       backgroundColor: "#F1C411",
        //                       width: "80%",
        //                       height: 30,
        //                       borderRadius: 5,
        //                       justifyContent: "center",
        //                       marginTop: Platform.OS === "android" ? 40 : 45,
        //                       bottom: 10,
        //                       alignSelf: "center",
        //                     }}
        //                   >
        //                     <Text
        //                       style={{
        //                         alignSelf: "center",
        //                         fontWeight: "bold",
        //                       }}
        //                     >
        //                       Submit
        //                     </Text>
        //                   </TouchableOpacity>
        //                 </View>
        //               </Modal>
        //               <Text
        //                 style={{
        //                   color: "white",
        //                   left: 0,
        //                   right: 0,
        //                   top: 0,
        //                   textAlign: "center",
        //                 }}
        //               >
        //                 Meeting Info.
        //               </Text>
        //             </View>
        //           </View>
        //           <Text style={{ marginTop: 20, right: 5, color: "#F1C411" }}>
        //             {item.map((item, i) => item.Topic)}
        //           </Text>
        //           <View style={{ flexDirection: "row" }}>
        //             <Text style={{ marginTop: 5, right: 5, color: "white" }}>
        //               {starttimestring} - {endtimestring}
        //             </Text>
        //           </View>
        //           {document != "" ? (
        //             <View style={{ flexDirection: "row" }}>
        //               <Text
        //                 style={{
        //                   right: 5,
        //                   marginTop: 5,
        //                   color: "white",
        //                   fontWeight: "400",
        //                   fontStyle: "italic",
        //                 }}
        //               >
        //                 {item.Document}
        //               </Text>
        //               <TouchableOpacity
        //                 onPress={() => downloadFile(uri)}
        //                 style={{
        //                   width: 25,
        //                   height: 25,
        //                   backgroundColor: "#F1C411",
        //                   justifyContent: "center",
        //                   borderRadius: 20,
        //                 }}
        //               >
        //                 <MaterialIcons
        //                   name="file-download"
        //                   size={15}
        //                   style={{ alignSelf: "center", top: 0, left: 0 }}
        //                 />
        //               </TouchableOpacity>
        //             </View>
        //           ) : (
        //             <Text
        //               style={{
        //                 right: 5,
        //                 marginTop: 5,
        //                 color: "white",
        //                 fontWeight: "400",
        //               }}
        //             >
        //               No document uploaded
        //             </Text>
        //           )}

        //           <View style={{ flexDirection: "row", marginTop: 10 }}>
        //             {/* <Text
        //               style={{
        //                 alignSelf: "center",
        //                 right: 5,
        //                 color: "white",
        //               }}
        //             >
        //               With
        //             </Text> */}

        //             {item != undefined ? (
        //               <View style={{ flexDirection: "row", flex: 1 }}></View>
        //             ) : (
        //               <TouchableOpacity onPress={() => ViewProfile(StudentID)}>
        //                 <Image
        //                   source={{ uri: item.StudentPic }}
        //                   style={{
        //                     width: 30,
        //                     height: 30,
        //                     right: 0,
        //                     left: 0,
        //                     borderRadius: 35,
        //                     alignSelf: "center",
        //                   }}
        //                 />
        //               </TouchableOpacity>
        //             )}
        //           </View>
        //           <View style={{ alignSelf: "center" }}>
        //             <Text
        //               style={{
        //                 color: "white",
        //                 top: 10,
        //                 alignSelf: "center",
        //                 right: 2,
        //               }}
        //             >
        //               Starts in:
        //             </Text>
        //             <View
        //               style={{
        //                 flexDirection: "row",
        //                 alignSelf: "center",
        //                 width: "auto",
        //                 right: 12,
        //               }}
        //             >
        //               {string != null &&
        //                 string.map((item, i) => {
        //                   const divided = item.split(" ");

        //                   return (
        //                     <View
        //                       key={i}
        //                       style={{
        //                         flexDirection: "row",
        //                         width: 60,
        //                         height: "auto",
        //                         alignSelf: "center",
        //                         paddingHorizontal: 0,
        //                       }}
        //                     >
        //                       <Card
        //                         containerStyle={{
        //                           backgroundColor: "white",
        //                           borderColor: "white",
        //                           width: 50,
        //                           height: 45,
        //                           borderRadius: 10,
        //                           justifyContent: "center",
        //                           alignSelf: "center",
        //                           marginRight: 10,
        //                         }}
        //                       >
        //                         <Text
        //                           style={{
        //                             alignSelf: "center",
        //                             color: "black",
        //                             top: 0,
        //                           }}
        //                         >
        //                           {divided[0]}
        //                         </Text>
        //                       </Card>
        //                     </View>
        //                   );
        //                 })}
        //             </View>
        //             <View
        //               style={{
        //                 flexDirection: "row",
        //                 top: 2,
        //                 alignSelf: "center",
        //                 left: 12.5,
        //               }}
        //             >
        //               {string != null &&
        //                 string.map((item, i) => {
        //                   const dividedstring = item.split(" ");

        //                   return (
        //                     <View
        //                       key={i}
        //                       style={{
        //                         width: 60,
        //                         alignSelf: "center",
        //                         right: 12,
        //                       }}
        //                     >
        //                       <View
        //                         style={{
        //                           width: "auto",
        //                           height: 25,
        //                           left: 0,
        //                           backgroundColor: "white",

        //                           justifyContent: "center",
        //                         }}
        //                       >
        //                         <Text
        //                           style={{
        //                             color: "black",
        //                             flexDirection: "row",
        //                             right: 2,
        //                             textAlign: "center",
        //                             width: "auto",
        //                           }}
        //                         >
        //                           {dividedstring[1]}
        //                         </Text>
        //                       </View>
        //                     </View>
        //                   );
        //                 })}
        //             </View>
        //           </View>
        //           <TouchableOpacity
        //             onPress={() => openLink(item)}
        //             style={{
        //               backgroundColor: "#F1C411",
        //               width: 300,
        //               height: 30,
        //               borderRadius: 5,
        //               justifyContent: "center",
        //               marginTop: 10,
        //               alignSelf: "flex-start",
        //             }}
        //           >
        //             <Text style={{ alignSelf: "center" }}>Start Session</Text>
        //           </TouchableOpacity>
        //         </Card>
        //         <Modal isVisible={isprofile}>
        //           <View
        //             style={{
        //               width: "100%",
        //               height: "70%",
        //               backgroundColor: "black",
        //               alignSelf: "center",
        //               borderRadius: 15,
        //               shadowColor: "grey",
        //               shadowOffset: { width: 1, height: 1 },
        //               shadowRadius: 1,
        //               shadowOpacity: 0.5,
        //               elevation: 5,
        //             }}
        //           >
        //             <TouchableOpacity onPress={() => closePopup()}>
        //               <MaterialIcons
        //                 name="clear"
        //                 size={25}
        //                 style={{ alignSelf: "flex-end" }}
        //                 color={"#F1C411"}
        //               />
        //             </TouchableOpacity>

        //             <FlatList
        //               data={tuteeData}
        //               renderItem={({ item }) => {
        //                 return (
        //                   <View style={{ width: "100%" }}>
        //                     <Image
        //                       source={{ uri: item.Photo }}
        //                       style={{
        //                         width: 55,
        //                         height: 55,
        //                         alignSelf: "center",
        //                         borderRadius: 25,
        //                         top: 5,
        //                       }}
        //                     />
        //                     <Text
        //                       style={{
        //                         color: "white",
        //                         alignSelf: "center",
        //                         flexDirection: "row",
        //                         top: 10,
        //                         fontSize: 18,
        //                       }}
        //                     >
        //                       {item.Title} {item.Name}
        //                     </Text>
        //                     <View
        //                       style={{
        //                         top: 25,
        //                         backgroundColor: "white",
        //                         height: "115%",
        //                         width: "100%",
        //                         borderRadius: 10,
        //                         alignSelf: "center",
        //                       }}
        //                     ></View>
        //                   </View>
        //                 );
        //               }}
        //             />
        //           </View>
        //         </Modal>
        //       </View>
        //     );
        //   }}
        //   keyExtractor={(item, index) => index.toString()}
        // />
        <ScrollView
          style={{ backgroundColor: "white", height: "300%" }}
        ></ScrollView>
      ) : crowdfunding ? (
        <ScrollView
          contentContainerStyle={{ height: "200%", backgroundColor: "white" }}
          style={{ height: "auto", backgroundColor: "white" }}
        >
          <Card
            containerStyle={{
              backgroundColor: "#101820FF",
              borderColor: "#101820FF",
              width: "auto",
              height: "auto",
              borderRadius: 15,
              shadowOffset: { width: 0, height: 2 },
              shadowColor: "black",
              shadowRadius: 2,
              shadowOpacity: 0.5
            }}
          >
            <ScrollView
              contentContainerStyle={{
                height: editcrowdfunding === true ? "155%" : "auto"
              }}
              style={{ height: editcrowdfunding === true ? "200%" : "auto" }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  borderBottomWidth: 1
                }}
              >
                <Text
                  style={{
                    color: "white",
                    alignSelf: "center",
                    fontWeight: "bold"
                  }}
                >
                  Add new crowdfunding session
                </Text>
                {editcrowdfunding === false ? (
                  <TouchableOpacity
                    onPress={() => addcrowdfunding()}
                    style={{}}
                  >
                    <MaterialIcons
                      name="add"
                      color={"#F1C411"}
                      size={25}
                      style={{ alignSelf: "flex-start", bottom: 0 }}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => setcrowdfunding(false)}
                    style={{}}
                  >
                    <MaterialIcons
                      name="arrow-drop-down"
                      color={"#F1C411"}
                      size={25}
                      style={{ alignSelf: "flex-start", bottom: 0 }}
                    />
                  </TouchableOpacity>
                )}
              </View>
              {editcrowdfunding ? (
                <View>
                  <Text
                    style={{
                      alignSelf: "flex-start",
                      top: 10,
                      color: "white",

                      fontSize: 16
                    }}
                  >
                    Category
                  </Text>
                  <ModalDropdown
                    options={category.map((item, i) => item.Category)}
                    style={{
                      backgroundColor: "#333939",
                      borderRadius: 10,

                      borderColor: "#333939",
                      borderWidth: 2,
                      width: "60%",
                      height: 40,
                      justifyContent: "center",
                      top: 10
                    }}
                    textStyle={{
                      color: "white",
                      alignSelf: "center",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 10
                    }}
                    dropdownStyle={{
                      backgroundColor: "#333939",
                      borderWidth: 2,
                      borderColor: "#333939",
                      width: "40%",
                      top: 0
                    }}
                    dropdownTextStyle={{
                      backgroundColor: "#333939",
                      color: "white"
                    }}
                    dropdownTextHighlightStyle={{ color: "#F1C411" }}
                    onSelect={(index, topic) => setCatselect(topic)}
                    defaultValue="Select a category"
                  ></ModalDropdown>
                  {/* <Text
                    style={{
                      alignSelf: "flex-start",
                      top: 10,
                      color: "white",

                      fontSize: 16,
                    }}
                  >
                    Title
                  </Text> */}
                  <TextInput
                    value={title}
                    onChangeText={(text) => settitle(text)}
                    style={{
                      width: "60%",
                      borderColor: "#333939",
                      height: 35,
                      borderRadius: 10,
                      marginTop: 10,
                      borderWidth: 1,
                      color: "white",

                      backgroundColor: "#333939"
                    }}
                  />

                  <TouchableOpacity
                    onPress={() => pickImage()}
                    style={{
                      backgroundColor: "white",
                      width: "auto",
                      paddingHorizontal: 20,
                      height: 30,
                      justifyContent: "center",
                      borderRadius: 10,
                      marginTop: 20
                    }}
                  >
                    <Text style={{ alignSelf: "center", color: "black" }}>
                      Upload an image or a video
                    </Text>
                  </TouchableOpacity>

                  {type === "image" ? (
                    <Image
                      source={{ uri: videoURL }}
                      style={{
                        width: 200,
                        height: 150,
                        top: 10,

                        resizeMode: "contain"
                      }}
                    />
                  ) : (
                    <Video
                      ref={video}
                      style={styles.backgroundVideo}
                      source={{
                        uri: videoURL
                      }}
                      useNativeControls
                      resizeMode="contain"
                      isLooping
                      onPlaybackStatusUpdate={(status) =>
                        setStatus(() => status)
                      }
                    />
                  )}

                  <Text style={{ color: "white", top: 10, fontSize: 16 }}>
                    Funding Goal
                  </Text>
                  <TextInput
                    placeholderTextColor={"white"}
                    onChangeText={(text) => setprice(text)}
                    style={styles.textinput}
                  />
                  <Text
                    style={{
                      borderWidth: 1,
                      width: "60%",
                      borderColor: "#333939",

                      height: 35,
                      justifyContent: "center",
                      backgroundColor: "#333939",
                      bottom: Platform.OS === "android" ? 20 : 18,
                      color: "white",
                      zIndex: 0,
                      textAlign: "left",
                      borderRadius: 10
                    }}
                  >
                    {price}$
                  </Text>
                  <Text
                    style={{
                      alignSelf: "flex-start",

                      color: "white",

                      fontSize: 16
                    }}
                  >
                    Minimum Contribution
                  </Text>
                  <TextInput
                    value={minimum}
                    onChangeText={(text) => setminimum(text)}
                    style={{
                      width: "60%",
                      borderColor: "#333939",
                      height: 35,
                      borderRadius: 10,

                      borderWidth: 1,
                      color: "white",

                      backgroundColor: "#333939"
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => opendatepicker()}
                    style={{
                      backgroundColor: "white",
                      width: "70%",
                      height: 30,
                      justifyContent: "center",
                      borderRadius: 10,
                      marginTop: 10
                    }}
                  >
                    <Text style={{ alignSelf: "center", color: "black" }}>
                      Pick the timings of the session
                    </Text>
                  </TouchableOpacity>
                  {TimeArray != null &&
                    TimeArray.map((item, i) => {
                      return (
                        <View key={i} style={{ paddingVertical: 2 }}>
                          <Text
                            style={{
                              color: "white"
                            }}
                          >
                            {item.Value.map(
                              (item, i) =>
                                item.Date +
                                " " +
                                item.StartTime +
                                "-" +
                                item.EndTime
                            )}
                          </Text>
                        </View>
                      );
                    })}
                  <TouchableOpacity
                    onPress={() => openTimerPicker()}
                    style={{
                      backgroundColor: "white",
                      width: "50%",
                      height: 30,
                      justifyContent: "center",
                      borderRadius: 10,
                      marginTop: 10
                    }}
                  >
                    <Text style={{ alignSelf: "center", color: "black" }}>
                      Timer
                    </Text>
                  </TouchableOpacity>
                  <Text
                    style={{
                      color: "white"
                    }}
                  >
                    Campaign Ends on: {timerDate} {timerTime}
                  </Text>
                  <Modal isVisible={isTimer}>
                    <View
                      style={{
                        shadowColor: "#000",
                        shadowOffset: {
                          width: 0,
                          height: 7
                        },
                        shadowOpacity: 0.43,
                        shadowRadius: 9.51,
                        elevation: 15,
                        height: "40%",
                        width: "100%",
                        borderRadius: 16,
                        alignSelf: "center",
                        justifyContent: "center",
                        backgroundColor: "#333939"
                      }}
                    >
                      <TouchableOpacity onPress={() => closeTimer()}>
                        <MaterialIcons
                          name="clear"
                          size={25}
                          style={{ alignSelf: "flex-end" }}
                          color={"#F1C411"}
                        />
                      </TouchableOpacity>
                      <View
                        style={{
                          flexDirection: "column",
                          justifyContent: "space-around"
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-evenly"
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              backgroundColor: "white",
                              width: "30%",
                              height: 30,
                              borderRadius: 10,
                              justifyContent: "center",
                              alignItems: "center",
                              alignSelf: "center"
                            }}
                            onPress={() => {
                              showTimer();
                            }}
                          >
                            <Text>Ends at</Text>
                          </TouchableOpacity>
                          <Text
                            style={{
                              borderWidth: 1,
                              width: 70,
                              alignSelf: "center",
                              color: "white",
                              borderColor: "white",
                              marginLeft: 0
                            }}
                          >
                            {timerTime}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={{
                          marginTop: 50,
                          backgroundColor: "white",
                          width: "50%",
                          height: 30,
                          borderRadius: 10,
                          justifyContent: "center",
                          alignItems: "center",
                          alignSelf: "center"
                        }}
                        onPress={() => addTimer()}
                      >
                        <Text
                          style={{ alignSelf: "center", fontWeight: "bold" }}
                        >
                          Add timer
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <DateTimePickerModal
                      isVisible={timerpicker}
                      mode="datetime"
                      input={true}
                      onConfirm={handleTimer}
                      onCancel={hidetimerpicker}
                    />
                  </Modal>

                  <Modal isVisible={datepicker}>
                    <View
                      style={{
                        shadowColor: "#000",
                        shadowOffset: {
                          width: 0,
                          height: 7
                        },
                        shadowOpacity: 0.43,
                        shadowRadius: 9.51,
                        elevation: 15,
                        height: "40%",
                        width: "100%",
                        borderRadius: 16,
                        alignSelf: "center",
                        justifyContent: "center",
                        backgroundColor: "#333939"
                      }}
                    >
                      <TouchableOpacity onPress={() => setdatepicker(false)}>
                        <MaterialIcons
                          name="clear"
                          size={25}
                          style={{ alignSelf: "flex-end" }}
                          color={"#F1C411"}
                        />
                      </TouchableOpacity>
                      <View
                        style={{
                          flexDirection: "column",
                          justifyContent: "space-around"
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-evenly"
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              backgroundColor: "white",
                              width: "30%",
                              height: 30,
                              borderRadius: 10,
                              justifyContent: "center",
                              alignItems: "center",
                              alignSelf: "center"
                            }}
                            onPress={() => {
                              setChosenMode(true);
                              showDatePicker();
                            }}
                          >
                            <Text>From</Text>
                          </TouchableOpacity>
                          <Text
                            style={{
                              borderWidth: 1,
                              width: 70,
                              alignSelf: "center",
                              color: "white",
                              borderColor: "white",
                              marginLeft: 0
                            }}
                          >
                            {StartingTime}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-evenly"
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              backgroundColor: "white",
                              width: "30%",
                              height: 30,
                              borderRadius: 10,
                              justifyContent: "center",
                              alignItems: "center",
                              alignSelf: "center",
                              marginTop: 10
                            }}
                            onPress={() => {
                              setChosenMode(false);
                              showDatePicker();
                            }}
                          >
                            <Text>To</Text>
                          </TouchableOpacity>
                          <Text
                            style={{
                              borderWidth: 1,
                              width: 70,
                              alignSelf: "center",
                              color: "white",
                              borderColor: "white",
                              marginTop: 10
                            }}
                          >
                            {endSlot}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={{
                          marginTop: 50,
                          backgroundColor: "white",
                          width: "50%",
                          height: 30,
                          borderRadius: 10,
                          justifyContent: "center",
                          alignItems: "center",
                          alignSelf: "center"
                        }}
                        onPress={() => addTimings()}
                      >
                        <Text
                          style={{ alignSelf: "center", fontWeight: "bold" }}
                        >
                          Add Timings
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <DateTimePickerModal
                      isVisible={isTimePickerVisible}
                      mode="datetime"
                      input={true}
                      onConfirm={handleDate}
                      onCancel={hideDateTime}
                    />
                  </Modal>
                  <Text
                    style={{
                      alignSelf: "flex-start",
                      top: 10,
                      color: "white",

                      fontSize: 16
                    }}
                  >
                    Double contribution
                  </Text>
                  <ModalDropdown
                    options={["Signed Certificate", "1 hour 1-1 session"]}
                    style={{
                      backgroundColor: "#333939",
                      borderRadius: 10,
                      alignSelf: "center",
                      borderColor: "#333939",
                      borderWidth: 2,
                      width: "100%",
                      height: 50,
                      justifyContent: "center",
                      top: 10
                    }}
                    textStyle={{
                      color: "white",
                      alignSelf: "center",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 10
                    }}
                    dropdownStyle={{
                      backgroundColor: "#333939",
                      borderWidth: 2,
                      borderColor: "#333939",
                      width: "82%",
                      marginTop: Platform.OS === "android" ? 170 : 200
                    }}
                    dropdownTextStyle={{
                      backgroundColor: "#333939",
                      color: "white"
                    }}
                    dropdownTextHighlightStyle={{ color: "#F1C411" }}
                    onSelect={(index, topic) => setdoubleincentive(topic)}
                    defaultValue="Select an incentive for double contribution"
                  ></ModalDropdown>
                  <Text
                    style={{
                      alignSelf: "flex-start",
                      top: 10,
                      color: "white",

                      fontSize: 16
                    }}
                  >
                    Triple contribution
                  </Text>
                  <ModalDropdown
                    options={["Signed Certificate", "2 hours 1-1 session"]}
                    style={{
                      backgroundColor: "#333939",
                      borderRadius: 10,
                      alignSelf: "center",
                      borderColor: "#333939",
                      borderWidth: 2,
                      width: "100%",
                      height: 50,
                      justifyContent: "center",
                      top: 10
                    }}
                    textStyle={{
                      color: "white",
                      alignSelf: "center",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 10
                    }}
                    dropdownStyle={{
                      backgroundColor: "#333939",
                      borderWidth: 2,
                      borderColor: "#333939",
                      width: "82%",
                      marginTop: Platform.OS === "android" ? 170 : 200
                    }}
                    dropdownTextStyle={{
                      backgroundColor: "#333939",
                      color: "white"
                    }}
                    dropdownTextHighlightStyle={{ color: "#F1C411" }}
                    onSelect={(index, topic) => settripleincentive(topic)}
                    defaultValue="Select an incentive for triple contribution"
                  ></ModalDropdown>
                  {/* <TextInput
                      textAlign="left"
                      style={{
                        backgroundColor: "#333939",
                        width: "60%",
                        alignSelf: "center",
                        borderRadius: 10,
                        height: 50,
                        borderColor: "#464142",
                        color: "white",
                      }}
                    /> */}

                  <TouchableOpacity
                    onPress={() => startCrowdFunding()}
                    style={{
                      alignSelf: "center",
                      marginTop: 25,
                      backgroundColor: "#F1C411",
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
                    <Text style={{ alignSelf: "center" }}>Start Now</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </ScrollView>
          </Card>

          {groupsessionInfo != undefined ? (
            <FlatList
              data={groupsessionInfo}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => {
                // let width = animation.interpolate({
                //   inputRange: [0, 100],
                //   outputRange: ["0%", "100%"],
                //   extrapolate: "clamp",
                // });
                let timearray;
                let array = [];
                let dateStr;
                let starttimestring;
                let endtimestring;
                for (var i = 0; i < item.Time.length; i++) {
                  let timestring = item.Time[i].toString();
                  const string = timestring.split("-");
                  dateStr = moment(parseInt(string)).format("dddd Do YYYY");
                  starttimestring = moment(parseInt(string)).format("hh:mm a");
                  endtimestring = moment(parseInt(string[1])).format("hh:mm a");
                  //const string = time.split("-");
                  timearray = [
                    {
                      Date: dateStr,
                      startTime: starttimestring,
                      endTime: endtimestring
                    }
                  ];
                  array.push(timearray);
                }

                return (
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
                          fontSize: 15,

                          fontWeight: "bold"
                        }}
                      >
                        Summary{" "}
                      </Text>
                      <View style={{ flexDirection: "row" }}>
                        <Text
                          style={{
                            color: "white"
                          }}
                        >
                          Number of hours: {item.NumOfHours}{" "}
                        </Text>

                        <TouchableOpacity
                          onPress={() => setschedule(true)}
                          style={{
                            backgroundColor: "#F1C411",
                            width: 25,
                            height: 25,
                            borderRadius: 10,
                            justifyContent: "center",
                            alignSelf: "flex-start",
                            bottom: 5
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
                          bottom: 2
                        }}
                      >
                        Funding Goal: {item.Goal}${" "}
                      </Text>
                      <Text
                        style={{
                          color: "white"
                        }}
                      >
                        Total Collected: {item.LastContribution}${" "}
                      </Text>
                      <Modal isVisible={isSchedule}>
                        <View
                          style={{
                            width: "100%",
                            height: "40%",
                            backgroundColor: "#333939",
                            alignSelf: "center",
                            borderRadius: 15
                          }}
                        >
                          <TouchableOpacity onPress={() => setschedule(false)}>
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
                              fontWeight: "bold"
                            }}
                          >
                            Schedule
                          </Text>
                          {array.map((item, i) => {
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
                                        borderRadius: 10
                                      }}
                                    >
                                      <Text
                                        style={{
                                          color: "black",
                                          textAlign: "center",
                                          width: "100%",
                                          alignSelf: "center"
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
                            left: 5
                          }}
                        >
                          {item.DoubleIncentive}
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
                            left: 5
                          }}
                        >
                          {item.TripleIncentive}
                        </Text>
                      </View>

                      {item.LastContribution != item.Goal ? (
                        <Text style={{ color: "#F1C411", width: 200, top: 12 }}>
                          Your funding goal has not been reached yet
                        </Text>
                      ) : (
                        <Text style={{ color: "#F1C411", top: 15 }}>
                          Rittoe's funding goal has been reached.
                        </Text>
                      )}
                    </View>

                    <TouchableOpacity
                      onPress={() => openPopUp(item)}
                      style={{
                        width: 150,
                        height: 30,
                        justifyContent: "center",
                        backgroundColor: "white",
                        paddingHorizontal: 10,
                        borderRadius: 10,
                        alignSelf: "center",
                        top: 10
                      }}
                    >
                      <Text style={{ alignSelf: "center" }}>
                        View more details
                      </Text>
                    </TouchableOpacity>
                    {/* <View style={{ alignSelf: "center" }}>
                  <View
                    style={{
                      flexDirection: "row",

                      width: 40,
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
                    })}
                  </View>
                  <View
                    style={{
                      flexDirection: "row",

                      bottom: 5,
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
                </View> */}
                  </Card>
                );
              }}
            />
          ) : null}
        </ScrollView>
      ) : previous ? (
        <ScrollView style={{ backgroundColor: "white" }}></ScrollView>
      ) : null}
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
  textinput: {
    width: "60%",
    borderColor: "white",
    height: 30,
    top: 10,
    color: "rgba(0,0,0,0)",
    zIndex: 1,
    borderRadius: 10
  }
});
