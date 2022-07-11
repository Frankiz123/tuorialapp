import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Platform,
  Modal,
  Alert,
  Pressable,
  KeyboardAvoidingView
} from "react-native";
import ChatStyle from "../Chat.style";
import { useNavigation } from "@react-navigation/native";

const Settings = (props) => {
  const navigation = useNavigation();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={props.open}
      onRequestClose={props.close}
    >
      <Pressable onPress={props.close} style={styles.centeredView}>
        <Pressable onPress={() => {}} style={styles.modalView}>
          <Pressable
            style={[styles.button, { marginBottom: 10 }]}
            onPress={() => {
              props.openForm();
              props.close();
            }}
          >
            <Text style={styles.textStyle}>Create custom package</Text>
          </Pressable>
          <Pressable
            style={[styles.button]}
            onPress={() => {
              props.close();
              navigation.navigate("CustomPackages", {
                senderId: props.senderId,
                receiverId: props.receiverId,
                chat: props.item
              });
            }}
          >
            <Text style={styles.textStyle}>Show all custom packages</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  ...ChatStyle
});

export default Settings;
