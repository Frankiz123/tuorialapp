import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import TuteeAccount from "../Tutee/TuteeAccount";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createStackNavigator } from "@react-navigation/stack";
import Tutor from "../Tutor/Tutor";
import TutorProfile from "../Tutor/TutorProfile";
import { NavigationContainer } from "@react-navigation/native";
import Earnings from "../Tutor/Earnings";
import TutorSchedule from "../Tutor/TutorSchedule";
import Reviews from "../Tutor/Reviews";
import Requests from "../Tutor/Requests";
import TutorSkills from "../Tutor/TutorSkills";
import TutorSessions from "../Tutor/TutorSessions";
//CODE ADDED BY UDDIPAN
import TutorSessionsTest from "../Tutor/TutorSessionsTest";
//CODE ADDED BY UDDIPAN
import Organizations from "../Tutor/Organization";
import TutorEducation from "../Tutor/TutorEducation";
import Endorsements from "../Tutor/Endorsements";
import PromoVideo from "../Tutor/PromoVideo";
import TuteeProfile from "../Tutee/TuteeProfile";
import BiddingDetails from "../Tutor/BiddingDetails";
import BiddingsProgress from "../Tutee/BiddingsProgress";
import CrowdFundingEvent from "../Tutee/CrowdFundingEvent";
import TempTuteeNavigator from "../Tutee/TempTuteeNavigator";
import AcceptBidding from "../Tutor/AcceptBidding";
import SplashScreen from "./SplashScreen";
import { enableScreens } from "react-native-screens";
import TutorReferrals from "../Tutor/TutorReferrals";
import Samples from "../Tutor/Samples";
import UpdateProfile from "../Tutee/UpdateProfile";
import firestore from "@react-native-firebase/firestore";
import FullScreenImage from "../Tutee/FullScreenImage";

enableScreens(true);
const Stack = createStackNavigator();

