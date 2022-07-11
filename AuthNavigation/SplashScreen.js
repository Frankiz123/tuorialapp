import { StatusBar } from "expo-status-bar";
import React, { useState, Component, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Linking,
  Image,
  RecyclerViewBackedScrollView,
  ActivityIndicator,
  Animated,
  Easing,
  Dimensions
} from "react-native";

import { createSwitchNavigator, createAppContainer } from "react-navigation";
import { useLinkProps, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

// NOT IN USE FOR NOW!!
const { height } = Dimensions.get("screen");
export default function SplashScreen(props) {
  const { updateLogged, userUpdate, userData } = props;
  const [isloaded, setloaded] = useState(true);
  const navigation = useNavigation();
  const animatedmargin = useRef(new Animated.Value(0)).current;
  const animatedtop = useRef(new Animated.Value(0)).current;
  const fadeanimation = useRef(new Animated.Value(1)).current;
  const position = height / 2;
  const performTimeConsumingTask = async () => {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve("result");
      }, 2000)
    );
  };
  useEffect(() => {
    async function performTask() {
      const data = await performTimeConsumingTask();

      if (data !== null) {
        navigation.navigate("Student");
      }
    }
    performTask();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator></ActivityIndicator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#101820FF"
  },
  animated: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: 1000
  }
});
