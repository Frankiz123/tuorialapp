import React, { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Card } from "react-native-elements";
import SoundPlayer from "react-native-sound-player";
import { AntDesign } from "@expo/vector-icons";

const App = ({ BiddingDetails, showDetail, setShowDetail }) => {
  const [playing, setplaying] = useState(false);

  const setPlay = () => {
    if (playing) {
      try {
        SoundPlayer.playUrl(BiddingDetails.fileUrlRec);
        SoundPlayer.onFinishedPlaying(() => {
          console.log("END");
          setplaying(false);
        });
        setplaying(!playing);
      } catch (e) {
        console.log(`cannot play the sound file`, e);
      }
    } else {
      try {
        SoundPlayer.pause();
        setplaying(!playing);
      } catch (e) {
        console.log(`cannot play the sound file`, e);
      }
    }
  };
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={showDetail}
        onRequestClose={() => {
          setShowDetail(!showDetail);
        }}
      >
        <View style={styles.centeredView}>
          <View
            style={{
              justifyContent: "center",
              width: "80%",
              left: -5
            }}
          >
            <Card
              containerStyle={{
                borderRadius: 25,
                width: "90%",
                backgroundColor: "#101820FF",
                borderColor: "#101820FF",
                paddingBottom: "10%"
              }}
            >
              <AntDesign
                name="close"
                size={24}
                color="white"
                style={{ alignSelf: "flex-end" }}
                onPress={() => {
                  setShowDetail(!showDetail);
                }}
              />
              <View
                style={{
                  flexDirection: "column",
                  alignSelf: "center",
                  left: 0
                }}
              >
                <Image
                  source={{ uri: BiddingDetails.StudentPic }}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 10,
                    alignSelf: "center",
                    marginBottom: 10
                  }}
                />
                <Text style={{ color: "white", fontSize: 14 }}>
                  {BiddingDetails.StudentName}
                </Text>
              </View>
              <Text
                style={{
                  fontWeight: "bold",
                  alignSelf: "center",
                  color: "white",
                  fontSize: 17
                }}
              >
                {BiddingDetails.Topic}{" "}
              </Text>
              <View style={{ flexDirection: "row" }}>
                <View style={{ flexDirection: "column" }}>
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      top: 20
                    }}
                  >
                    Category: {BiddingDetails.Category}{" "}
                  </Text>
                  <Text
                    style={{
                      color: "white",
                      top: 20
                    }}
                  >
                    {BiddingDetails.Type}{" "}
                  </Text>
                  <Text
                    style={{
                      color: "white",
                      top: 20
                    }}
                  >
                    Bidding starting at: {BiddingDetails.Goal}$/hr.{" "}
                  </Text>

                  <Text
                    style={{
                      color: "white",
                      top: 20
                    }}
                  >
                    Delivery Days:{" "}
                    {BiddingDetails?.expectedDeliveryDate
                      ? BiddingDetails?.expectedDeliveryDate
                      : "N/A"}
                  </Text>
                  <Text
                    style={{
                      color: "white",
                      top: 20
                    }}
                  >
                    No. of Video Sessions:{" "}
                    {BiddingDetails?.noOfVideo
                      ? BiddingDetails?.noOfVideo
                      : "N/A"}
                  </Text>

                  <Text
                    style={{
                      color: "white",
                      top: 20
                    }}
                  >
                    Description: {BiddingDetails?.noOfVideo}
                  </Text>

                  {BiddingDetails.fileUrl != "" && (
                    <View style={{ flexDirection: "row", top: 20 }}>
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "400",
                          fontStyle: "italic",
                          alignSelf: "center"
                        }}
                      >
                        Document
                      </Text>
                      <TouchableOpacity
                        style={{
                          width: 25,
                          height: 25,
                          backgroundColor: "#F1C411",
                          justifyContent: "center",
                          borderRadius: 20,
                          left: 5
                        }}
                      >
                        <MaterialIcons
                          name="file-download"
                          size={15}
                          style={{ alignSelf: "center" }}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                  {BiddingDetails.Timer != 0 ? (
                    <Text style={{ color: "#F1C411", width: 200, top: 20 }}>
                      Rittee's maximum budget has not been reached yet.
                    </Text>
                  ) : (
                    <Text style={{ color: "white", top: 20 }}>
                      Rittee's maximum budget has been reached.
                    </Text>
                  )}
                  {BiddingDetails.fileUrlRec != "" && (
                    <View style={{ flexDirection: "row", top: 20 }}>
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "400",
                          fontStyle: "italic",
                          alignSelf: "center"
                        }}
                      >
                        Play Recording
                      </Text>
                      <TouchableOpacity
                        style={{
                          width: 25,
                          height: 25,
                          backgroundColor: "#F1C411",
                          justifyContent: "center",
                          borderRadius: 20,
                          left: 5
                        }}
                        onPress={setPlay}
                      >
                        <MaterialIcons
                          name={!playing ? "play-arrow" : "pause"}
                          size={15}
                          style={{ alignSelf: "center" }}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </Card>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)"
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

export default App;