export default function GoToType(props) {
  const {
    userUpdate,
    userData,
    userDetail,
    userDesc,
    userPreference,
    userInterests,
    updateLogged
  } = props;
  const [valuetype, setvalue] = useState("");
  const [iscombined, setcombined] = useState("");
  const [loading, setloading] = useState(true);

  //gets the locally stored value of whether a user has chosen to be on EARN side or LEARN

  useEffect(() => {
    storageGet("Type");
  }, []);
  const storageGet = async (key) => {
    try {
      const result = await AsyncStorage.getItem("Type");
      setvalue(result);

      if (result === "Tutor") {
        setloading(false);
        firestore()
          .collection("Users")
          .doc(props.userData.ID)
          .update({ Type: result });
      } else {
        setloading(false);
        firestore()
          .collection("Users")
          .doc(props.userData.ID)
          .update({ Type: "Tutee" });
      }

      return result;
    } catch (error) {
      console.log(error);
    }
  };
  let value = storageGet("Type");
  const updateValue = (typevalue) => {
    setvalue(typevalue);
  };
  if (loading === true) {
    return <ActivityIndicator></ActivityIndicator>;
  }
  return (
    <Stack.Navigator headerMode="none">
      {/* SKIP FOR V1 */}
      {/* {valuetype === "Tutor" ? ( */}
      {valuetype === "Tutor" ? (
        <>
          <Stack.Screen
            name="Tutor"
            children={() => (
              <Tutor
                userData={userData}
                updateLogged={updateLogged}
                updateType={updateValue}
                usertype={valuetype}
              />
            )}
            options={{
              headerBackTitleVisible: false,
              headerLeft: () => {
                return null;
              }
            }}
          />
          <Stack.Screen
            name="Profile"
            children={() => (
              <TutorProfile userData={userData} updateLogged={updateLogged} />
            )}
            options={{ title: "Profile" }}
          />
          <Stack.Screen
            name="Account"
            children={() => (
              <Account userData={userData} updateLogged={updateLogged} />
            )}
            options={{ title: "Account" }}
          />
          <Stack.Screen
            name="Schedule"
            children={() => <TutorSchedule userData={userData} />}
            options={{ title: "Schedule" }}
          />
          <Stack.Screen
            name="Ratings"
            children={() => <Reviews userData={userData} />}
            options={{ title: "Reviews" }}
          />
          <Stack.Screen
            name="Requests"
            children={() => <Requests userData={userData} />}
            options={{ title: "Notifications" }}
          />
          <Stack.Screen
            name="Skills"
            children={() => <TutorSkills userData={userData} />}
            options={{ title: "Skills" }}
          />
          <Stack.Screen
            name="Details"
            children={() => <Details userData={userData} />}
            options={{ title: "Details" }}
          />
          <Stack.Screen
            name="Earnings"
            children={() => <Earnings userData={userData} />}
            options={{ title: "Earnings" }}
          />
          <Stack.Screen
            name="TutorSessions"
            children={() => <TutorSessions userData={userData} />}
            options={{ title: "Tutor Sessions" }}
          />
          {/* CODE ADDED BY UDDIPAN */}
          <Stack.Screen
            name="TutorSessionsTest"
            children={() => <TutorSessionsTest userData={userData} />}
            options={{ title: "Tutor Sessions" }}
          />
          {/* CODE ADDED BY UDDIPAN */}
          <Stack.Screen
            name="Organisation"
            children={() => <Organizations userData={userData} />}
            options={{ title: "Tutor Sessions" }}
          />
          <Stack.Screen
            name="TutorEducation"
            children={() => <TutorEducation userData={userData} />}
            options={{ title: "Tutor Sessions" }}
          />
          <Stack.Screen
            name="Endorsements"
            children={() => <Endorsements userData={userData} />}
            options={{ title: "Tutor Sessions" }}
          />
          <Stack.Screen
            name="PromoVideo"
            children={() => <PromoVideo userData={userData} />}
          />
          <Stack.Screen
            name="BiddingDetails"
            children={() => <BiddingDetails userData={userData} />}
          />
          <Stack.Screen
            name="AcceptBidding"
            children={() => <AcceptBidding userData={userData} />}
          />
          <Stack.Screen
            name="TutorReferrals"
            children={() => <TutorReferrals userData={userData} />}
          />
          <Stack.Screen
            name="Samples"
            children={() => <Samples userData={userData} />}
          />
          <Stack.Screen
            name="CrowdFundingEvent"
            children={() => <CrowdFundingEvent userData={userData} />}
          />
          <Stack.Screen
            name="UpdateProfile"
            children={() => (
              <UpdateProfile
                userData={userData}
                userUpdate={(profile) => userUpdate(profile)}
              />
            )}
          />
        </>
      ) : (
        <>
          {/* <Stack.Screen
            name="SplashScreen"
            children={() => (
              <SplashScreen
                userData={userData}
                updateType={updateValue}
                usertype={valuetype}
                updateLogged={updateLogged}
              />
            )}
            options={{ headerShown: false }}
          /> */}
          <Stack.Screen
            name="Student"
            children={() => (
              <TuteeAccount
                userData={userData}
                updateType={updateValue}
                usertype={valuetype}
                updateLogged={updateLogged}
              />
            )}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Profile"
            children={() => (
              <TuteeProfile
                userData={userData}
                updateType={updateValue}
                usertype={valuetype}
                updateLogged={updateLogged}
              />
            )}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="FullScreenImage"
            children={() => <FullScreenImage />}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="BiddingDetails"
            children={() => <BiddingDetails userData={userData} />}
          />
          <Stack.Screen
            name="BiddingsProgress"
            children={() => <BiddingsProgress userData={userData} />}
          />
          <Stack.Screen
            name="CrowdFundingEvent"
            children={() => <CrowdFundingEvent userData={userData} />}
          />
          <Stack.Screen
            name="UpdateProfile"
            children={() => (
              <UpdateProfile
                userData={userData}
                userUpdate={(profile) => userUpdate(profile)}
              />
            )}
          />
          <Stack.Screen
            name="Ratings"
            children={() => <Reviews userData={userData} />}
            options={{ title: "Reviews" }}
          />
          <Stack.Screen
            name="Earnings"
            children={() => <Earnings userData={userData} />}
            options={{ title: "Earnings" }}
            initialParams={{ usersType: "Tutee" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
