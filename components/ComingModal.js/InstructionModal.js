import React from "react";
import { Text, View, Pressable, ScrollView } from "react-native";
import Modal from "react-native-modal";
import { Entypo } from "@expo/vector-icons";
import { TouchableOpacity, Image } from "react-native";
import { CheckBox } from "react-native-elements/dist/checkbox/CheckBox";

const InstructionModal = ({
  close,
  open,
  heading,
  logo,
  description,
  description2,
  btn,
  single,
  closeOnly,
  dontShowAgain,
  setdontShowAgain
}) => {
  return (
    <Modal isVisible={open}>
      <View
        style={{
          backgroundColor: "#333939",
          width: "110%",
          alignSelf: "center",
          borderRadius: 10
        }}
      >
        <Text
          style={{
            padding: 15,
            textAlign: "center",
            color: "#fff",
            letterSpacing: 1.2,
            fontSize: 17,
            fontWeight: "bold"
          }}
        >
          {heading ? heading : "COMING SOON"}
        </Text>

        <Image
          style={{ width: 50, height: 180, alignSelf: "center" }}
          source={
            logo
              ? require("../../assets/crowdfunding.png")
              : require("../../assets/mrtt.png")
          }
        />

        <ScrollView style={{ height: "30%", marginBottom: -40 }}>
          <Text
            style={{
              padding: 15,
              textAlign: "center",
              color: "#fff",
              lineHeight: 20,
              letterSpacing: 1.2,
              fontWeight: "bold"
            }}
          >
            {single ? "SINGLE DAY AVAILABILITY" : "Multi-DAY AVAILABILITY"}
          </Text>
          {single ? (
            <Text
              style={{
                padding: 15,
                textAlign: "center",
                color: "#fff",
                letterSpacing: 1.2
              }}
            >
              So that Tuto-rittees (consumers) can book your real time live
              services, here you can enter the dates/timings when you are
              available one day at a time to virtually meet them to conduct live
              sessions or discuss their asynchronous package requirements.
            </Text>
          ) : (
            <Text
              style={{
                padding: 15,
                textAlign: "center",
                color: "#fff",
                letterSpacing: 1.2
              }}
            >
              Here, you can enter the dates with common timings when you are
              available in BULK to virtually meet users to conduct live sessions
              or discuss any asynchronous package requirements.
            </Text>
          )}
          <Text
            style={{
              padding: 15,
              textAlign: "center",
              color: "#fff",
              letterSpacing: 1.2
            }}
          >
            You can select date1, date2, date3... with the same time when you
            are available in one step. For example, if you are available every
            Monday/Wednesday/Friday from 6:00 PM to 9:00 PM.
          </Text>
          {single ? (
            <Text
              style={{
                padding: 15,
                textAlign: "center",
                color: "#fff",
                letterSpacing: 1.2
              }}
            >
              Note: To enter common timings over multiple days, you can use the
              ++ button instead.
            </Text>
          ) : (
            <Text
              style={{
                padding: 15,
                textAlign: "center",
                color: "#fff",
                letterSpacing: 1.2
              }}
            >
              Note: To enter different timings for different days, one day at a
              time, you can use the + button instead.
            </Text>
          )}
          <Text
            style={{
              padding: 15,
              textAlign: "center",
              color: "#fff",
              letterSpacing: 1.2
            }}
          >
            Lets start earning and sharing our talents to the world.
          </Text>
        </ScrollView>

        <Text
          style={{
            padding: 15,
            textAlign: "center",
            color: "#fff",
            lineHeight: 20,
            letterSpacing: 1.2
          }}
        >
          {!description2 &&
            "Stay tuned and get ready to explore endless talents."}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <CheckBox
            checked={dontShowAgain}
            onPress={() => setdontShowAgain(!dontShowAgain)}
            checkedColor="white"
          />
          <Text
            style={{
              textAlign: "center",
              color: "#fff",
              letterSpacing: 1.2,
              fontSize: 13,
              fontWeight: "bold"
            }}
          >
            Don't show again
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly"
          }}
        >
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
            onPress={close}
          >
            <Text
              style={{
                color: "#fff",
                letterSpacing: 1.2,
                fontWeight: "bold"
              }}
            >
              Next
            </Text>
          </TouchableOpacity>
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
            onPress={closeOnly}
          >
            <Text
              style={{
                color: "#fff",
                letterSpacing: 1.2,
                fontWeight: "bold"
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default InstructionModal;
