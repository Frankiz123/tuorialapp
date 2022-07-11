import React, { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import ModalDropdown from "react-native-modal-dropdown";
import firestore from "@react-native-firebase/firestore";
import Modal from "react-native-modal";
import moment from "moment";

const BookModal = (props) => {
  //setting variables
  const [topic, settopic] = useState("");
  const [bookpopupTab, setBookpopupTab] = useState(1);
  const [filename, setfilename] = useState("");
  const [dateString, setDates] = useState({});
  const [isday, setDate] = useState("");
  const [daypicked, isdaypicked] = useState(false);
  const [istimefound, setTimeFound] = useState(false);
  const [specialrequest, setspecialrequest] = useState("");
  const [slots, setslots] = useState({});
  const [tutorid, settutorid] = useState("");
  let markedEvents = {};
  let timeSlots = [];
  const Timings = firestore().collection("Slots");
  const [TimeSlots, SetTimeSlots] = useState([]);

  const List = [];

  async function getTutorsTimings(tutorid) {
    await Timings.where("ID", "==", tutorid).onSnapshot((querySnapshot) => {
      if (querySnapshot.empty) {
        console.log("empty");
      }
      querySnapshot.forEach((documentSnapshot) => {
        List.push({ ...documentSnapshot.data(), key: documentSnapshot.id });
      });
      var key;
      var idkey;
      var obj = null;
      //get list
      for (var i = 0; i < List.length; i++) {
        const dataset = List[i].availability;
        obj = Object.values(dataset);
      }
      //var objID = Object.keys(dataset);
      const dateList = [];
      if (obj) {
        obj.forEach((snapshot) => {
          if (snapshot.booked === "false") {
            dateList.push(snapshot.dateString);
          }
          const uniqueDates = dateList.filter(
            (val, id, array) => array.indexOf(val) == id
          );
          uniqueDates.forEach((date) => {
            let dots = [];
            let markedDate = {};
            dots.push({
              color: "white",
              selectedDayBackgroundColor: "green"
            });
            markedDate["dots"] = dots;
            markedEvents[date] = {
              selected: true,
              marked: true,
              color: "#fdc500",
              day: date
            };
            setDates(markedEvents);
          });
        });
      }
    });
  }
  async function onDayPress(day) {
    let date = day.dateString;
    setDate(day.dateString);
    let markedate = day.dateString;
    let newdates = markedEvents;
    isdaypicked(true);
    await Timings.where("ID", "==", tutorid).onSnapshot((querySnapshot) => {
      const tutorLists = [];
      if (querySnapshot.empty) {
        console.log("empty");
      }
      querySnapshot.forEach((documentSnapshot) => {
        tutorLists.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id
        });
      });
      var key;
      var idkey;
      var obj = null;
      //get list
      for (var i = 0; i < tutorLists.length; i++) {
        const dataset = tutorLists[i].availability;
        obj = Object.values(dataset);
      }
      if (obj) {
        obj.forEach((snapshot) => {
          if (date === snapshot.dateString && snapshot.booked === "false") {
            timeSlots.push(snapshot);
            console.log("yes time", snapshot);
            SetTimeSlots(timeSlots);
            setTimeFound(true);
          }
        });
        let num = obj.findIndex((e) => date === e.dateString);
        console.log("number of index", num);
        if (num === -1) {
          setTimeFound(false);
        }
      }
    });
  }
  function selectTimings(item) {
    setslots(item);
  }
  useEffect(() => {
    if (props.receiverId) {
      getTutorsTimings(props.receiverId);
      settutorid(props.receiverId);
    }
  }, [props.receiverId]);
  return (
    <Modal
      isVisible={props.visible}
      style={{ width: "100%", height: "100%", right: 5 }}
    >
      <KeyboardAvoidingView
        enabled={Platform.OS === "ios" ? true : false}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          width: "95%",
          height: "150%",
          backgroundColor: "#333939",
          right: 5,
          borderRadius: 10,
          flex: 1
        }}
      >
        <TouchableOpacity onPress={() => props.close()}>
          <MaterialIcons
            name="clear"
            size={25}
            style={{ alignSelf: "flex-end" }}
            color={"#fdc500"}
          />
        </TouchableOpacity>

        <ScrollView
          scrollToOverflowEnabled={true}
          contentContainerStyle={{ flexGrow: 1, height: "130%" }}
        >
          <View style={{ height: "auto" }}>
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
                alignSelf: "center"
              }}
            >
              Add your booking details
            </Text>
            <Text
              style={{
                color: "white",
                marginTop: 10,
                fontWeight: "bold",
                textAlign: "center",
                alignSelf: "center"
              }}
            >
              {props.selectedCustomPackage?.name} (
              {props.selectedCustomPackage?.tier})
            </Text>
            <Text
              style={{
                color: "#fff9",
                fontWeight: "bold",
                textAlign: "center",
                alignSelf: "center"
              }}
            >
              Price: ${props.selectedCustomPackage?.price}, Live Sessions:{" "}
              {props.selectedCustomPackage?.totalLiveSession}, Revisions:{" "}
              {props.selectedCustomPackage?.totalRevisions}
            </Text>
            <Calendar
              onDayPress={(day) => onDayPress(day)}
              style={{
                width: "auto",
                height: "auto",
                marginTop: 10,
                borderRadius: 10
              }}
              hideExtraDays
              enableSwipeMonths={true}
              markedDates={{
                ...dateString,
                [isday]: {
                  selected: true,
                  marked: true,
                  selectedColor: "green"
                }
              }}
              theme={{
                "stylesheet.day.period": {
                  base: {
                    overflow: "hidden",
                    height: "10%"
                  },
                  wrapper: {
                    borderRadius: 2,
                    backgroundColor: "blue",
                    overflow: "hidden",
                    height: "10%"
                  }
                },
                "monthTitleTextStyle": {
                  color: "#6d95da",
                  fontWeight: "300",
                  fontSize: 16
                },

                "selectedDayBackgroundColor": "#fdc500",
                "todayTextColor": "#4d194d",
                "arrowColor": "#6d95da",
                "dayTextColor": "#6d95da",
                "textSectionTitleColor": "#6d95da"
              }}
            />

            {istimefound ? (
              <View
                style={{
                  flexDirection: "column",
                  marginTop: 10,
                  width: "auto",
                  marginRight: 20
                }}
              >
                {TimeSlots.map((item, i) => {
                  var endtimestring = moment(item.endTime).format("hh:mm a");
                  var starttimestring = moment(item.startTime).format(
                    "hh:mm a"
                  );

                  const startTime = new Date(item.startTime).toLocaleTimeString(
                    "en-US"
                  );
                  const endTime = new Date(item.endTime).toLocaleTimeString(
                    "en-US"
                  );
                  return (
                    <TouchableOpacity
                      key={i}
                      onPress={() => selectTimings(item)}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          width: 150,
                          height: 30,
                          backgroundColor: slots === item ? "green" : "#fdc500",

                          borderRadius: 10,
                          marginTop: 5
                        }}
                      >
                        <Text
                          style={{
                            color: "black",
                            alignSelf: "center",
                            paddingHorizontal: 5
                          }}
                        >
                          {starttimestring}-{endtimestring}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
            <Text style={{ color: "white", marginTop: 0, textAlign: "center" }}>
              Topic:
            </Text>
            <TextInput
              style={styles.TextInput}
              onChangeText={(text) => settopic(text)}
              value={topic}
            />
            <Text
              style={{ color: "white", marginTop: 10, textAlign: "center" }}
            >
              Special request:
            </Text>
            <TextInput
              multiline={true}
              style={{
                borderWidth: 2,
                marginTop: 5,
                borderColor: "#e8a80c",
                height: "8%",
                textAlign: "justify",
                color: "white"
              }}
              onChangeText={(text) => setspecialrequest(text)}
              value={specialrequest}
            />
            <View
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row"
              }}
            >
              <TouchableOpacity
                onPress={() => pickdoc()}
                style={{
                  paddingHorizontal: 20,
                  height: 30,
                  backgroundColor: "#fdc500",
                  justifyContent: "center",
                  borderRadius: 10,
                  marginTop: 10,
                  flexDirection: "row",
                  alignSelf: "center",
                  marginRight: 10
                }}
              >
                <MaterialIcons
                  name="mic"
                  size={15}
                  style={{ alignSelf: "center" }}
                />
                {filename != "" ? (
                  <Text>{filename}</Text>
                ) : (
                  <Text style={{ alignSelf: "center" }}>Voice Note</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => pickdoc()}
                style={{
                  paddingHorizontal: 20,
                  height: 30,
                  backgroundColor: "#fdc500",
                  justifyContent: "center",
                  borderRadius: 10,
                  marginTop: 10,
                  flexDirection: "row",
                  alignSelf: "center",
                  marginLeft: 10
                }}
              >
                <MaterialIcons
                  name="folder"
                  size={15}
                  style={{ alignSelf: "center" }}
                />
                {filename != "" ? (
                  <Text>{filename}</Text>
                ) : (
                  <Text style={{ alignSelf: "center" }}>Documents</Text>
                )}
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => BookSession()}
              style={{
                top: 10,
                backgroundColor: "#fdc500",
                height: 30,
                borderRadius: 10,
                justifyContent: "center",
                flexDirection: "row",
                alignSelf: "center",
                width: "80%",
                paddingHorizontal: 100,
                marginBottom: 50
              }}
            >
              <MaterialIcons
                name="book-online"
                size={15}
                style={{ alignSelf: "center" }}
              />
              <Text style={{ alignSelf: "center" }}>Book</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};
const styles = StyleSheet.create({
  row: {
    flexDirection: "row"
  },
  TextInput: {
    borderColor: "#e8a80c",
    borderWidth: 2,
    marginTop: 5,
    color: "white",
    textAlign: "left"
  }
});
export default BookModal;
