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
  Dimensions,
  Alert
} from "react-native";
import { Rating, AirbnbRating } from "react-native-ratings";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/Feather";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import LinearGradient from "react-native-linear-gradient";
import StarRating from "react-native-star-rating";
import Modal from "react-native-modal";
import { Card } from "react-native-elements";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useLinkProps, useNavigation } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";

import { Video, AVPlaybackStatus } from "expo-av";

import * as demodata from "../demodata.json";
import { Linking } from "react-native";
import { ActivityIndicator } from "react-native";

import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import { Pressable } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

export default function Samples(props) {
  const { userData } = props;
  const [type, settype] = useState("");
  const [status, setStatus] = React.useState({});
  const video = React.useRef(null);
  const [filePath, setFilePath] = useState(null);
  const [videoURL, setURL] = useState(null);
  const [picked, setPicked] = useState(false);
  const [size, setsize] = useState("");
  const [sampleData, setSampleData] = useState([]);
  const navigation = useNavigation();
  const [imageData, setImageData] = useState([]);
  const [videoLinks, setvideoLinks] = useState([]);
  const [sampleLink, setSampleLink] = useState("");
  const [isEditable, setEditable] = useState(false);
  const [isuploading, setuploading] = useState(true);
  const [deletedItem, setDeletedItem] = useState({});
  const [isVideoFormOn, setVideoFromOn] = useState(false);
  const [youtubeLink, setYoutubeLink] = useState("");
  const [playing, setPlaying] = useState(false);

  const fileUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      thumbnail: true,
      quality: 1
    });
    setPicked(true);
    setuploading(true);
    settype(result.type);
    console.log("image data ", result);
    if (!result.cancelled) {
      let source = { uri: result.uri };
      setFilePath(source.uri);
      let uri = result.uri;
      const ID = props.userData.ID;
      getFileSize(uri);
      if (size <= 3337813) {
        handleVideoDatabase(uri, ID);
      } else {
        console.log("sorry");
        Alert.alert("Choose an image size less than 3MB");
      }
    } else {
      console.log("too big");
      setuploading(false);
      setPicked(false);
    }
  };
  const getFileSize = async (fileUri) => {
    let fileInfo = await FileSystem.getInfoAsync(fileUri);
    console.log("size ", fileInfo.size);
    setsize(fileInfo.size);
    return fileInfo.size;
  };
  const handleVideoDatabase = async (uri, ID) => {
    console.log("reached here");
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        resolve(xhr.response);
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
    let now = Date.now();
    const ref = storage()
      .ref()
      .child("Sample/" + `${props.userData.ID}_${now}`);
    let snapshot = await ref.put(blob);
    // const url = await snapshot.ref.getDownloadURL();
    const url = await storage()
      .ref("Sample/" + `${props.userData.ID}_${now}`)
      .getDownloadURL();
    let SampleObject = [
      {
        MediaType: "Image",
        Url: url,
        Path: "Sample/" + `${props.userData.ID}_${now}`
      }
    ];
    firestore()
      .collection("Users")
      .doc(props.userData.ID)
      .update({
        Sample: firestore.FieldValue.arrayUnion(...SampleObject),
        isSample: true
      });
    setuploading(false);
    setPicked(false);
    setURL(url);
  };
  function onBuffer() {
    console.log("video buffered");
  }
  function submitToggle(isHome) {
    console.log("function toggle", isHome);

    navigation.navigate("Tutor");
  }
  function videoError() {
    console.log("video error");
  }
  const [average, setaverage] = useState("");
  const [editedIndex, seteditedIndex] = useState(0);
  const [editedSample, seteditedsample] = useState([]);
  const [isDeleted, setdeleted] = useState(false);
  function deleteItems(item) {
    var itemList = [...sampleData];
    let index = itemList.filter((e) => e.Url !== item.Url);
    //itemList.splice(index, 1);
    seteditedsample(index);
    setSampleData(index);
    setImageData(index.filter((pic) => pic.MediaType === "Image"));
    setvideoLinks(index.filter((vid) => vid.MediaType === "Video"));
    let count = sampleData.length;
    var number1 = parseInt(count);
    let updatedcount = number1 - 1;
    seteditedIndex(updatedcount);
    setdeleted(true);
    setDeletedItem(item);
  }

  function SaveEdit() {
    if (isDeleted === true) {
      firestore()
        .collection("Users")
        .doc(props.userData.ID)
        .update({ Sample: editedSample });
      if (deletedItem.MediaType === "Image") {
        var desertRef = storage().ref(deletedItem.Path);
        // Delete the file
        desertRef
          .delete()
          .then(function () {
            // File deleted successfully
            setDeletedItem({});
            setEditable(false);
          })
          .catch(function (error) {
            // Uh-oh, an error occurred!
          });
      } else {
        setDeletedItem({});
        setEditable(false);
      }
    } else {
      Alert.alert("You have not deleted anything.");
      setEditable(false);
    }
  }

  useEffect(() => {
    firestore()
      .collection("Users")
      .doc(props.userData.ID)
      .onSnapshot((querysnapshot) => {
        if (
          querysnapshot.data().Sample != null &&
          querysnapshot.data().Sample.length
        ) {
          let imageData = querysnapshot
            .data()
            .Sample.filter((e) => e.MediaType === "Image");

          let videodata = querysnapshot
            .data()
            .Sample.filter((e) => e.MediaType === "Video");
          setvideoLinks(videodata);
          setImageData(imageData);
          setSampleData(querysnapshot.data().Sample);
        } else {
          setSampleData([]);
        }
        let totalavg = (
          Math.round(querysnapshot.data().TotalAverage * 100) / 100
        ).toFixed(2);
        setaverage(totalavg);
      });
  }, []);
  function matchYoutubeUrl(url) {
    var p =
      /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    if (url.match(p)) {
      return url.match(p)[1];
    }
    return false;
  }
  const handleAddVideoSamples = async () => {
    const isValid = matchYoutubeUrl(youtubeLink);
    if (!isValid) {
      alert("Invalid youtube URL");
    } else {
      let SampleObject = [
        {
          MediaType: "Video",
          Url: youtubeLink,
          VideoId: isValid
        }
      ];
      firestore()
        .collection("Users")
        .doc(props.userData.ID)
        .update({
          Sample: firestore.FieldValue.arrayUnion(...SampleObject),
          isSample: true
        });
      setVideoFromOn(false);
    }
  };
  return (
    <SafeAreaView
      style={{
        backgroundColor: "black",
        height: "100%",
        paddingTop: Platform.OS === "android" ? 25 : 0,
        width: "100%"
      }}
    >
      <View style={{ backgroundColor: "black", width: "100%" }}>
        <View
          style={{
            flexDirection: "row",
            width: "100%"
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ color: "white", fontSize: 15 }}>
              Your{" "}
              <Text
                style={{ color: "#F1C411", fontWeight: "bold", fontSize: 15 }}
              >
                {" "}
                SAMPLES.
              </Text>
            </Text>
            <Text style={{ color: "white", top: 0, fontSize: 15 }}>
              Show off your expertise and skills.
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
        </View>

        <View
          style={{ justifyContent: "flex-end", alignSelf: "flex-end" }}
        ></View>
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            alignSelf: "center",
            top: 120 / 5 - 7,
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
                {sampleData.length}
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
              {average}{" "}
            </Text>
            <MaterialIcons
              name="star"
              style={{ color: "black", alignSelf: "center" }}
            />
          </View>
        </View>
        <Text
          style={{
            alignSelf: "center",
            fontSize: 16,
            color: "white"
          }}
        >
          {props.userData.NameTitle} {props.userData.Name}
        </Text>
      </View>

      <ScrollView
        style={{
          width: "100%",
          backgroundColor: "white",

          height: "100%"
        }}
      >
        <Card
          containerStyle={{
            backgroundColor: "#101820FF",
            borderColor: "#101820FF",
            width: "85%",
            height: "auto",
            borderRadius: 15,
            shadowOffset: { width: 0, height: 2 },
            shadowColor: "black",
            shadowRadius: 2,
            shadowOpacity: 0.5,
            alignSelf: "center"
          }}
        >
          <Text style={{ color: "white", fontSize: 16, alignSelf: "center" }}>
            Add your samples
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              paddingBottom: 30
            }}
          >
            <View style={{ flexDirection: "column", alignSelf: "center" }}>
              <TouchableOpacity
                style={{ flexDirection: "row", top: 10, alignSelf: "center" }}
                onPress={() => fileUpload()}
              >
                <MaterialIcons
                  name="image"
                  size={80}
                  color={"white"}
                ></MaterialIcons>
              </TouchableOpacity>
              {picked === true && isuploading === true ? (
                <ActivityIndicator
                  color={"white"}
                  style={{ marginTop: 20 }}
                ></ActivityIndicator>
              ) : null}
            </View>
            <Text
              style={{
                color: "white",
                alignSelf: "center",
                top: 12,
                fontSize: 20
              }}
            >
              OR
            </Text>

            <Pressable
              style={{
                marginTop: 15,
                alignSelf: "center",
                flexDirection: "row"
              }}
              onPress={() => {
                setVideoFromOn(!isVideoFormOn);
              }}
            >
              <MaterialIcons
                name="video-collection"
                size={80}
                color={"white"}
              ></MaterialIcons>
            </Pressable>
          </View>
          {isVideoFormOn && (
            <View>
              <TextInput
                style={{
                  backgroundColor: "white",
                  width: "100%",
                  borderRadius: 5,
                  top: 5
                }}
                onChangeText={(text) => setYoutubeLink(text)}
                placeholder={"Youtube link to your sample"}
                valu={youtubeLink}
              />
              <TouchableOpacity
                style={{
                  alignSelf: "center",
                  backgroundColor: "#F1C411",
                  height: 30,
                  paddingHorizontal: 20,
                  shadowColor: "white",
                  shadowRadius: 0.5,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  elevation: 5,
                  top: 5,
                  justifyContent: "center",
                  width: "100%",
                  marginVertical: 20
                }}
                onPress={() => handleAddVideoSamples()}
              >
                <Text
                  style={{
                    color: "white",
                    alignSelf: "center",
                    alignItems: "center"
                  }}
                >
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Card>
        {sampleData.length && sampleData != null ? (
          <Card
            containerStyle={{
              backgroundColor: "#101820FF",
              borderColor: "#101820FF",
              width: "85%",
              height: "auto",
              borderRadius: 15,
              shadowOffset: { width: 0, height: 2 },
              shadowColor: "black",
              shadowRadius: 2,
              shadowOpacity: 0.5,
              alignSelf: "center"
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignSelf: "center"
              }}
            >
              <Text
                style={{ color: "white", fontSize: 16, alignSelf: "center" }}
              >
                Your existing samples
              </Text>
              <TouchableOpacity
                onPress={() => {
                  if (sampleData.length && sampleData != null) {
                    setEditable(!isEditable);
                  }
                }}
                style={{ width: 30, height: "auto", alignSelf: "center" }}
              >
                <Icon
                  name="edit-2"
                  size={15}
                  style={{
                    color: "white",
                    alignSelf: "center"
                  }}
                />
              </TouchableOpacity>
            </View>

            {imageData.map((item, i) => {
              let images = item.Url;
              return (
                <View
                  key={i}
                  style={{
                    marginTop: 10,
                    flexDirection: "row",
                    justifyContent: "space-between"
                  }}
                >
                  <Image
                    source={{ uri: images }}
                    style={{ width: 200, height: 100 }}
                  />
                  {isEditable === true && sampleData != "" ? (
                    <TouchableOpacity
                      onPress={() => deleteItems(item)}
                      style={{ alignSelf: "flex-start", left: 5 }}
                    >
                      <MaterialIcons name="delete" size={20} color={"white"} />
                    </TouchableOpacity>
                  ) : null}
                </View>
              );
            })}

            {videoLinks.map((item, i) => {
              return (
                <View
                  key={i}
                  style={{
                    marginTop: 10,
                    flexDirection: "row",
                    justifyContent: "space-between"
                  }}
                >
                  <React.Fragment key={i}>
                    <View
                      style={{
                        margin: "1%",
                        width: 200,
                        backgroundColor: "#ff00"
                      }}
                    >
                      <YoutubePlayer
                        height={100}
                        play={playing}
                        videoId={item.VideoId}
                        // onChangeState={onStateChange}
                        onFullScreenChange={(status) => console.log("ok")}
                      />
                    </View>
                  </React.Fragment>
                  {isEditable === true && sampleData != "" ? (
                    <TouchableOpacity
                      onPress={() => deleteItems(item)}
                      style={{ alignSelf: "flex-start", left: 5 }}
                    >
                      <MaterialIcons name="delete" size={20} color={"white"} />
                    </TouchableOpacity>
                  ) : null}
                </View>
              );
            })}
            {isEditable === true ? (
              <TouchableOpacity
                onPress={() => SaveEdit()}
                style={{
                  width: "30%",
                  height: 30,

                  backgroundColor: "#F1C411",
                  marginTop: 20,
                  justifyContent: "center",
                  alignSelf: "center",
                  borderRadius: 10
                }}
              >
                <Text style={{ alignSelf: "center" }}>Save</Text>
              </TouchableOpacity>
            ) : null}
          </Card>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  column: {
    flexDirection: "column"
  },
  row: {
    flexDirection: "row"
  },
  backgroundVideo: {
    top: 50,
    left: 0,
    bottom: 0,
    right: 0,
    width: "100%",
    height: "70%"
  }
});
