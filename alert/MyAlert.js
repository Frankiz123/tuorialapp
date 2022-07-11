import React from "react";
import { View, Modal, Text, TouchableOpacity, StyleSheet } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";

const MyAlert = (props) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={props.visible}
      onRequestClose={() => {
        props.onClose();
      }}
    >
      <TouchableOpacity
        style={styles.Modal}
        onPress={() => {
          props.onClose();
        }}
      >
        <View style={styles.CardModal}>
          <View>
            <AntDesign
              name={props.icon}
              size={24}
              color={props.iconColor}
              style={styles.icon}
            />
            <Text style={styles.ModalHeader}>{props.title}</Text>
            <View style={{ marginVertical: 15 }}>
              <Text
                style={{
                  textAlign: "center",
                  lineHeight: 24,
                  fontSize: 16,
                  color: "#444"
                }}
              >
                {props.msg}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
const styles = StyleSheet.create({
  Modal: {
    flex: 1,
    backgroundColor: "#0005",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  CardModal: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "85%"
  },
  ModalHeader: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center"
  },
  icon: {
    textAlign: "center",
    marginBottom: 10
  }
});

export default MyAlert;
