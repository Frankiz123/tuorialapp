import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Animated,
  Dimensions,
  TextInput,
  Platform
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ToggleSwitch from "toggle-switch-react-native";
import LottieView from "lottie-react-native";
//DASHBOARD FOR TUTEE

import firestore from "@react-native-firebase/firestore";

const storageGet = async (key) => {
  try {
    const result = await AsyncStorage.getItem(key);
    console.log("result ", result);
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
export default function TempPage(props) {
  const { userData, updateType } = props;

  // SETTING THE VARIABLES
  const [category, setCategory] = useState([]);
  const [biddingTopic, setbiddingTopic] = useState("");
  const [biddingPrice, setbiddingprice] = useState("");
  const [isBiddingType, setbiddingtype] = useState(false);
  const [biddingTimer, setbiddingTimer] = useState(0);
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
  const CatList = [];
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
  const [isBidsProgress, setbidsprogress] = useState(false);
  const [groupsessionID, setgroupsessionID] = useState([]);
  const [groupsessionInfo, setgroupsessionInfo] = useState([]);
  const [grouptutorID, setgrouptutorID] = useState("");
  const [grouptutorArray, setgrouptutorArray] = useState([]);
  const [crowdfundingcount, setcrowdfundingcount] = useState(0);

  const [expensiveTaskState, setExpensiveTaskState] = useState(
    ExpensiveTaskStates.notStared
  );
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

  //selects subcategory
  function iconSelect(item, i, keys) {
    seticon(item);
    seticonindex(i);
    console.log("inside ICON FUNCTION", keys[i]);
    setsubcategorylist(keys[i]);
    setsubcatselect(true);
  }

  //gets subcategories in the selected categories
  async function getCategories(newcategory) {
    setSelected(newcategory);

    await firestore()
      .collection("SubCategories")
      .where("CategoryID", "==", newcategory)
      .onSnapshot((querysnap) => {
        const subcatList = [];
        console.log("trying to select subcategories", newcategory);
        querysnap.forEach((docsnap) => {
          subcatList.push({ ...docsnap.data(), key: docsnap.id });
        });
        setsubcategories(subcatList);
      });

    getTutorsinCat(newcategory);
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
    console.log("new category ", newcategory);
  }, []);

  //gets tutors in selected categories
  async function getTutorsinCat(newcategory) {
    const tutorlist = [];

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
          let groupID = [];
          querysnapshot.forEach((docsnap) => {
            tutorlist.push({ ...docsnap.data(), key: docsnap.id });
          });

          settutordata(tutorlist);
          setadvanced(false);
        });
    }
    setcatselect(true);
  }

  //gets categories
  async function getLists() {
    await firestore()
      .collection("Categories")
      .onSnapshot((querysnapshot) => {
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

  async function submitToggle(isOn) {
    await AsyncStorage.setItem("Type", "Tutor").then(() => {
      console.log("It was saved");
    });
    var type = "Tutor";
    updateType(type);
  }

  //when clicked submit filter

  //to find the closest timing a tutor is available in
  useEffect(() => {
    getLists();
  }, []);

  const welcomestring = "Start 𝐋𝐄𝐀𝐑𝐍𝐈𝐍𝐆";
  const tuteestring =
    "𝐓𝐮𝐭𝐨𝐫𝐢𝐭𝐭𝐨, connecting those who want to LEARN with those who want to EARN.";
  return (
    <SafeAreaView
      style={{
        backgroundColor: "black",
        height: "112%",
        paddingTop: Platform.OS === "android" ? 25 : 0
      }}
    >
      <View style={styles.header}>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <Image
              source={{ uri: props.userData.Photo }}
              style={{ width: 45, height: 45, borderRadius: 40, top: 10 }}
            />
          </TouchableOpacity>
          <View style={{ flexDirection: "column", top: 15, right: 28 }}>
            <Text style={{ color: "#F1C411", fontWeight: "bold" }}>
              Tuto-Rittees,
            </Text>
            <View style={{ flexDirection: "row", marginTop: 0, right: 0 }}>
              <Text style={{ color: "white" }}>Lets start</Text>
              <Text style={{ color: "#F1C411", fontWeight: "bold", left: 4 }}>
                LEARNING.
              </Text>
            </View>
          </View>
          <View style={{ alignSelf: "flex-end" }}>
            <ToggleSwitch
              isOn={isOn} // There should be a state like this.state.isOn(Set default value)
              onColor="black"
              offColor="#F1C411"
              labelStyle={{ color: "black" }}
              size="large"
              onToggle={() => {
                setisOn(!isOn),
                  submitToggle(isOn),
                  console.log("status toggle", isOn);
              }} //To update state
            />
          </View>
        </View>
        <View
          style={{
            marginTop: 30,
            backgroundColor: "white",
            height: 65,
            padding: 5,
            borderRadius: 10,
            alignContent: "center",
            zIndex: 1,
            opacity: 0.8
          }}
        >
          <FlatList
            style={{ height: 160 }}
            data={category}
            renderItem={({ item, index }) => {
              newcategory = item.ID;
              return (
                <TouchableOpacity
                  onPress={() => {
                    getCategories(item.ID);
                  }}
                  style={{ width: Dimensions.get("screen").width / 4 }}
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
                    <Image
                      source={{ uri: item.Icon }}
                      style={{
                        width: 35,
                        height: 40,
                        alignSelf: "center",
                        resizeMode: "contain",
                        alignContent: "center",
                        alignItems: "center"
                      }}
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
                </TouchableOpacity>
              );
            }}
            horizontal={true}
            keyExtractor={(item, index) => {
              return index.toString();
            }}
          />
        </View>

        {categorypick != null ? (
          <ScrollView
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
            }}
          >
            {categorypick === "21" ? (
              <Animated.View style={{ width: OrganizationAnim, marginLeft: 0 }}>
                <Text style={{ marginTop: 15, textAlign: "center" }}>
                  Check out your organisation's tuto-rittoes and group tutoring
                  sessions below
                </Text>
              </Animated.View>
            ) : categorypick === "22" ? (
              <View style={{ width: 450, justifyContent: "center" }}>
                <TextInput
                  multiline={true}
                  textAlign={"left"}
                  style={{
                    borderWidth: 1,
                    width: "82%",
                    height: 40,
                    right: 0,
                    left: 1,
                    top: 10
                  }}
                />
              </View>
            ) : (
              subcategories.map((item, i) => {
                const keys = Object.values(item.General);
                const string = Object.values(item.Icon);
                return (
                  <View key={i} style={{ flexDirection: "column" }}>
                    <View
                      style={{ flexDirection: "row", paddingHorizontal: 0 }}
                    >
                      {string.map((item, i) => {
                        indexList.push(i);

                        return (
                          <Animated.View
                            key={i}
                            style={{ width: MarginAnim, alignSelf: "center" }}
                          >
                            <TouchableOpacity
                              onPress={() => {
                                console.log("pressed");
                              }}
                              style={{
                                backgroundColor: "#F1C411",
                                borderRadius: icon === item ? 20 : 0
                              }}
                            >
                              <Animated.View style={{ opacity: fadeAnim[i] }}>
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
                                        Platform.OS === "android" ? -9 : -6,
                                      position: "absolute"
                                    }}
                                    source={require("../assets/focus2.json")}
                                    loop={true}
                                  />
                                ) : null}
                                <Image
                                  source={{ uri: item }}
                                  style={{
                                    width: 35,
                                    height: 40,
                                    resizeMode: "contain",
                                    alignSelf: "center"
                                  }}
                                ></Image>
                              </Animated.View>
                            </TouchableOpacity>
                          </Animated.View>
                        );
                      })}
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      {keys.map((value, i) => {
                        return (
                          <Animated.View
                            key={i}
                            style={{ flexGrow: 1, width: MarginAnim }}
                          >
                            <TouchableOpacity
                              onPress={() => subcategoryselect(value, i, keys)}
                            >
                              <Animated.Text
                                style={{
                                  color:
                                    subcategorylist === value
                                      ? "black"
                                      : "black",
                                  fontSize: 10.5,
                                  width: "auto",
                                  alignContent: "center",
                                  right: 0,
                                  alignSelf: "center",
                                  opacity: fadeAnim[i]
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
              })
            )}
          </ScrollView>
        ) : (
          <View>
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
          </View>
        )}
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          bottom: 90,
          height: "900%",
          backgroundColor: "black"
        }}
      >
        {/* <WebView
          source={{
            uri: "https://www.tutoritto.com/categories",
          }}
          style={{
            flex: 1,
            height: 500,
          }}
          startInLoadingState={false}
          javaScriptEnabled={true}
        /> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: "auto"
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
  }
});
