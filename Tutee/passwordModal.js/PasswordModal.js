import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Pressable
} from "react-native";
import Modal from "react-native-modal";
import ModalDropdown from "react-native-modal-dropdown";
import { Entypo } from "@expo/vector-icons";

const PasswordModal = (props) => {
  const [passwordText, setPasswordText] = useState("");
  const handleCheckPassword = () => {
    if (passwordText === "t") {
      props.close();
      props.onSuccess();
    } else {
      alert("Wrong Password!");
    }
  };
  return (
    <Modal isVisible={props.open}>
      <View
        style={{
          backgroundColor: "#333939",
          width: "110%",
          alignSelf: "center",
          borderRadius: 10
        }}
      >
        <Entypo
          name={"warning"}
          size={30}
          color={"#F1C411"}
          style={{ alignSelf: "center", margin: 15 }}
        />
        <Pressable
          onPress={() => props.close()}
          style={{ position: "absolute", top: 10, right: 10 }}
        >
          <Entypo name={"cross"} size={25} color={"#F1C411"} />
        </Pressable>
        <Text
          style={{
            padding: 15,
            textAlign: "center",
            color: "#fff",
            lineHeight: 20,
            letterSpacing: 1.2
          }}
        >
          The Tuto-Rittee dashboard is currently locked and is based on
          invitation only (Enter code if you have one). We will officially
          launch it on July 30, 2021 for all. In the mean time, if you have any
          talents, skills, knowledge that you can share online and earn money,
          make sure to TOGGLE to the EARN portal for Tuto-Rittoes and create
          your profile.
        </Text>
        <TextInput
          secureTextEntry
          placeholder={"Password"}
          style={{
            width: "85%",
            alignSelf: "center",
            padding: 10,
            backgroundColor: "#fff",
            borderRadius: 7
          }}
          value={passwordText}
          onChangeText={(text) => setPasswordText(text)}
        />
        <TouchableOpacity
          style={{
            width: 100,
            padding: 15,
            backgroundColor: "#F1C411",
            alignSelf: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 10,
            marginTop: 15,
            marginBottom: 15
          }}
          onPress={() => {
            handleCheckPassword();
          }}
        >
          <Text>Submit</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default PasswordModal;
