import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Image, Animated, Dimensions } from "react-native";
import AuthNavigator from "./AuthNavigation/AuthNavigator";
import { TourGuideProvider } from "rn-tourguide";
import OneSignal from "react-native-onesignal";
import {
  GoogleSignin,
  statusCodes
} from "@react-native-google-signin/google-signin";
const { height } = Dimensions.get("screen");
export default function App() {
  // OneSignal.setLogLevel(6, 0);
  // OneSignal.setAppId("ac22727f-6311-4f71-942a-b877b92f7aa8");
  // OneSignal.promptForPushNotificationsWithUserResponse((response) => {
  //   console.log("Prompt response:", response);
  // });

  // OneSignal.setNotificationWillShowInForegroundHandler(
  //   (notificationReceivedEvent) => {
  //     console.log(
  //       "OneSignal: notification will show in foreground:",
  //       notificationReceivedEvent
  //     );
  //     let notification = notificationReceivedEvent.getNotification();
  //     console.log("notification: ", notification);
  //     const data = notification.additionalData;
  //     console.log("additionalData: ", data);
  //     // Complete with null means don't show a notification.
  //     notificationReceivedEvent.complete(notification);
  //   }
  // );

  // OneSignal.setNotificationOpenedHandler((notification) => {
  //   console.log("OneSignal: notification opened:", notification);
  // });

  const [isloaded, setloaded] = useState(true);
  const animatedmargin = useRef(new Animated.Value(0)).current;
  const fadeanimation = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    // GoogleSignin.configure({
    //   webClientId:
    //     "436192046181-4q4lvebitiqi2ss43gu0p0vf8vlnkh2o.apps.googleusercontent.com"
    //   // if you want to access Google API on behalf of the user FROM YOUR SERVER
    //   // iosClientId: GOOGLE_OAUTH_KEY_IOS, // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    // });
    Animated.timing(animatedmargin, {
      toValue: height / 2 - 170,
      duration: 1000,
      useNativeDriver: false,
      delay: 400
    }).start(() => {
      Animated.timing(fadeanimation, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: false
      }).start(() => {
        setloaded(false);
      });
    }, []);
  });

  return isloaded ? (
    <TourGuideProvider {...{ borderRadius: 16 }}>
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.animated,
            { top: animatedmargin, opacity: fadeanimation }
          ]}
        >
          <Image
            source={require("./assets/logopt1.png")}
            style={{
              width: 200,
              height: 100,
              justifyContent: "center",
              alignItems: "center",
              resizeMode: "contain"
            }}
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.animated,
            { bottom: animatedmargin, opacity: fadeanimation }
          ]}
        >
          <Image
            source={require("./assets/logo2.png")}
            style={{
              width: 350,
              height: 200,
              justifyContent: "center",
              alignItems: "center",
              resizeMode: "contain"
            }}
          />
        </Animated.View>
      </View>
    </TourGuideProvider>
  ) : (
    <AuthNavigator />
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
