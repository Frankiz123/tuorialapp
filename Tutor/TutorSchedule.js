import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  Button,
  View,
  StyleSheet,
  Text,
  FlatList,
  Alert,
  AlertIOS,
  ActivityIndicator,
  Keyboard,
  Platform
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import moment from "moment";
import { Calendar } from "react-native-calendars";
import { Card } from "react-native-elements";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Feather";
import Toast from "react-native-simple-toast";
import ComingModal from "../components/ComingModal.js/InstructionModal";
import firestore from "@react-native-firebase/firestore";
for (let i = 0; i <= 7; i++) {
  let startDate = moment();
  var markedDates = [];
  let DATE = startDate.clone().add(i, "days");
  let dots = [];
  let lines = [];

  if (i % 2) {
    lines.push({
      color: "#fdc500",
      selectedColor: "#fdc500"
    });
  } else {
    dots.push({
      color: "white",
      selectedColor: "green"
    });
  }
  markedDates.push({
    DATE,
    dots,
    lines
  });
}
export default function TutorSchedule(props) {
  const navigation = useNavigation();
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [isTime, setTime] = useState();
  const { userData } = props;
  const [isvisible, setVisible] = useState(false);
  const [dateString, setDates] = useState({});
  const [isday, setDate] = useState("");
  const [marked, setmarked] = useState({});
  const [daypicked, isdaypicked] = useState(false);
  const [istimefound, setTimeFound] = useState(false);
  const [slots, TimeSlots] = useState([]);
  const [selected, DayPicked] = useState("");
  const [startTime, setStartTime] = useState([]);
  const [endTimeFormat, setEndTime] = useState([]);
  const [StartingTime, setStartingTime] = useState("");
  const [array, startarray] = useState([]);
  const [chosenMode, setChosenMode] = useState(null);
  const [endTime, choseEndTime] = useState([]);
  const [endSlot, setEndSlot] = useState();
  const [count, setCount] = useState(0);
  const [isEndTime, setendbool] = useState(false);
  const [SelectedDate, SetDate] = useState("");
  const [fetchedArray, SetStart] = useState([]);
  const [fetchedData, SetEnd] = useState([]);
  const [startunixtime, setstartunixtime] = useState("");
  const [endunixtime, setendunixtime] = useState("");
  const [isdeleted, setdeleted] = useState(false);
  const [indextodelete, setindex] = useState("");
  const [closestHour, setclosesthour] = useState(0);
  const [arrayofhours, setarrayofhours] = useState([]);
  const Timings = firestore().collection("Slots");
  const [time_SLOTS, SetTimeSlots] = useState([]);
  const [isendvisibility, setendvisibility] = useState(false);
  const [toTimeOpen, setToTimeOpen] = useState(false);
  const [fromTimeOpen, setFromTimeOpen] = useState(false);
  const [datestring, setdatestring] = useState("");
  const [selectMultiple, setselectMultiple] = useState(false);
  const [selectedDates, setselectedDates] = useState([]);
  const [openComingSoon, setOpenComingSoon] = useState(false);
  const [selectedDayID, setselectedDayID] = useState("");
  const [selectedDayDate, setselectedDayDate] = useState("");
  const [dontShowAgain, setdontShowAgain] = useState(false);

  const customDatesStyles = [];
  //count[timeChosen, setTimesChosen] = useState(0);
  //const[endcount, setEndCount] = useState(0);
  var AM_PM;
  const newendTime = [];
  const newStartTime = [];
  const fetchedstartTime = [];
  const fetchedendTime = [];
  const usersCollection = firestore();

  //console.log(props.userData)
  const showDatePicker = () => {
    setTimePickerVisibility(true);
  };
  const showEndDatePicker = () => {
    setendvisibility(true);
  };
  let newdate = SelectedDate;
  var weekdayName;
  const List = [];
  const slotsDB = firestore().collection("Slots").doc(props.userData.ID);

  async function getClosestHour() {
    await firestore()
      .collection("Users")
      .doc(props.userData.ID)
      .onSnapshot((querySnapShot) => {
        setclosesthour(querySnapShot.data().ClosestHour);
      });
  }
  async function getTimings() {
    await getTutorsTimings(props.userData.ID);
  }
  useEffect(() => {
    getTimings();
  }, []);

  useEffect(() => {
    //getSlots();
    getClosestHour();
  }, []);

  const hideDatePicker = () => {
    setTimePickerVisibility(false);
  };

  const hideEndPicker = () => {
    setendvisibility(false);
  };
  let markedEvents = {};

  async function getTutorsTimings(tutorid) {
    await Timings.doc(props.userData.ID).onSnapshot((querySnapshot) => {
      if (!querySnapshot.exists) {
        console.log("empty");
      } else {
        const List = [];

        List.push({ ...querySnapshot.data(), key: querySnapshot.id });

        var key;
        var idkey;
        var obj;
        //get list
        for (var i = 0; i < List.length; i++) {
          const dataset = List[i].availability;
          obj = Object.values(dataset);
        }
        //var objID = Object.keys(dataset);
        const dateList = [];
        obj.forEach((snapshot) => {
          dateList.push(snapshot.dateString);

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
              color: "#F1C411",
              day: date
            };

            setDates(markedEvents);
          });
        });
      }
    });
  }
  const [formattedDate, setformatteddate] = useState("");

  async function onDayPress(day) {
    setselectedDayDate(day);
    let date = day.dateString;
    setformatteddate(day.timestamp);
    setDate(day.dateString);

    var dateStr = moment(day.dateString).format("YYYY-MM-DD");
    setdatestring(dateStr);

    let markedate = day.dateString;
    let newdates = markedEvents;
    isdaypicked(true);
    const tutorLists = [];

    await Timings.doc(props.userData.ID)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.exists) {
          console.log("empty");
        } else {
          tutorLists.push({
            ...querySnapshot.data(),
            key: querySnapshot.id
          });

          var key;
          var idkey;
          var obj;
          //get list
          for (var i = 0; i < tutorLists.length; i++) {
            const dataset = tutorLists[i].availability;
            obj = Object.values(dataset);
          }

          let timeSlots = [];
          obj.forEach((snapshot) => {
            if (date === snapshot.dateString) {
              timeSlots.push(snapshot);
              setTimeFound(true);
              setselectedDayID(querySnapshot.id);
            }
          });
          SetTimeSlots(timeSlots);
          let num = obj.findIndex((e) => date === e.dateString);
          if (num === -1) {
            setTimeFound(false);
          }
        }
      });
  }

  const handleEndDate = (time) => {
    hideEndPicker();
    var endtimestring = moment(time).format("hh:mm");
    const unixTime = new Date(time).valueOf();
    setendunixtime(unixTime);
    setEndSlot(endtimestring);
  };

  const handleConfirm = (time) => {
    if (selectMultiple) {
      setCount(count + 1);
      const unixTime = new Date(time).valueOf();
      var dateStr = moment(unixTime).format("YYYY-MM-DD");
      Toast.showWithGravity(
        dateStr + " Added Successfully!",
        Toast.LONG,
        Toast.TOP
      );
      setselectedDates([...selectedDates, dateStr]);
      if (Platform.OS == "android") {
        setTimePickerVisibility(false);
        setTimeout(() => {
          setTimePickerVisibility(true);
        }, 1000);
      }

      return;
    }
    hideDatePicker();
    setCount(count + 1);
    const unixTime = new Date(time).valueOf();
    var dateStr = moment(unixTime).format("YYYY-MM-DD");
    setdatestring(dateStr);
  };
  const handleTime = (time, type) => {
    const unixTime = new Date(time).valueOf();
    var timeString = moment(unixTime).format("hh:mm a");
    if (type === "start") {
      setstartunixtime(unixTime);
      setStartingTime(timeString);
      setFromTimeOpen(false);
    } else {
      setendunixtime(unixTime);
      setEndSlot(timeString);
      setToTimeOpen(false);
    }
  };

  function openmodal() {
    setVisible(true);
  }

  const closeOnly = () => {
    setOpenComingSoon(false);
  };

  function addarray(arayDate, type, index) {
    var newarr = [];
    firestore()
      .collection("Users")
      .doc(props.userData.ID)
      .update({ ScheduleSet: true });
    var difference = endunixtime - startunixtime;

    let actualdifference = difference / 60 / 1000;
    if (actualdifference % 60 === 0) {
      let numberOfSessions = actualdifference / 60;
      let startTime = new Date(startunixtime);
      for (let i = 0; i < numberOfSessions; i++) {
        let tempStartTime = new Date(startTime).valueOf();
        let endTime = startTime.setHours(startTime.getHours() + 1);
        newarr.push({
          startTime: tempStartTime,
          endTime,
          booked: "false",
          dateString: arayDate
        });
        startTime = new Date(endTime);
      }
      startarray(newarr);
      usersCollection
        .collection("Slots")
        .doc(props.userData.ID)
        .set(
          {
            availability: firestore.FieldValue.arrayUnion(...newarr),
            ID: props.userData.ID
          },
          { merge: true }
        );
      setVisible(false);
      if (type == "multi") {
        if (index == selectedDates.length - 1)
          Alert.alert("You have successfully set your timings");
      } else {
        console.log("Single");
        Alert.alert("You have successfully set your timings");
      }
    } else {
      Alert.alert(
        "Each session can be of 1 hour only.",
        "For example you can add your timings like 8:00 AM to 10:00 AM and it'll create 2 one hour sessions."
      );
    }
  }

  const addTimings = () => {
    if (selectMultiple) {
      selectedDates.map((datestring, index) => {
        addarray(datestring, "multi", index);
      });
    } else {
      addarray(datestring);
    }
    onDayPress(selectedDayDate);
  };

  const removeItem = async (item) => {
    await Timings.doc(selectedDayID)
      .get()
      .then(async (querySnapshot) => {
        let newAvailability = [];
        if (querySnapshot.exists) {
          const availability = querySnapshot.data().availability;
          availability.map(async (a, i) => {
            if (
              a.booked != item.booked ||
              a.dateString != item.dateString ||
              a.endTime != item.endTime ||
              a.startTime != item.startTime
            ) {
              newAvailability.push(a);
            } else {
              console.log("Dont add it");
            }
          });
          await Timings.doc(selectedDayID).update({
            availability: newAvailability
          });
          getTimings();
          onDayPress(selectedDayDate);
        }
      });
  };

  return (
    <SafeAreaView style={{ paddingTop: Platform.OS === "android" ? 15 : 0 }}>
      <View style={{ backgroundColor: "black", height: "100%" }}>
        <View style={{ width: "100%", top: 10 }}>
          <Text style={{ left: 5, color: "white" }}>Your calendar.</Text>
          <Text style={{ left: 5, color: "white" }}>Add your availability</Text>
        </View>

        <Calendar
          onDayPress={(day) => onDayPress(day)}
          style={{
            width: "100%",
            height: "auto",
            marginTop: 20,
            borderRadius: 10,
            backgroundColor: "white",
            right: 0
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
                height: "10%",
                backgroundColor: "black"
              },
              wrapper: {
                borderRadius: 2,
                backgroundColor: "blue",
                overflow: "hidden",
                height: "10%"
              }
            },
            "monthTitleTextStyle": {
              color: "white",
              fontWeight: "300",
              fontSize: 16
            },
            "monthTextColor": "black",
            "selectedDayBackgroundColor": "#fdc500",
            "todayTextColor": "black",
            "arrowColor": "#6d95da",
            "backgroundColor": "black",
            "dayTextColor": "#6d95da",
            "textSectionTitleColor": "#6d95da",
            "calendarBackground": "white"
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
            {time_SLOTS.map((item, i) => {
              var endtimestring = moment(item.endTime).format("hh:mm a");
              var starttimestring = moment(item.startTime).format("hh:mm a");

              const startTime = new Date(item.startTime).toLocaleTimeString(
                "en-US"
              );
              const endTime = new Date(item.endTime).toLocaleTimeString(
                "en-US"
              );
              return (
                <TouchableOpacity key={i}>
                  <View
                    style={{
                      flexDirection: "row",
                      width: "50%",
                      height: 30,
                      backgroundColor: slots === item ? "green" : "#fdc500",
                      borderRadius: 10,
                      marginTop: 5,
                      justifyContent: "space-between",
                      paddingHorizontal: 5
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
                    <TouchableOpacity
                      style={{ alignItems: "center", justifyContent: "center" }}
                      onPress={() => removeItem(item)}
                    >
                      <Text
                        style={{
                          color: "black",
                          alignSelf: "center",
                          paddingHorizontal: 5,
                          fontWeight: "bold"
                        }}
                      >
                        X
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : null}
        <View
          style={{
            justifyContent: "center",
            position: "absolute",
            alignSelf: "flex-end",
            top: 10,
            display: "flex",
            flexDirection: "row"
          }}
        >
          <TouchableOpacity
            style={{
              width: 30,
              height: 30,
              borderRadius: 25,
              backgroundColor: "#fdc500",
              marginHorizontal: 10
            }}
            onPress={async () => {
              const dontShowAgain = await AsyncStorage.getItem("dontShowAgain");
              if (dontShowAgain) {
                openmodal();
                setselectedDates([]);
                setselectMultiple(false);
              } else {
                setselectMultiple(false);
                setOpenComingSoon(true);
              }
            }}
          >
            <Icon name="plus" size={30} style={{}} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 30,
              height: 30,
              borderRadius: 25,
              backgroundColor: "#fdc500",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center"
            }}
            onPress={async () => {
              const dontShowAgain = await AsyncStorage.getItem("dontShowAgain");
              if (dontShowAgain) {
                openmodal();
                setselectedDates([]);
                setselectMultiple(true);
              } else {
                setselectMultiple(true);
                setOpenComingSoon(true);
              }
            }}
          >
            <Icon name="plus" size={15} style={{}} />
            <Icon name="plus" size={15} style={{}} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 30,
              height: 30,
              borderRadius: 25,
              backgroundColor: "#fff",
              marginHorizontal: 10
            }}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="close" size={30} style={{}} />
          </TouchableOpacity>
        </View>

        <Modal isVisible={isvisible}>
          <View
            style={{
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 7
              },
              shadowOpacity: 0.43,
              shadowRadius: 9.51,
              elevation: 15,
              width: "80%",
              borderRadius: 16,
              alignSelf: "center",
              padding: 5,
              backgroundColor: "#333939"
            }}
          >
            <TouchableOpacity onPress={() => setVisible(false)}>
              <MaterialIcons
                name="clear"
                size={25}
                style={{ alignSelf: "flex-end" }}
                color={"#fdc500"}
              />
            </TouchableOpacity>
            <View
              style={{
                flexDirection: "column",
                justifyContent: "space-around"
              }}
            >
              <View
                style={{ flexDirection: "row", justifyContent: "space-evenly" }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: "white",
                    width: "40%",
                    height: 30,
                    borderRadius: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    alignSelf: "center"
                  }}
                  onPress={() => {
                    showDatePicker();
                  }}
                >
                  <Text>{selectMultiple ? "Choose Dates" : "Choose Date"}</Text>
                </TouchableOpacity>
                <View style={{ marginBottom: 14 }}>
                  {selectedDates.length < 1 && selectMultiple && (
                    <Text
                      style={{
                        borderWidth: 1,
                        width: 130,
                        padding: 5,
                        alignSelf: "center",
                        color: "white",
                        borderColor: "white",
                        marginLeft: 0,
                        marginTop: 15
                      }}
                    ></Text>
                  )}
                  {selectMultiple ? (
                    selectedDates.map((datestring) => {
                      return (
                        <Text
                          style={{
                            borderWidth: 1,
                            width: 130,
                            padding: 5,
                            alignSelf: "center",
                            color: "white",
                            borderColor: "white",
                            marginLeft: 0,
                            marginTop: 15
                          }}
                        >
                          {datestring}
                        </Text>
                      );
                    })
                  ) : (
                    <Text
                      style={{
                        borderWidth: 1,
                        width: 130,
                        padding: 5,
                        alignSelf: "center",
                        color: "white",
                        borderColor: "white",
                        marginLeft: 0,
                        marginTop: 15
                      }}
                    >
                      {datestring}
                    </Text>
                  )}
                </View>
              </View>
              <View
                style={{ flexDirection: "row", justifyContent: "space-evenly" }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: "white",
                    width: "40%",
                    height: 30,
                    borderRadius: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    alignSelf: "center",
                    marginTop: 10
                  }}
                  onPress={() => {
                    setFromTimeOpen(true);
                  }}
                >
                  <Text>Start Time</Text>
                </TouchableOpacity>
                <Text
                  style={{
                    borderWidth: 1,
                    width: 130,
                    padding: 5,
                    alignSelf: "center",
                    color: "white",
                    borderColor: "white",
                    marginTop: 10
                  }}
                >
                  {StartingTime}
                </Text>
              </View>
              <View
                style={{ flexDirection: "row", justifyContent: "space-evenly" }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: "white",
                    width: "40%",
                    height: 30,
                    borderRadius: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    alignSelf: "center",
                    marginTop: 10
                  }}
                  onPress={() => {
                    setToTimeOpen(true);
                  }}
                >
                  <Text>End Time</Text>
                </TouchableOpacity>
                <Text
                  style={{
                    borderWidth: 1,
                    width: 130,
                    padding: 5,
                    alignSelf: "center",
                    color: "white",
                    borderColor: "white",
                    marginTop: 10
                  }}
                >
                  {endSlot}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={{
                marginTop: 50,
                backgroundColor: "white",
                width: "50%",
                height: 30,
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center"
              }}
              onPress={addTimings}
            >
              <Text style={{ alignSelf: "center", fontWeight: "bold" }}>
                Add Timings
              </Text>
            </TouchableOpacity>
          </View>
          <DateTimePickerModal
            isVisible={isTimePickerVisible}
            mode="date"
            input={true}
            cancelTextIOS="Done"
            confirmTextIOS="Pick Date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            date={
              moment(datestring).isValid()
                ? moment(datestring).toDate()
                : moment().toDate()
            }
          />
          <DateTimePickerModal
            isVisible={fromTimeOpen}
            mode="time"
            input={true}
            onConfirm={(time) => handleTime(time, "start")}
            onCancel={() => setFromTimeOpen(false)}
          />
          <DateTimePickerModal
            isVisible={toTimeOpen}
            mode="time"
            input={true}
            onConfirm={(time) => handleTime(time, "end")}
            onCancel={() => setToTimeOpen(false)}
          />
        </Modal>
      </View>
      <ComingModal
        open={openComingSoon}
        single={!selectMultiple}
        setdontShowAgain={setdontShowAgain}
        dontShowAgain={dontShowAgain}
        close={async () => {
          if (dontShowAgain) {
            await AsyncStorage.setItem("dontShowAgain", "T");
          }
          setOpenComingSoon(false);
          if (selectMultiple) {
            setTimeout(() => {
              openmodal();
              setselectedDates([]);
            }, 1000);
          } else {
            setTimeout(() => {
              openmodal();
            }, 1000);
          }
        }}
        closeOnly={closeOnly}
        heading="How To Add?"
        logo
        description
        description2
        btn="Go"
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  header: {
    top: 0,
    height: "50%",
    width: "100%",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute"
  },
  container: {
    flexDirection: "column",
    flexWrap: "wrap",
    height: 40
  },
  column: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexGrow: 1,
    flexWrap: "wrap"
  }
});
