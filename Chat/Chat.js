// CODE ADDED BY UDDIPAN
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
import ChatStyle from "./Chat.style";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

// Icon
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// component
// import Body from '../../components/template/body/Body';
import Settings from "./modals/Settings";
import CreateModal from "./modals/CreateModal";
import BookModal from "./modals/BookModal";

//Utils
import ImageUploader from "../utils/ImageUploader";
import SendNotification from "../utils/SendNotification";
import SendEmail from "../utils/SendEmail";
import GetEmailTemplate from "../utils/GetEmailTemplate";

import firestore from "@react-native-firebase/firestore";
import { Dimensions } from "react-native";

const Chat = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [createCustomPackage, setcreateCustomPackage] = useState(false);
  const [bookModalVisible, setBookModalVisible] = useState(false);
  const [selectedCustomPackage, setSelectedCustomPackage] = useState({});

  const scrollViewRef = useRef();
  const navigation = useNavigation();
  const { item } = props.route.params;
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [uploadedImg, setUploadedImg] = useState(null);

  let openImagePickerAsync = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log("clickable");
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
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
    setUploadedImg(source);
    // setuploadURI(uploadUri);
    // setFilePath(source.uri);
    // setPicked(true);
    // // uriToBlob(pickerResult.uri);
    // var ID = userData.ID;
    // _handlePhotoChoice(uri, ID);
  };
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
  const renderChat = () => {
    let jsx = [];
    chats.map((chat, i) => {
      if (chat?.type === "customOffer") {
        jsx.push(
          <View
            style={[
              styles.msgCustomPackage,
              {
                backgroundColor:
                  chat.tier === "Bronze"
                    ? "#cd7f32"
                    : chat.tier === "Silver"
                    ? "#D9D8D6"
                    : chat.tier === "Gold"
                    ? "#DFBD69"
                    : chat.tier === "Platinum"
                    ? "#E5E4E2"
                    : "#333939"
              }
            ]}
          >
            <View style={styles.msgCustomPackageTop}>
              <View style={styles.msgCustomPackageLeft}>
                <Text style={styles.msgCustomPackageName}>{chat.name}</Text>
                <Text style={styles.msgCustomPackageTier}>{chat.tier}</Text>
              </View>
              <View style={styles.msgCustomPackageRight}>
                <Text style={styles.msgCustomePackagePrice}>${chat.price}</Text>
              </View>
            </View>
            <View style={styles.msgCustomPackageMiddle}>
              <Text style={styles.msgCustomePackageText}>
                Live Sessions:{" "}
                {chat.totalLiveSession === -1 ? "N/A" : chat.totalLiveSession}
              </Text>
              <Text style={styles.msgCustomePackageText}>
                Delivery Days:{" "}
                {chat.deliveryDays === -1 ? "N/A" : chat.deliveryDays}
              </Text>
              <Text style={styles.msgCustomePackageText}>
                Number of revisions:{" "}
                {chat.totalRevisions === -1 ? "N/A" : chat.totalRevisions}
              </Text>
              <Text style={styles.msgCustomePackageText}>
                {chat.description}
              </Text>
              {Array.isArray(chat.extraFeatures) &&
                chat.extraFeatures.length > 0 && (
                  <View>
                    <Text style={styles.msgExtraHeading}>Extra Features</Text>
                    {chat.extraFeatures.map((extra, j) => (
                      <View>
                        <Text>Title: {extra.title}</Text>
                        <Text>Description: {extra.description}</Text>
                      </View>
                    ))}
                  </View>
                )}
            </View>
            {chat.status === "pending" ? (
              <View style={styles.msgCustomPackageBottom}>
                {chat.senderId === props.userData.ID ? (
                  <Pressable
                    style={[
                      styles.msgCustomePackageBtn,
                      { backgroundColor: "#0e0e0e" }
                    ]}
                    onPress={() => {
                      handleChangeStatus(chat, "withdrawn");
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
                        setSelectedCustomPackage(chat);
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
                {chat.status === "withdrawn" && (
                  <Text style={{ color: "#f00" }}>
                    *This offer has been withdrawn
                  </Text>
                )}
                {chat.status === "rejected" && (
                  <Text style={{ color: "#f00" }}>
                    *This offer has been rejected
                  </Text>
                )}
                {chat.status === "inProgress" && (
                  <Text>*This offer is in progress</Text>
                )}
              </>
            )}
          </View>
        );
      } else {
        if (chat.senderId === props.userData.ID) {
          jsx.push(
            <>
              <View style={styles.msgTo}>
                <Image
                  source={{ uri: props.userData.Photo }}
                  style={styles.msgProfileImg}
                />
                <View style={styles.msgFromWrapper}>
                  <View style={styles.msgFromWrapperMainReversed}>
                    {chat.photo && (
                      <Image
                        source={{ uri: chat.photo }}
                        style={styles.msgFromImage}
                        resizeMode="cover"
                      />
                    )}
                    {chat.message?.length > 0 && (
                      <Text style={styles.msgFromTextReversed}>
                        {chat.message}
                      </Text>
                    )}
                    <View style={styles.msgFromBottom1ViewReversed}></View>
                    <View style={styles.msgFromBottom2ViewReversed}></View>

                    <View style={styles.msgFromTop1View}></View>
                    <View style={styles.msgFromTop2View}></View>
                  </View>
                </View>
              </View>
            </>
          );
        } else {
          jsx.push(
            <>
              <View style={styles.msgFrom}>
                <Image
                  source={{ uri: item.Photo }}
                  style={styles.msgProfileImg}
                />
                <View style={styles.msgFromWrapper}>
                  <View style={styles.msgFromWrapperMain}>
                    {chat.photo && (
                      <Image
                        source={{ uri: chat.photo }}
                        style={styles.msgFromImage}
                        resizeMode="cover"
                      />
                    )}
                    {chat.message?.length > 0 && (
                      <Text style={styles.msgFromText}>{chat.message}</Text>
                    )}
                    <View style={styles.msgFromBottom1View}></View>
                    <View style={styles.msgFromBottom2View}></View>

                    <View style={styles.msgFromTop1View}></View>
                    <View style={styles.msgFromTop2View}></View>
                  </View>
                </View>
              </View>
            </>
          );
        }
      }
    });
    return jsx;
  };
  const handleSendMessage = async () => {
    if (!message) {
      return;
    }
    let senderId = props.userData.ID;
    let receiverId = item.ID;
    let chatId = "";
    if (senderId < receiverId) {
      chatId = senderId + receiverId;
    } else {
      chatId = receiverId + senderId;
    }
    const ref = firestore().collection("Chats");
    ref
      .doc(chatId)
      .get()
      .then(async (snapshot) => {
        setMessage("");
        let uri = null;
        if (uploadedImg) {
          uri = await ImageUploader(uploadedImg.uri);
        }
        await firestore()
          .collection("Chats")
          .doc(chatId)
          .collection("messages")
          .add({
            message,
            senderId,
            receiverId,
            photo: uri,
            timestamp: Date.now()
          });
        firestore()
          .collection("Users")
          .doc(props.userData.ID)
          .get()
          .then((snapshot) => {
            const senderInfo = snapshot.data();
            let inbox = [];
            if (Array.isArray(senderInfo.inbox)) {
              inbox = senderInfo.inbox;
            }
            if (inbox.filter((o) => o.ID === item.ID).length === 0) {
              inbox.push({
                ID: item.ID,
                lastMessage: message,
                unread: 0,
                timestamp: Date.now()
              });
            } else {
              let index = inbox.findIndex((o) => o.ID === item.ID);
              inbox[index] = {
                ...inbox[index],
                lastMessage: message,
                timestamp: Date.now()
              };
            }
            snapshot.ref.update({ inbox });
          });
        firestore()
          .collection("Users")
          .doc(item.ID)
          .get()
          .then((snapshot) => {
            const receiverInfo = snapshot.data();
            let inbox = [];
            if (Array.isArray(receiverInfo.inbox)) {
              inbox = receiverInfo.inbox;
            }
            if (inbox.filter((o) => o.ID === props.userData.ID).length === 0) {
              inbox.push({
                ID: props.userData.ID,
                lastMessage: message,
                unread: 1,
                timestamp: Date.now()
              });
            } else {
              let index = inbox.findIndex((o) => o.ID === props.userData.ID);
              inbox[index] = {
                ...inbox[index],
                lastMessage: message,
                unread: ++inbox[index].unread,
                timestamp: Date.now()
              };
            }
            snapshot.ref.update({ inbox });
            let emailBody = GetEmailTemplate({
              title: `You have received message from ${props.userData.Name}`,
              subtitle: `Hi ${receiverInfo.Name}, ${props.userData.Name} has left you a message.`,
              content: `"${message}"`
            });
            SendEmail(receiverInfo.Email, "Message from Tutoritto", emailBody);
          });
        await SendNotification(`${props.userData.Name}: ${message}`, [item.ID]);
      })
      .catch((err) => {
        console.log(err);
      });
    // console.log(chatId);
  };
  const fetchMessagesByChatId = () => {
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
      .doc(chatId.trim())
      .collection("messages")
      .orderBy("timestamp")
      .onSnapshot((querySnapshot) => {
        const allMessages = [];
        querySnapshot.forEach((doc) => {
          if (doc) allMessages.push(doc.data());
        });
        setChats([...allMessages]);
      });
  };
  const changeMessageReadStatus = () => {
    firestore()
      .collection("Users")
      .doc(props.userData.ID)
      .get()
      .then((snapshot) => {
        const senderInfo = snapshot.data();
        let inbox = [];
        if (Array.isArray(senderInfo.inbox)) {
          inbox = senderInfo.inbox;
        }
        let index = inbox.findIndex((o) => o.ID === item.ID);
        if (index >= 0) {
          inbox[index] = {
            ...inbox[index],
            unread: 0
          };
          snapshot.ref.update({ inbox });
        }
      });
  };
  useEffect(() => {
    fetchMessagesByChatId();
    changeMessageReadStatus();
  }, []);

  return (
    <>
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
            <Text style={styles.headerTitleText}>{item.Name}</Text>
          </View>
        </View>
        <MaterialCommunityIcons.Button
          name="clipboard-text"
          size={25}
          color={"#fff"}
          style={{ backgroundColor: "#0e0e0e" }}
          onPress={() => setModalVisible(!modalVisible)}
        />
      </View>

      <ScrollView
        style={{ flex: 1, backgroundColor: "#000" }}
        showsHorizontalScrollIndicator="none"
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current.scrollToEnd({ animated: true })
        }
      >
        {renderChat()}
      </ScrollView>
      <View style={styles.commentBox}>
        <TouchableOpacity
          style={styles.commentBoxBtn}
          onPress={openImagePickerAsync}
        >
          <MaterialCommunityIcons name="camera" size={25} color={"#F1C411"} />
        </TouchableOpacity>
        <View style={styles.commentArea}>
          {/* <TouchableOpacity style={styles.commentBoxBtn}>
            <MaterialCommunityIcons
              name="microphone"
              size={20}
              color={Colors.postBtnText}
            />
          </TouchableOpacity> */}
          <TextInput
            placeholder="Start typing ..."
            style={styles.commentBoxInput}
            placeholderTextColor={"#aaa"}
            value={message}
            onChangeText={(value) => setMessage(value)}
          />
        </View>
        <TouchableOpacity
          style={styles.commentBoxBtn}
          onPress={() => handleSendMessage()}
        >
          <MaterialCommunityIcons name="send" size={25} color={"#F1C411"} />
        </TouchableOpacity>
        {/*  */}
        <Settings
          open={modalVisible}
          close={() => {
            setModalVisible(!modalVisible);
          }}
          openForm={() => {
            setcreateCustomPackage(!createCustomPackage);
          }}
          senderId={props.userData.ID}
          receiverId={item.ID}
          item={item}
        />
        {/*  */}
        <CreateModal
          open={createCustomPackage}
          close={() => {
            setcreateCustomPackage(!createCustomPackage);
          }}
          senderId={props.userData.ID}
          receiverId={item.ID}
          item={item}
        />
        <BookModal
          senderId={props.userData.ID}
          receiverId={item.ID}
          item={item}
          selectedCustomPackage={selectedCustomPackage}
          visible={bookModalVisible}
          close={() => {
            setBookModalVisible(false);
          }}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  ...ChatStyle
});

export default Chat;
// CODE ADDED BY UDDIPAN
