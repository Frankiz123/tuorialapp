import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import GoToType from "./GoToType";
import Chat from "../Chat/Chat";
import CustomPackages from "../Chat/CustomPackages";
import ChatListing from "../Chat/ChatListing";
import Login from "./Login";
import SetUp from "./SetUp";
import { enableScreens } from "react-native-screens";
enableScreens(true);

import { ActivityIndicator } from "react-native";

const Stack = createStackNavigator();

import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

export default function AuthNavigator(props) {
  const [isLoggedin, setLoggedIn] = useState(false);
  const [userData, setuserData] = useState({});
  const [loading, setloading] = useState(true);
  const updateData = (data) => {
    setuserData(data);
  };
  function validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  useEffect(() => {
    const authlistener = auth().onAuthStateChanged((user) => {
      console.log(user, "--->");
      if (user === null) {
        setLoggedIn(false);
        setloading(false);
        //
      } else {
        console.log("USER is authenticated!");
        let uid;
        user.providerData.map((item, i) => (uid = item.uid));
        console.log("uid", uid);
        if (true) {
          if (!validateEmail(uid)) {
            const query = firestore().collection("Users").doc(uid);
            query.get().then((querySnapShot) => {
              if (querySnapShot.exists) {
                console.log("EXISTS ", querySnapShot.data());
                updateData(querySnapShot.data());
                setLoggedIn(true);
                setloading(false);
              } else {
                setloading(false);
              }
            });
          } else {
            const ref = firestore().collection("Users");
            ref
              .where("Email", "==", uid)
              .get()
              .then((querySnapshot) => {
                let obj = {};
                querySnapshot.forEach((doc) => {
                  obj = doc.data();
                });
                updateData(obj);
                setLoggedIn(true);
                setloading(false);
              })
              .catch((err) => {
                console.log(err);
              });
          }
          //CODE ADDED BY UDDIPAN
        }
      }
    });
    return authlistener;
  }, []);

  //for checking if user signed up or not
  const updateLoggedIn = (loggedin) => {
    setLoggedIn(loggedin);
  };
  if (loading === true) {
    return <ActivityIndicator></ActivityIndicator>;
  }
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none">
        {isLoggedin ? (
          <>
            <Stack.Screen name="GoToType">
              {(props) => (
                <GoToType
                  {...props}
                  updateLogged={updateLoggedIn}
                  userUpdate={updateData}
                  userData={userData}
                />
              )}
            </Stack.Screen>
            {/* CODE ADDED BY UDDIPAN */}
            <Stack.Screen name="Chat">
              {(props) => (
                <Chat
                  {...props}
                  updateLogged={updateLoggedIn}
                  userUpdate={updateData}
                  userData={userData}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="ChatListing">
              {(props) => (
                <ChatListing
                  {...props}
                  updateLogged={updateLoggedIn}
                  userUpdate={updateData}
                  userData={userData}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="CustomPackages">
              {(props) => (
                <CustomPackages
                  {...props}
                  updateLogged={updateLoggedIn}
                  userUpdate={updateData}
                  userData={userData}
                />
              )}
            </Stack.Screen>
            {/* CODE ADDED BY UDDIPAN */}
          </>
        ) : (
          <>
            <Stack.Screen name="Login">
              {(props) => (
                <Login
                  {...props}
                  updateLogged={updateLoggedIn}
                  userUpdate={updateData}
                  userData={userData}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="SetUp">
              {(props) => (
                <SetUp
                  {...props}
                  updateLogged={updateLoggedIn}
                  userUpdate={updateData}
                  userData={userData}
                />
              )}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
