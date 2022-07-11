"use strict";
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";

import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";

import { TouchableOpacity } from "react-native-gesture-handler";

import { MaterialIcons } from "@expo/vector-icons";

export default function UpdateProfile(props) {
  const [filePath, setFilePath] = useState(null);
  const [picked, setPicked] = useState(false);
  const [uploaduri, setuploadURI] = useState(null);
  const { userData } = props;
  const [url, setUrl] = useState(null);
  const [name, setname] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [email, setEmail] = useState(userData.Email);
  const usersCollection = firestore();

  console.log(userData.Email);

  const navigation = useNavigation();

  let ref;

  let openImagePickerAsync = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert(
        "Permission to access camera roll is required! Go to settings and allow manually"
      );
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
    setuploadURI(uploadUri);
    setFilePath(source.uri);
    // uriToBlob(pickerResult.uri);
    var ID = userData.ID;
    _handlePhotoChoice(uri, ID);
  };

  const _handlePhotoChoice = async (uri, ID) => {
    setImageLoading(true);
    try {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          resolve(xhr.response);
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      });

      const ref = storage()
        .ref()
        .child("userimages/" + ID);
      await ref.put(blob);
      const url = await storage()
        .ref("userimages/" + ID)
        .getDownloadURL();
      setUrl(url);
      setPicked(true);
      await usersCollection
        .collection("Users")
        .doc(userData.ID)
        .update({ Photo: url });
      props.userUpdate({ ...userData, Photo: url });
    } catch (err) {
      console.log(err);
    } finally {
      setImageLoading(false);
    }
  };

  //for saving user details
  async function SaveDetail() {
    try {
      setBtnLoading(true);
      await usersCollection
        .collection("Users")
        .doc(userData.ID)
        .update({ Name: name ? name : userData.Name, Email: email });
      props.userUpdate({
        ...userData,
        Name: name ? name : userData.Name,
        Email: email
      });
      alert("Profile updated sucessfully!");
    } catch (err) {
      alert("Something went wrong!");
    } finally {
      setBtnLoading(false);
    }
  }
  useEffect(() => {
    if (userData?.Name) {
      setname(userData.Name);
    }
  }, [userData]);
  return (
    <SafeAreaView
      style={{
        backgroundColor: "#101820FF",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flex: 1
      }}
    >
      <View
        style={{
          zIndex: 1,
          position: "absolute",
          alignSelf: "flex-end",
          top: 50,
          right: 10
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            justifyContent: "center",
            alignSelf: "flex-end",
            backgroundColor: "white",
            width: 35,
            height: 35,
            borderRadius: 35,
            justifyContent: "center"
          }}
        >
          <MaterialIcons
            name="close"
            size={25}
            style={{ alignSelf: "center" }}
            color={"black"}
          />
        </TouchableOpacity>
      </View>

      <View
        style={{
          width: "90%",
          padding: 15,
          backgroundColor: "#eee",
          borderRadius: 15
        }}
      >
        <Text
          style={{
            justifyContent: "center",
            alignItems: "center",
            fontSize: 20,
            alignSelf: "center",
            marginTop: 50,
            color: "black",
            fontWeight: "bold"
          }}
        >
          Update Your Profile
        </Text>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ marginTop: "20%", marginLeft: 20 }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ height: "70%" }}
          >
            <View
              style={{
                flexDirection: "row",
                alignSelf: "center",
                position: "relative",
                backgroundColor: "#0000",
                marginLeft: 15
              }}
            >
              <Image
                source={{ uri: picked ? url : userData.Photo }}
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: 100,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              />
              <TouchableOpacity
                onPress={openImagePickerAsync}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 50,
                  backgroundColor: "orange",
                  marginLeft: -25,
                  marginTop: 150,
                  elevation: 5,
                  zIndex: 9999
                }}
              >
                <View style={{ borderRadius: 10 }}>
                  {imageLoading ? (
                    <ActivityIndicator
                      color={"#000"}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 50,
                        backgroundColor: "#DFBD69"
                      }}
                    />
                  ) : (
                    <Image
                      source={require("../assets/uploadicon.png")}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 50,
                        backgroundColor: "orange"
                      }}
                    />
                  )}
                </View>
              </TouchableOpacity>
            </View>
            <View
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ alignSelf: "center", width: "100%" }}
            >
              {/* <Image
              source={require("../assets/username.png")}
              style={{ width: 20, height: 20, marginTop: 30, right: 5 }}
            /> */}

              <TextInput
                style={{
                  marginTop: 10,
                  width: "75%",
                  height: 40,
                  marginLeft: 10,
                  alignItems: "baseline",
                  borderBottomWidth: 2,
                  textAlign: "left",
                  color: "black",
                  fontSize: 16,
                  borderColor: "white",
                  backgroundColor: "white",
                  alignSelf: "center",
                  padding: 0,
                  paddingLeft: 5,
                  elevation: 1,
                  borderRadius: 30
                }}
                placeholder="Name"
                onChangeText={(text) => setname(text)}
                value={name}
              />

              <TextInput
                style={{
                  marginTop: 10,
                  width: "75%",
                  height: 40,
                  marginLeft: 10,
                  alignItems: "baseline",
                  borderBottomWidth: 2,
                  textAlign: "left",
                  color: "black",
                  fontSize: 16,
                  borderColor: "white",
                  backgroundColor: "white",
                  alignSelf: "center",
                  padding: 0,
                  paddingLeft: 5,
                  elevation: 1,
                  borderRadius: 30
                }}
                placeholder="Email"
                onChangeText={(text) => setEmail(text)}
                value={email}
              />
              <TouchableOpacity
                style={{
                  marginTop: 10,
                  backgroundColor: "#fdc500",
                  width: 100,
                  height: 40,
                  borderRadius: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "center"
                }}
                onPress={() => SaveDetail()}
                disabled={btnLoading}
              >
                {btnLoading ? (
                  <ActivityIndicator color={"#000"} />
                ) : (
                  <Text style={{ alignSelf: "center" }}>Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  TextInput: {
    marginTop: 20,
    width: "55%",
    height: 40,
    alignItems: "baseline",
    borderBottomWidth: 2,
    textAlign: "left",
    color: "black",
    fontSize: 16,
    borderColor: "white",
    backgroundColor: "white",
    alignSelf: "center",
    paddingTop: 15,
    paddingLeft: 5
  }
});
