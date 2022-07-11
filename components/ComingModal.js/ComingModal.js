import React from "react";
import { Text, View, Pressable } from "react-native";
import Modal from "react-native-modal";
import { Entypo } from "@expo/vector-icons";
import { TouchableOpacity, Image } from "react-native";

const ComingModal = ({ close, open }) => {
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
          COMING SOON
        </Text>

        <Image
          style={{ width: 50, height: 180, alignSelf: "center" }}
          source={require("../../assets/mrtt.png")}
        />

        <Text
          style={{
            padding: 15,
            textAlign: "center",
            color: "#fff",
            lineHeight: 20,
            letterSpacing: 1.2
          }}
        >
          Tutoritto is only available for rittoes (suppliers) at this time. The
          tuto-rittee (consumers) dashboard will be open by the end of october.
        </Text>
        <Text
          style={{
            padding: 15,
            textAlign: "center",
            color: "#fff",
            lineHeight: 20,
            letterSpacing: 1.2
          }}
        >
          Stay tuned and get ready to explore endless talents.
        </Text>

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
            Cool
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default ComingModal;
