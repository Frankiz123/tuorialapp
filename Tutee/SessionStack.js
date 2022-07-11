import React, { useContext, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import UpcomingSessions from "./UpcomingSessions.js";
//CODE ADDED BY UDDIPAN
import UpcomingSessionsTest from "./UpcomingSessionsTest";
//CODE ADDED BY UDDIPAN

import Ratings from "./Ratings";

export default function SessionStack(props) {
  const Stack = createStackNavigator();
  const { userData } = props;
  return (
    <Stack.Navigator headerMode="none">
      {/* CODE ADDED BY UDDIPAN */}
      {/* <Stack.Screen
        name="Sessions"
        children={() => <UpcomingSessions userData={userData} />}
      /> */}
      <Stack.Screen
        name="Sessions"
        children={() => <UpcomingSessionsTest userData={userData} />}
      />
      {/* CODE ADDED BY UDDIPAN */}
      <Stack.Screen
        name="Reviews"
        children={() => <Ratings userData={userData} />}
      />
    </Stack.Navigator>
  );
}
