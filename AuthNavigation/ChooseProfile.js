import React, { useContext, useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions
} from "react-native";
import { useLinkProps, useNavigation } from "@react-navigation/native";
const { height } = Dimensions.get("screen");

import firestore from "@react-native-firebase/firestore";
export default function ChooseProfile(props) {
  const { userUpdate, userData, updateLogged } = props;
  const [isTutor, SetTutorProfile] = useState(true);
  const [isParent, SetParentProfile] = useState(true);
  const [isStudent, SetStudentProfile] = useState(true);
  console.log("hello", props.userData.Name);
  const navigation = useNavigation();

  console.log("hello", props.userData.Photo);
  const profilepic = props.userData.Photo;
  const usersCollection = firestore();
  function TutorProfile() {
    props.userData.Type = "Tutor";
    props.navigation.navigate("SetUp");
    // usersCollection.collection('Users').doc(props.userData.ID).set({Name: props.userData.Name, Photo: profilepic, ID: props.userData.ID, Type: props.userData.Type })
    //updateLogged(true);
  }
  function StudentProfile() {
    props.userData.Type = "Student";
    navigation.navigate("SetUp", {
      userData: userData,
      updateLogged: updateLogged
    });
  }
  function StudentProfile() {
    props.userData.Type = "Student";
    navigation.navigate("SetUp", {
      userData: userData,
      updateLogged: updateLogged
    });
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#101820FF", marginTop: "auto" }}
    >
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "center",
          alignContent: "center",
          marginTop: 100
        }}
      >
        {/* <Image source = {require('../assets/tutorrito.png')} style = {{width: 100, height: 100, borderRadius: 20, marginTop: 50, justifyContent: 'center',alignItems: 'center'}}/> */}

        <Text style={styles.userinfo}>Welcome Mr.Anderson</Text>
      </View>
      <Text
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginRight: "auto",
          marginLeft: "auto",
          marginTop: 30,
          fontSize: 20,
          color: "white"
        }}
      >
        Are you a
      </Text>

      <View style={styles.container}>
        <View style={{ flexDirection: "row", alignSelf: "center" }}>
          {/* <Image
            source={require("../assets/tutoricon.png")}
            style={{
              width: 50,
              height: 50,
              borderRadius: 50,
              marginTop: 20,
              marginRight: 20,
            }}
          /> */}
          <TouchableOpacity
            style={styles.options}
            onPress={() => {
              TutorProfile();
            }}
          >
            <Text style={styles.optiontext}>Tutor</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "row", alignSelf: "center" }}>
          <Image
            source={require("../assets/studenticon.png")}
            style={{
              width: 50,
              height: 50,
              borderRadius: 50,
              marginTop: 20,
              marginRight: 20,
              backgroundColor: "orange"
            }}
          />
          <TouchableOpacity
            style={styles.options}
            onPress={() => {
              StudentProfile();
            }}
          >
            <Text style={styles.optiontext}> Tutee</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    margin: 70,
    marginTop: "5%",
    alignItems: "baseline",
    justifyContent: "flex-end"
  },
  optiontext: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    fontSize: 18,
    color: "black"
  },

  options: {
    width: "70%",
    borderRadius: 25,
    height: 45,
    marginTop: 20,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    color: "black",
    alignItems: "center",
    backgroundColor: "#fdc500"
  },

  userinfo: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
    color: "white"
  }
});
