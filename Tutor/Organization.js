import React, { useContext, useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  FlatList,
  TextInput,
  Dimensions,
  ScrollView
} from "react-native";
import ModalDropdown from "react-native-modal-dropdown";
import * as orginazations from "../universitylists.json";
import { SearchBar, Card } from "react-native-elements";
import { useLinkProps, useNavigation } from "@react-navigation/native";
import { ToggleButton } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import firestore from "@react-native-firebase/firestore";

export default function Organizations(props) {
  const [universityarray, setuniarray] = useState([]);
  const [isData, setdata] = useState(false);
  const [selected, setselected] = useState("");
  const [status, setStatus] = useState("checked");
  const { userData } = props;
  const [data, setData] = useState([]);
  const [value, setvalue] = useState("");
  const navigation = useNavigation();
  const [textvalue, settextvalue] = useState("");
  const [catID, setcatID] = useState(["21"]);
  const [otherUniversityText, setOtherUniversityText] = useState("");
  const [userInfo, setUserInfo] = useState({});

  const uniList = [];
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

  useEffect(() => {
    var unsubscribe;
    if (uniList != null) {
      setuniarray(uniList);
    }
    // if (value != "") {
    //   unsubscribe = firebase
    //     .firestore()
    //     .collection("Users")
    //     .doc(props.userData.ID)
    //     .update({ Organization: value });
    //   let id = JSON.stringify("21");
    //   firebase
    //     .firestore()
    //     .collection("Users")
    //     .doc(userData.ID)
    //     .update({
    //       CategoryID: firebase.firestore.FieldValue.arrayUnion(...catID),
    //     });
    // }

    unsubscribe = firestore()
      .collection("Users")
      .doc(props.userData.ID)
      .onSnapshot((querysnapshot) => {
        setvalue(querysnapshot.data().Organization);
        setUserInfo(querysnapshot.data());
      });
    return () => {
      unsubscribe;
    };
  }, []);

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
  function selectedUni(item) {
    setvalue(item);
    setStatus("checked");
    setdata(false);
    settextvalue("");
    setuniarray(uniList);

    firestore()
      .collection("Users")
      .doc(props.userData.ID)
      .update({ Organization: item });
    firestore()
      .collection("Users")
      .doc(props.userData.ID)
      .update({
        CategoryID: firestore.FieldValue.arrayUnion(...catID)
      });
  }

  const saveOtherUniversity = () => {
    var unsubscribe;
    if (uniList != null) {
      setuniarray(uniList);
    }
    if (value != "" && props.userData.ID != undefined) {
      unsubscribe = firestore()
        .collection("Users")
        .doc(props.userData.ID)
        .update({ Organization: otherUniversityText });
      firestore()
        .collection("Users")
        .doc(userData.ID)
        .update({
          CategoryID: firestore.FieldValue.arrayUnion(...catID)
        });
    }
    setvalue(otherUniversityText);
    setOtherUniversityText("");
    return () => {
      unsubscribe;
    };
  };
  return (
    <SafeAreaView
      style={{
        backgroundColor: "black",
        height: "100%",
        paddingTop: Platform.OS === "android" ? 25 : 0
      }}
    >
      <View style={{ backgroundColor: "black", height: 160 }}>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: "white", fontSize: 15 }}>
              Your{" "}
              <Text
                style={{ color: "#F1C411", fontWeight: "bold", fontSize: 15 }}
              >
                Organisations.
              </Text>
            </Text>

            <Text style={{ color: "white", top: 0, fontSize: 15 }}>
              {" "}
              Update or add new organisations.
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("Tutor")}
            style={{
              justifyContent: "center",
              alignSelf: "flex-end"
            }}
          >
            <View
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
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{ justifyContent: "flex-end", alignSelf: "flex-end" }}
        ></View>
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            alignSelf: "center",
            top: 65 / 5 - 0
          }}
        >
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
              width: 25,
              height: 25,
              borderRadius: 15,
              justifyContent: "center",
              position: "absolute",
              left: 55,
              top: -5
            }}
          >
            <Text style={{ fontSize: 14, alignSelf: "center", color: "white" }}>
              {typeof userInfo?.Organization === "string"
                ? userInfo?.Organization?.length > 0
                  ? 1
                  : 0
                : 0}
            </Text>
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
            <Text style={{ alignSelf: "center" }}> 0 </Text>
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
              bottom: 10
            }}
          >
            {" "}
            {props.userData.NameTitle} {props.userData.Name}
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
              Organisation{" "}
            </Text>
          </View>
        </Card.Title>
        <Card.Divider style={{ backgroundColor: "black" }} />
        <ScrollView style={{ height: "100%" }}>
          <View
            style={{
              backgroundColor: "black",
              flexDirection: "row",
              justifyContent: "space-between",
              top: 20,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 10
            }}
          >
            {status === "checked" ? (
              value != "" ? (
                <Text
                  style={{ color: "white", alignSelf: "center", fontSize: 14 }}
                >
                  {value}
                </Text>
              ) : (
                <Text
                  style={{ color: "white", alignSelf: "center", fontSize: 14 }}
                >
                  Pick
                </Text>
              )
            ) : (
              <TextInput
                value={textvalue}
                onChangeText={(text) => {
                  settextvalue(text), changetext(text);
                }}
                placeholderTextColor="white"
                style={{ color: "white", width: "85%", height: 40 }}
                placeholder="Search"
              />
            )}
            <ToggleButton
              icon="arrow-down"
              style={{
                color: "white",
                backgroundColor: "black",
                alignSelf: "flex-end"
              }}
              color={status === "checked" ? "white" : "green"}
              value="check"
              status={status}
              onPress={onButtonToggle}
            />
          </View>
          {status === "unchecked" ? (
            <View style={{ height: "50%", top: 20 }}>
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
                        padding: 1,
                        borderWidth: 1,
                        borderColor: "#eee7"
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => selectedUni(item)}
                        style={{
                          padding: 7,
                          borderBottomWidth: 1,
                          borderBottomColor: "#eee"
                        }}
                      >
                        <Text style={{ color: "black" }}>{item}</Text>
                      </TouchableOpacity>
                    </View>
                  );
                }}
              />
            </View>
          ) : null}
          <View
            style={{
              top: 20,
              marginTop: 20,
              alignItems: "center",
              paddingBottom: 50
            }}
          >
            <Text style={{ color: "#000" }}>-OR-</Text>
            <View style={{ flexDirection: "row" }}>
              <TextInput
                value={otherUniversityText}
                onChangeText={(text) => {
                  setOtherUniversityText(text);
                }}
                placeholderTextColor="white"
                style={{
                  color: "white",
                  width: "78%",
                  height: 40,
                  backgroundColor: "#000",
                  marginTop: 20
                }}
                placeholder="Type Other Organisation"
              />
              <TouchableOpacity
                style={{
                  alignSelf: "center",
                  backgroundColor: "#fdc500",
                  height: 40,
                  paddingHorizontal: 20,
                  borderRadius: 5,
                  shadowColor: "white",
                  shadowRadius: 0.5,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  elevation: 5,
                  justifyContent: "center",
                  marginLeft: 10,
                  marginTop: 20
                }}
                onPress={() => saveOtherUniversity()}
              >
                <Text
                  style={{
                    color: "#000",
                    alignSelf: "center",
                    alignItems: "center"
                  }}
                >
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {value != "" ? (
            <View>
              <Card
                containerStyle={{
                  width: "100%",
                  alignSelf: "center",
                  borderRadius: 10,
                  shadowOffset: { width: 0, height: 2 },
                  shadowColor: "black",
                  shadowRadius: 2,
                  shadowOpacity: 0.5,
                  backgroundColor: "#eaeaf4",
                  borderColor: "#eaeaf4",
                  // height: "45%",
                  marginTop: 50
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignSelf: "flex-start",
                    right: 5
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#ffd500",
                      justifyContent: "center",
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      marginRight: 10
                    }}
                  >
                    <MaterialIcons
                      name="school"
                      style={{ alignSelf: "center" }}
                      size={20}
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: 14,
                      marginTop: 0,
                      alignSelf: "center",
                      fontWeight: "bold"
                    }}
                  >
                    {value}
                  </Text>
                </View>
              </Card>
            </View>
          ) : null}
        </ScrollView>
      </Card>
    </SafeAreaView>
  );
}
