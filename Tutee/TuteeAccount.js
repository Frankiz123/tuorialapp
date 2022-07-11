import React, { useContext, useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableHighlight,
  TouchableOpacity
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
const Tab = createBottomTabNavigator();

export default function TuteeAccount(props) {
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
          <Home
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
          <Tallet
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
        children={() => (
          <SessionStack
            userData={userData}
            updateType={updateType}
            usertype={usertype}
          />
        )}
        options={{
          tabBarLabel: "Sessions",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="event" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="Notifications"
        children={() => (
          <Notifications userData={userData} updateType={updateType} />
        )}
        options={{
          tabBarLabel: "Notifications",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bell" size={size} color={color} />
          )
        }}
      />
      {/* <Tab.Screen
        name="Referrals"
        children={() => <TuteeReferral userData={userData} />}
        options={{
          tabBarLabel: "Links",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-multiple-plus"
              size={size}
              color={color}
            />
          )
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
