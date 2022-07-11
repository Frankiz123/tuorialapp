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
import { TextInput } from "react-native-gesture-handler";
import LinearGradient from "react-native-linear-gradient";
import StarRating from "react-native-star-rating";
import Modal from "react-native-modal";
import { Card } from "react-native-elements";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useLinkProps, useNavigation } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import * as VideoThumbnails from "expo-video-thumbnails";
import MyLoader from "../components/loader/MyLoader";

import { Video, AVPlaybackStatus } from "expo-av";

import * as demodata from "../demodata.json";

import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
export default function PromoVideo(props) {
  const { userData } = props;

  const [type, settype] = useState("");
  const [status, setStatus] = React.useState({});
  const video = React.useRef(null);
  const [filePath, setFilePath] = useState(null);
  const [videoURL, setURL] = useState(null);
  const [picked, setPicked] = useState(false);
  const [size, setsize] = useState("");
  const [videocount, setvideocount] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [title, settitle] = useState("");
  const fileUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      videoMaxDuration: 3000,
      thumbnail: true,
      aspect: [4, 3],
      quality: 1
    });
    if (result.duration > 30000) {
      console.log("very big");
      Alert.alert("Choose a video less than 30 seconds");
      return;
    }
    settype(result.type);
    console.log("image data ", result);
    if (!result.cancelled) {
      let source = { uri: result.uri };
      setFilePath(source.uri);
      let uri = result.uri;
      const ID = props.userData.ID;
      const fileSize = await getFileSize(uri);
      if (fileSize <= 5537813) {
        handleVideoDatabase(uri, ID);
      } else {
        console.log("sorry");
        Alert.alert("Choose a file size less than 5MB");
      }
    } else {
      console.log("cancelled by user");
    }
  };
  const getFileSize = async (fileUri) => {
    return new Promise(async (resolve, reject) => {
      let fileInfo = await FileSystem.getInfoAsync(fileUri);
      console.log("size ", fileInfo.size);
      setsize(fileInfo.size);
      resolve(fileInfo.size);
    });
  };
  const generateThumbnail = async (videoURI) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { uri } = await VideoThumbnails.getThumbnailAsync(videoURI, {
          time: 15000
        });
        resolve(uri);
      } catch (e) {
        console.warn(e);
        reject(e);
      }
    });
  };
  const handleVideoDatabase = async (uri, ID) => {
    try {
      setLoading(true);
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
      const ref = storage()
        .ref()
        .child("PromoVideo/" + ID);
      let snapshot = await ref.put(blob);
      // const url = await snapshot.ref.getDownloadURL();
      const url = await storage()
        .ref("PromoVideo/" + ID)
        .getDownloadURL();
      let thumbnail = await generateThumbnail(url);

      const blob2 = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          resolve(xhr.response);
        };
        xhr.responseType = "blob";
        xhr.open("GET", thumbnail, true);
        xhr.send(null);
      });
      const ref2 = storage()
        .ref()
        .child("PromoVideoThumbnail/" + ID);
      await ref2.put(blob2);
      thumbnail = await storage()
        .ref("PromoVideoThumbnail/" + ID)
        .getDownloadURL();

      var number2 = parseInt(videocount);
      var videocounttemp = 1;
      // var videocounttemp = number2 + 1;
      firestore()
        .collection("Users")
        .doc(props.userData.ID)
        .update({ VideoCount: videocounttemp });
      firestore()
        .collection("Users")
        .doc(props.userData.ID)
        .update({ Video: url, VideoThumbnail: thumbnail });
      setURL(url);
      setPicked(true);
    } catch (err) {
    } finally {
      setLoading(false);
    }
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
  async function getuserInfo() {
    await firestore()
      .collection("Users")
      .doc(props.userData.ID)
      .onSnapshot((querysnapshot) => {
        setURL(querysnapshot.data().Video);
        setvideocount(querysnapshot.data().VideoCount);
        let totalavg = (
          Math.round(querysnapshot.data().TotalAverage * 100) / 100
        ).toFixed(2);
        setaverage(totalavg);
        settitle(querysnapshot.data().NameTitle);
      });
  }
  useEffect(() => {
    getuserInfo();
  }, []);

  return (
    <SafeAreaView
      style={{
        backgroundColor: "black",
        height: "100%",
        paddingTop: Platform.OS === "android" ? 25 : 0
      }}
    >
      <MyLoader loading={loading} color={"#fff"} />
      <View style={{ backgroundColor: "black", height: 180 }}>
        <View
          style={{
            flexDirection: "row"
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ color: "white", fontSize: 15 }}>
              Your{" "}
              <Text
                style={{ color: "#F1C411", fontWeight: "bold", fontSize: 15 }}
              >
                {" "}
                PROMO VIDEO.
              </Text>
            </Text>

            <Text style={{ color: "white", top: 0, fontSize: 15 }}>
              You have 30 seconds to impress.{"😉"}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => submitToggle()}
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
                {videocount}
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
              width: 55,
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
          width: "100%",
          backgroundColor: "white",
          right: 15,
          bottom: 15,
          height: "100%"
        }}
      >
        <Card
          containerStyle={{
            backgroundColor: "#101820FF",
            borderColor: "#101820FF",
            width: "auto",
            height: "70%",
            borderRadius: 15,
            shadowOffset: { width: 0, height: 2 },
            shadowColor: "black",
            shadowRadius: 2,
            shadowOpacity: 0.5
          }}
        >
          <View
            style={{
              color: "white",
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <Text style={{ color: "white" }}>Add your promo video</Text>
            <TouchableOpacity onPress={() => fileUpload()}>
              <MaterialIcons
                name="file-upload"
                size={20}
                color={"white"}
                style={{ alignSelf: "center", bottom: 2 }}
              />
            </TouchableOpacity>
          </View>
          <Video
            ref={video}
            style={styles.backgroundVideo}
            source={{
              uri: videoURL
            }}
            useNativeControls
            resizeMode="contain"
            isLooping
            onPlaybackStatusUpdate={(status) => setStatus(() => status)}
          />
        </Card>
      </Card>
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
