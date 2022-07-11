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
  ScrollView,
  TextInput,
  Linking
} from "react-native";
import { useLinkProps, useNavigation } from "@react-navigation/native";
import { Card, ListItem, Button, List } from "react-native-elements";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import StarRating from "react-native-star-rating";
import Icon from "react-native-vector-icons/Feather";
import { useRoute } from "@react-navigation/native";
import ModalDropdown from "react-native-modal-dropdown";
import { ToggleButton } from "react-native-paper";
import * as orginazations from "../universitylists.json";
import * as languages from "../languagestutor.json";
//CODE ADDED BY UDDIPAN
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import OneSignal from "react-native-onesignal";
import LottieView from "lottie-react-native";
//CODE ADDED BY UDDIPAN

import countries from "../countries.json";

import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { fonts } from "react-native-elements/dist/config";

export default function TuteeProfile(props) {
  const route = useRoute();
  const { userData, userPreference, userInterests, userSelect, updateLogged } =
    props;
  const navigation = useNavigation();
  const [language, editlanguage] = useState(false);
  // const [country, editCountry] = useState(false);
  const [newCourse, setNewCourse] = useState([]);
  const [selected, setselected] = useState("");
  const [iscountries, setcountries] = useState(false);
  const [isInterests, setIsInterests] = useState(false);
  const [countryArray, setcountryarray] = useState([]);
  const [selectedcountry, setselectedcountry] = useState("");
  const [countrystring, setcountrystring] = useState("");
  const [arrayofcountries, setarrayofcountries] = useState([]);
  const [Photo, setPhoto] = useState("");
  const [oraginsation, setorganisation] = useState(false);
  const [rewards, setrewards] = useState(false);
  const [profile, setprofile] = useState(false);
  const languagesList = [];
  const [universityarray, setuniarray] = useState([]);
  const [isData, setdata] = useState(false);
  const [status, setStatus] = useState("checked");
  const [data, setData] = useState([]);
  const [value, setvalue] = useState("");
  const [langValue, setlangValue] = useState("");
  const [textvalue, settextvalue] = useState("");
  const [play, setplay] = useState(false);
  const [catID, setcatID] = useState(["21"]);
  const [array, setArray] = useState([]);
  const [email, setEmail] = useState("");
  const [originalarray, setoriginalarray] = useState([]); //original country array for tutor
  const [arrayvalue, setarrayvalue] = useState([]);
  const [interestsArray, setInterestsArray] = useState([]);
  const [interestString, setInterestString] = useState("");
  const [selectedInterest, setSelectedInterest] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [otherUniversityText, setOtherUniversityText] = useState("");

  const uniList = [];
  const fulluniList = [];
  let values;
  let country;

  let langString;
  for (var key in languages) {
    langString = Object.values(languages);
    //values.map((item, i)=> console.log(item.name))
  }

  for (var key in countries) {
    country = Object.values(countries);
  }

  useEffect(() => {
    firestore()
      .collection("Users")
      .doc(props.userData.ID)
      .onSnapshot((querySnapShot) => {
        if (querySnapShot.exists) {
          setUserInfo(querySnapShot.data());
        }
      });
  }, []);
  for (var key in orginazations) {
    const string = Object.values(orginazations[key]);
    uniList.push(string[1]);
  }

  function saveDetail() {
    if (value != "") {
      var newarray = array;
      newarray = [langValue];

      setArray(newarray);
      firestore()
        .collection("Users")
        .doc(props.userData.ID)
        .set(
          { Languages: firestore.FieldValue.arrayUnion(...newarray) },
          { merge: true }
        );
    }
    //setlangValue("");
    editlanguage(false);
  }

  function deleteItems(i) {
    var itemList = [...arraylanguages];
    let index = itemList.indexOf(i);
    itemList.splice(index, 1);
    setlangarray(itemList);

    firestore()
      .collection("Users")
      .doc(props.userData.ID)
      .update({ Languages: itemList });
    //setdeleted(false);
  }
  function deleteInterest(item, i) {
    // var itemList = [...arrayvalue];
    // let index = itemList.indexOf(i);
    // itemList.splice(index, 1);
    let itemList = userInfo.Interests.filter(
      (interest) => interest.Category !== item.Category
    );
    firestore()
      .collection("Users")
      .doc(props.userData.ID)
      .update({ Interests: itemList });
    //setdeleted(false);
  }

  const onButtonToggle = (value) => {
    setStatus(status === "checked" ? "unchecked" : "checked");
    settextvalue("");
    setuniarray(uniList);
  };

  useEffect(() => {
    var unsubscribe;
    if (uniList != null) {
      setuniarray(uniList);
    }
    if (value != "" && props.userData.ID != undefined) {
      unsubscribe = firestore()
        .collection("Users")
        .doc(props.userData.ID)
        .update({ Organization: value });
      let id = JSON.stringify("21");
      firestore()
        .collection("Users")
        .doc(userData.ID)
        .update({
          CategoryID: firestore.FieldValue.arrayUnion(...catID)
        });
      setvalue(value);
    }
    return () => {
      unsubscribe;
    };
  }, [value]);

  useEffect(() => {
    var unsubscribe;
    unsubscribe = firestore()
      .collection("Users")
      .doc(props.userData.ID)
      .onSnapshot((querysnapshot) => {
        setvalue(querysnapshot.data().Organization);
      });
    return () => {
      unsubscribe;
    };
  }, []);
  function changetext(text) {
    let textString = text.toLowerCase();
    let array = orginazations;
    let isFiltered = false;
    const containsKeyword = (val) =>
      typeof val === "string" && val.indexOf(textString) !== -1;
    let names;
    for (var key in orginazations) {
      names = orginazations[key].name;
      //const itemdata = orginazations[key].name.toUpperCase()
    }
    const newdata = universityarray.filter((item) => {
      let itemdata = item.toString().toUpperCase();
      let textdata = text.toUpperCase();
      return itemdata.indexOf(textdata) > -1;
    });

    setdata(true);
    setuniarray(newdata);
    settextvalue(text);
  }

  function OnTextSubmit() {}

  function selectedUni(item) {
    setvalue(item);
    setStatus("checked");
    setdata(false);
    settextvalue("");
    setuniarray(uniList);
  }
  const ref = firestore().collection("Users");
  useEffect(() => {
    if (props.userData.ID !== undefined) {
      return ref.doc(props.userData.ID).onSnapshot((querySnapShot) => {
        if (querySnapShot.data()) {
          setlangarray(querySnapShot.data().Languages);
          setNewCourse(querySnapShot.data().Preferences);
          setPhoto(querySnapShot.data().Photo);
          setEmail(querySnapShot.data().Email);
          if (
            querySnapShot.data().Country.length &&
            querySnapShot.data().Country != undefined
          ) {
            setoriginalarray(querySnapShot.data().Country);
          }
        }
      });
    }
  }, []);

  function navigateToAccount() {
    navigation.navigate("StudentSettings");
  }
  function navigatetoOrganization() {
    setorganisation(!oraginsation);
    setrewards(false);
    setprofile(false);
    //navigation.navigate('Organizations');
  }
  function navigatetorewards() {
    setorganisation(false);
    setrewards(!rewards);
    setprofile(false);
  }
  function isOnProfile() {
    setprofile(!profile);
    setorganisation(false);
    setrewards(false);
  }

  function updateEditable() {
    SetEdit(isEdit);
    navigation.navigate("About");
  }
  const pic = Photo;

  function updateEditableDept() {
    navigation.navigate("Course");
  }
  const [arraylanguages, setlangarray] = useState([]);
  function selectOption(topic, index) {
    setselected(topic);
    setlangarray([...arraylanguages, topic]);
  }
  //CODE ADDED BY UDDIPAN
  const removeExternalUserIdforOneSignal = async (externalUserId) => {
    // console.log(externalUserId); return
    OneSignal.removeExternalUserId((results) => {
      // The results will contain push and email success statuses
      console.log("Results of setting external user id");
    });
  };
  const handleLogout = async () => {
    try {
      // return
      // let res = await GoogleSignin.isSignedIn();
      // if (res) {
      await auth()
        .signOut()
        .then(async () => {
          updateLogged(false);

          await GoogleSignin.revokeAccess();
          await GoogleSignin.signOut();
          await removeExternalUserIdforOneSignal();
        })
        .catch((err) => {
          console.log(err);
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
    }
  };

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
        setcountrystring("");
      }
      setcountries(false);
    }
  }

  function saveInterest() {
    if (selectedInterest != "") {
      let newarray = [selectedInterest];
      firestore()
        .collection("Users")
        .doc(props.userData.ID)
        .set(
          { Interests: firestore.FieldValue.arrayUnion(...newarray) },
          { merge: true }
        );
      setInterestString("");
      setIsInterests(false);
    }
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
  async function getUserCategories() {
    await firestore()
      .collection("Categories")
      .onSnapshot((querysnapshot) => {
        const list = [];
        querysnapshot.forEach((docsnapshot) => {
          list.push({ ...docsnapshot.data(), key: docsnapshot.id });
        });
        let sorted = list.sort((a, b) => {
          if (a.Category < b.Category) {
            return -1;
          }
          if (a.Category > b.Category) {
            return 1;
          }
          return 0;
        });
        let updated = sorted.filter((e) => e.Category != "My organisation");
        updated = sorted.filter((e) => e.Category != "Search");
        setarrayvalue(updated);
      });
  }
  useEffect(() => {
    getUserCategories();
  }, []);
  useEffect(() => {
    const filtered = arrayvalue.filter((item) => {
      return item.Category.includes(interestString);
    });
    setInterestsArray([...filtered]);
  }, [interestString]);
  const saveOtherUniversity = () => {
    var unsubscribe;
    if (uniList != null) {
      setuniarray(uniList);
    }
    if (value != "" && props.userData.ID != undefined) {
      unsubscribe = firestore()
        .collection("Users")
        .doc(props.userData.ID)
        .update({ Organization: otherUniversityText });
      firestore()
        .collection("Users")
        .doc(userData.ID)
        .update({
          CategoryID: firestore.FieldValue.arrayUnion(...catID)
        });
    }
    setvalue(otherUniversityText);
    setOtherUniversityText("");
    return () => {
      unsubscribe;
    };
  };
  //CODE ADDED BY UDDIPAN
  return (
    <SafeAreaView
      style={{
        backgroundColor: "black",
        height: "100%",
        paddingTop: Platform.OS === "android" ? 25 : 0
      }}
    >
      <View style={{ backgroundColor: "black", height: "25%" }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
            paddingHorizontal: 15
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => navigation.navigate("UpdateProfile")}
            >
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
                <Text style={{ color: "white", fontSize: 13 }}>
                  Update your{" "}
                </Text>
                <Text
                  style={{ color: "white", fontSize: 13, color: "#F1C411" }}
                >
                  profile{" "}
                </Text>
                <Text style={{ color: "white", fontSize: 13 }}>and </Text>
                <Text
                  style={{ color: "white", fontSize: 13, color: "#F1C411" }}
                >
                  interests{" "}
                </Text>
              </View>
              {/* uddipan st */}
            </View>
          </View>
          <View
            style={{
              alignSelf: "center",
              justifyContent: "space-between",
              flexDirection: "row"
            }}
          >
            <TouchableOpacity
              onPress={() => handleLogout()}
              style={{
                alignSelf: "center",
                borderRadius: 35,
                justifyContent: "center"
              }}
            >
              <Text
                style={{ color: "white", alignSelf: "center", fontSize: 14 }}
              >
                {"  "}
                Logout{" "}
              </Text>
              <MaterialIcons
                name="logout"
                size={22}
                style={{ alignSelf: "center", color: "white" }}
              />
            </TouchableOpacity>
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
                  style={{ color: "white" }}
                />
              </View>
            </TouchableOpacity>
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
                  style={{ color: "white" }}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 0,
            width: "100%",
            alignSelf: "center",
            alignContent: "center"
            // marginLeft: 10,
          }}
        >
          {oraginsation === true ? (
            <LottieView
              ref={(animation) => {
                setplay(animation);
              }}
              autoPlay={true}
              style={{
                width: 140,
                height: 140,
                alignSelf: "center",
                marginTop: Platform.OS === "android" ? -17 : -11.5,
                position: "absolute",
                top: 7,
                left: 2.5
              }}
              source={require("../assets/focus2.json")}
              loop={true}
            />
          ) : null}
          <View
            style={{
              flexDirection: "column",
              alignSelf: "center",
              marginTop: 5,
              justifyContent: "center",
              width: "auto",
              marginBottom: 50
            }}
          >
            <TouchableOpacity onPress={() => navigatetoOrganization()}>
              <View
                style={{
                  backgroundColor:
                    oraginsation === true ? "#fdc500" : "#fdc500",
                  alignSelf: "center",
                  borderRadius: 35,
                  height: 55,
                  width: 55,
                  justifyContent: "center"
                }}
              >
                <MaterialIcons
                  name="group"
                  size={40}
                  style={{ alignSelf: "center", color: "black" }}
                />
              </View>
              <Text
                style={{
                  color: oraginsation === true ? "#fdc500" : "#fdc500",
                  alignSelf: "center",
                  bottom: 0,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 7
                }}
              >
                My Organisations
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "column",
              alignSelf: "center",
              width: "auto",
              marginBottom: 60
            }}
          >
            <View
              style={{
                backgroundColor: "#F1C411",
                alignSelf: "center",
                borderRadius: 35,
                height: 70,
                width: 70,
                justifyContent: "center"
              }}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate("UpdateProfile")}
              >
                <Image
                  source={{ uri: props.userData.Photo }}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 40
                  }}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                bottom: 15,
                backgroundColor: "white",
                borderRadius: 20,
                justifyContent: "center",
                flexDirection: "row",
                width: "auto",
                alignSelf: "center",
                padding: 5
              }}
            >
              <Text style={{ alignSelf: "center" }}>0</Text>
              <MaterialIcons
                name="star"
                style={{ color: "black", alignSelf: "center" }}
              />
            </View>
            <Text
              style={{
                color: profile === true ? "#fdc500" : "white",
                alignSelf: "center",
                bottom: 10,
                marginTop: 7
              }}
            >
              Profile
            </Text>
          </View>
          {rewards === true ? (
            <LottieView
              ref={(animation) => {
                setplay(animation);
              }}
              autoPlay={true}
              style={{
                width: 140,
                height: 140,
                alignSelf: "center",
                marginTop: Platform.OS === "android" ? -17 : -11.5,
                position: "absolute",
                top: 11.5,
                right: 0.5
              }}
              source={require("../assets/focus2.json")}
              loop={true}
            />
          ) : null}
          <View
            style={{
              flexDirection: "column",
              alignSelf: "center",
              marginTop: 5,
              width: 100,
              marginBottom: 50
            }}
          >
            <TouchableOpacity onPress={() => navigation.navigate("Ratings")}>
              <View
                style={{
                  backgroundColor: rewards === true ? "#fdc500" : "#fdc500",
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
                  name="rate-review"
                  style={{ alignSelf: "center" }}
                  color={"black"}
                  size={30}
                />
                {/* <Image
                  source={require("../assets/medal.png")}
                  style={{ alignSelf: "center", width: 40, height: 40 }}
                /> */}
              </View>
              <Text
                style={{
                  color: rewards === true ? "#fdc500" : "#fdc500",
                  alignSelf: "center",
                  marginTop: 7
                }}
              >
                Reviews
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View
        style={{ height: "75%", overflow: "hidden", backgroundColor: "#fff" }}
      >
        {profile ? (
          <ScrollView style={{ height: "100%" }}>
            <Card
              style={{ height: "100%" }}
              containerStyle={{
                backgroundColor: "white",
                borderColor: "black",
                width: "100%",
                alignSelf: "flex-start",
                justifyContent: "flex-start"
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    backgroundColor: "#ffd500",
                    alignSelf: "flex-start",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                    borderRadius: 10
                  }}
                >
                  <Icon
                    name="globe"
                    size={20}
                    style={{ color: "black", alignSelf: "center" }}
                  />
                </View>
                <View style={{ flexDirection: "column", alignSelf: "center" }}>
                  {arraylanguages &&
                    arraylanguages.map((item, i) => {
                      const string = Object.values(item);
                      return (
                        <View key={i}>
                          <View style={{ flexDirection: "row" }}>
                            <Text style={{ left: 0, right: 5 }}>{item}</Text>
                            {language ? (
                              <MaterialIcons
                                name="delete"
                                size={15}
                                style={{ left: 5 }}
                                onPress={() => deleteItems(i)}
                              />
                            ) : null}
                          </View>
                          <Card.Divider
                            style={{ left: 5, paddingHorizontal: 5 }}
                          ></Card.Divider>
                        </View>
                      );
                    })}
                </View>
                <TouchableOpacity
                  onPress={() => editlanguage(!language)}
                  style={{ flexDirection: "row", padding: 10 }}
                >
                  <Icon
                    name="edit-2"
                    size={15}
                    style={{
                      color: "black",
                      alignSelf: "flex-start"
                    }}
                  />
                </TouchableOpacity>
              </View>
              {language ? (
                <View style={{ bottom: 10 }}>
                  <ModalDropdown
                    options={values.map((item, i) => {
                      return item.name;
                    })}
                    style={{
                      backgroundColor: "black",
                      height: 25,
                      borderRadius: 10,
                      justifyContent: "center",
                      width: 100,
                      alignSelf: "center"
                    }}
                    textStyle={{
                      color: "white",
                      alignSelf: "center",
                      marginLeft: 5,
                      fontSize: 13
                    }}
                    dropdownStyle={{
                      width: "auto",
                      backgroundColor: "white",
                      width: 100,
                      borderRadius: 10,
                      height: 100,
                      bottom: 100,
                      borderColor: "black",
                      borderBottomColor: "black"
                    }}
                    dropdownTextStyle={{
                      backgroundColor: "white",
                      color: "black"
                    }}
                    dropdownTextHighlightStyle={{
                      color: "#fdc500",
                      backgroundColor: "black"
                    }}
                    onSelect={(index, string) => setlangValue(string)}
                    defaultValue="Language"
                  />

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
                      top: 5,
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
                </View>
              ) : null}
              <Card.Divider style={{ marginTop: 10 }}></Card.Divider>
              <View style={{ flexDirection: "row", alignSelf: "flex-start" }}>
                <View
                  style={{
                    backgroundColor: "#ffd500",
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

                <Text style={{ color: "black", alignSelf: "center" }}>
                  {" "}
                  {props.userData.Country}{" "}
                </Text>
                <Icon
                  name="edit-2"
                  size={15}
                  style={{ color: "black", alignSelf: "center" }}
                />
              </View>
              <Card.Divider style={{ marginTop: 20 }}></Card.Divider>
              <View
                style={{ flexDirection: "column", alignSelf: "flex-start" }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignSelf: "flex-start"
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#ffd500",
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
                      style={{ alignSelf: "center" }}
                    />
                  </View>
                  <Text
                    style={{
                      color: "black",
                      alignSelf: "center",
                      justifyContent: "center",
                      left: 2
                    }}
                  >
                    {email}
                  </Text>
                </View>
              </View>

              <Card.Divider style={{ marginTop: 20 }}></Card.Divider>

              <View
                style={{ flexDirection: "column", alignSelf: "flex-start" }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignSelf: "flex-start"
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#ffd500",
                      alignSelf: "flex-start",
                      justifyContent: "center",
                      width: 40,
                      height: 40,
                      borderRadius: 20
                    }}
                  >
                    <MaterialIcons
                      name="wallet-giftcard"
                      size={20}
                      style={{ alignSelf: "center" }}
                    />
                  </View>
                  <Text
                    style={{
                      color: "black",
                      alignSelf: "center",
                      justifyContent: "center",
                      left: 2
                    }}
                  >
                    {" "}
                    Wallet{" "}
                  </Text>
                  <TouchableOpacity style={{ flexDirection: "row" }}>
                    <Icon
                      name="arrow-right"
                      size={20}
                      style={{
                        color: "black",
                        alignSelf: "center",
                        justifyContent: "center",
                        left: 2
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <Card.Divider style={{ marginTop: 20 }}></Card.Divider>

              <View
                style={{ flexDirection: "column", alignSelf: "flex-start" }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignSelf: "flex-start"
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#ffd500",
                      alignSelf: "flex-start",
                      justifyContent: "center",
                      width: 40,
                      height: 40,
                      borderRadius: 20
                    }}
                  >
                    <Image
                      source={require("../assets/interests.png")}
                      style={{ alignSelf: "center", width: 30, height: 30 }}
                    />
                  </View>
                  <Text
                    style={{
                      color: "black",
                      alignSelf: "center",
                      justifyContent: "center",
                      left: 2
                    }}
                  >
                    {" "}
                    Interests{" "}
                  </Text>
                  <TouchableOpacity style={{ flexDirection: "row" }}>
                    <Icon
                      name="arrow-right"
                      size={20}
                      style={{
                        color: "black",
                        alignSelf: "center",
                        justifyContent: "center",
                        left: 2
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          </ScrollView>
        ) : oraginsation ? (
          <View style={{ height: "100%" }}>
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
              <View
                style={{
                  backgroundColor: "black",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  top: 20,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 10
                }}
              >
                {status === "checked" ? (
                  value != "" ? (
                    <Text
                      style={{
                        color: "white",
                        alignSelf: "center",
                        fontSize: 14
                      }}
                    >
                      {value}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        color: "white",
                        alignSelf: "center",
                        fontSize: 14
                      }}
                    >
                      Pick
                    </Text>
                  )
                ) : (
                  <TextInput
                    value={textvalue}
                    onChangeText={(text) => {
                      settextvalue(text), changetext(text);
                    }}
                    placeholderTextColor="white"
                    style={{ color: "white", width: "85%", height: 40 }}
                    placeholder="Search"
                  />
                )}
                <ToggleButton
                  icon="arrow-down"
                  style={{
                    color: "white",
                    backgroundColor: "black",
                    alignSelf: "flex-end"
                  }}
                  color={status === "checked" ? "white" : "green"}
                  value="check"
                  status={status}
                  onPress={onButtonToggle}
                />
              </View>
              {status === "unchecked" ? (
                <View style={{ height: "50%", top: 20 }}>
                  <FlatList
                    data={universityarray}
                    keyExtractor={(item, index) => {
                      return index.toString();
                    }}
                    renderItem={({ item }) => {
                      return (
                        <View
                          style={{
                            height: "auto",
                            width: "auto",
                            padding: 1,
                            borderWidth: 1,
                            borderColor: "#eee7"
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => selectedUni(item)}
                            style={{
                              padding: 7,
                              borderBottomWidth: 1,
                              borderBottomColor: "#eee"
                            }}
                          >
                            <Text style={{ color: "black" }}>{item}</Text>
                          </TouchableOpacity>
                        </View>
                      );
                    }}
                  />
                </View>
              ) : null}
              <View style={{ top: 20, marginTop: 20, alignItems: "center" }}>
                <Text style={{ color: "#000" }}>-OR-</Text>
                <View style={{ flexDirection: "row" }}>
                  <TextInput
                    value={otherUniversityText}
                    onChangeText={(text) => {
                      setOtherUniversityText(text);
                    }}
                    placeholderTextColor="white"
                    style={{
                      color: "white",
                      width: "78%",
                      height: 40,
                      backgroundColor: "#000",
                      marginTop: 20
                    }}
                    placeholder="Type Other Organizations "
                  />
                  <TouchableOpacity
                    style={{
                      alignSelf: "center",
                      backgroundColor: "#fdc500",
                      height: 40,
                      paddingHorizontal: 20,
                      borderRadius: 5,
                      shadowColor: "white",
                      shadowRadius: 0.5,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      elevation: 5,
                      justifyContent: "center",
                      marginLeft: 10,
                      marginTop: 20
                    }}
                    onPress={() => saveOtherUniversity()}
                  >
                    <Text
                      style={{
                        color: "#000",
                        alignSelf: "center",
                        alignItems: "center"
                      }}
                    >
                      Save
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              {value != "" ? (
                <View>
                  <Card
                    containerStyle={{
                      width: "100%",
                      alignSelf: "center",
                      borderRadius: 10,
                      shadowOffset: { width: 0, height: 2 },
                      shadowColor: "black",
                      shadowRadius: 2,
                      shadowOpacity: 0.5,
                      backgroundColor: "#eaeaf4",
                      borderColor: "#eaeaf4",
                      // height: "45%",
                      marginTop: 50
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignSelf: "flex-start",
                        right: 5
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: "#ffd500",
                          justifyContent: "center",
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          marginRight: 10
                        }}
                      >
                        <MaterialIcons
                          name="school"
                          style={{ alignSelf: "center" }}
                          size={20}
                        />
                      </View>
                      <Text
                        style={{
                          fontSize: 14,
                          marginTop: 0,
                          alignSelf: "center",
                          fontWeight: "bold"
                        }}
                      >
                        {value}
                      </Text>
                    </View>
                  </Card>
                </View>
              ) : null}
            </Card>
          </View>
        ) : rewards ? (
          <ScrollView contentContainerStyle={{ height: "200%" }}>
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
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignSelf: "center"
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 18,
                    color: "black",
                    alignSelf: "center",
                    left: 10,
                    bottom: 5
                  }}
                >
                  Rewards
                </Text>
              </View>
              <Card
                containerStyle={{
                  width: "50%",
                  alignSelf: "center",
                  borderRadius: 10,
                  shadowOffset: { width: 0, height: 2 },
                  shadowColor: "black",
                  shadowRadius: 2,
                  shadowOpacity: 0.5,
                  backgroundColor: "#eaeaf4",
                  borderColor: "#eaeaf4",
                  left: 10,
                  bottom: 12
                }}
              >
                <View
                  style={{
                    alignSelf: "center",
                    borderRadius: 35,
                    height: 35,
                    width: 35
                  }}
                >
                  <Image
                    source={require("../assets/medal.png")}
                    style={{ alignSelf: "center", width: 30, height: 30 }}
                  />
                </View>
                <Text
                  style={{ color: "black", alignSelf: "center", fontSize: 35 }}
                >
                  10
                </Text>
              </Card>
              <Card.Divider style={{ marginTop: 10 }}></Card.Divider>
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    backgroundColor: "#ffd500",
                    alignSelf: "flex-start",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                    borderRadius: 20
                  }}
                >
                  <Image
                    source={require("../assets/referral.png")}
                    style={{ width: 25, height: 25, alignSelf: "center" }}
                  />
                </View>
                <TouchableOpacity>
                  <View style={{ flexDirection: "column", marginLeft: 5 }}>
                    <Text style={{ fontWeight: "bold" }}>
                      Refer your first friend!
                    </Text>
                    <Text style={{ top: 5 }}>Earn 10 more points</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <Card.Divider style={{ marginTop: 10 }}></Card.Divider>
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    backgroundColor: "#ffd500",
                    alignSelf: "flex-start",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                    borderRadius: 20
                  }}
                >
                  <Image
                    source={require("../assets/lecture.png")}
                    style={{ width: 25, height: 25, alignSelf: "center" }}
                  />
                </View>
                <TouchableOpacity>
                  <View style={{ flexDirection: "column", marginLeft: 5 }}>
                    <Text style={{ fontWeight: "bold" }}>Attend a seminar</Text>
                    <Text style={{ top: 5 }}>Earn 15 more points</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </Card>
          </ScrollView>
        ) : (
          <ScrollView>
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
                height: "150%"
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    backgroundColor: "#ffd500",
                    alignSelf: "flex-start",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    marginRight: 10
                  }}
                >
                  <Icon
                    name="globe"
                    size={20}
                    style={{ color: "black", alignSelf: "center" }}
                  />
                </View>
                <Text
                  style={{
                    color: "#000",
                    marginTop: 7,
                    fontWeight: "bold"
                  }}
                >
                  Language :
                </Text>
                <View
                  style={{
                    flexDirection: "column",
                    alignSelf: "center",
                    top: 5,
                    left: 5
                  }}
                >
                  {arraylanguages &&
                    arraylanguages.map((item, i) => {
                      const string = Object.values(item);
                      return (
                        <View
                          style={{
                            alignSelf: "center",
                            paddingHorizontal: 7,
                            paddingVertical: 5,
                            borderRadius: 5,
                            backgroundColor: "#eee",
                            marginLeft: 5,
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            marginBottom: 10
                          }}
                          key={i}
                        >
                          <View style={{ flexDirection: "row" }}>
                            <Text style={{ left: 0 }}>{item}</Text>
                          </View>
                          {language ? (
                            <MaterialIcons
                              name="delete"
                              size={15}
                              style={{ left: 5 }}
                              onPress={() => deleteItems(i)}
                            />
                          ) : null}
                        </View>
                      );
                    })}
                </View>
                {language ? (
                  <TouchableOpacity
                    onPress={() => editlanguage(!language)}
                    style={{ flexDirection: "row" }}
                  >
                    <MaterialIcons
                      name="arrow-drop-up"
                      size={15}
                      style={{
                        color: "black",
                        alignSelf: "flex-start",
                        padding: 10,
                        marginLeft: 10
                      }}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => editlanguage(!language)}
                    style={{ flexDirection: "row" }}
                  >
                    <Icon
                      name="edit-2"
                      size={15}
                      style={{
                        color: "black",
                        alignSelf: "flex-start",
                        padding: 10,
                        marginLeft: 10
                      }}
                    />
                  </TouchableOpacity>
                )}
              </View>
              {language ? (
                <View
                  style={{ marginTop: 10 }}
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
                    options={langString.map((item, i) => {
                      return item.name;
                    })}
                    style={{
                      backgroundColor: "#fff",
                      height: 35,
                      borderRadius: 10,
                      justifyContent: "center",
                      width: "100%",
                      alignSelf: "center",
                      borderWidth: 1,
                      borderColor: "#ddd0",
                      elevation: 1,
                      marginBottom: 15,
                      paddingHorizontal: 10
                    }}
                    textStyle={{
                      color: "black",
                      alignSelf: "center",
                      justifyContent: "center"
                    }}
                    dropdownStyle={{
                      backgroundColor: "#fff",
                      width: "86%",
                      marginTop: 10,
                      marginLeft: -7
                    }}
                    dropdownTextStyle={{
                      backgroundColor: "#fff",
                      color: "black"
                    }}
                    dropdownTextHighlightStyle={{ color: "#fdc500" }}
                    onSelect={(index, topic) => setlangValue(topic)}
                  ></ModalDropdown>
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
                      onPress={() => editlanguage(!language)}
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
              <Card.Divider style={{ marginTop: 7 }}></Card.Divider>
              {/* country */}

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
                      alignSelf: "center",
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
                              marginLeft: 5
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
                      style={{
                        color: "black",
                        alignSelf: "center",
                        padding: 10
                      }}
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
              {/* email */}
              <View
                style={{ flexDirection: "column", alignSelf: "flex-start" }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignSelf: "flex-start"
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#ffd500",
                      alignSelf: "flex-start",
                      justifyContent: "center",
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      marginRight: 10
                    }}
                  >
                    <MaterialIcons
                      name="email"
                      size={20}
                      style={{ alignSelf: "center" }}
                    />
                  </View>
                  <Text
                    style={{
                      color: "#000",
                      marginTop: 7,
                      fontWeight: "bold"
                    }}
                  >
                    Email :
                  </Text>
                  <View
                    style={{
                      alignSelf: "center",
                      paddingHorizontal: 7,
                      paddingVertical: 5,
                      borderRadius: 5,
                      backgroundColor: "#eee",
                      marginLeft: 5,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 0
                    }}
                  >
                    <Text
                      style={{
                        color: "black",
                        alignSelf: "center",
                        justifyContent: "center",
                        left: 2
                      }}
                    >
                      {email}
                    </Text>
                  </View>
                </View>
              </View>
              <Card.Divider style={{ marginTop: 7 }}></Card.Divider>
              {/*  Wallet */}
              <TouchableOpacity
                style={{
                  flexDirection: "column",
                  alignSelf: "flex-start",
                  width: "100%",
                  backgroundColor: "#f000"
                }}
                onPress={() => {
                  navigation.navigate("Tallet");
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignSelf: "flex-start"
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#ffd500",
                      alignSelf: "flex-start",
                      justifyContent: "center",
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      marginRight: 10
                    }}
                  >
                    <MaterialIcons
                      name="wallet-giftcard"
                      size={20}
                      style={{ alignSelf: "center" }}
                    />
                  </View>
                  <Text
                    style={{
                      color: "black",
                      alignSelf: "center",
                      justifyContent: "center",
                      left: 2,
                      fontWeight: "bold"
                    }}
                  >
                    {" "}
                    Tallet{" "}
                  </Text>
                  {/* <TouchableOpacity style={{ flexDirection: "row" }}>
                    <Icon
                      name="arrow-right"
                      size={20}
                      style={{
                        color: "black",
                        alignSelf: "center",
                        justifyContent: "center",
                        left: 2,
                      }}
                    />
                  </TouchableOpacity> */}
                </View>
              </TouchableOpacity>

              <Card.Divider style={{ marginTop: 7 }}></Card.Divider>
              {/* intrest */}
              {/* <TouchableOpacity
                style={{ flexDirection: "column", alignSelf: "flex-start" }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignSelf: "flex-start",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#ffd500",
                      alignSelf: "flex-start",
                      justifyContent: "center",
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      marginRight: 10,
                    }}
                  >
                    <Image
                      source={require("../assets/interests.png")}
                      style={{ alignSelf: "center", width: 30, height: 30 }}
                    />
                  </View>
                  <Text
                    style={{
                      color: "black",
                      alignSelf: "center",
                      justifyContent: "center",
                      left: 2,
                      fontWeight: "bold",
                    }}
                  >
                    {" "}
                    Interests{" "}
                  </Text>

                </View>
              </TouchableOpacity> */}
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
                  <Image
                    source={require("../assets/interests.png")}
                    style={{ alignSelf: "center", width: 30, height: 30 }}
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
                      alignSelf: "center",
                      fontWeight: "bold"
                    }}
                  >
                    {" "}
                    Interests :{" "}
                  </Text>
                  {/* <Icon
                    name="arrow-right"
                    size={18}
                    style={{ color: "black", alignSelf: "center", left: 2 }}
                  /> */}
                  {Array.isArray(userInfo.Interests)
                    ? userInfo.Interests.map((item, i) => {
                        return (
                          <View
                            key={i}
                            style={{
                              alignSelf: "center",
                              paddingHorizontal: 7,
                              paddingVertical: 5,
                              borderRadius: 5,
                              backgroundColor: "#eee",
                              marginLeft: 5
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
                                {item.Category}
                                {/* {i != arr.length - 1 ? "," : ""} */}
                              </Text>
                              {isInterests ? (
                                <MaterialIcons
                                  name="delete"
                                  size={15}
                                  style={{ left: 5, top: 2 }}
                                  onPress={() => deleteInterest(item, i)}
                                />
                              ) : null}
                            </View>
                          </View>
                        );
                      })
                    : null}
                </View>
                {isInterests === true ? (
                  <TouchableOpacity onPress={() => setIsInterests(false)}>
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
                    onPress={() => setIsInterests(true)}
                  >
                    <Icon
                      name="edit-2"
                      size={15}
                      style={{
                        color: "black",
                        alignSelf: "center",
                        padding: 10
                      }}
                    />
                  </TouchableOpacity>
                )}
              </View>
              {isInterests ? (
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
                    value={interestString}
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
                    onChangeText={(text) => setInterestString(text)}
                  />
                  {interestString != "" && (
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
                        {interestString != "" &&
                          interestsArray.map((item, i) => {
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
                                    setSelectedInterest(item);
                                    setInterestString(item.Category);
                                    setInterestsArray([]);
                                  }}
                                  style={{
                                    backgroundColor: "white",
                                    borderBottomWidth: 1,
                                    borderColor: "#ccc",
                                    borderRadius: 0,
                                    zIndex: 10
                                  }}
                                >
                                  <Text style={{ padding: 10 }}>
                                    {item.Category}{" "}
                                  </Text>
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
                      onPress={() => saveInterest()}
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
                      onPress={() => setIsInterests(false)}
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
              {/* interest ends */}
            </Card>
          </ScrollView>
        )}
      </View>
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
