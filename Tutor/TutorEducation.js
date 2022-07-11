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
  Platform,
  Pressable,
  KeyboardAvoidingView
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { SearchBar, Card } from "react-native-elements";
import { ScrollView, TextInput } from "react-native-gesture-handler";
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
import ModalDropdown from "react-native-modal-dropdown";
import * as orginazations from "../universitylists.json";
import { ToggleButton } from "react-native-paper";
import { useLinkProps, useNavigation } from "@react-navigation/native";
import * as degrees from "../degrees.json";
import DatePicker from "react-native-datepicker";
import firestore from "@react-native-firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import ImageUploader from "../utils/ImageUploader";
import { Linking } from "react-native";
import MyLoader from "../components/loader/MyLoader";

export default function TutorEducation(props) {
  const { userData } = props;
  const route = useRoute();
  const [universityarray, setuniarray] = useState([]);
  const [isData, setdata] = useState(false);
  const [selected, setselected] = useState("");
  const [status, setStatus] = useState("checked");
  const [data, setData] = useState([]);
  const [value, setvalue] = useState("");
  const navigation = useNavigation();
  const [degreeText, setdegreeText] = useState("");
  const [textvalue, settextvalue] = useState("");
  const [degreeselected, setdegreeselected] = useState("");
  const [DegreeValue, setdegrees] = useState(degrees["default"]);
  const [isdegree, setdegreetoggle] = useState("checked");
  const [enddate, setenddate] = useState("");
  const [isdate, setdatebool] = useState(false);
  const [education, seteducation] = useState([]);
  const [isNew, addnew] = useState(false);
  const [isSaved, setSaved] = useState(false);
  const [educationCount, seteducationCount] = useState(0);
  const [universitytext, setuniversitytext] = useState("");
  const [degreetext, setdegreetext] = useState("");
  const [isother, setother] = useState(0);
  const [isEditable, setEditable] = useState(false);
  const [editableString, setEditablestring] = useState(0);
  const [title, settitle] = useState("");

  const [universityEditText, setUniversityEditText] = useState("");
  const [degreeEditText, setDegreeEditText] = useState("");
  const [endEditDate, setEndDate] = useState("");
  const [uploadedImg, setUploadedImg] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const uniList = [];
  const degreeArray = [];
  degreeArray.push(degrees["default"]);

  const fulluniList = [];
  let values;

  for (var key in orginazations) {
    const string = Object.values(orginazations[key]);
    uniList.push(string[1]);
  }

  const onButtonToggle = (value) => {
    setStatus(status === "checked" ? "unchecked" : "checked");
    settextvalue("");
    setuniarray(uniList);
    console.log("status", status);
  };

  const onDegreeToggle = (value) => {
    setdegreetoggle(isdegree === "checked" ? "unchecked" : "checked");
    //setdegreeText("");
    setdegrees(degrees["default"]);
  };

  function selectdegree(item) {
    console.log("item is", item);
    setdegreeselected(item);
    setdegreetoggle("checked");
    setdegreeText("");
    setdegrees(degrees["default"]);
  }

  //edit your data
  function editItems(item) {
    setEditable(true);
    console.log("item to be edited", item);
    setEditablestring(item);
    setUniversityEditText(item.University);
    setDegreeEditText(item.Degree);
    setEndDate(item.End);
  }

  //delete data
  function deleteItem(item) {
    Alert.alert(
      "Do you want to delete this degree ?",
      "This action is non-reversible",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => {
            let educations = education.filter(
              (edu) => edu.Degree !== item.Degree
            );
            firestore()
              .collection("Users")
              .doc(userData.ID)
              .update({ Education: educations });
          }
        }
      ]
    );
  }
  function addNew() {
    addnew(!isNew);
    setother(false);
    setUploadedImg(null);
  }
  //save the edited details
  async function saveEdittedDetails() {
    try {
      setLoading(true);
      let index = education.findIndex(
        (e) => e.Degree === editableString.Degree
      );
      //get the existing uni string
      let existinguni = education.map((item, i) => item.University);
      let unistring;
      let existingUniString = existinguni.map((item, i) => {
        return (unistring = item);
      });

      //get the existing degree string
      let existingdegree = education.map((item, i) => item.Degree);
      let degreestring;
      let existingDegree = existingdegree.map((item, i) => {
        return (degreestring = item);
      });

      let newUniText =
        universityEditText != "" ? universityEditText : unistring;
      let newDegreeText = degreeEditText != "" ? degreeEditText : degreestring;
      let stringend = moment(endEditDate).format("YYYY");

      //check for documents
      let uri = null;
      if (uploadedImg) {
        uri = await ImageUploader(uploadedImg.uri);
      }
      setUploadedImg(null);

      let newEducation = {
        University: newUniText,
        Degree: newDegreeText,
        End: stringend,
        Document: uri
      };
      education[index] = newEducation;
      await firestore()
        .collection("Users")
        .doc(userData.ID)
        .update({ Education: education });
      setEditable(false);
      alert("Education edited successfully!");
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }
  function addNewOther() {
    setother(!isother);
    addnew(false);
    setUploadedImg(null);
  }
  async function saveDetails() {
    try {
      setLoading(true);
      setSaved(true);
      let stringend = moment(enddate).format("YYYY");
      //incrementing count
      var number2 = parseInt(educationCount);
      var educationtemp = number2 + 1;
      firestore().collection("Users").doc(props.userData.ID).update({
        EducationCount: educationtemp
      });
      //check for documents
      let uri = null;
      if (uploadedImg) {
        uri = await ImageUploader(uploadedImg.uri);
      }
      if (isNew === true) {
        const Education = [
          {
            University: value,
            Degree: degreeselected,
            End: stringend,
            Document: uri
          }
        ];
        await firestore()
          .collection("Users")
          .doc(props.userData.ID)
          .update({
            Education: firestore.FieldValue.arrayUnion(...Education)
          });
        addnew(false);
      } else if (isother === true) {
        const Education = [
          {
            University: universitytext,
            Degree: degreetext,
            End: stringend,
            Document: uri
          }
        ];
        await firestore()
          .collection("Users")
          .doc(props.userData.ID)
          .update({
            Education: firestore.FieldValue.arrayUnion(...Education)
          });
        setother(false);
      }
      alert("Education created successfully!");
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }
  const [average, setaverage] = useState("");

  useEffect(() => {
    var unsubscribe;
    if (uniList != null) {
      setuniarray(uniList);
    }
    getUserInfo();
  }, []);

  async function getUserInfo() {
    await firestore()
      .collection("Users")
      .doc(props.userData.ID)
      .onSnapshot((querysnapshot) => {
        let totalavg = (
          Math.round(querysnapshot.data().TotalAverage * 100) / 100
        ).toFixed(2);
        setaverage(totalavg);
        settitle(querysnapshot.data().NameTitle);
        seteducationCount(
          Array.isArray(querysnapshot.data().Education)
            ? querysnapshot.data().Education.length
            : 0
        );
        seteducation(querysnapshot.data().Education);
        console.log(education, isNew);
      });
  }
  function onEndDate(date) {
    let year = new Date(date).getFullYear();
    setenddate(date);
  }
  function changetext(text) {
    let textString = text.toLowerCase();
    let array = orginazations;
    let isFiltered = false;
    const containsKeyword = (val) =>
      typeof val === "string" && val.indexOf(textString) !== -1;
    let names;
    for (var key in orginazations) {
      names = orginazations[key].name;
      //const itemdata = orginazations[key].name.toUpperCase()
    }
    const newdata = universityarray.filter((item) => {
      let itemdata = item.toString().toUpperCase();
      let textdata = text.toUpperCase();
      return itemdata.indexOf(textdata) > -1;
    });

    setdata(true);
    setuniarray(newdata);
    settextvalue(text);
  }

  function changedegreeText(degreetext) {
    let textString = degreeText.toLowerCase();
    const array = [];
    array.push(DegreeValue);
    const newdata = DegreeValue.filter((item) => {
      let itemdata = item.toString().toUpperCase();
      let textdata = degreeText.toUpperCase();
      return itemdata.indexOf(textdata) > -1;
    });
    setdegrees(newdata);
    console.log(newdata);
  }

  function selectedUni(item) {
    setvalue(item);
    setStatus("checked");
    setdata(false);
    settextvalue("");
    setuniarray(uniList);
  }

  let openImagePickerAsync = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }
    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.cancelled === true) {
      console.log("not allowed");
      return;
    }
    console.log("image daata", pickerResult);
    let source = { uri: pickerResult.uri };
    let uri = pickerResult.uri;
    let uploadUri = Platform.OS === "ios" ? uri.replace("file://", "") : uri;
    setUploadedImg(source);
  };
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{
        backgroundColor: "black",
        height: "100%",
        paddingTop: Platform.OS === "android" ? 15 : 25
      }}
    >
      <MyLoader loading={isLoading} color={"#fff"} />
      <View
        style={{
          backgroundColor: "black",
          height: 180
        }}
      >
        <TouchableOpacity
          onPress={() => console.log("....")}
          style={{
            flexDirection: "row"
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ color: "white", fontSize: 15 }}>
              {" "}
              Your{" "}
              <Text
                style={{ color: "#F1C411", fontWeight: "bold", fontSize: 15 }}
              >
                EDUCATIONAL BACKGROUND.
              </Text>
            </Text>
            <Text style={{ color: "white", top: 0, fontSize: 15 }}>
              {" "}
              Update or add new educational info.
            </Text>
          </View>

          <TouchableOpacity
            onPress={navigation.goBack}
            style={{
              backgroundColor: "white",
              width: 35,
              height: 35,
              borderRadius: 35,
              justifyContent: "center",
              alignSelf: "flex-end"
            }}
          >
            <MaterialIcons
              name="home"
              size={25}
              style={{ alignSelf: "center" }}
              color={"black"}
            />
          </TouchableOpacity>
        </TouchableOpacity>

        <View
          style={{ justifyContent: "flex-end", alignSelf: "flex-end" }}
        ></View>
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            alignSelf: "center",
            top: 65 / 5 - 0,
            width: 70
          }}
        >
          <View style={{ flexDirection: "row", width: 75, height: 75 }}>
            <Image
              source={{ uri: props.userData.Photo }}
              style={{
                width: 70,
                height: 70,
                alignSelf: "center",
                borderRadius: 35
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
                top: 0
              }}
            >
              <Text
                style={{ fontSize: 14, alignSelf: "center", color: "white" }}
              >
                {educationCount}
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
              alignSelf: "center"
            }}
          >
            <Text style={{ alignSelf: "center", color: "black" }}>
              {" "}
              {average}{" "}
            </Text>
            <MaterialIcons
              name="star"
              style={{ color: "black", alignSelf: "center" }}
            />
          </View>
          <Text
            style={{
              alignSelf: "center",
              fontSize: 16,
              color: "white",
              bottom: 10,
              width: 400,
              textAlign: "center"
            }}
          >
            {title} {props.userData.Name}
          </Text>
        </View>
      </View>
      <Card
        containerStyle={{
          shadowColor: "grey",
          shadowOpacity: 0.5,
          shadowOffset: { width: 2, height: 2 },
          height: "105%",
          backgroundColor: "white",
          borderColor: "white",
          width: "100%",
          right: 15
        }}
      >
        <Card.Title
          style={{
            textAlign: "left",
            flexDirection: "row",
            justifyContent: "space-between"
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-around" }}
          >
            <Text
              style={{
                marginTop: 2,
                fontSize: 16,
                color: "black",
                alignSelf: "center"
              }}
            >
              {" "}
              Education{" "}
            </Text>
            <TouchableOpacity
              onPress={() => addNew()}
              style={{
                backgroundColor: "#F1C411",
                width: 40,
                height: 40,
                borderRadius: 20,
                justifyContent: "center",
                alignSelf: "flex-start"
              }}
            >
              <MaterialIcons
                name="add"
                size={30}
                style={{
                  color: "black",
                  alignSelf: "center",
                  marginLeft: 0
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => addNewOther()}
              style={{
                backgroundColor: "#F1C411",
                left: 10,
                width: 40,
                height: 40,
                borderRadius: 20,
                justifyContent: "center",
                alignSelf: "flex-start"
              }}
            >
              <MaterialIcons
                name="add"
                size={30}
                style={{
                  color: "white",
                  alignSelf: "center",
                  marginLeft: 0
                }}
              />
            </TouchableOpacity>
          </View>
        </Card.Title>
        <Card.Divider style={{ backgroundColor: "black" }} />
        <ScrollView>
          {isEditable === true ? (
            <Card
              containerStyle={{
                backgroundColor: "#101820FF",
                borderColor: "#101820FF",
                width: "auto",
                height: "36%",
                borderRadius: 15,
                shadowOffset: { width: 0, height: 2 },
                shadowColor: "black",
                shadowRadius: 2,
                shadowOpacity: 0.5,
                marginBottom: 20
              }}
            >
              <ScrollView>
                <TouchableOpacity
                  style={{ position: "absolute", alignSelf: "flex-end" }}
                  onPress={() => setEditable(false)}
                >
                  <MaterialIcons
                    name="clear"
                    size={25}
                    style={{ alignSelf: "flex-end" }}
                    color={"#F1C411"}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    alignSelf: "flex-start",
                    color: "white",
                    fontSize: 16,
                    marginBottom: 5
                  }}
                >
                  University
                </Text>
                <TextInput
                  value={universityEditText}
                  onChangeText={(text) => setUniversityEditText(text)}
                  placeholder={editableString.University}
                  placeholderTextColor="white"
                  style={{
                    width: "100%",
                    borderColor: "#333939",
                    height: 40,
                    borderRadius: 10,
                    borderWidth: 1,
                    color: "white",
                    backgroundColor: "#333939",
                    marginBottom: 10,
                    paddingLeft: 10
                  }}
                />
                <Text
                  style={{
                    alignSelf: "flex-start",
                    color: "white",
                    fontSize: 16,
                    marginTop: 10,
                    marginBottom: 5
                  }}
                >
                  Degree
                </Text>
                <TextInput
                  value={degreeEditText}
                  onChangeText={(text) => setDegreeEditText(text)}
                  placeholder={editableString.Degree}
                  placeholderTextColor="white"
                  style={{
                    width: "100%",
                    borderColor: "#333939",
                    height: 40,
                    borderRadius: 10,
                    borderWidth: 1,
                    color: "white",
                    backgroundColor: "#333939",
                    marginBottom: 10,
                    paddingLeft: 10
                  }}
                />
                <Text
                  style={{
                    alignSelf: "flex-start",
                    color: "white",
                    fontSize: 16,
                    top: 10,
                    marginBottom: 5
                  }}
                >
                  Graduation Date
                </Text>
                <View
                  style={{
                    flexDirection: "row"
                  }}
                >
                  <DatePicker
                    dateFormat="MM/yyyy"
                    onDateChange={(date) => {
                      setdatebool(true), setEndDate(date);
                    }}
                    style={{
                      top: 10,
                      borderColor: "#333939",
                      backgroundColor: "white",
                      width: "100%",
                      borderRadius: 10,
                      color: "white",
                      borderWidth: 0
                    }}
                    customStyles={{ dateInput: { color: "white" } }}
                    showMonthYearPicker
                    locale="en-GB"
                    showIcon={false}
                    confirmBtnText="Confirm"
                    placeholder={editableString.End}
                    cancelBtnText="Cancel"
                    date={endEditDate}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => openImagePickerAsync()}
                  style={{
                    width: "100%",
                    height: 40,
                    backgroundColor: "#0008",
                    marginTop: 20,
                    marginBottom: 0,
                    justifyContent: "center",
                    alignSelf: "center",
                    borderRadius: 10
                  }}
                >
                  <Text
                    style={{
                      alignSelf: "center",
                      color: "white",
                      fontSize: 16
                    }}
                  >
                    Upload Certificate
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => saveEdittedDetails()}
                  style={{
                    width: "100%",
                    height: 40,
                    backgroundColor: "#F1C411",
                    marginTop: 20,
                    justifyContent: "center",
                    alignSelf: "center",
                    borderRadius: 10
                  }}
                >
                  <Text style={{ alignSelf: "center" }}>Save</Text>
                </TouchableOpacity>
              </ScrollView>
            </Card>
          ) : null}
          {isNew === true ? (
            <View style={{ width: "auto", height: "auto" }}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 18,

                  color: "black",
                  top: 0,
                  alignSelf: "center",
                  right: 5
                }}
              >
                General
              </Text>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
              >
                <Card
                  containerStyle={{
                    backgroundColor: "#101820FF",
                    borderColor: "#101820FF",
                    width: "100%",
                    borderRadius: 15,
                    shadowOffset: { width: 0, height: 2 },
                    shadowColor: "black",
                    shadowRadius: 2,
                    shadowOpacity: 0.5,
                    right: 10,
                    paddingBottom: 50
                  }}
                >
                  <Text
                    style={{
                      alignSelf: "flex-start",
                      color: "white",
                      fontSize: 16,
                      marginBottom: 5
                    }}
                  >
                    University
                  </Text>
                  <Pressable
                    style={{
                      backgroundColor: "#333939",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      top: 5,
                      borderRadius: 10,
                      marginBottom: 13,
                      height: 45,
                      position: "relative"
                    }}
                    onPress={onButtonToggle}
                  >
                    {status === "checked" ? (
                      value != "" ? (
                        <Text
                          style={{
                            color: "white",
                            alignSelf: "center",
                            fontSize: 14,
                            paddingLeft: 10
                          }}
                        >
                          {value}
                        </Text>
                      ) : (
                        <Text
                          style={{
                            color: "grey",
                            alignSelf: "center",
                            fontSize: 14,
                            paddingLeft: 10
                          }}
                        >
                          Ex: University of Oxford
                        </Text>
                      )
                    ) : (
                      <TextInput
                        value={textvalue}
                        onChangeText={(text) => {
                          settextvalue(text), changetext(text);
                        }}
                        placeholderTextColor="grey"
                        style={{ color: "white", width: "90%" }}
                        placeholder="Type here..."
                      />
                    )}
                    <ToggleButton
                      icon="arrow-down"
                      style={{
                        color: "black",
                        backgroundColor: "#333939" /*333939*/,
                        alignSelf: "flex-end",
                        borderTopEndRadius: 10,
                        borderBottomEndRadius: 10,
                        position: "absolute",
                        top: 2,
                        right: 0
                      }}
                      color={status === "checked" ? "black" : "#F1C411"}
                      value="check"
                      status={status}
                      onPress={onButtonToggle}
                    />
                  </Pressable>
                  {status === "unchecked" ? (
                    <View
                      style={{
                        height: "70%",
                        top: 80,
                        width: "101%",
                        position: "absolute",
                        zIndex: 2,
                        backgroundColor: "#333939",
                        borderRadius: 10,
                        overflow: "hidden"
                      }}
                    >
                      <FlatList
                        data={universityarray}
                        keyExtractor={(item, index) => {
                          return index.toString();
                        }}
                        renderItem={({ item }) => {
                          return (
                            <View
                              style={{
                                height: "auto",
                                width: "auto",
                                borderBottomWidth: 0.5,
                                flexDirection: "column",
                                paddingVertical: 10,
                                borderColor: "#0005"
                              }}
                            >
                              <TouchableOpacity
                                onPress={() => selectedUni(item)}
                              >
                                <Text
                                  style={{ color: "white", paddingLeft: 10 }}
                                >
                                  {item}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          );
                        }}
                      />
                    </View>
                  ) : null}
                  <Text
                    style={{
                      alignSelf: "flex-start",
                      color: "white",
                      fontSize: 16,
                      top: 10,
                      marginBottom: 5
                    }}
                  >
                    Degree
                  </Text>
                  <Pressable
                    style={{
                      backgroundColor: "#333939",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      top: 12,
                      borderRadius: 10,
                      marginBottom: 13,
                      height: 45,
                      position: "relative"
                    }}
                    onPress={onDegreeToggle}
                  >
                    {isdegree === "checked" ? (
                      degreeselected !== "" ? (
                        <Text
                          style={{
                            color: "white",
                            alignSelf: "center",
                            fontSize: 14,
                            paddingLeft: 10
                          }}
                        >
                          {degreeselected}
                        </Text>
                      ) : (
                        <Text
                          style={{
                            color: "grey",
                            alignSelf: "center",
                            fontSize: 14,
                            paddingLeft: 10
                          }}
                        >
                          Ex: Bachelors of Artificial Intelligence
                        </Text>
                      )
                    ) : (
                      <TextInput
                        value={degreeText}
                        onChangeText={(text) => {
                          setdegreeText(text), changedegreeText(text);
                        }}
                        placeholderTextColor="grey"
                        style={{ color: "white", width: "90%" }}
                        placeholder="Type here..."
                      />
                    )}

                    <ToggleButton
                      icon="arrow-down"
                      style={{
                        color: "black",
                        backgroundColor: "#333939" /*333939*/,
                        alignSelf: "flex-end",
                        borderTopEndRadius: 10,
                        borderBottomEndRadius: 10,
                        position: "absolute",
                        top: 2,
                        right: 0
                      }}
                      color={isdegree === "checked" ? "black" : "#F1C411"}
                      value="check"
                      status={isdegree}
                      onPress={onDegreeToggle}
                    />
                  </Pressable>
                  {isdegree === "unchecked" ? (
                    <View
                      style={{
                        height: "50%",
                        top: 170,
                        width: "101%",
                        position: "absolute",
                        zIndex: 2,
                        backgroundColor: "#333939",
                        borderRadius: 10,
                        overflow: "hidden"
                      }}
                    >
                      <FlatList
                        data={DegreeValue}
                        keyExtractor={(item, index) => {
                          return index.toString();
                        }}
                        renderItem={({ item }) => {
                          return (
                            <View
                              style={{
                                height: "auto",
                                width: "auto",
                                borderBottomWidth: 0.5,
                                flexDirection: "column",
                                paddingVertical: 10,
                                borderColor: "#0005"
                              }}
                            >
                              <TouchableOpacity
                                onPress={() => selectdegree(item)}
                              >
                                <Text
                                  style={{ color: "white", paddingLeft: 10 }}
                                >
                                  {item}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          );
                        }}
                      />
                    </View>
                  ) : null}
                  <View>
                    <Text
                      style={{
                        alignSelf: "flex-start",
                        color: "white",
                        fontSize: 16,
                        top: 15,
                        marginBottom: 5
                      }}
                    >
                      Graduation Date
                    </Text>
                    <DatePicker
                      dateFormat="MM/yyyy"
                      onDateChange={(date) => {
                        setdatebool(true), onEndDate(date);
                      }}
                      style={{
                        top: 15,
                        borderBottomWidth: 0,
                        borderRightWidth: 0,
                        borderWidth: 0,
                        borderColor: "#0000",
                        backgroundColor: "#333939",
                        borderRadius: 10,
                        marginBottom: 10,
                        width: "100%",
                        justifyContent: "flex-start"
                      }}
                      customStyles={{
                        dateInput: {
                          borderWidth: 0,
                          paddingRight: 25,
                          justifyContent: "center",
                          alignItems: "flex-start",
                          paddingLeft: 10
                        },
                        dateText: {
                          fontSize: 14,
                          color: "#fff",
                          textAlign: "left"
                        }
                      }}
                      showMonthYearPicker
                      locale="en-GB"
                      showIcon={false}
                      confirmBtnText="Confirm"
                      placeholder="Pick.."
                      cancelBtnText="Cancel"
                      date={enddate}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() => openImagePickerAsync()}
                    style={{
                      width: "70%",
                      height: 40,
                      backgroundColor: "#0008",
                      marginTop: 20,
                      marginBottom: 0,
                      justifyContent: "center",
                      alignSelf: "center",
                      borderRadius: 10
                    }}
                  >
                    <Text
                      style={{
                        alignSelf: "center",
                        color: "white",
                        fontSize: 16
                      }}
                    >
                      Upload Certificate
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => saveDetails()}
                    style={{
                      width: "70%",
                      height: 40,
                      backgroundColor: "#F1C411",
                      marginTop: 10,
                      marginBottom: 20,
                      justifyContent: "center",
                      alignSelf: "center",
                      borderRadius: 10
                    }}
                  >
                    <Text style={{ alignSelf: "center" }}>Save</Text>
                  </TouchableOpacity>
                </Card>
              </KeyboardAvoidingView>
            </View>
          ) : isother === true ? (
            <View>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 18,
                  color: "black",
                  top: 0,
                  alignSelf: "center",
                  right: 5
                }}
              >
                Others
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
                  shadowOpacity: 0.5
                }}
              >
                <Text
                  style={{
                    alignSelf: "flex-start",
                    color: "white",
                    fontSize: 16,
                    marginBottom: 5
                  }}
                >
                  Institution
                </Text>
                <TextInput
                  value={universitytext}
                  onChangeText={(text) => setuniversitytext(text)}
                  placeholder="Ex: Arina Animations"
                  placeholderTextColor="grey"
                  style={{
                    width: "100%",
                    borderColor: "#333939",
                    height: 40,
                    borderRadius: 10,
                    borderWidth: 1,
                    color: "white",
                    backgroundColor: "#333939",
                    marginBottom: 10,
                    paddingLeft: 10
                  }}
                />
                <Text
                  style={{
                    alignSelf: "flex-start",
                    color: "white",
                    fontSize: 16,
                    marginTop: 10,
                    marginBottom: 5
                  }}
                >
                  Certificate Title
                </Text>
                <TextInput
                  value={degreetext}
                  onChangeText={(text) => setdegreetext(text)}
                  placeholder="Ex: Graphics Designing"
                  placeholderTextColor="grey"
                  style={{
                    width: "100%",
                    borderColor: "#333939",
                    height: 40,
                    borderRadius: 10,
                    borderWidth: 1,
                    color: "white",
                    backgroundColor: "#333939",
                    marginBottom: 10,
                    paddingLeft: 10
                  }}
                />
                <Text
                  style={{
                    alignSelf: "flex-start",
                    color: "white",
                    fontSize: 16,
                    top: 10
                  }}
                >
                  Issue Date
                </Text>
                <View
                  style={{
                    flexDirection: "row"
                  }}
                >
                  <DatePicker
                    dateFormat="MM/yyyy"
                    onDateChange={(date) => {
                      setdatebool(true), onEndDate(date);
                    }}
                    style={{
                      top: 15,
                      borderBottomWidth: 0,
                      borderRightWidth: 0,
                      borderWidth: 0,
                      borderColor: "#0000",
                      backgroundColor: "#333939",
                      borderRadius: 10,
                      marginBottom: 10,
                      width: "100%",
                      justifyContent: "flex-start"
                    }}
                    customStyles={{
                      dateInput: {
                        borderWidth: 0,
                        paddingRight: 25,
                        justifyContent: "center",
                        alignItems: "flex-start",
                        paddingLeft: 10
                      },
                      dateText: {
                        fontSize: 14,
                        color: "#fff",
                        textAlign: "left"
                      }
                    }}
                    showMonthYearPicker
                    locale="en-GB"
                    showIcon={false}
                    confirmBtnText="Confirm"
                    placeholder="Pick.."
                    cancelBtnText="Cancel"
                    date={enddate}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => openImagePickerAsync()}
                  style={{
                    width: "70%",
                    height: 40,
                    backgroundColor: "#0008",
                    marginTop: 20,
                    marginBottom: 0,
                    justifyContent: "center",
                    alignSelf: "center",
                    borderRadius: 10
                  }}
                >
                  <Text
                    style={{
                      alignSelf: "center",
                      color: "white",
                      fontSize: 16
                    }}
                  >
                    Upload Certificate
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => saveDetails()}
                  style={{
                    width: "70%",
                    height: 40,
                    backgroundColor: "#F1C411",
                    marginTop: 30,
                    marginBottom: 20,
                    justifyContent: "center",
                    alignSelf: "center",
                    borderRadius: 10
                  }}
                >
                  <Text
                    style={{
                      alignSelf: "center",
                      color: "black",
                      fontSize: 14
                    }}
                  >
                    Save
                  </Text>
                </TouchableOpacity>
              </Card>
            </View>
          ) : education != "" ? (
            <View style={{ height: "100%", width: "110%" }}>
              <FlatList
                data={education}
                style={{ height: "100%", width: "auto", right: 0 }}
                keyExtractor={(item, index) => {
                  return index.toString();
                }}
                renderItem={({ item }) => {
                  return (
                    <View
                      style={{
                        width: "90%",
                        alignSelf: "flex-start",
                        borderRadius: 10,
                        shadowOffset: { width: 0, height: 2 },
                        shadowColor: "black",
                        shadowRadius: 2,
                        shadowOpacity: 0.5,
                        elevation: 3,
                        backgroundColor: "#eaeaf4",
                        borderColor: "#eaeaf4",
                        height: "auto",
                        bottom: 0,
                        marginBottom: 20,
                        left: 3,
                        padding: 10
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignSelf: "flex-start",
                          right: 0,
                          top: 5
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: "#F1C411",
                            justifyContent: "center",
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            marginRight: 10,
                            alignSelf: "flex-start"
                          }}
                        >
                          <MaterialIcons
                            name="school"
                            style={{ alignSelf: "center" }}
                            size={20}
                            color={"black"}
                          />
                        </View>
                        <View style={{ flexDirection: "column", width: "68%" }}>
                          <Text
                            style={{
                              fontSize: 14,
                              marginTop: 0,
                              fontWeight: "bold",
                              left: 5,
                              width: "100%",
                              color: "black"
                            }}
                          >
                            {item.University}, {item.End}
                          </Text>
                          <Text
                            style={{
                              fontSize: 12,
                              marginTop: 5,
                              left: 5,
                              color: "#0008"
                            }}
                          >
                            {item.Degree}
                          </Text>
                          <Text
                            style={{
                              fontSize: 14,
                              marginTop: 5,
                              left: 5
                            }}
                          ></Text>
                        </View>
                        {typeof item.Document === "string" && (
                          <TouchableOpacity
                            style={{
                              backgroundColor: "#F1C411",
                              paddingHorizontal: 5,
                              paddingVertical: 3,
                              height: 30,
                              borderRadius: 20,
                              marginLeft: -10,
                              elevation: 2
                            }}
                            onPress={() => Linking.openURL(item.Document)}
                          >
                            <Text
                              style={{
                                color: "#fff"
                              }}
                            >
                              Certificate{" "}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                      <View
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "center",
                          flexDirection: "row",
                          paddingHorizontal: 0
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => editItems(item)}
                          style={{
                            flex: 1,
                            marginRight: 5,
                            height: 35,
                            backgroundColor: "#0002",
                            borderRadius: 10,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "row"
                          }}
                        >
                          <MaterialIcons
                            name="edit"
                            size={20}
                            style={{ right: 0, left: 0 }}
                            color={"black"}
                            style={{ marginRight: 7 }}
                          />
                          <Text>Edit Education</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => deleteItem(item)}
                          style={{
                            marginRight: 5,
                            height: 35,
                            backgroundColor: "#0002",
                            borderRadius: 10,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "row",
                            width: 50
                          }}
                        >
                          <MaterialIcons
                            name="delete"
                            size={20}
                            style={{ right: 0, left: 0 }}
                            color={"black"}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                }}
              />
            </View>
          ) : null}
        </ScrollView>
      </Card>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  column: {
    flexDirection: "column"
  },
  row: {
    flexDirection: "row"
  },

  selectTimings: {
    borderRadius: 5,
    shadowColor: "grey",
    shadowOpacity: 0.5,
    shadowOffset: { width: 5, height: 5 },
    backgroundColor: "black",
    marginLeft: 15
  },
  datePickerStyle: {
    width: 120,
    marginRight: 10,
    marginTop: 5
  }
});
