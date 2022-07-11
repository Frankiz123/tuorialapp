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

import firestore from '@react-native-firebase/firestore';
export default function TuteeReferral(props) {
  const route = useRoute();
  const { userData, userPreference, userInterests, userSelect } = props;
  const navigation = useNavigation();
  const [language, editlanguage] = useState(false);
  const [newCourse, setNewCourse] = useState([]);
  const [selected, setselected] = useState("");
  const [Photo, setPhoto] = useState("");
  const [refer, setrefer] = useState(false);
  const [share, setshare] = useState(false);
  const [referrals, setreferrals] = useState(true);

  console.log(selected);
  const ref = firestore().collection("Users");
  // useEffect(() => {
  //   console.log("effected");
  //   return ref.doc(props.userData.ID).onSnapshot((querySnapShot) => {
  //     if (querySnapShot.data()) {
  //       setNewCourse(querySnapShot.data().Preferences);
  //       setPhoto(querySnapShot.data().Photo);
  //     }
  //   });
  // }, []);
  function navigatetorefer() {
    setrefer(!refer);
    setshare(false);
    setreferrals(false);
    //navigation.navigate('Organizations');
  }
  function navigatetoshare() {
    setrefer(false);
    setshare(!share);
    setreferrals(false);
  }
  function isOnReferral() {
    setreferrals(true);
    setrefer(false);
    setshare(false);
  }

  function updateEditable() {
    SetEdit(isEdit);
    console.log(isEdit);
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
  console.log(arraylanguages);
  return (
    <SafeAreaView
      style={{
        backgroundColor: "black",
        height: "100%",
        paddingTop: Platform.OS === "android" ? 25 : 0,
      }}
    >
      <View style={{ backgroundColor: "black", height: "35%" }}>
        <View
          style={{
            flexDirection: "row",
            alignSelf: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Profile");
            }}
            style={{
              alignSelf: "center",
              borderRadius: 35,
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white", alignSelf: "center", fontSize: 14 }}>
              {" "}
              Settings{" "}
            </Text>
            <MaterialIcons
              name="settings"
              size={22}
              style={{ alignSelf: "center", color: "white" }}
            />
          </TouchableOpacity>
          <TouchableOpacity style={{ flexDirection: "column" }} onPress={() => {
            Linking.openURL("https://www.tutoritto.com/contact")
          }}>
            <Text style={{ color: "white", fontSize: 14 }}> Help </Text>
            <View
              style={{ borderRadius: 35, alignSelf: "center" }}
            >
              <MaterialIcons name="help" size={22} style={{ color: "white" }} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{ flexDirection: "column" }} onPress={() => {
            Linking.openURL("https://www.tutoritto.com/about")
          }}>
            <Text style={{ color: "white", fontSize: 14 }}> About </Text>
            <View
              style={{ borderRadius: 35, alignSelf: "center" }}
            >
              <MaterialIcons name="info" size={22} style={{ color: "white" }} />
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 50,
            width: "100%",
            alignSelf: "center",
            alignContent: "center",
          }}
        >
          <View
            style={{
              flexDirection: "column",
              alignSelf: "center",
              marginTop: 5,
              justifyContent: "center",
              width: 120,
            }}
          >
            <TouchableOpacity onPress={() => navigatetorefer()}>
              <View
                style={{
                  backgroundColor: refer === true ? "white" : "#fdc500",
                  alignSelf: "center",
                  borderRadius: 35,
                  height: 55,
                  width: 55,
                  justifyContent: "center",
                }}
              >
                <Image
                  source={require("../assets/social-media.png")}
                  style={{ alignSelf: "center", width: 40, height: 40 }}
                />
              </View>
              <Text
                style={{
                  color: refer === true ? "#fdc500" : "white",
                  alignSelf: "center",
                  bottom: 0,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {" "}
                Refer{" "}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{ flexDirection: "column", alignSelf: "center", width: 120 }}
          >
            <TouchableOpacity onPress={() => isOnReferral()}>
              <View
                style={{
                  backgroundColor: "#fdc500",
                  alignSelf: "center",
                  borderRadius: 35,
                  height: 55,
                  width: 55,
                  justifyContent: "center",
                }}
              >
                <Image
                  source={require("../assets/referrals.png")}
                  style={{
                    width: 55,
                    height: 55,
                    alignSelf: "center",
                    borderRadius: 35,
                  }}
                />
              </View>
              <Text
                style={{
                  color: referrals === true ? "#fdc500" : "white",
                  alignSelf: "center",
                }}
              >
                {" "}
                Referrals{" "}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "column",
              alignSelf: "center",
              marginTop: 5,
              width: 100,
            }}
          >
            <TouchableOpacity onPress={() => navigatetoshare()}>
              <View
                style={{
                  backgroundColor: share === true ? "white" : "#fdc500",
                  alignSelf: "center",
                  borderRadius: 35,
                  height: 55,
                  width: 55,
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialIcons
                  name="share"
                  size={40}
                  style={{ alignSelf: "center" }}
                />
              </View>
              <Text
                style={{
                  color: share === true ? "#fdc500" : "white",
                  alignSelf: "center",
                }}
              >
                {" "}
                Share{" "}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {referrals ? (
        <ScrollView style={{ backgroundColor: "white" }}>
          <Card
            containerStyle={{
              width: "90%",
              backgroundColor: "#eaeaf4",
              borderColor: "#eaeaf4",
              borderRadius: 10,
              height: "100%",
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontSize: 18 }}>Congratulations!</Text>
              <View
                style={{
                  width: 35,
                  height: 35,
                  borderRadius: 20,
                  backgroundColor: "#fdc500",
                  justifyContent: "center",
                  alignSelf: "center",
                  bottom: 8,
                  left: 5,
                }}
              >
                <MaterialIcons
                  name="celebration"
                  size={25}
                  style={{ alignSelf: "center" }}
                />
              </View>
            </View>
            <Text style={{ top: 10 }}>
              A friend joined through your referral code. You've earned 10
              reward points
            </Text>
          </Card>
          <Card.Divider
            style={{ marginTop: 20, backgroundColor: "black" }}
          ></Card.Divider>
        </ScrollView>
      ) : refer ? (
        <ScrollView contentContainerStyle={{ height: "100%" }}>
          <Card
            style={{ width: "100%", height: "100%" }}
            containerStyle={{
              marginTop: 0,
              backgroundColor: "white",
              borderColor: "white",
              width: "100%",
              alignSelf: "flex-start",
              justifyContent: "flex-start",
              right: 15,
              height: "100%",
            }}
          >
            <Text style={{ alignSelf: "center" }}>Refer a friend</Text>
            <Card
              containerStyle={{
                width: "90%",
                backgroundColor: "#eaeaf4",
                borderColor: "#eaeaf4",
                borderRadius: 10,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{
                    borderWidth: 1,
                    width: "90%",
                    padding: 5,
                    alignSelf: "center",
                  }}
                >
                  ABC391
                </Text>
                <View
                  style={{
                    backgroundColor: "#fdc500",
                    justifyContent: "center",
                    borderRadius: 20,
                    width: 35,
                    height: 35,
                    left: 3,
                    alignSelf: "center",
                  }}
                >
                  <MaterialIcons
                    name="file-copy"
                    size={20}
                    style={{ alignSelf: "center" }}
                  />
                </View>
              </View>

              <View style={{ flexDirection: "row", alignSelf: "center" }}>
                <Image
                  source={require("../assets/fblogo.png")}
                  style={{
                    width: 30,
                    height: 30,
                    justifyContent: "center",
                    alignSelf: "center",
                    resizeMode: "contain",
                    marginTop: 40,
                  }}
                />
                <Image
                  source={require("../assets/googleicon.png")}
                  style={{
                    width: 30,
                    height: 30,
                    justifyContent: "center",
                    alignSelf: "center",
                    resizeMode: "contain",
                    marginTop: 40,
                    marginLeft: 20,
                  }}
                />
                <Image
                  source={require("../assets/linkedin.png")}
                  style={{
                    width: 30,
                    height: 30,
                    justifyContent: "center",
                    alignSelf: "center",
                    resizeMode: "contain",
                    marginTop: 40,
                    marginLeft: 20,
                  }}
                />
                <Image
                  source={require("../assets/instagram.png")}
                  style={{
                    width: 30,
                    height: 30,
                    justifyContent: "center",
                    alignSelf: "center",
                    resizeMode: "contain",
                    marginTop: 40,
                    marginLeft: 20,
                  }}
                />
              </View>
            </Card>
          </Card>
        </ScrollView>
      ) : share ? (
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
              height: "100%",
            }}
          ></Card>
        </ScrollView>
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
    justifyContent: "center",
  },
});
