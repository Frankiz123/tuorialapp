import { useNavigation, useRoute } from "@react-navigation/core";
import React from "react";
import { StyleSheet, Image, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
export default function FullScreenImage() {
  const navigation = useNavigation();
  const { uri, press } = useRoute().params;
  return (
    <View style={{ backgroundColor: "black", flex: 1 }}>
      <TouchableOpacity
        onPress={navigation.goBack}
        style={{
          alignSelf: "flex-end",
          marginTop: 40,
          marginRight: 40
        }}
      >
        <Icon
          name="close"
          onPress={() => {
            navigation.goBack();
            press();
          }}
          color="white"
          size={30}
        />
      </TouchableOpacity>
      <Image
        source={{ uri }}
        style={{ flex: 1, height: "100%", width: "100%" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
