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
  ActivityIndicator,
  Dimensions,
  Alert,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { SearchBar, Card } from "react-native-elements";
import { TextInput } from "react-native-gesture-handler";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Feather";
import moment from "moment";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ToggleSwitch from "toggle-switch-react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import TuteeAccount from "../Tutee/TuteeAccount";
import { MaterialIcons } from "@expo/vector-icons";
import * as demodata from "../demodata.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import { useLinkProps, useNavigation } from "@react-navigation/native";

import firestore from '@react-native-firebase/firestore';
export default function Requests(props) {
  const { userData } = props;
  const route = useRoute();

  const ref = firestore().collection("Requests");
  const [array, setArray] = useState([]);
  const [isOn, setisOn] = useState(false);
  const [date, setDate] = useState("");
  const [isvisible, setVisible] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requeststatus, setrequestStatus] = useState(false);
  const [password, setPassword] = useState("");
  const [meetingID, setMeetingID] = useState("");
  const [studentID, setStudentID] = useState("");
  const [meetingarr, setmeetingarr] = useState([]);
  const [freerequest, setfreerequest] = useState([]);
  const [chosenMode, setChosenMode] = useState(false);
  const [timings, settimings] = useState(false);
  const [timevisibility, setTimePickerVisibility] = useState(false);
  const [datevisible, setDateVisibility] = useState(false);
  const [timeslot, setStartTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [average, setaverage] = useState("");
  const [title, settitle] = useState("");
  const [endorsementCount, setendorsementCount] = useState(0);
  const [endorsedArray, setendorsedArray] = useState([]);
  var studentlist = [];
  var MeetingInfo = [];
  var number;
  const newkey = [];
  const newList = [];
  var dataset;
  var newobj;
  var filtered;
  const updatedobj = [];

  const [earnings, setbool] = useState(true);
  const [profile, setbool1] = useState(true);
  const [account, setbool2] = useState(true);

  const navigation = useNavigation();

  const [name, setname] = useState("");

  useEffect(() => {
    var unsubscribe = firestore()
      .collection("Users")
      .doc(props.userData.ID)
      .onSnapshot((querySnapShot) => {
        if (querySnapShot.exists) {
          setname(querySnapShot.data().Name);
          let tutorAVG = (
            Math.round(querySnapShot.data().TotalAverage * 100) / 100
          ).toFixed(2);
          setaverage(tutorAVG);
          settitle(querySnapShot.data().Title);
          setendorsementCount(querySnapShot.data().EndorsementCount);
          setendorsedArray(querySnapShot.data().Endorsements);
        }
      });
    return () => {
      unsubscribe;
    };
  }, []);

  console.log("outside", requeststatus);
  return (
    <View style={{ flex: 0 }}>
      <View style={{ backgroundColor: "black", height: 180 }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Tutor")}
          style={{
            justifyContent: "flex-end",
            alignSelf: "flex-end",
            right: 10,
            position: "absolute",
            top: 23,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              width: 35,
              height: 35,
              borderRadius: 35,

              justifyContent: "center",
              alignSelf: "flex-end",
            }}
          >
            <MaterialIcons
              name="home"
              size={25}
              style={{ alignSelf: "center" }}
              color={"black"}
            />
          </View>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            marginTop: 29,
            height: "auto",
            alignSelf: "center",
            width: "100%",
          }}
        >
          <View
            style={{
              flexDirection: "column",
              width: "100%",
              alignSelf: "center",
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  color: "white",
                  alignSelf: "flex-start",
                  right: 0,
                  fontSize: 15,
                  left: 5,
                }}
              >
                Your
              </Text>
              <Text
                style={{
                  color: "#fdc500",
                  alignSelf: "flex-start",
                  right: 0,
                  fontSize: 15,
                  left: 9,
                  fontWeight: "bold",
                }}
              >
                AUTO-TALENTS ENDORESMENTS.
              </Text>
            </View>
            <Text
              style={{
                color: "white",
                alignSelf: "flex-start",
                right: 0,
                fontSize: 15,
                left: 5,
              }}
            >
              These endorsements are a result of a high review scores received
              from previously conducted sessions.
            </Text>
            <View style={{ flexDirection: "row", top: 5, left: 5 }}></View>
            <TouchableOpacity
              style={{
                alignSelf: "center",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                left: 0,
                top: 15,
              }}
            >
              <View style={{ flexDirection: "row", width: 75, height: 75 }}>
                <Image
                  source={{ uri: props.userData.Photo }}
                  style={{
                    width: 70,
                    height: 70,
                    alignSelf: "center",
                    borderRadius: 35,
                  }}
                />
                <View
                  style={{
                    backgroundColor: "red",
                    width: 20,
                    height: 20,
                    borderRadius: 15,
                    justifyContent: "center",
                    position: "absolute",
                    right: 0,
                    top: 0,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      alignSelf: "center",
                      color: "white",
                    }}
                  >
                    {endorsementCount}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  bottom: 15,
                  backgroundColor: "white",
                  borderRadius: 20,
                  justifyContent: "center",
                  flexDirection: "row",
                  width: 50,
                  alignSelf: "center",
                }}
              >
                <Text style={{ alignSelf: "center" }}> {average}</Text>
                <MaterialIcons
                  name="star"
                  style={{ color: "black", alignSelf: "center" }}
                />
              </View>
              <Text
                style={{
                  color: "white",
                  width: "auto",
                  alignSelf: "center",
                  fontSize: 16,
                  bottom: 10,
                }}
              >
                {title} {name}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Card
          containerStyle={{
            shadowColor: "grey",
            shadowOpacity: 0.5,
            shadowOffset: { width: 2, height: 2 },
            height: "85%",
            backgroundColor: "white",
            borderColor: "white",
            width: Dimensions.get("screen").width,
            right: 15,
          }}
        >
          <Card.Title style={{ textAlign: "left" }}>
            <Text style={{ marginTop: 5, fontSize: 16, color: "black" }}>
              {" "}
              Endorsements{" "}
            </Text>
          </Card.Title>

          <Card.Divider style={{ backgroundColor: "black" }} />
          <FlatList
            data={endorsedArray}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              return (
                <View
                  style={{
                    flexDirection: "column",
                    width: "100%",
                    marginRight: 30,
                    height: "auto",
                    borderRadius: 10,
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <View
                      style={{
                        alignSelf: "center",
                        backgroundColor: "#fdc500",
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        justifyContent: "center",
                      }}
                    >
                      <Image
                        source={{ uri: item.TuteePic }}
                        style={{ width: 40, height: 40, borderRadius: 20 }}
                      />
                    </View>
                    <View style={{ flexDirection: "column" }}>
                      {item.TuteeName !== undefined ? (
                        <Text
                          style={{
                            height: "auto",
                            width: "80%",
                            textAlign: "left",
                            marginLeft: 10,
                          }}
                        >
                          {item.TuteeName}'s review score resulted in an
                          endorsement for:
                        </Text>
                      ) : (
                        <Text
                          style={{
                            height: "auto",
                            width: "70%",
                            textAlign: "left",
                            marginLeft: 10,
                          }}
                        >
                          Anonymous' review resulted in an endorsement for:
                        </Text>
                      )}
                      <Text
                        style={{
                          height: "auto",
                          width: "70%",
                          textAlign: "left",
                          marginLeft: 10,
                          fontWeight: "bold",
                        }}
                      >
                        {item.EndorsedTalent}
                      </Text>
                    </View>
                  </View>
                  <Card.Divider />
                </View>
              );
            }}
          />
        </Card>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  column: {
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
  },

  selectTimings: {
    borderRadius: 5,
    shadowColor: "grey",
    shadowOpacity: 0.5,
    shadowOffset: { width: 5, height: 5 },
    backgroundColor: "black",
    marginLeft: 15,
  },
  datePickerStyle: {
    width: 120,
    marginRight: 10,
    marginTop: 5,
  },
});
