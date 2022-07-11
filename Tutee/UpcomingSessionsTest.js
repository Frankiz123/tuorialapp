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
  Alert,
  PermissionsAndroid,
} from "react-native";
import { Card, ListItem, Button, List } from "react-native-elements";
import { AntDesign } from "@expo/vector-icons";
import { useLinkProps, useNavigation } from "@react-navigation/native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import * as Notifications from "expo-notifications";
import Icon from "react-native-vector-icons/Feather";
import { MaterialIcons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import * as ImagePicker from "expo-image-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Modal from "react-native-modal";
import ModalDropdown from "react-native-modal-dropdown";
import moment from "moment";
import * as FileSystem from "expo-file-system";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";
import { requestOneTimePayment, requestBillingAgreement } from 'react-native-paypal';
import SendNotification from "../utils/SendNotification";

import firestore from '@react-native-firebase/firestore';

import DenyModal from "../components/Sessions/DenyModal";
const Tab = createMaterialTopTabNavigator();
export default function Earnings(props) {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [upcoming, isUpcoming] = useState(true);
  const [isprofile, setprofile] = useState(false);
  const [tuteeData, setData] = useState([]);
  const [hoursleft, sethoursleft] = useState("");
  const [showDenyModal, setShowDenyModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState({});

  // CODE ADDED BY UDDIPAN
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  // CODE ADDED BY UDDIPAN
  const video = React.useRef(null);

  let List;

  const string = hoursleft.split(",");
  const fetchUpcomingSessions = async () => {
    await firestore()
      .collection("Requests")
      .onSnapshot((querySnapShot) => {
        let list = [];
        querySnapShot.forEach((doc) => {
          const { Requests } = doc.data();
          if (Requests.filter(req => req.StudentID === props.userData.ID).length) {
            Requests.map(req => {
              req.id = doc.id;
            })
            list = Requests;
          }
        });
        setUpcomingEvents([...list])
      });
  }
  useEffect(() => {
    fetchUpcomingSessions();
  }, [])
  const handlePayment = async (item, index) => {
    await firestore()
      .collection("Users")
      .doc(item.id)
      .get()
      .then(async (tutorSnapshot) => {
        const tutorInfo = tutorSnapshot.data();
        let amountAfterComission = tutorInfo.Rate + ((tutorInfo.Rate * 7.5) / 100);
        const {
          nonce,
          payerId,
          email,
          firstName,
          lastName,
          phone
        } = await requestOneTimePayment(
          "sandbox_8hcps3nb_5jzrrgvqbr3ny2qs",
          {
            amount: String(amountAfterComission),
            currency: 'USD',
            localeCode: 'en_US',
            shippingAddressRequired: false,
            userAction: 'commit',
            intent: 'authorize',
          }
        );
        console.log(nonce,
          payerId,
          email,
          firstName,
          lastName,
          phone);

        await firestore()
          .collection("Requests")
          .doc(item.id)
          .get()
          .then((querySnapShot) => {
            if (querySnapShot.exists) {
              let requests = querySnapShot.data().Requests;
              requests[index].Status = "ongoing";
              querySnapShot.ref.update({ Requests: requests });

              let tuteeId = props.userData.ID;
              let tutorId = item.id;
              let escrowId = "";
              if (tuteeId < tutorId) {
                escrowId = tuteeId + tutorId;
              }
              else {
                escrowId = tutorId + tuteeId;
              }
              firestore()
                .collection("Escrow").doc(escrowId).set({
                  tutorId,
                  tuteeId,
                  amount: tutorInfo.Rate,
                  status: "blocked",
                  created_on: Date.now(),
                });
            }
          })
          .catch((err) => {
            console.log(err);
          })
      })
      .catch((err) => {
        alert("Something went wrong")
      })
  }
  const releasePayment = async (item, index) => {
    await firestore()
      .collection("Requests")
      .doc(item.id)
      .get()
      .then((querySnapShot) => {
        if (querySnapShot.exists) {
          let requests = querySnapShot.data().Requests;
          requests[index].Status = "completed";
          querySnapShot.ref.update({ Requests: requests });

          let tuteeId = props.userData.ID;
          let tutorId = item.id;
          let escrowId = "";
          if (tuteeId < tutorId) {
            escrowId = tuteeId + tutorId;
          }
          else {
            escrowId = tutorId + tuteeId;
          }
          firestore()
            .collection("Escrow").doc(escrowId).update({
              status: "released",
              completed_on: Date.now(),
            });

          firestore()
            .collection("Escrow").doc(escrowId).get().then((escrowSnapshot) => {
              const escrowInfo = escrowSnapshot.data();
              let amountAfterComission = escrowInfo.amount - ((escrowInfo.amount * 17.5) / 100);
              escrowSnapshot.ref.update({
                status: "released",
                completed_on: Date.now(),
              })
              firestore()
                .collection("Users").doc(item.id).get()
                .then((userSnapShot) => {
                  const tutorInfo = userSnapShot.data();
                  userSnapShot.ref.update({
                    Balance: tutorInfo.Balance + amountAfterComission
                  })
                })
              SendNotification(`You have received $${amountAfterComission} in your wallet`, [item.id])
            })
        }
      })
      .catch((err) => {
        console.log();
        // reject(err);
      })
  }
  const handleDeny = async (item) => {
    setSelectedSession(item);
    setShowDenyModal(true);
  }
  return (
    <SafeAreaView
      style={{
        backgroundColor: "black",
        height: "100%",
        paddingTop: Platform.OS === "android" ? 25 : 0,
      }}
    >
       <View
        onLayout={(event) => {
          var { x, y, width, height } = event.nativeEvent.layout;
          console.log("view height", height);
        }}
        style={{ backgroundColor: "black", height: 190 }}
      >
        <View
          style={{
            alignSelf: "flex-end",
            position: "absolute",
            right: 2,
            zIndex: 1,
          }}
        >
          {/* <TouchableOpacity
            onPress={() => submitToggle()}
            style={{ justifyContent: "flex-end", alignSelf: "flex-end" }}
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
          </TouchableOpacity> */}
        </View>

        <View style={{ flexDirection: "row", top: 0 }}>
          <Text
            style={{
              color: "white",
              left: 10,
              top: 0,
              fontSize: 15,
            }}
          >
            Your
          </Text>
          <Text
            style={{
              color: "#fdc500",
              left: 10,
              top: 0,
              fontSize: 15,
              fontWeight: "bold",
            }}
          >
            {" "}
            SESSIONS.
          </Text>
        </View>
        <Text style={{ color: "white", left: 10, fontSize: 15, top: 0 }}>
          Add, View or Edit Sessions Info.
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            top: 190 / 5,
            right: 5,
          }}
        >
          <View
            style={{
              flexDirection: "column",
              alignSelf: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => openPrevious()}
              style={{
                backgroundColor: "#fdc500",
                alignSelf: "center",
                borderRadius: 35,
                height: 55,
                width: 55,
                justifyContent: "center",
              }}
            >
              <MaterialIcons
                name="skip-previous"
                size={40}
                style={{ alignSelf: "center", color: "black" }}
              />
            </TouchableOpacity>
            <View
              style={{
                backgroundColor: "red",
                width: 25,
                height: 25,
                borderRadius: 15,
                justifyContent: "center",
                position: "absolute",
                left: 38,
                top: -8,
              }}
            >
              <Text
                style={{ fontSize: 14, alignSelf: "center", color: "white" }}
              >
                0
              </Text>
            </View>
            <Text
              style={{
                color: "white",
                alignSelf: "center",
                bottom: 0,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {" "}
              Previous{" "}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "column",
              alignSelf: "center",
              width: "auto",
              bottom: 5,
            }}
          >
            <TouchableOpacity
              onPress={() => openUpcoming()}
              style={{
                backgroundColor: "#fdc500",
                alignSelf: "center",
                borderRadius: 35,
                height: 70,
                width: 70,
                justifyContent: "center",
              }}
            >
              <Image
                source={require("../assets/event.png")}
                style={{
                  width: 40,
                  height: 40,
                  alignSelf: "center",
                  resizeMode: "contain",
                }}
              />
            </TouchableOpacity>
            <View
              style={{
                backgroundColor: "red",
                width: 25,
                height: 25,
                borderRadius: 15,
                justifyContent: "center",
                position: "absolute",
                left: 46,
                top: -8,
              }}
            >
              <Text
                style={{ fontSize: 14, alignSelf: "center", color: "white" }}
              >
                0
              </Text>
            </View>
            <Text style={{ color: "white", alignSelf: "center" }}>
              Upcoming
            </Text>
          </View>
          <View
            style={{
              flexDirection: "column",
              alignSelf: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => openCrowdfunding()}
              style={{
                backgroundColor: "#fdc500",
                alignSelf: "center",
                borderRadius: 35,
                height: 55,
                width: 55,
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={require("../assets/balance.png")}
                style={{ alignSelf: "center", left: 2, width: 40, height: 40 }}
              />
            </TouchableOpacity>
            <View
              style={{
                backgroundColor: "red",
                width: 25,
                height: 25,
                borderRadius: 15,
                justifyContent: "center",
                position: "absolute",
                left: 40,
                top: -8,
              }}
            >
              <Text
                style={{ fontSize: 14, alignSelf: "center", color: "white" }}
              >
                0
              </Text>
            </View>
            <Text
              style={{
                color: "white",
                alignSelf: "center",
                width: "auto",
                textAlign: "center",
              }}
            >
              Funding
            </Text>
          </View>
        </View>
      </View>
      {upcoming && (
        <FlatList
          data={upcomingEvents}
          style={{ backgroundColor: "white" }}
          renderItem={({ item, index }) => {
            const uri = item.Document;
            const StudentID = item.StudentID;
            const tutorID = item.TutorID;
            var endtimestring = moment(item.EndTime).format("HH:mm A");
            var starttimestring = moment(item.StartTime).format("HH:mm A");
            return (
              <View style={{ alignSelf: "center" }}>
                <Text style={{ top: 10, fontSize: 20 }}>
                  {item.Month}, {item.Year}
                </Text>
                <Card
                  containerStyle={{
                    backgroundColor: "#101820FF",
                    borderColor: "#101820FF",
                    width: "auto",
                    borderRadius: 15,
                    shadowOffset: { width: 0, height: 2 },
                    shadowColor: "black",
                    shadowRadius: 2,
                    shadowOpacity: 0.5,
                  }}
                >
                  <Text
                    style={{
                      alignSelf: "flex-start",
                      right: 5,
                      fontSize: 20,
                      color: "white",
                    }}
                  >
                    {" "}
                    {item.Day}{" "}
                  </Text>
                  <Text style={{ fontSize: 14, color: "white" }}>
                    {item.Month}
                  </Text>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        color: "white",
                        top: 15,
                        right: 5,
                        fontWeight: "bold",
                      }}
                    >
                      {item.Category}
                    </Text>
                    <Icon
                      name="arrow-right"
                      size={18}
                      style={{
                        color: "white",
                        alignSelf: "center",
                        top: 15,
                        right: 2,
                      }}
                    />
                    <Text
                      style={{
                        color: "white",
                        top: 15,
                        right: 0,
                        fontWeight: "bold",
                      }}
                    >
                      {item.SubCategory}
                    </Text>
                  </View>
                  <Text style={{ marginTop: 20, right: 5, color: "#fdc500" }}>
                    {item.Topic}
                  </Text>
                  <Text style={{ marginTop: 5, right: 5, color: "white" }}>
                    {starttimestring} - {endtimestring}
                  </Text>

                  <View style={{ flexDirection: "row", marginTop: 10 }}>
                    <Text
                      style={{ alignSelf: "center", right: 5, color: "white" }}
                    >
                      With
                    </Text>
                    <TouchableOpacity onPress={() => ViewProfile(StudentID)}>
                      <Image
                        source={{ uri: item.TutorPic }}
                        style={{
                          width: 30,
                          height: 30,
                          right: 0,
                          left: 0,
                          borderRadius: 35,
                          alignSelf: "center",
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={{ alignSelf: "center" }}>
                    <Text
                      style={{
                        color: "white",
                        top: 10,
                        alignSelf: "center",
                        right: 2,
                      }}
                    >
                      Starts in:
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignSelf: "center",
                        width: "auto",
                        right: 12,
                      }}
                    >
                      {string.map((item, i) => {
                        const divided = item.split(" ");

                        return (
                          <View
                            key={i}
                            style={{
                              flexDirection: "row",
                              width: 60,
                              height: "auto",
                              alignSelf: "center",
                              paddingHorizontal: 0,
                            }}
                          >
                            <Card
                              containerStyle={{
                                backgroundColor: "white",
                                borderColor: "white",
                                width: 50,
                                height: 45,
                                borderRadius: 10,
                                justifyContent: "center",
                                alignSelf: "center",
                                marginRight: 10,
                              }}
                            >
                              <Text
                                style={{
                                  alignSelf: "center",
                                  color: "black",
                                  top: 0,
                                }}
                              >
                                {divided[0]}
                              </Text>
                            </Card>
                          </View>
                        );
                      })}
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        top: 2,
                        alignSelf: "center",
                        left: 12.5,
                      }}
                    >
                      {string.map((item, i) => {
                        const dividedstring = item.split(" ");

                        return (
                          <View
                            key={i}
                            style={{
                              width: 60,
                              alignSelf: "center",
                              right: 12,
                            }}
                          >
                            <View
                              style={{
                                width: "auto",
                                height: 25,
                                left: 0,
                                backgroundColor: "white",

                                justifyContent: "center",
                              }}
                            >
                              <Text
                                style={{
                                  color: "black",
                                  flexDirection: "row",
                                  right: 2,
                                  textAlign: "center",
                                  width: "auto",
                                }}
                              >
                                {dividedstring[1]}
                              </Text>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                  {(item.Status === "In Progress" || item.Status === "ongoing" || item.Status === "completed") ? (
                    <Text style={{ color: "#fdc500", textAlign: "center", marginTop: 10 }}>
                      {item.Status === "In Progress" ? "PENDING" : item.Status === "ongoing" ? "Ongoing" : "Completed"}
                    </Text>
                  ) : (
                    <>
                      {item.Status !== "Accepted" && (
                        <TouchableOpacity
                          onPress={() => {
                            handleDeny();
                          }}
                          style={{
                            backgroundColor: "#fdc500",
                            width: 300,
                            height: 30,
                            borderRadius: 5,
                            justifyContent: "center",
                            marginTop: 10,
                            alignSelf: "flex-start",
                          }}
                        >
                          <Text style={{ alignSelf: "center" }}>Deny</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        onPress={() => {
                          item.Status === "Accepted" ? handlePayment(item, index) : releasePayment(item, index)
                        }}
                        style={{
                          backgroundColor: "#fdc500",
                          width: 300,
                          height: 30,
                          borderRadius: 5,
                          justifyContent: "center",
                          marginTop: 10,
                          alignSelf: "flex-start",
                        }}
                      >
                        <Text style={{ alignSelf: "center" }}>{item.Status === "Accepted" ? "PAY" : "CONFIRM"}</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </Card>
                <Modal isVisible={isprofile}>
                  <View
                    style={{
                      width: "100%",
                      height: "70%",
                      backgroundColor: "black",
                      alignSelf: "center",
                      borderRadius: 15,
                      shadowColor: "grey",
                      shadowOffset: { width: 1, height: 1 },
                      shadowRadius: 1,
                      shadowOpacity: 0.5,
                      elevation: 5,
                    }}
                  >
                    <TouchableOpacity onPress={() => closePopup()}>
                      <MaterialIcons
                        name="clear"
                        size={25}
                        style={{ alignSelf: "flex-end" }}
                        color={"#fdc500"}
                      />
                    </TouchableOpacity>

                    <FlatList
                      data={tuteeData}
                      renderItem={({ item }) => {
                        return (
                          <View style={{ width: "100%" }}>
                            <Image
                              source={{ uri: item.Photo }}
                              style={{
                                width: 55,
                                height: 55,
                                alignSelf: "center",
                                borderRadius: 25,
                                top: 5,
                              }}
                            />
                            <Text
                              style={{
                                color: "white",
                                alignSelf: "center",
                                flexDirection: "row",
                                top: 10,
                                fontSize: 18,
                              }}
                            >
                              {item.Title} {item.Name}
                            </Text>
                            <View
                              style={{
                                top: 25,
                                backgroundColor: "white",
                                height: "115%",
                                width: "100%",
                                borderRadius: 10,
                                alignSelf: "center",
                              }}
                            ></View>
                          </View>
                        );
                      }}
                    />
                  </View>
                </Modal>
              </View>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
      <DenyModal visible={showDenyModal} close={()=>setShowDenyModal(false)} session={selectedSession} userData={props.userData}/>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  header: {
    top: 0,
    height: 240,
    width: "100%",
    backgroundColor: "#8dc6ff",
    alignItems: "center",
    justifyContent: "center",
  },
  textinput: {
    borderWidth: 1,
    width: "60%",
    height: 20,
    marginTop: 20,
    alignSelf: "center",
  },
});
