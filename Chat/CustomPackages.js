import React, { useState, useEffect, useRef } from "react";
import { FlatList } from "react-native";
import { Dimensions } from "react-native";
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
import ChatStyle from "./Chat.style";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useNavigation } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";
import MyLoader from "../components/loader/MyLoader";
import BookModal from "./modals/BookModal";

const Settings = (props) => {
  const navigation = useNavigation();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookModalVisible, setBookModalVisible] = useState(false);

  const handleChangeStatus = (chat, status) => {
    let senderId = props.userData.ID;
    let receiverId = item.ID;
    let chatId = "";
    if (senderId < receiverId) {
      chatId = senderId + receiverId;
    } else {
      chatId = receiverId + senderId;
    }
    firestore()
      .collection("Chats")
      .doc(chatId)
      .collection("messages")
      .doc(chat.id)
      .update({ status });
  };
  const loadCustomPackages = async () => {
    try {
      const { receiverId, senderId } = props.route.params;
      setLoading(true);
      let chatId = "";
      if (senderId < receiverId) {
        chatId = senderId + receiverId;
      } else {
        chatId = receiverId + senderId;
      }
      firestore()
        .collection("Chats")
        .doc(chatId.trim())
        .collection("messages")
        .where("type", "==", "customOffer")
        // .orderBy("timestamp")
        .onSnapshot((querySnapshot) => {
          const allMessages = [];
          if (querySnapshot) {
            querySnapshot.forEach((doc) => {
              if (doc) allMessages.push(doc.data());
            });
          }
          setPackages([...allMessages]);
          setLoading(false);
        });
    } catch (err) {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadCustomPackages();
  }, []);
  return (
    <View
      style={{
        backgroundColor: "#000",
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height
      }}
    >
      <MyLoader loading={loading} color={"#fff"} />
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.back}
            onPress={() => navigation.goBack()}
            style={{ paddingHorizontal: 10 }}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={25}
              color={"#eee"}
            />
          </TouchableOpacity>
          <View style={styles.headerTitle}>
            <Text style={styles.headerTitleText}>{"All custom packages"}</Text>
          </View>
        </View>
        <MaterialCommunityIcons.Button
          name="cog-outline"
          size={25}
          color={"#0e0e0e"}
          style={{ backgroundColor: "#0e0e0e" }}
          onPress={() => setModalVisible(!modalVisible)}
        />
      </View>
      <FlatList
        data={packages}
        renderItem={({ item }) => (
          <View
            style={[
              styles.msgCustomPackage,
              {
                backgroundColor:
                  item.tier === "Bronze"
                    ? "#cd7f32"
                    : item.tier === "Silver"
                    ? "#D9D8D6"
                    : item.tier === "Gold"
                    ? "#DFBD69"
                    : item.tier === "Platinum"
                    ? "#E5E4E2"
                    : "#333939"
              }
            ]}
          >
            <View style={styles.msgCustomPackageTop}>
              <View style={styles.msgCustomPackageLeft}>
                <Text style={styles.msgCustomPackageName}>{item.name}</Text>
                <Text style={styles.msgCustomPackageTier}>{item.tier}</Text>
              </View>
              <View style={styles.msgCustomPackageRight}>
                <Text style={styles.msgCustomePackagePrice}>${item.price}</Text>
              </View>
            </View>
            <View style={styles.msgCustomPackageMiddle}>
              <Text style={styles.msgCustomePackageText}>
                Live Sessions: {item.totalLiveSession}
              </Text>
              <Text style={styles.msgCustomePackageText}>
                Delivery Days: {item.deliveryDays}
              </Text>
              <Text style={styles.msgCustomePackageText}>
                Number of revisions: {item.totalRevisions}
              </Text>
              <Text style={styles.msgCustomePackageText}>
                {item.description}
              </Text>
            </View>
            {item.status === "pending" ? (
              <View style={styles.msgCustomPackageBottom}>
                {item.senderId === props.route.params.senderId ? (
                  <Pressable
                    style={[
                      styles.msgCustomePackageBtn,
                      { backgroundColor: "#0e0e0e" }
                    ]}
                    onPress={() => {
                      handleChangeStatus(item, "withdrawn");
                    }}
                  >
                    <Text
                      style={[
                        styles.msgCustomePackageBtnText,
                        { color: "#fff" }
                      ]}
                    >
                      Withdraw
                    </Text>
                  </Pressable>
                ) : (
                  <>
                    <Pressable
                      style={[
                        styles.msgCustomePackageBtn,
                        { backgroundColor: "#0e0e0e" }
                      ]}
                      onPress={() => {
                        setBookModalVisible(true);
                      }}
                    >
                      <Text
                        style={[
                          styles.msgCustomePackageBtnText,
                          { color: "#fff" }
                        ]}
                      >
                        Accept
                      </Text>
                    </Pressable>
                    <Pressable
                      style={styles.msgCustomePackageBtn}
                      onPress={() => {
                        handleChangeStatus(chat, "rejected");
                      }}
                    >
                      <Text style={styles.msgCustomePackageBtnText}>
                        Decline
                      </Text>
                    </Pressable>
                  </>
                )}
              </View>
            ) : (
              <>
                {item.status === "withdrawn" && (
                  <Text style={{ color: "#f00" }}>
                    *This offer has been withdrawn
                  </Text>
                )}
                {item.status === "rejected" && (
                  <Text style={{ color: "#f00" }}>
                    *This offer has been rejected
                  </Text>
                )}
                {item.status === "inProgress" && (
                  <Text>*This offer is in progress</Text>
                )}
              </>
            )}
          </View>
        )}
        keyExtractor={(item) => item.toString()}
        contentContainerStyle={{
          paddingBottom: 50
        }}
        ListEmptyComponent={
          <View>
            <Text style={{ color: "#fff", textAlign: "center" }}>
              No custom packages found!
            </Text>
          </View>
        }
      />
      <BookModal
        senderId={props.route.params.senderId}
        receiverId={props.route.params.receiverId}
        item={props.chat}
        visible={bookModalVisible}
        close={() => {
          setBookModalVisible(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  ...ChatStyle
});

export default Settings;
