"use strict";
import React, { useContext, useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import * as ImagePicker from "expo-image-picker";

import axios from "axios";
import * as Permissions from "expo-permissions";
import * as Notifications from "expo-notifications";

import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import storage from "@react-native-firebase/storage";

export default function SetUp(props) {
  console.log("props.route.params ", props.route.params);
  const [filePath, setFilePath] = useState(null);
  const [picked, setPicked] = useState(false);
  const [uploaduri, setuploadURI] = useState(null);
  const { userData, updateLogged, userUpdate } = props;
  const [url, setUrl] = useState(null);
  const [country, setCountry] = useState("");
  const [name, setname] = useState(
    props.route?.params?.displayname ? props.route.params.displayname : ""
  );
  const usersCollection = firestore();
  const [pic, setPic] = useState("");
  const dbstorage = storage();
  const photo = picked ? filePath : userData.Photo;
  console.log("NAME ", name);
  let ref;
  useEffect(() => {
    const authlistener = auth().onAuthStateChanged((user) => {
      if (user != null) {
        console.log("we are authenticated now!");
        let uid;
        user.providerData.map((item, i) => (uid = item.uid));
        console.log("uid", uid);
        if (true) {
          registerForPushNotification(uid);
          ref = storage()
            .ref()
            .child("userimages " + uid);
          const query = firestore().collection("Users").doc(uid);
          query.get().then((querySnapShot) => {
            if (querySnapShot.exists) {
              console.log("EXISTS in setuppage page ");
            }
          });
        }
      } else {
        console.log("not authenticated");
      }
    });
    return authlistener;
  }, []);
  useEffect(() => {}, []);

  async function registerForPushNotification(uid) {
    let token;
    // if (Constants.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      console.log("pls request");
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      console.log("failed");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    firestore()
      .collection("Users")
      .doc(uid)
      .set({ ExpoPushToken: token }, { merge: true });
    // } else {
    //   console.log("open mobile");
    // }

    return token;
  }
  //edit your profile pic
  let openImagePickerAsync = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log("clickable");
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.cancelled === true) {
      console.log("not allowed");
      return;
    }
    console.log("image daata", pickerResult);

    let source = { uri: pickerResult.uri };
    let uri = pickerResult.uri;
    let uploadUri = Platform.OS === "ios" ? uri.replace("file://", "") : uri;
    setuploadURI(uploadUri);
    setFilePath(source.uri);
    // uriToBlob(pickerResult.uri);
    var ID = userData.ID;
    _handlePhotoChoice(uri, ID);
  };
  //converting pic url to data that can be stored in firebase storage
  const _handlePhotoChoice = async (uri, ID) => {
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
      .child("userimages/" + ID);
    await ref.put(blob);
    const url = await storage()
      .ref("userimages/" + ID)
      .getDownloadURL();
    console.log("download url ", url);
    setUrl(url);
    setPicked(true);
  };

  //for saving user details
  function SaveDetail() {
    userData.Country = country;
    setCountry(country);
    console.log("about country: ", country);
    var newUserData = {
      Name: name != null ? name : userData.Name,
      ID: userData.ID,
      Photo: url != null ? url : userData.Photo,
      Type: "",
      Email: userData.Email,
      Description: "",
      Country: [country]
    };
    userUpdate(newUserData);
    usersCollection
      .collection("Users")
      .doc(userData.ID)
      .set(
        {
          Name: name ? name : userData.Name,
          Photo: url !== null ? url : userData.Photo,
          ID: userData.ID,
          ProfileChanged: url !== null ? true : false,
          Type: userData.Type,
          Country: [country],
          FirstTime: false,
          Email: userData.Email,
          Organization: "",
          Language: ["English"],
          Balance: 0,
          CategoryCount: 0,
          EducationCount: 0,
          EndorsementCount: 0,
          LanguageCount: 0,
          Q1Average: 0,
          Q2Average: 0,
          Q3Average: 0,
          Q4Average: 0,
          TotalAverage: 0,
          RequestCount: 0,
          SessionCount: 0,
          RewardCount: 0,
          SkillCount: 0,
          UpcomingCount: 0,
          NotifCount: 1,
          PreviousCount: 0,
          ScheduleSet: false,
          GroupSessionCount: 0,
          VideoCount: 0,
          BiddingCount: 0,
          HourReward: 0,
          EndorsedReward: 0,
          Hours: 0,
          ReviewCount: 0,
          Rate: 0
        },
        { merge: true }
      );
    let Notifarray = [
      {
        Message:
          "Update your profile with your skills, expertise, promo video, hourly rate and more.",
        Type: "StartUp"
      }
    ];
    firestore()
      .collection("Notifications")
      .doc(props.userData.ID)
      .set(
        { Messages: firestore.FieldValue.arrayUnion(...Notifarray) },
        { merge: true }
      );

    updateLogged(true);
  }

  return (
    <SafeAreaView
      style={{
        backgroundColor: "#101820FF",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          backgroundColor: "white",
          padding: 10,
          margin: "5%",
          width: "93%",
          borderRadius: 15,
          flex: 1
        }}
      >
        <Text
          style={{
            justifyContent: "center",
            alignItems: "center",
            fontSize: 20,
            alignSelf: "center",
            marginTop: 50,
            color: "black",
            fontWeight: "bold"
          }}
        >
          Set Up Your Profile
        </Text>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ marginTop: "20%", marginLeft: 20 }}
        >
          <View style={{ flexDirection: "row", alignSelf: "center" }}>
            <Image
              source={{ uri: picked ? url : userData.Photo }}
              style={{
                width: 200,
                height: 200,
                borderRadius: 100,
                justifyContent: "center",
                alignItems: "center"
              }}
            />
            <TouchableOpacity
              onPress={openImagePickerAsync}
              style={{
                width: 40,
                height: 40,
                borderRadius: 50,
                backgroundColor: "orange",
                marginLeft: -25,
                marginTop: 150,
                elevation: 5,
                zIndex: 9999
              }}
            >
              <View style={{ borderRadius: 10 }}>
                <Image
                  source={require("../assets/uploadicon.png")}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 50,
                    backgroundColor: "orange"
                  }}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", alignSelf: "center" }}>
            {/* <Image
              source={require("../assets/username.png")}
              style={{ width: 20, height: 20, marginTop: 30, right: 5 }}
            /> */}
            <TextInput
              style={{
                marginTop: 20,
                width: "75%",
                height: 40,
                marginLeft: 10,
                alignItems: "baseline",
                borderBottomWidth: 2,
                textAlign: "left",
                color: "black",
                fontSize: 16,
                borderColor: "white",
                backgroundColor: "white",
                alignSelf: "center",
                padding: 0,
                paddingLeft: 5,
                elevation: 1,
                borderRadius: 30
              }}
              placeholder="Name"
              onChangeText={(text) => setname(text)}
              // multiline={true}
              value={name}
            />
          </View>
          <View style={{ flexDirection: "row", alignSelf: "center" }}>
            {/* <Image
              source={require("../assets/country.png")}
              style={{ width: 30, height: 30, marginTop: 20, right: 10 }}
            /> */}
            <TextInput
              style={{
                marginTop: 20,
                width: "75%",
                height: 40,
                marginLeft: 10,
                alignItems: "baseline",
                borderBottomWidth: 2,
                textAlign: "left",
                color: "black",
                fontSize: 16,
                borderColor: "white",
                backgroundColor: "white",
                alignSelf: "center",
                padding: 0,
                paddingLeft: 5,
                elevation: 1,
                borderRadius: 30
              }}
              placeholder="Country"
              onChangeText={(text) => setCountry(text)}
              // multiline={true}
            />
          </View>
          <TouchableOpacity
            style={{
              marginTop: 50,
              backgroundColor: "#fdc500",
              width: 100,
              height: 40,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center"
            }}
            onPress={() => SaveDetail()}
          >
            <Text style={{ alignSelf: "center" }}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  TextInput: {
    marginTop: 20,
    width: "55%",
    height: 40,
    alignItems: "baseline",
    borderBottomWidth: 2,
    textAlign: "left",
    color: "black",
    fontSize: 16,
    borderColor: "white",
    backgroundColor: "white",
    alignSelf: "center",
    paddingTop: 15,
    paddingLeft: 5
  }
});
