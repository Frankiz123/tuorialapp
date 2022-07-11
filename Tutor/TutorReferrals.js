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
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import RNInvitereferrals from "react-native-invitereferrals";
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
import ModalDropdown from "react-native-modal-dropdown";
import * as orginazations from "../universitylists.json";
import { ToggleButton } from "react-native-paper";
import { useLinkProps, useNavigation } from "@react-navigation/native";
import * as degrees from "../degrees.json";
import DatePicker from "react-native-datepicker";
export default function TutorReferrals(props) {
  const { userData } = props;
  const navigation = useNavigation();

  function sendInvite() {
    RNInvitereferrals.invite();
  }
  return (
    <SafeAreaView
      style={{
        backgroundColor: "black",
        height: "100%",
        paddingTop: Platform.OS === "android" ? 25 : 0,
      }}
    >
      <View style={{ backgroundColor: "black", height: 180 }}>
        <View
          style={{
            alignSelf: "flex-end",
            right: 5,
            left: 0,
            top: 0,
            position: "absolute",
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("Tutor")}
            style={{
              justifyContent: "center",
              alignSelf: "flex-end",
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
        </View>
        <View style={{ flexDirection: "row", top: 0 }}>
          <Text style={{ color: "white", fontSize: 15 }}> Your </Text>
          <Text style={{ color: "#F1C411", fontWeight: "bold", fontSize: 15 }}>
            REFERRALS.
          </Text>
        </View>
        <Text style={{ color: "white", top: 0, fontSize: 15 }}>
          {" "}
          Send invites to your friends or family.
        </Text>

        <View
          style={{ justifyContent: "flex-end", alignSelf: "flex-end" }}
        ></View>
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            alignSelf: "center",
            top: 65 / 5 - 0,
          }}
        >
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
              width: 25,
              height: 25,
              borderRadius: 15,
              justifyContent: "center",
              position: "absolute",
              left: Platform.OS === "android" ? 52 : 52,
              top: -5,
            }}
          >
            <Text style={{ fontSize: 14, alignSelf: "center", color: "white" }}>
              0
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
              alignSelf: "center",
            }}
          >
            <Text style={{ alignSelf: "center" }}> 3.79 </Text>
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
            }}
          >
            {" "}
            Prof. {props.userData.Name}
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
          right: 15,
        }}
      >
        <Text style={{ alignSelf: "center", fontWeight: "bold" }}>
          Refer a friend
        </Text>
        <Card
          containerStyle={{
            width: "90%",
            backgroundColor: "#eaeaf4",
            borderColor: "#eaeaf4",
            borderRadius: 10,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                borderWidth: 1,
                width: "90%",
                padding: 5,
                alignSelf: "center",
              }}
            >
              ABC391
            </Text>
            <View
              style={{
                backgroundColor: "#fdc500",
                justifyContent: "center",
                borderRadius: 20,
                width: 35,
                height: 35,
                left: 3,
                alignSelf: "center",
              }}
            >
              <MaterialIcons
                name="file-copy"
                size={20}
                style={{ alignSelf: "center" }}
              />
            </View>
          </View>

          <View style={{ flexDirection: "row", alignSelf: "center" }}>
            {/* <Image
              source={require("../assets/fblogo.png")}
              style={{
                width: 30,
                height: 30,
                justifyContent: "center",
                alignSelf: "center",
                resizeMode: "contain",
                marginTop: 40,
              }}
            />
            <Image
              source={require("../assets/googleicon.png")}
              style={{
                width: 30,
                height: 30,
                justifyContent: "center",
                alignSelf: "center",
                resizeMode: "contain",
                marginTop: 40,
                marginLeft: 20,
              }}
            />
            <Image
              source={require("../assets/linkedin.png")}
              style={{
                width: 30,
                height: 30,
                justifyContent: "center",
                alignSelf: "center",
                resizeMode: "contain",
                marginTop: 40,
                marginLeft: 20,
              }}
            /> */}
            <TouchableOpacity onPress={() => sendInvite()}>
              <Image
                source={require("../assets/whatsapp.png")}
                style={{
                  width: 40,
                  height: 40,
                  justifyContent: "center",
                  alignSelf: "center",
                  resizeMode: "contain",
                }}
              />
            </TouchableOpacity>
          </View>
        </Card>
      </Card>
    </SafeAreaView>
  );
}
