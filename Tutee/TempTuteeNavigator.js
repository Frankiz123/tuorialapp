import React, { useContext, useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Alert
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Notifications from "./Notifications.js";
import { MaterialIcons } from "@expo/vector-icons";
import Home from "./Home";
import TuteeReferral from "./TuteeReferral";
import UpcomingSessions from "./UpcomingSessions.js";
import TuteeProfile from "./TuteeProfile.js";
import TutorSessions from "../Tutor/TutorSessions.js";
import Tallet from "./Tallet";
import SessionStack from "./SessionStack";
import TempPage from "./TempPage";

import firestore from "@react-native-firebase/firestore";
const Tab = createBottomTabNavigator();
const slides = [
  {
    key: "s1",
    title: "Find a tutor",
    text: "Search for a specific category or write your own",
    image: require("../assets/findstudents.png"),

    backgroundColor: "#B4EBCA"
  },
  {
    key: "s2",
    title: "Book a meeting",
    text: "Book a tutor for a ONE on ONE zoom session",
    image: require("../assets/meetingbook.png"),

    backgroundColor: "#D9F2B4"
  },
  {
    key: "s3",
    title: "Rate your experience",
    text: "Give feedback on your experience with the tutor",
    image: require("../assets/feedback.png"),

    backgroundColor: "#FFB7C3"
  }
];
export default function TempTuteeNavigator(props) {
  const {
    userData,
    updateType,
    usertype,
    updateLogged,
    usercombined,
    updateCombined
  } = props;
  const [showApp, SetRealApp] = useState(false);
  const [detail, SetDetails] = useState("");
  const [preferences, SetPreferences] = useState([]);
  const ref = firestore().collection("Users");

  /*const query =  usersCollection.collection('Users').doc(userData.ID);
        query.get().then(querySnapShot => { 
          console.log('its', querySnapShot.data().Status)
          
            if(querySnapShot.data().Status==true){
            console.log('exists', querySnapShot.data());
            SetRealApp(true);
        }   
          else {
            SetRealApp(false)
            console.log('doesnt exist')
            
          }
        }) */
  const updateDetail = (data) => {
    SetDetails(data);
    console.log("Auth nav: ", data);
  };
  const updateInterests = (interests) => {
    SetPreferences(interests);
  };

  console.log("tutor interests", userData.Preferences);

  const _onDone = () => {
    SetRealApp(true);
  };
  const _onSkip = () => {
    SetRealApp(true);
  };
  const renderItems = ({ item }) => {
    return (
      <View style={styles.slide}>
        <Text style={styles.title}>{item.title}</Text>
        <Image
          source={item.image}
          style={{ width: 200, height: 200, marginTop: 20 }}
        />
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  };

  const _renderDoneButton = () => {
    return (
      <Text
        style={{
          fontSize: 20,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 10,
          color: "white"
        }}
      >
        {" "}
        Done{" "}
      </Text>
    );
  };
  const _renderNextButton = () => {
    return (
      <Text
        style={{
          fontSize: 20,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 10,
          color: "white"
        }}
      >
        {" "}
        Next{" "}
      </Text>
    );
  };
  const _renderSkipButton = () => {
    return (
      <Text
        style={{
          fontSize: 20,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 10,
          color: "white"
        }}
      >
        {" "}
        Skip{" "}
      </Text>
    );
  };

  function Alertbox() {
    Alert.alert("Disabled.");
  }

  return (
    <Tab.Navigator
      initialRouteName="Home"
      lazy={true}
      tabBarOptions={{
        activeTintColor: "#F1C411",
        inactiveBackgroundColor: "#101820FF",
        activeBackgroundColor: "#101820FF"
      }}
    >
      <Tab.Screen
        name="Home"
        children={() => (
          <TempPage
            userData={userData}
            updateType={updateType}
            usertype={usertype}
          />
        )}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          )
        }}
      />
      <Tab.Screen
        name="Tallet"
        children={() => (
          <TempPage
            userData={userData}
            updateType={updateType}
            usertype={usertype}
          />
        )}
        options={{
          tabBarLabel: "Tallet",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="wallet" color={color} size={size} />
          )
        }}
      />
      <Tab.Screen
        name="Sessions"
        children={() => console.log("wow")}
        options={{
          tabBarLabel: "Sessions",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="event" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="Notifications"
        children={() => console.log("wow")}
        options={{
          tabBarLabel: "Notifications",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bell" size={size} color={color} />
          )
        }}
      />
      {/* <Tab.Screen
        name="Referrals"
        children={() => console.log("wow")}
        options={{
          tabBarLabel: "Links",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-multiple-plus"
              size={size}
              color={color}
            />
          ),
        }}
      /> */}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(0, 0, 0, 0)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#101820FF"
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 35,
    top: 20
  },
  text: {
    marginTop: 30,
    color: "white",
    textAlign: "center",
    fontSize: 15
  },
  title: {
    fontSize: 22,
    color: "white",
    textAlign: "center"
  }
});
