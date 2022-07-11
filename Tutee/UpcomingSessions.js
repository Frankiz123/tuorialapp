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
  Alert,
  PermissionsAndroid
} from "react-native";
import { Card, ListItem, Button, List } from "react-native-elements";
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
import moment from "moment";
import * as FileSystem from "expo-file-system";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";

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
  const [type, settype] = useState("");
  const [title, settitle] = useState("");
  const [price, setprice] = useState("");
  const [datepicker, setdatepicker] = useState(false);
  const [date, setdate] = useState("");
  const [time, settime] = useState();
  const [datevisibility, setdatevisibility] = useState(false);
  const [currenttime, setcurrent] = useState(moment());
  const [hours, sethours] = useState([5, 10, 15, 20, 25]);
  const [selected, setselected] = useState(0);
  const [events, setevents] = useState([]);
  const [isprofile, setprofile] = useState(false);
  const [selectedID, setID] = useState("");
  const [tuteeData, setData] = useState([]);
  const [timeleft, settimeleft] = useState("");
  const [isdaysleft, setdaysleft] = useState(false);
  const [sessionsID, setsessionsID] = useState([]);
  const [sessionfound, setsessionfound] = useState(false);
  const [isEventsFound, seteventsfound] = useState(false);
  let List;
  const handleDate = (date) => {
    var stringdate = moment(date).format("YYYY-MM-DD h:mm:ss");
    setdate(date);
    console.log(stringdate);
    hidePicker();
  };
  console.log();

  const showDatePicker = () => {
    setdatevisibility(true);
  };
  const hidePicker = () => {
    setdatevisibility(false);
  };
  const navigation = useNavigation();
  function submitToggle() {
    navigation.navigate("Tutor");
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
      handleVideoDatabase(uri, ID);
    } else {
      console.log("too big");
    }
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
  useEffect(() => {
    let unsubscribe;

    if (props.userData.ID !== undefined) {
      unsubscribe = firestore()
        .collection("Users")
        .doc(props.userData.ID)
        .onSnapshot((querysnapshot) => {
          setsessionsID(querysnapshot.data().SessionID);
          setsessionfound(true);
          console.log("arrat ", sessionsID);
        });
    }
    return () => {
      unsubscribe;
    };
  }, [sessionfound]);
  useEffect(() => {
    if (sessionfound === true) {
      firestore()
        .collection("Sessions")
        .where(firestore.FieldPath.documentId(), "in", sessionsID)
        .onSnapshot((querysnapshot) => {
          querysnapshot.forEach((docsnap) => {
            List = docsnap.data().Upcoming;
          });
          setevents(List);
          seteventsfound(true);

          console.log("session ", events, props.userData.ID);
        });
    }
    if (selectedID !== "") {
      firestore()
        .collection("Users")
        .doc(selectedID)
        .onSnapshot((querysnapshot) => {
          studentList.push({ ...querysnapshot.data(), key: querysnapshot.id });
          setData(studentList);
        });
    }
  }, [selectedID, props.userData.ID, sessionfound]);
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
  const [hoursleft, sethoursleft] = useState("");
  useEffect(() => {
    if (events != "" && events.length && isEventsFound === true) {
      let tempTimes = events.map((val) => val.StartTime);
      mytemptimes = tempTimes;
      console.log("EVENTS", events);
      setInterval(() => {
        if (mytemptimes.length > 0) {
          for (const time in mytemptimes) {
            mytemptimes[time] = mytemptimes[time] - 1;
            conversion = secondtoHHMM(mytemptimes[time]);
          }

          sethoursleft(conversion);
        }
      }, 1000);
    }
  }, [isEventsFound]);
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

  return (
    <SafeAreaView
      style={{
        backgroundColor: "black",
        height: "100%",
        paddingTop: Platform.OS === "android" ? 25 : 0
      }}
    >
      <View
        onLayout={(event) => {
          var { x, y, width, height } = event.nativeEvent.layout;
          console.log("view height", height);
        }}
        style={{ backgroundColor: "black", height: 190 }}
      >
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
              color: "#fdc500",
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
            top: 190 / 5,
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
                backgroundColor: "#fdc500",
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
                1
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
                backgroundColor: "#fdc500",
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
                1
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
                backgroundColor: "#fdc500",
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
                1
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
              Funding
            </Text>
          </View>
        </View>
      </View>
      {upcoming ? (
        <FlatList
          data={events}
          style={{ backgroundColor: "white" }}
          renderItem={({ item, index }) => {
            const uri = item.Document;
            const StudentID = item.StudentID;
            const tutorID = item.TutorID;
            var endtimestring = moment(item.EndTime).format("HH:mm A");
            var starttimestring = moment(item.StartTime).format("HH:mm A");
            return (
              <View style={{ alignSelf: "center" }}>
                <Text style={{ top: 10, fontSize: 20 }}>
                  {item.Month}, {item.Year}
                </Text>
                <Card
                  containerStyle={{
                    backgroundColor: "#101820FF",
                    borderColor: "#101820FF",
                    width: "auto",
                    borderRadius: 15,
                    shadowOffset: { width: 0, height: 2 },
                    shadowColor: "black",
                    shadowRadius: 2,
                    shadowOpacity: 0.5
                  }}
                >
                  <Text
                    style={{
                      alignSelf: "flex-start",
                      right: 5,
                      fontSize: 20,
                      color: "white"
                    }}
                  >
                    {" "}
                    {item.Day}{" "}
                  </Text>
                  <Text style={{ fontSize: 14, color: "white" }}>
                    {item.Month}
                  </Text>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        color: "white",
                        top: 15,
                        right: 5,
                        fontWeight: "bold"
                      }}
                    >
                      {item.Category}
                    </Text>
                    <Icon
                      name="arrow-right"
                      size={18}
                      style={{
                        color: "white",
                        alignSelf: "center",
                        top: 15,
                        right: 2
                      }}
                    />
                    <Text
                      style={{
                        color: "white",
                        top: 15,
                        right: 0,
                        fontWeight: "bold"
                      }}
                    >
                      {item.SubCategory}
                    </Text>
                  </View>
                  <Text style={{ marginTop: 20, right: 5, color: "#fdc500" }}>
                    {item.Topic}
                  </Text>
                  <Text style={{ marginTop: 5, right: 5, color: "white" }}>
                    {starttimestring} - {endtimestring}
                  </Text>

                  <View style={{ flexDirection: "row", marginTop: 10 }}>
                    <Text
                      style={{ alignSelf: "center", right: 5, color: "white" }}
                    >
                      With
                    </Text>
                    <TouchableOpacity onPress={() => ViewProfile(StudentID)}>
                      <Image
                        source={{ uri: item.TutorPic }}
                        style={{
                          width: 30,
                          height: 30,
                          right: 0,
                          left: 0,
                          borderRadius: 35,
                          alignSelf: "center"
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={{ alignSelf: "center" }}>
                    <Text
                      style={{
                        color: "white",
                        top: 10,
                        alignSelf: "center",
                        right: 2
                      }}
                    >
                      Starts in:
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignSelf: "center",
                        width: "auto",
                        right: 12
                      }}
                    >
                      {string.map((item, i) => {
                        const divided = item.split(" ");

                        return (
                          <View
                            key={i}
                            style={{
                              flexDirection: "row",
                              width: 60,
                              height: "auto",
                              alignSelf: "center",
                              paddingHorizontal: 0
                            }}
                          >
                            <Card
                              containerStyle={{
                                backgroundColor: "white",
                                borderColor: "white",
                                width: 50,
                                height: 45,
                                borderRadius: 10,
                                justifyContent: "center",
                                alignSelf: "center",
                                marginRight: 10
                              }}
                            >
                              <Text
                                style={{
                                  alignSelf: "center",
                                  color: "black",
                                  top: 0
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
                        top: 2,
                        alignSelf: "center",
                        left: 12.5
                      }}
                    >
                      {string.map((item, i) => {
                        const dividedstring = item.split(" ");

                        return (
                          <View
                            key={i}
                            style={{
                              width: 60,
                              alignSelf: "center",
                              right: 12
                            }}
                          >
                            <View
                              style={{
                                width: "auto",
                                height: 25,
                                left: 0,
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
                    style={{
                      backgroundColor: "#fdc500",
                      width: 300,
                      height: 30,
                      borderRadius: 5,
                      justifyContent: "center",
                      marginTop: 10,
                      alignSelf: "flex-start"
                    }}
                  >
                    <Text style={{ alignSelf: "center" }}>Join Session</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("Reviews", {
                        userData: props.userData,
                        TutorData: tutorID
                      })
                    }
                    style={{
                      backgroundColor: "#fdc500",
                      width: 300,
                      height: 30,
                      borderRadius: 5,
                      justifyContent: "center",
                      marginTop: 10,
                      alignSelf: "flex-start"
                    }}
                  >
                    <Text style={{ alignSelf: "center" }}>Review</Text>
                  </TouchableOpacity>
                </Card>
                <Modal isVisible={isprofile}>
                  <View
                    style={{
                      width: "100%",
                      height: "70%",
                      backgroundColor: "black",
                      alignSelf: "center",
                      borderRadius: 15,
                      shadowColor: "grey",
                      shadowOffset: { width: 1, height: 1 },
                      shadowRadius: 1,
                      shadowOpacity: 0.5,
                      elevation: 5
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

                    <FlatList
                      data={tuteeData}
                      renderItem={({ item }) => {
                        return (
                          <View style={{ width: "100%" }}>
                            <Image
                              source={{ uri: item.Photo }}
                              style={{
                                width: 55,
                                height: 55,
                                alignSelf: "center",
                                borderRadius: 25,
                                top: 5
                              }}
                            />
                            <Text
                              style={{
                                color: "white",
                                alignSelf: "center",
                                flexDirection: "row",
                                top: 10,
                                fontSize: 18
                              }}
                            >
                              {item.Title} {item.Name}
                            </Text>
                            <View
                              style={{
                                top: 25,
                                backgroundColor: "white",
                                height: "115%",
                                width: "100%",
                                borderRadius: 10,
                                alignSelf: "center"
                              }}
                            ></View>
                          </View>
                        );
                      }}
                    />
                  </View>
                </Modal>
              </View>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : crowdfunding ? (
        <ScrollView style={{ backgroundColor: "white" }}>
          <View>
            <Text style={{ alignSelf: "center", top: 10, fontWeight: "bold" }}>
              Select a title
            </Text>
            <TextInput
              value={title}
              onChangeText={(text) => settitle(text)}
              style={styles.textinput}
            />
            <TouchableOpacity
              onPress={() => pickImage()}
              style={{
                backgroundColor: "#101820FF",
                width: "50%",
                height: 30,
                justifyContent: "center",
                alignSelf: "center",
                borderRadius: 10,
                marginTop: 10
              }}
            >
              <Text style={{ alignSelf: "center", color: "white" }}>
                Upload an image or a video
              </Text>
            </TouchableOpacity>

            {type === "image" ? (
              <Image
                source={{ uri: videoURL }}
                style={{ width: "100%", height: "50%", resizeMode: "contain" }}
              />
            ) : null}

            <Text style={{ alignSelf: "center", top: 20 }}>Enter a price</Text>
            <TextInput
              value={price}
              onChangeText={(text) => setprice(text)}
              style={styles.textinput}
            />
            <TouchableOpacity
              onPress={() => opendatepicker()}
              style={{
                backgroundColor: "#101820FF",
                width: "50%",
                height: 30,
                justifyContent: "center",
                alignSelf: "center",
                borderRadius: 10,
                marginTop: 10
              }}
            >
              <Text style={{ alignSelf: "center", color: "white" }}>
                Pick hours left
              </Text>
            </TouchableOpacity>
            <ModalDropdown
              options={hours}
              style={{
                backgroundColor: "black",
                borderRadius: 10,
                marginLeft: 10,
                borderColor: "#e8a80c",
                borderWidth: 2
              }}
              textStyle={{
                color: "white",
                alignSelf: "center",
                justifyContent: "center",
                alignItems: "center",
                padding: 10
              }}
              dropdownStyle={{
                backgroundColor: "#101820FF",
                borderWidth: 2,
                marginBottom: 100
              }}
              dropdownTextStyle={{
                backgroundColor: "#101820FF",
                color: "white"
              }}
              dropdownTextHighlightStyle={{ color: "#fdc500" }}
              onSelect={(index, topic) => setselected(topic)}
            ></ModalDropdown>

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
                  height: 250,
                  width: "80%",
                  borderRadius: 16,
                  alignSelf: "center",
                  justifyContent: "center",
                  backgroundColor: "black"
                }}
              >
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
                        showDatePicker();
                      }}
                    >
                      <Text>Pick a day</Text>
                    </TouchableOpacity>
                    <Text
                      style={{
                        borderWidth: 1,
                        width: 90,
                        alignSelf: "center",
                        color: "white",
                        borderColor: "white",
                        marginLeft: 0
                      }}
                    ></Text>
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
                    onPress={() => closemodal()}
                  >
                    <Text style={{ alignSelf: "center", fontWeight: "bold" }}>
                      Save
                    </Text>
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={datevisibility}
                    mode="date"
                    input={true}
                    locale={"en_GB"}
                    onConfirm={handleDate}
                    onCancel={hidePicker}
                  />
                </View>
              </View>
            </Modal>
            <TouchableOpacity onPress={() => calculateTimeLeft()}>
              <Text>calculate</Text>

              <Text></Text>
            </TouchableOpacity>
          </View>
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
    borderWidth: 1,
    width: "60%",
    height: 20,
    marginTop: 20,
    alignSelf: "center"
  }
});
