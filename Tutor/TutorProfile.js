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
  Platform,
  TextInput,
  Linking,
  Pressable
} from "react-native";
import { Card, ListItem, Button, List } from "react-native-elements";
import Icon from "react-native-vector-icons/Feather";
import { AntDesign } from "@expo/vector-icons";
import { useLinkProps, useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import * as languages from "../languagestutor.json";
import ModalDropdown from "react-native-modal-dropdown";
import * as Notifications from "expo-notifications";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import StarRating from "react-native-star-rating";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import ToggleSwitchNav from "toggle-switch-react-native/ToggleSwitchNav";
import { render } from "react-dom";
//CODE ADDED BY UDDIPAN
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import OneSignal from "react-native-onesignal";
//CODE ADDED BY UDDIPAN
import * as demodata from "../demodata.json";
import countries from "../countries.json";

import firestore from "@react-native-firebase/firestore";
import MyAlert from "../alert/MyAlert";
import auth from "@react-native-firebase/auth";

const Tab = createMaterialTopTabNavigator();
export default function TutorProfile(props) {
  const { userData, updateLogged } = props;

  const [schedule, setbool] = useState(true);
  const [categories, setcategories] = useState([]);
  const [value, setvalue] = useState("");
  const [items, setItems] = useState([]);
  const [array, setArray] = useState([]);
  const [categoryID, setcategoryIDs] = useState([]);
  const [title, setTitle] = useState();
  const [istitle, settitlebool] = useState(false);
  const [email, setemail] = useState("");
  const [language, setlanguage] = useState(false);
  const [languagearray, setlanguages] = useState([]);
  const [count, languagecount] = useState(0);
  const [savedLang, setsavedLang] = useState(false);
  const [skillcount, setskillcount] = useState(0);
  const [promovideocount, setvideocount] = useState(0);
  const [reviewcount, setreviewcount] = useState(0);
  const [iscountries, setcountries] = useState(false);
  const [selectedcountry, setselectedcountry] = useState("");
  const [Bio, setbio] = useState("");
  const [organization, setorganization] = useState("");
  const [educationcount, seteducationcount] = useState(0);
  const [isSchedule, setschedule] = useState(false);
  const [isBioEditable, setBio] = useState(false);
  const [biotext, setbiotext] = useState("");
  const [selectedlang, setselectedlang] = useState("");
  const [arrayoflanguages, setarrayoflanguages] = useState([]);
  const [isdeleted, setdeleted] = useState(false);
  const [countryArray, setcountryarray] = useState([]);
  const [countrystring, setcountrystring] = useState("");
  const [langcount, setcount] = useState(0);
  const [educationdegree, seteducationdegree] = useState("");
  const [arrayofcountries, setarrayofcountries] = useState([]);
  const [isSample, setSample] = useState(false);
  const [originalarray, setoriginalarray] = useState([]); //original country array for tutor
  const [visibility, setVisibility] = useState(false);

  let values;
  let country;

  values = Object.values(languages);

  for (var key in countries) {
    country = Object.values(countries);
  }

  const navigation = useNavigation();

  useEffect(() => {
    firestore()
      .collection("Users")
      .doc(props.userData.ID)
      .onSnapshot((querySnapShot) => {
        if (querySnapShot.exists) {
          setskillcount(querySnapShot.data().SkillCount);
          setvideocount(querySnapShot.data().VideoCount);
          setreviewcount(querySnapShot.data().ReviewCount);
          setlanguages(
            Array.isArray(querySnapShot.data().Languages)
              ? querySnapShot.data().Languages
              : []
          );
          setcategoryIDs(querySnapShot.data().CategoryID);
          seteducationcount(
            Array.isArray(querySnapShot.data().Education)
              ? querySnapShot.data().Education.length
              : 0
          );
          setcategories(querySnapShot.data().Categories);
          setTitle(querySnapShot.data().NameTitle);
          setemail(querySnapShot.data().Email);
          setschedule(querySnapShot.data().ScheduleSet);
          languagecount(querySnapShot.data().LanguageCount);
          setorganization(querySnapShot.data().Organization);
          seteducationdegree(querySnapShot.data().Education);
          setSample(querySnapShot.data().isSample);
          if (
            querySnapShot.data().Country.length &&
            querySnapShot.data().Country != undefined
          ) {
            setoriginalarray(querySnapShot.data().Country);
          }
          setbio(querySnapShot.data().Bio);
        }
      });
  }, []);

  function navigatetoSchedule(schedule) {
    if (schedule === true) {
      navigation.navigate("Schedule");
    }
  }
  function editBio() {
    setBio(true);
  }

  function savebiotext() {
    firestore()
      .collection("Users")
      .doc(props.userData.ID)
      .update({ Bio: biotext });
    setBio(false);
  }

  function editEducation() {
    navigation.navigate("TutorEducation");
  }

  function saveCountry() {
    if (selectedcountry != "") {
      let newarray = countryArray;
      newarray = [selectedcountry];
      setcountryarray(newarray);
      if (countryArray.length === 2) {
        Alert.alert("You can only add up to 2 countries.");
      } else {
        firestore()
          .collection("Users")
          .doc(props.userData.ID)
          .set(
            { Country: firestore.FieldValue.arrayUnion(...newarray) },
            { merge: true }
          );
      }
      setcountries(false);
    }
  }
  function saveDetail() {
    console.log("VALUE ", value);
    if (value != "") {
      var newarray = array;
      newarray = [selectedlang];
      setsavedLang(true);
      var number1 = parseInt(count);
      let updatedcount = number1 + 1;
      firestore()
        .collection("Users")
        .doc(props.userData.ID)
        .update({ LanguageCount: updatedcount });
      setArray(newarray);
      setItems([...items, value]);

      firestore()
        .collection("Users")
        .doc(props.userData.ID)
        .set(
          { Languages: firestore.FieldValue.arrayUnion(...newarray) },
          { merge: true }
        );
    } else if (isdeleted === true) {
      console.log("deleeted item");
    }
    setvalue("");
    // Alert.alert('Data saved')
    setlanguage(false);
  }

  function deleteItems(i) {
    setdeleted(true);
    var itemList = [...languagearray];
    let index = itemList.indexOf(i);
    itemList.splice(index, 1);
    setlanguages(itemList);
    var number1 = parseInt(count);
    let updatedcount = number1 - 1;
    firestore()
      .collection("Users")
      .doc(props.userData.ID)
      .update({ LanguageCount: updatedcount });
    console.log("deleted items", itemList);
    firestore()
      .collection("Users")
      .doc(props.userData.ID)
      .update({ Languages: itemList });
    //setdeleted(false);
  }

  function deleteCountries(i) {
    var itemList = [...originalarray];
    let index = itemList.indexOf(i);
    itemList.splice(index, 1);
    firestore()
      .collection("Users")
      .doc(props.userData.ID)
      .update({ Country: itemList });
  }

  function searchLanguages(text) {
    console.log("text", text);
    setvalue(text);
    let languages = values.map((item, i) => {
      return item.name;
    });
    let updatedlanguages = languages.slice(0, -1);
    console.log("categories", updatedlanguages);
    const newdata = updatedlanguages.filter((item) => {
      let stringdata = JSON.stringify(item);
      let itemdata = stringdata.toUpperCase();
      console.log("item", stringdata.toUpperCase());
      let textdata = text.toUpperCase();
      return itemdata.indexOf(textdata) > -1;
    });

    console.log("now", newdata);

    setarrayoflanguages(newdata);

    //setsearchtext(newdata.toString());
  }

  function searchCountries(text) {
    setcountrystring(text);
    let countries = country.map((item, i) => item.name);

    const newdata = countries.filter((item) => {
      let itemdata = item.toUpperCase();
      let textdata = text.toUpperCase();
      return itemdata.indexOf(textdata) > -1;
    });

    setarrayofcountries(newdata);
  }

  function navigateToNotifs() {
    navigation.navigate("Requests");
  }
  function goToReviews() {
    navigation.navigate("Ratings");
  }
  function navigateToSkills() {
    navigation.navigate("Skills");
  }
  function navigatetoOrganization() {
    navigation.navigate("Organisation");
  }
  function Editlang() {
    //console.log('languages', JSON.stringify(data))
    setlanguage(true);
  }
  function SaveTitle() {
    settitlebool(false);
    firestore()
      .collection("Users")
      .doc(props.userData.ID)
      .update({ NameTitle: title });
  }
  function EditTitle() {
    settitlebool(true);
  }
  function submitToggle(isHome) {
    console.log("function toggle", isHome);

    navigation.navigate("Tutor");
  }
  //CODE ADDED BY UDDIPAN
  const removeExternalUserIdforOneSignal = async (externalUserId) => {
    // console.log(externalUserId); return
    OneSignal.removeExternalUserId((results) => {
      // The results will contain push and email success statuses
      console.log("Results of setting external user id");
      console.log(results);
    });
  };
  const handleLogout = async () => {
    try {
      // let res = await GoogleSignin.isSignedIn();
      // if (res) {
      await auth()
        .signOut()
        .then(async () => {
          updateLogged(false);
        })
        .catch((err) => {
          console.log("Logout error ", err);
        })
        .finally(async () => {
          let res = await GoogleSignin.isSignedIn();
          if (res) {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            await removeExternalUserIdforOneSignal();
          }
        });
      // }
    } catch (e) {
      console.error(e);
      alert(e);
    }
  };
  const handleVerifyUser = () => {
    Alert.alert(
      "Are you sure want to send your profile for verification ?",
      "Please make sure you have submitted all valid info.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK",
          onPress: async () => {
            await firestore().collection("UserVerificationRequests").add({
              tutorId: props.userData.ID,
              status: "pending"
            });
            alert("Verification request waiting to be verified by admin!");
          }
        }
      ]
    );
  };
  //CODE ADDED BY UDDIPAN
  return (
    <SafeAreaView
      style={{
        backgroundColor: "black",
        height: "100%",
        width: "100%",
        paddingTop: Platform.OS === "android" ? 15 : 0
      }}
    >
      {/* top section */}
      <View style={{ flexDirection: "column", height: "auto", marginTop: 0 }}>
        {/* top section right side buttons */}
        <View
          style={{
            alignSelf: "flex-end",
            position: "absolute",
            right: 45,
            flexDirection: "row"
          }}
        >
          {/* top section right side button item */}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Samples");
            }}
            style={{
              justifyContent: "flex-end",
              alignSelf: "flex-end",
              width: 40,
              flexDirection: "row"
            }}
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
              <Image
                source={require("../assets/fabric.png")}
                style={{ alignSelf: "center", width: 25, height: 25 }}
              />
            </View>
            {isSample === true ? null : (
              <View
                style={{
                  backgroundColor: "red",
                  width: 15,
                  height: 15,
                  borderRadius: 15,
                  justifyContent: "center",
                  position: "absolute",
                  left: 0,
                  top: -5
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    alignSelf: "center",
                    color: "white"
                  }}
                >
                  !
                </Text>
              </View>
            )}
          </TouchableOpacity>
          {/* top section right side button item */}

          {/* top section right side button item */}
          <TouchableOpacity
            onPress={() => {
              setbool(true), navigatetoSchedule(schedule);
            }}
            style={{
              justifyContent: "flex-end",
              alignSelf: "flex-end",
              width: 40,
              flexDirection: "row"
            }}
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
            {isSchedule === true ? null : (
              <View
                style={{
                  backgroundColor: "red",
                  width: 15,
                  height: 15,
                  borderRadius: 15,
                  justifyContent: "center",
                  position: "absolute",
                  left: 0,
                  top: -5
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    alignSelf: "center",
                    color: "white"
                  }}
                >
                  !
                </Text>
              </View>
            )}
          </TouchableOpacity>
          {/* top section right side button item */}
        </View>
        {/* top section right side buttons */}

        {/* top section right side button Home */}
        <View style={{ alignSelf: "flex-end", position: "absolute" }}>
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
        {/* top section right side button Home */}

        {/* top section left side */}
        <View
          style={{
            flexDirection: "row",
            alignSelf: "flex-start",
            justifyContent: "space-between"
          }}
        >
          {/* top section left side button */}
          <TouchableOpacity
            onPress={() =>
              auth()
                .signOut()
                .then(() => handleLogout())
            }
            style={{
              alignSelf: "center",
              borderRadius: 35,
              justifyContent: "center"
            }}
          >
            <Text style={{ color: "white", alignSelf: "center", fontSize: 14 }}>
              {"   "}Logout{" "}
            </Text>
            <MaterialIcons
              name="logout"
              size={22}
              style={{ alignSelf: "center", color: "#F1C411" }}
            />
          </TouchableOpacity>
          {/* top section left side button */}

          {/* top section left side button */}
          <TouchableOpacity
            style={{ flexDirection: "column" }}
            onPress={() => {
              Linking.openURL("https://www.tutoritto.com/contact");
            }}
          >
            <Text style={{ color: "white", fontSize: 14 }}> Help </Text>
            <View style={{ borderRadius: 35, alignSelf: "center" }}>
              <MaterialIcons
                name="help"
                size={22}
                style={{ color: "#F1C411" }}
              />
            </View>
          </TouchableOpacity>
          {/* top section left side button */}

          {/* top section left side button */}
          <TouchableOpacity
            style={{ flexDirection: "column" }}
            onPress={() => {
              Linking.openURL("https://www.tutoritto.com/about");
            }}
          >
            <Text style={{ color: "white", fontSize: 14 }}> About </Text>
            <View style={{ borderRadius: 35, alignSelf: "center" }}>
              <MaterialIcons
                name="info"
                size={22}
                style={{ color: "#F1C411" }}
              />
            </View>
          </TouchableOpacity>
          {/* top section left side button */}
        </View>
        {/* top section left side button */}

        {/* top section Left side button Home */}
        <View
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            flexDirection: "row"
          }}
        >
          <Pressable onPress={() => navigation.navigate("UpdateProfile")}>
            <Image
              source={{ uri: props.userData.Photo }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 50,
                marginRight: 0,
                marginTop: 10
              }}
            />
          </Pressable>
          <View>
            <View style={{ flexDirection: "row", marginTop: 5 }}>
              <Text style={{ color: "white", left: 10, top: 10, fontSize: 15 }}>
                Update your
              </Text>
              <Text
                style={{
                  color: "#F1C411",
                  left: 15,
                  top: 10,
                  fontSize: 15,
                  fontWeight: "bold"
                }}
              >
                PROFILE.
              </Text>
            </View>
            <Text
              style={{
                color: "white",
                left: 10,
                top: 10,
                fontSize: 15,
                marginBottom: 10
              }}
            >
              Add info, expertise and more.
            </Text>
          </View>
        </View>
      </View>
      {/* top section Left side   */}

      {/* top section Middle side Buttons */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          height: "19%",
          top: 10,
          backgroundColor: "black",
          left: 0
        }}
      >
        <View
          style={{
            flexDirection: "column",
            alignSelf: "center",
            justifyContent: "center"
          }}
        >
          <View style={{ width: 60, height: "auto", flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => {
                navigateToSkills();
              }}
              style={{
                backgroundColor: "#F1C411",
                alignSelf: "center",
                borderRadius: 35,
                height: 55,
                width: 55,
                justifyContent: "center"
              }}
            >
              <Image
                source={require("../assets/interests.png")}
                style={{ alignSelf: "center", width: 40, height: 40 }}
              />
            </TouchableOpacity>
            <View
              style={{
                backgroundColor: "red",
                width: 20,
                height: 20,
                borderRadius: 15,
                justifyContent: "center",
                position: "absolute",
                right: 0,
                top: -5
              }}
            >
              {categoryID != undefined ? (
                <Text
                  style={{ fontSize: 14, alignSelf: "center", color: "white" }}
                >
                  {skillcount}
                </Text>
              ) : (
                <Text
                  style={{ fontSize: 16, alignSelf: "center", color: "white" }}
                >
                  !
                </Text>
              )}
            </View>
          </View>
          {categoryID != undefined ? (
            <Text
              style={{
                color: "white",
                alignSelf: "center",
                bottom: 0,
                alignItems: "center",
                justifyContent: "center",
                marginLeft: -7,
                marginTop: 5
              }}
            >
              {" "}
              Expertise{" "}
            </Text>
          ) : (
            <Text
              style={{
                color: "red",
                alignSelf: "center",

                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {" "}
              Expertise
            </Text>
          )}
        </View>

        <View
          style={{
            flexDirection: "column",
            alignSelf: "center",
            width: "auto",
            bottom: 8
          }}
        >
          <View style={{ width: 75, height: "auto", flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => {
                goToReviews();
              }}
              style={{
                backgroundColor: "#F1C411",
                alignSelf: "center",
                borderRadius: 35,
                height: 70,
                width: 70,
                justifyContent: "center"
              }}
            >
              <MaterialIcons
                name="rate-review"
                style={{ alignSelf: "center" }}
                color={"black"}
                size={50}
              />
            </TouchableOpacity>
            <View
              style={{
                backgroundColor: "red",
                width: 20,
                height: 20,
                borderRadius: 15,
                justifyContent: "center",
                position: "absolute",
                right: 0,
                top: -3
              }}
            >
              <Text
                style={{ fontSize: 14, alignSelf: "center", color: "white" }}
              >
                {reviewcount}
              </Text>
            </View>
          </View>

          <Text
            style={{
              color: "white",
              alignSelf: "center",
              marginLeft: -7,
              marginTop: 5
            }}
          >
            Reviews
          </Text>
        </View>

        <View
          style={{
            flexDirection: "column",
            alignSelf: "center",
            justifyContent: "center",
            width: 55
          }}
        >
          <View style={{ width: 60, height: "auto", flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => navigation.navigate("PromoVideo")}
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
              <MaterialIcons
                name="video-collection"
                size={40}
                color={"black"}
                style={{ alignSelf: "center", width: 40, height: 40 }}
              />
            </TouchableOpacity>
            <View
              style={{
                backgroundColor: "red",
                width: 20,
                height: 20,
                borderRadius: 15,
                justifyContent: "center",
                position: "absolute",
                right: 0,
                top: -5
              }}
            >
              {promovideocount != 0 ? (
                <Text
                  style={{ fontSize: 14, alignSelf: "center", color: "white" }}
                >
                  {promovideocount}
                </Text>
              ) : (
                <Text
                  style={{ fontSize: 16, alignSelf: "center", color: "white" }}
                >
                  !
                </Text>
              )}
            </View>
          </View>
          <Text
            style={{
              color: "white",
              width: 150,
              right: 15,
              // marginLeft: -5,
              marginTop: 5
            }}
          >
            Promo Videos{" "}
          </Text>
        </View>
      </View>
      {/* top section middle side Buttons */}

      {/* Scroll Views Starts */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ width: "100%" }}
      >
        <Card
          style={{ width: "100%" }}
          containerStyle={{
            marginTop: 0,
            backgroundColor: "white",
            borderColor: "black",
            width: "100%",
            alignSelf: "flex-start",
            justifyContent: "flex-start",
            right: 15,
            height: "100%"
          }}
        >
          <View style={{ flexDirection: "column", alignSelf: "flex-start" }}>
            {/* Title starts */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignSelf: "flex-start"
              }}
            >
              <View style={{ width: 45, height: "auto", flexDirection: "row" }}>
                <View
                  style={{
                    backgroundColor: "#F1C411",
                    alignSelf: "flex-start",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                    borderRadius: 20
                  }}
                >
                  <Image
                    source={require("../assets/title.png")}
                    style={{ alignSelf: "center", width: 20, height: 20 }}
                  />
                </View>
                {title != null ? null : (
                  <View
                    style={{
                      backgroundColor: "red",
                      width: 15,
                      height: 15,
                      borderRadius: 15,
                      justifyContent: "center",
                      position: "absolute"
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        alignSelf: "center",
                        color: "white"
                      }}
                    >
                      !
                    </Text>
                  </View>
                )}
              </View>
              {title != null ? (
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={{
                      color: "black",
                      alignSelf: "center",
                      justifyContent: "center",
                      fontWeight: "bold"
                    }}
                  >
                    Title :
                  </Text>

                  {/* <Icon
                    name="arrow-right"
                    size={18}
                    style={{ color: "black", alignSelf: "center" }}
                  /> */}
                  <View
                    style={{
                      alignSelf: "center",
                      paddingHorizontal: 7,
                      paddingVertical: 5,
                      borderRadius: 5,
                      backgroundColor: "#eee",
                      marginLeft: 5
                    }}
                  >
                    <Text
                      style={{
                        color: "black",
                        alignSelf: "center",
                        justifyContent: "center"
                      }}
                    >
                      {" "}
                      {title}{" "}
                    </Text>
                  </View>
                </View>
              ) : (
                <Text
                  style={{
                    color: "black",
                    alignSelf: "center",
                    justifyContent: "center",
                    left: 0,
                    fontWeight: "bold"
                  }}
                >
                  Title :{" "}
                </Text>
              )}
              {istitle === false ? (
                <TouchableOpacity
                  onPress={() => EditTitle()}
                  style={{ flexDirection: "row" }}
                >
                  <Icon
                    name="edit-2"
                    size={15}
                    style={{
                      color: "black",
                      alignSelf: "center",
                      justifyContent: "center",
                      left: 5,
                      padding: 10
                    }}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => settitlebool(false)}
                  style={{}}
                >
                  <MaterialIcons
                    name="arrow-drop-up"
                    size={15}
                    style={{
                      color: "black",
                      alignSelf: "center",
                      justifyContent: "center",
                      left: 2,
                      top: 5,
                      padding: 10
                    }}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
          {istitle ? (
            <View
              style={{
                marginTop: 5,
                backgroundColor: "#eee",
                width: "100%",
                borderRadius: 10,
                padding: 10,
                paddingBottom: 20,
                elevation: 3
              }}
            >
              <ModalDropdown
                options={["Dr.", "Mr.", "Prof.", "Mrs.", "Miss."]}
                style={{
                  backgroundColor: "#fff",
                  height: 35,
                  borderRadius: 10,
                  justifyContent: "center",
                  width: "100%",
                  alignSelf: "center",
                  borderWidth: 1,
                  borderColor: "#ddd0",
                  elevation: 1
                }}
                textStyle={{
                  color: "black",
                  alignSelf: "center",
                  marginLeft: 16
                }}
                dropdownStyle={{
                  width: "86%",
                  marginTop: 10,
                  backgroundColor: "black"
                }}
                dropdownTextStyle={{ backgroundColor: "white", color: "black" }}
                dropdownTextHighlightStyle={{
                  color: "#F1C411",
                  backgroundColor: "black"
                }}
                onSelect={(index, string) => setTitle(string)}
                defaultValue="Title"
              />
              <View
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  flexDirection: "row",
                  width: "100%"
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: "black",
                    height: 30,
                    paddingHorizontal: 20,
                    borderRadius: 10,
                    shadowColor: "black",
                    shadowRadius: 0.5,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    elevation: 5,
                    top: 10,
                    justifyContent: "center"
                  }}
                  onPress={() => SaveTitle()}
                >
                  <Text
                    style={{
                      color: "white",
                      alignSelf: "center",
                      alignItems: "center"
                    }}
                  >
                    Save
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#fff0",
                    height: 30,
                    paddingHorizontal: 20,
                    borderRadius: 10,
                    shadowColor: "black",
                    shadowRadius: 0.5,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    elevation: 0,
                    top: 10,
                    justifyContent: "center",
                    marginLeft: 10,
                    borderWidth: 1,
                    borderColor: "black"
                  }}
                  onPress={() => settitlebool(false)}
                >
                  <Text
                    style={{
                      color: "black",
                      alignSelf: "center",
                      alignItems: "center"
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
          {/* Title ends */}

          <Card.Divider style={{ marginTop: 7 }}></Card.Divider>

          {/* Language starts */}
          <View
            style={{
              flexDirection: "row"
            }}
          >
            <View
              style={{
                backgroundColor: "#F1C411",
                alignSelf: "flex-start",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: 20
              }}
            >
              <Icon
                name="globe"
                size={20}
                style={{ color: "black", alignSelf: "center" }}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                alignSelf: "center",
                flex: 1
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  color: "black",
                  marginLeft: 5,
                  marginTop: languagearray !== "" ? 4 : 0,
                  marginBottom: languagearray !== "" ? 0 : 0
                }}
              >
                {" "}
                Languages :{" "}
              </Text>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  width: "40%",
                  flexWrap: "wrap"
                }}
              >
                {languagearray !== "" && (
                  <>
                    {/* <Icon
                    name="arrow-right"
                    size={18}
                    style={{ color: "black", alignSelf: "center" }}
                  /> */}

                    {languagearray !== ""
                      ? languagearray.map((item, i, arr) => {
                          const str =
                            languagearray
                              .slice(0, languagearray.length - 1)
                              .join(", ") +
                            ", " +
                            languagearray[languagearray.length - 1];

                          return (
                            <View
                              key={i}
                              style={{
                                alignSelf: "center",
                                paddingHorizontal: 7,
                                paddingVertical: 5,
                                borderRadius: 5,
                                backgroundColor: "#eee",
                                marginLeft: 5,
                                height: 30,
                                marginTop: 5
                              }}
                            >
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignSelf: "center"
                                }}
                              >
                                <Text style={{ color: "black" }}>
                                  {item}

                                  {/* {i != arr.length - 1 ? "," : ""} */}
                                </Text>
                                {language ? (
                                  <MaterialIcons
                                    name="delete"
                                    size={14}
                                    style={{ marginLeft: 5, marginTop: 2 }}
                                    onPress={() => deleteItems(i)}
                                  />
                                ) : null}
                              </View>
                            </View>
                          );
                        })
                      : null}
                  </>
                )}
              </View>
            </View>

            {language === true ? (
              <TouchableOpacity onPress={() => setlanguage(false)}>
                <MaterialIcons
                  name="arrow-drop-up"
                  size={15}
                  style={{
                    color: "black",
                    alignSelf: "center",
                    justifyContent: "center",
                    left: 2,
                    top: 5,
                    padding: 10
                  }}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => Editlang()}
                style={{ flexDirection: "row" }}
              >
                <Icon
                  name="edit-2"
                  size={15}
                  style={{
                    color: "black",
                    left: 5,
                    top: 0,
                    justifyContent: "flex-end",
                    alignSelf: "center",
                    padding: 10
                  }}
                />
              </TouchableOpacity>
            )}
          </View>
          {language ? (
            <View
              style={{
                marginTop: 5,
                backgroundColor: "#eee",
                width: "100%",
                borderRadius: 10,
                padding: 10,
                paddingBottom: 20,
                elevation: 3
              }}
            >
              <TextInput
                value={value}
                style={{
                  height: 35,
                  borderColor: "#0000",
                  borderWidth: 1,
                  width: "100%",
                  alignSelf: "center",
                  borderRadius: 10,
                  backgroundColor: "white",
                  padding: 0,
                  paddingLeft: 10,
                  marginBottom: 10,
                  elevation: 1
                }}
                placeholder="Type here..."
                onChangeText={(text) => searchLanguages(text)}
              />
              {value !== "" && (
                <View
                  style={{
                    width: "100%",
                    backgroundColor: "#fff",
                    marginTop: -15,
                    maxHeight: 150,
                    overflow: "hidden",
                    marginBottom: 10,
                    paddingTop: 5,
                    borderRadius: 5
                  }}
                >
                  <ScrollView>
                    {value !== ""
                      ? arrayoflanguages.map((item, i) => {
                          return (
                            <View
                              key={i}
                              style={{
                                width: "100%",
                                flexGrow: 1,
                                borderRadius: 0,
                                alignSelf: "center",
                                height: "auto"
                              }}
                            >
                              <TouchableOpacity
                                onPress={() => {
                                  setselectedlang(item);
                                  setvalue(item);
                                }}
                                style={{
                                  backgroundColor: "white",
                                  borderBottomWidth: 1,
                                  borderColor: "#ccc",
                                  borderRadius: 0,
                                  zIndex: 10
                                }}
                              >
                                <Text style={{ padding: 10 }}>{item} </Text>
                              </TouchableOpacity>
                            </View>
                          );
                        })
                      : null}
                  </ScrollView>
                </View>
              )}
              <View
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  flexDirection: "row",
                  width: "100%"
                }}
              >
                <TouchableOpacity
                  style={{
                    alignSelf: "center",
                    backgroundColor: "black",
                    height: 30,
                    paddingHorizontal: 20,
                    borderRadius: 10,
                    shadowColor: "white",
                    shadowRadius: 0.5,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    elevation: 5,
                    justifyContent: "center"
                  }}
                  onPress={() => saveDetail()}
                >
                  <Text
                    style={{
                      color: "white",
                      alignSelf: "center",
                      alignItems: "center"
                    }}
                  >
                    Save
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#fff0",
                    height: 30,
                    paddingHorizontal: 20,
                    borderRadius: 10,
                    shadowColor: "black",
                    shadowRadius: 0.5,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    elevation: 0,
                    justifyContent: "center",
                    marginLeft: 10,
                    borderWidth: 1,
                    borderColor: "black"
                  }}
                  onPress={() => setlanguage(false)}
                >
                  <Text
                    style={{
                      color: "black",
                      alignSelf: "center",
                      alignItems: "center"
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
          {/* Language ends */}

          <Card.Divider style={{ marginTop: 7 }}></Card.Divider>

          {/* Country start */}
          <View style={{ flexDirection: "row", alignSelf: "flex-start" }}>
            <View
              style={{
                backgroundColor: "#F1C411",
                alignSelf: "flex-start",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: 20
              }}
            >
              <Icon
                name="map-pin"
                size={20}
                style={{ color: "black", alignSelf: "center" }}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                alignSelf: "center",
                fontWeight: "bold",
                marginLeft: 5
              }}
            >
              <Text
                style={{
                  color: "black",
                  fontWeight: "bold"
                }}
              >
                {" "}
                Country :{" "}
              </Text>
              {/* <Icon
                name="arrow-right"
                size={18}
                style={{ color: "black", alignSelf: "center", left: 2 }}
              /> */}
              <View
                style={{ flexDirection: "row", flexWrap: "wrap", width: "40%" }}
              >
                {originalarray != null
                  ? originalarray.map((item, i, arr) => {
                      const str =
                        originalarray
                          .slice(0, originalarray.length - 1)
                          .join(", ") +
                        ", " +
                        originalarray[originalarray.length - 1];

                      return (
                        <View
                          key={i}
                          style={{
                            alignSelf: "center",
                            paddingHorizontal: 7,
                            paddingVertical: 5,
                            borderRadius: 5,
                            backgroundColor: "#eee",
                            marginLeft: 5,
                            marginTop: 5
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              marginLeft: 5,
                              alignSelf: "center"
                            }}
                          >
                            <Text style={{ left: 0, color: "black" }}>
                              {item}

                              {/* {i != arr.length - 1 ? "," : ""} */}
                            </Text>
                            {iscountries ? (
                              <MaterialIcons
                                name="delete"
                                size={15}
                                style={{ left: 5, top: 2 }}
                                onPress={() => deleteCountries(i)}
                              />
                            ) : null}
                          </View>
                        </View>
                      );
                    })
                  : null}
              </View>
            </View>
            {iscountries === true ? (
              <TouchableOpacity onPress={() => setcountries(false)}>
                <MaterialIcons
                  name="arrow-drop-up"
                  size={15}
                  style={{
                    color: "black",
                    alignSelf: "center",
                    justifyContent: "center",
                    top: 10,
                    padding: 10
                  }}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{ alignSelf: "center", left: 5 }}
                onPress={() => setcountries(true)}
              >
                <Icon
                  name="edit-2"
                  size={15}
                  style={{ color: "black", alignSelf: "center", padding: 10 }}
                />
              </TouchableOpacity>
            )}
          </View>
          {iscountries ? (
            <View
              style={{
                marginTop: 5,
                backgroundColor: "#eee",
                width: "100%",
                borderRadius: 10,
                padding: 10,
                paddingBottom: 15,
                elevation: 3
              }}
            >
              <TextInput
                value={countrystring}
                style={{
                  height: 35,
                  borderColor: "#0000",
                  borderWidth: 1,
                  width: "100%",
                  alignSelf: "center",
                  borderRadius: 10,
                  backgroundColor: "white",
                  padding: 0,
                  paddingLeft: 10,
                  marginBottom: 10,
                  elevation: 1
                }}
                placeholder="Type here..."
                onChangeText={(text) => searchCountries(text)}
              />

              {countrystring != "" && (
                <View
                  style={{
                    width: "100%",
                    backgroundColor: "#fff",
                    marginTop: -15,
                    maxHeight: 150,
                    overflow: "hidden",
                    marginBottom: 10,
                    paddingTop: 5,
                    borderRadius: 5
                  }}
                >
                  <ScrollView>
                    {countrystring != "" &&
                      arrayofcountries.map((item, i) => {
                        return (
                          <View
                            key={i}
                            style={{
                              width: "100%",
                              flexGrow: 1,
                              borderRadius: 0,
                              alignSelf: "center",
                              height: "auto"
                            }}
                          >
                            <TouchableOpacity
                              onPress={() => {
                                setselectedcountry(item);
                                setcountrystring(item);
                              }}
                              style={{
                                backgroundColor: "white",
                                borderBottomWidth: 1,
                                borderColor: "#ccc",
                                borderRadius: 0,
                                zIndex: 10
                              }}
                            >
                              <Text style={{ padding: 10 }}>{item} </Text>
                            </TouchableOpacity>
                          </View>
                        );
                      })}
                  </ScrollView>
                </View>
              )}
              <View
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  flexDirection: "row",
                  width: "100%"
                }}
              >
                <TouchableOpacity
                  style={{
                    alignSelf: "center",
                    backgroundColor: "black",
                    height: 30,
                    paddingHorizontal: 20,
                    borderRadius: 10,
                    shadowColor: "white",
                    shadowRadius: 0.5,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    elevation: 5,
                    justifyContent: "center"
                  }}
                  onPress={() => saveCountry()}
                >
                  <Text
                    style={{
                      color: "white",
                      alignSelf: "center",
                      alignItems: "center"
                    }}
                  >
                    Save
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#fff0",
                    height: 30,
                    paddingHorizontal: 20,
                    borderRadius: 10,
                    shadowColor: "black",
                    shadowRadius: 0.5,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    elevation: 0,
                    justifyContent: "center",
                    marginLeft: 10,
                    borderWidth: 1,
                    borderColor: "black"
                  }}
                  onPress={() => setcountries(false)}
                >
                  <Text
                    style={{
                      color: "black",
                      alignSelf: "center",
                      alignItems: "center"
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
          {/* Country ends */}

          <Card.Divider style={{ marginTop: 7 }}></Card.Divider>

          {/* email start */}
          <View style={{ flexDirection: "column", alignSelf: "flex-start" }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignSelf: "flex-start"
              }}
            >
              <View
                style={{
                  backgroundColor: "#F1C411",
                  alignSelf: "flex-start",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  borderRadius: 20
                }}
              >
                <MaterialIcons
                  name="email"
                  size={20}
                  color={"black"}
                  style={{ alignSelf: "center" }}
                />
              </View>
              <View style={{ flexDirection: "row", marginLeft: 5 }}>
                <Text
                  style={{
                    color: "black",
                    alignSelf: "center",
                    justifyContent: "center",
                    left: 0,
                    fontWeight: "bold"
                  }}
                >
                  {" "}
                  Email :{" "}
                </Text>

                {/* <Icon
                  name="arrow-right"
                  size={18}
                  style={{ color: "black", alignSelf: "center", top: 0 }}
                /> */}

                <View
                  style={{
                    alignSelf: "center",
                    paddingHorizontal: 7,
                    paddingVertical: 5,
                    borderRadius: 5,
                    backgroundColor: "#eee",
                    marginLeft: 5
                  }}
                >
                  <Text style={{ alignSelf: "center", color: "black" }}>
                    {props.userData.Email}{" "}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          {/* email ends */}

          <Card.Divider style={{ marginTop: 7 }}></Card.Divider>

          {/* education starts */}
          <View style={{ flexDirection: "row", alignSelf: "flex-start" }}>
            <View style={{ width: 45, height: "auto", flexDirection: "row" }}>
              <View
                style={{
                  backgroundColor: "#F1C411",
                  alignSelf: "flex-start",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  borderRadius: 20
                }}
              >
                <MaterialIcons
                  name="school"
                  size={20}
                  style={{ color: "black", alignSelf: "center" }}
                />
              </View>
              {educationcount != 0 ? null : (
                <View
                  style={{
                    backgroundColor: "red",
                    width: 15,
                    height: 15,
                    borderRadius: 15,
                    justifyContent: "center",
                    position: "absolute",
                    right: 0
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      alignSelf: "center",
                      color: "white"
                    }}
                  >
                    !
                  </Text>
                </View>
              )}
            </View>
            <View style={{ flexDirection: "row", marginLeft: 5 }}>
              <Text
                style={{
                  color: "black",
                  alignSelf: "center",
                  fontWeight: "bold"
                }}
              >
                Education :{" "}
              </Text>
            </View>
            {/* <Icon
              name="arrow-right"
              size={18}
              style={{ color: "black", alignSelf: "center", top: 0 }}
            /> */}

            <Icon
              onPress={() => {
                editEducation();
              }}
              name="edit-2"
              size={15}
              style={{
                color: "black",
                alignSelf: "center",
                justifyContent: "center",
                left: 10,
                padding: 10
              }}
            />
          </View>

          {Array.isArray(educationdegree) && (
            <View
              style={{
                alignSelf: "center",
                paddingHorizontal: 7,
                paddingVertical: 5,
                borderRadius: 5,
                backgroundColor: "#eee",
                marginLeft: 5,
                width: "100%",
                marginTop: 10
              }}
            >
              <Text style={{ alignSelf: "center", color: "black" }}>
                {educationdegree.map((edu) => edu.Degree).join(", ")}{" "}
              </Text>
            </View>
          )}
          {/* education ends */}

          <Card.Divider style={{ marginTop: 7 }}></Card.Divider>

          {/* bio started */}
          <View>
            <View style={{ flexDirection: "row" }}>
              <View style={{ width: 45, height: "auto", flexDirection: "row" }}>
                <View
                  style={{
                    backgroundColor: "#F1C411",
                    alignSelf: "flex-start",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                    borderRadius: 20
                  }}
                >
                  <Icon
                    name="user"
                    size={20}
                    style={{ color: "black", alignSelf: "center" }}
                  />
                </View>
                {Bio != null ? null : (
                  <View
                    style={{
                      backgroundColor: "red",
                      width: 15,
                      height: 15,
                      borderRadius: 15,
                      justifyContent: "center",
                      position: "absolute",
                      right: 0
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        alignSelf: "center",
                        color: "white"
                      }}
                    >
                      !
                    </Text>
                  </View>
                )}
              </View>
              <View style={{ flexDirection: "row", marginLeft: 5 }}>
                <Text
                  style={{
                    color: "black",
                    alignSelf: "center",
                    width: "auto",
                    textAlign: "left",
                    fontWeight: "bold"
                  }}
                >
                  {" "}
                  Bio :{" "}
                </Text>

                {/* <Icon
                  name="arrow-right"
                  size={18}
                  style={{ color: "black", alignSelf: "center" }}
                /> */}

                {/* {isBioEditable === true ? (
                  <TouchableOpacity onPress={() => setBio(false)}>
                    <MaterialIcons
                      name="arrow-drop-up"
                      size={15}
                      style={{
                        color: "black",
                        alignSelf: "flex-end",
                        justifyContent: "center",
                        bottom: 5,
                      }}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{ left: 5 }}
                    onPress={() => editBio()}
                    style={{}}
                  >
                    <Icon
                      name="edit-2"
                      size={15}
                      style={{
                        color: "black",
                        alignSelf: "flex-end",
                        justifyContent: "center",
                        bottom: 15,
                      }}
                    />
                  </TouchableOpacity>
                )} */}

                {/* {Bio === undefined ? ( */}
                {isBioEditable === true ? (
                  <TouchableOpacity onPress={() => setBio(false)}>
                    <MaterialIcons
                      name="arrow-drop-up"
                      size={15}
                      style={{
                        color: "black",
                        alignSelf: "center",
                        justifyContent: "center",
                        top: 5,
                        padding: 10
                      }}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => editBio()}
                    style={{ flexDirection: "row" }}
                  >
                    <Icon
                      name="edit-2"
                      size={15}
                      style={{
                        color: "black",
                        left: 8,
                        alignSelf: "center",
                        justifyContent: "center",
                        padding: 10
                      }}
                    />
                  </TouchableOpacity>
                )}
                {/* ) : null} */}
              </View>
            </View>

            {Bio != null ? (
              <View
                style={{
                  alignSelf: "center",
                  paddingHorizontal: 7,
                  paddingVertical: 5,
                  borderRadius: 5,
                  backgroundColor: "#eee",
                  marginLeft: 5,
                  width: "100%",
                  marginTop: 10
                }}
              >
                <Text
                  style={{
                    fontWeight: "normal",
                    width: "auto",
                    color: "black"
                  }}
                >
                  {Bio}{" "}
                </Text>
              </View>
            ) : null}

            {isBioEditable === true ? (
              <View
                style={{
                  marginTop: 5,
                  backgroundColor: "#eee",
                  width: "100%",
                  borderRadius: 10,
                  padding: 10,
                  paddingBottom: 15,
                  elevation: 3
                }}
              >
                <TextInput
                  value={biotext}
                  multiline={true}
                  onChangeText={(text) => setbiotext(text)}
                  placeholder="Ex: I am here to provie you with the best skills related to Marketing"
                  placeholderTextColor="grey"
                  style={{
                    width: "100%",
                    borderColor: "#333939",
                    height: "auto",
                    borderRadius: 10,
                    alignSelf: "center",
                    borderWidth: 1,
                    borderColor: "#ccc0",
                    color: "black",
                    top: 0,
                    marginBottom: 10,
                    elevation: 1,
                    backgroundColor: "white"
                  }}
                />
                <View
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    flexDirection: "row",
                    width: "100%"
                  }}
                >
                  <TouchableOpacity
                    style={{
                      alignSelf: "center",
                      backgroundColor: "black",
                      height: 30,
                      paddingHorizontal: 20,
                      borderRadius: 10,
                      shadowColor: "white",
                      shadowRadius: 0.5,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      elevation: 5,
                      justifyContent: "center"
                    }}
                    onPress={() => savebiotext()}
                  >
                    <Text
                      style={{
                        color: "white",
                        alignSelf: "center",
                        alignItems: "center"
                      }}
                    >
                      Save
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#fff0",
                      height: 30,
                      paddingHorizontal: 20,
                      borderRadius: 10,
                      shadowColor: "black",
                      shadowRadius: 0.5,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      elevation: 0,
                      justifyContent: "center",
                      marginLeft: 10,
                      borderWidth: 1,
                      borderColor: "black"
                    }}
                    onPress={() => setBio(false)}
                  >
                    <Text
                      style={{
                        color: "black",
                        alignSelf: "center",
                        alignItems: "center"
                      }}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}
          </View>
          {/* bio ended */}

          <Card.Divider style={{ marginTop: 7 }}></Card.Divider>

          {/* organisation started */}
          <View style={{ flexDirection: "column", alignSelf: "flex-start" }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignSelf: "flex-start"
              }}
            >
              <View style={{ width: 45, height: "auto", flexDirection: "row" }}>
                <View
                  style={{
                    backgroundColor: "#F1C411",
                    alignSelf: "flex-start",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                    borderRadius: 20
                  }}
                >
                  <MaterialIcons
                    name="group"
                    size={20}
                    style={{ alignSelf: "center" }}
                  />
                </View>
                {organization != "" ? null : (
                  <View
                    style={{
                      backgroundColor: "red",
                      width: 15,
                      height: 15,
                      borderRadius: 15,
                      justifyContent: "center",
                      position: "absolute",
                      right: 0
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        alignSelf: "center",
                        color: "white"
                      }}
                    >
                      !
                    </Text>
                  </View>
                )}
              </View>
              <Text
                style={{
                  color: "black",
                  alignSelf: "center",
                  justifyContent: "center",
                  marginLeft: 4,
                  fontWeight: "bold"
                }}
              >
                {" "}
                My Organisations :{" "}
              </Text>
              {/* <Icon
                name="arrow-right"
                size={18}
                style={{ color: "black", alignSelf: "center", top: 0 }}
              /> */}
              <View
                style={{
                  alignSelf: "center",
                  paddingHorizontal: 7,
                  paddingVertical: 5,
                  borderRadius: 5,
                  backgroundColor: "#eee",
                  marginLeft: 5,
                  flex: 1
                }}
              >
                <Text style={{ alignSelf: "center", color: "black" }}>
                  {organization}{" "}
                </Text>
              </View>
              <Icon
                onPress={() => {
                  navigatetoOrganization();
                }}
                name="edit-2"
                size={15}
                style={{
                  color: "black",
                  alignSelf: "center",
                  justifyContent: "center",
                  left: 10,
                  padding: 10
                }}
              />
            </View>
          </View>
          {/* organisation ended */}

          <Card.Divider style={{ marginTop: 7 }}></Card.Divider>

          {/* verification started */}
          <View style={{ flexDirection: "column", alignSelf: "flex-start" }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignSelf: "flex-start"
              }}
            >
              <View style={{ width: 45, height: "auto", flexDirection: "row" }}>
                <TouchableOpacity
                  onPress={() => {
                    setVisibility(!visibility);
                  }}
                  style={{
                    backgroundColor: "#F1C411",
                    alignSelf: "flex-start",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                    borderRadius: 20
                  }}
                >
                  <MaterialIcons
                    name="verified-user"
                    size={20}
                    style={{ alignSelf: "center" }}
                  />
                </TouchableOpacity>
                {props.userData.isVerified !== true && (
                  <View
                    style={{
                      backgroundColor: "red",
                      width: 15,
                      height: 15,
                      borderRadius: 15,
                      justifyContent: "center",
                      position: "absolute",
                      right: 0
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        alignSelf: "center",
                        color: "white"
                      }}
                    >
                      !
                    </Text>
                  </View>
                )}
              </View>
              <Text
                style={{
                  color: "black",
                  alignSelf: "center",
                  justifyContent: "center",
                  marginLeft: 7,
                  fontWeight: "bold"
                }}
              >
                Verification :{" "}
              </Text>
              {/* <Icon
                name="arrow-right"
                size={18}
                style={{ color: "black", alignSelf: "center", top: 0 }}
              /> */}
            </View>
          </View>
          <TouchableOpacity
            style={{
              alignSelf: "center",
              paddingHorizontal: 7,
              paddingVertical: 5,
              borderRadius: 5,
              backgroundColor: "#eee",
              marginLeft: 5,
              width: "100%",
              marginTop: 10
            }}
            onPress={() => {
              !props.userData.isVerified
                ? handleVerifyUser()
                : console.log("Already verified");
            }}
          >
            <Text
              style={{
                alignSelf: "center",
                color: "black",
                textDecorationLine:
                  props.userData.isVerified === true ? "none" : "underline",
                textDecorationColor: "#222"
              }}
            >
              {props.userData.isVerified === true
                ? "You are a verified Tutoritto!"
                : "Request for verification after setting your account properly."}
            </Text>
          </TouchableOpacity>
          {/* verification started */}

          <Card.Divider style={{ marginTop: 20 }}></Card.Divider>
        </Card>
      </ScrollView>

      <MyAlert
        title={"REQUEST FOR VERIFICATION "}
        msg={
          "Verification of your credentials is NOT REQUIRED to use the system however, it can help get more interests. Make sure to upload all documents in your education profile before requesting for verification."
        }
        visible={visibility}
        onClose={() => setVisibility(false)}
      />
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
  }
});
