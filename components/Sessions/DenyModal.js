import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  TextInput,
  Platform
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Card } from "react-native-elements";
import Modal from "react-native-modal";
import firestore from "@react-native-firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import ImageUploader from "../../utils/ImageUploader";

const DenyModal = (props) => {
  const [loading, setLoading] = useState(false);
  const [uploadedImg, setUploadedImg] = useState(null);

  const [state, setState] = useState({
    subject: "",
    message: ""
  });
  const handleSubmit = async () => {
    try {
      if (
        state.subject === "" ||
        state.message === "" ||
        uploadedImg === null
      ) {
        alert("Please fillup all mandetory fields!");
      } else if (state.amount > props.availableBalance) {
        alert(`You don't have $${state.amount} in your Tallet!`);
      } else {
        setLoading(true);
        let uri = null;
        if (uploadedImg) {
          uri = await ImageUploader(uploadedImg.uri);
        }
        await firestore().collection("ComplaintRequests").add({
          userId: props.userData.ID,
          tutorId: props.session.id,
          sessionId: props.session.id,
          subject: state.subject,
          message: state.message,
          timestamp: Date.now(),
          status: "pending",
          evidance: uri
        });
        alert("Application sent, waiting for approval from admin");
        props.close();
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  let openImagePickerAsync = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log("clickable");
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
    <Modal isVisible={props.visible}>
      <View
        style={{
          backgroundColor: "#333939",
          width: "100%",
          minHeight: "60%",
          alignSelf: "center",
          borderRadius: 10,
          padding: 5
        }}
      >
        <TouchableOpacity onPress={() => props.close()}>
          <MaterialIcons
            name="clear"
            size={25}
            style={{ alignSelf: "flex-end" }}
            color={"#F1C411"}
          />
        </TouchableOpacity>
        <ScrollView>
          <View style={{ paddingLeft: 10 }}>
            <View
              style={{
                width: "82%",
                marginTop: 10,
                flexDirection: "row",
                justifyContent: "space-between"
              }}
            >
              <Text
                style={{
                  fontSize: 14,

                  color: "white",
                  alignSelf: "center"
                }}
              >
                Subject
              </Text>
              <TextInput
                style={{
                  alignSelf: "center",
                  backgroundColor: "white",
                  width: 150,
                  borderRadius: 5,
                  top: 5
                }}
                onChangeText={(text) => setState({ ...state, subject: text })}
                value={state.subject}
                multiline={true}
                placeholder={"Enter subject"}
              />
            </View>
            <View
              style={{
                width: "82%",
                marginTop: 10,
                flexDirection: "row",
                justifyContent: "space-between"
              }}
            >
              <Text
                style={{
                  fontSize: 14,

                  color: "white",
                  alignSelf: "center"
                }}
              >
                Message
              </Text>
              <TextInput
                style={{
                  alignSelf: "center",
                  backgroundColor: "white",
                  width: 150,
                  borderRadius: 5,
                  top: 5
                }}
                onChangeText={(text) => setState({ ...state, message: text })}
                value={state.message}
                multiline={true}
                placeholder={"Tell us your issue in details"}
                numberOfLines={10}
              />
            </View>
            <TouchableOpacity
              style={{
                width: "82%",
                marginTop: 20,
                flexDirection: "row",
                justifyContent: "space-between"
              }}
              onPress={() => openImagePickerAsync()}
            >
              <Text
                style={{
                  fontSize: 14,
                  borderWidth: 1,
                  borderColor: "#fff",
                  padding: 10,
                  color: "white",
                  alignSelf: "center"
                }}
              >
                {uploadedImg !== null
                  ? uploadedImg.uri.substring(
                      uploadedImg.uri.lastIndexOf("/") + 1
                    )
                  : "Add Evidance"}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%"
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#F1C411",
                width: "40%",
                height: 30,
                borderRadius: 5,
                marginTop: 40,
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
              disabled={loading}
              onPress={() => handleSubmit()}
            >
              {loading ? (
                <ActivityIndicator color={"#000"} />
              ) : (
                <Text style={{ fontWeight: "bold" }}>SUBMIT</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};
export default DenyModal;
