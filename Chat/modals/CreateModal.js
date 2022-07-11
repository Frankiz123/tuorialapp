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
  KeyboardAvoidingView,
  Dimensions,
  ActivityIndicator
} from "react-native";
import ChatStyle from "../Chat.style";
import ModalDropdown from "react-native-modal-dropdown";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TextInputMask } from "react-native-masked-text";
import firestore from "@react-native-firebase/firestore";
//utils
import SendNotification from "../../utils/SendNotification";

const CreateModal = (props) => {
  const [category, setCategory] = useState([]);
  const priceRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    cat: "",
    tier: "",
    name: "",
    description: "",
    totalLiveSession: "",
    deliveryDays: "",
    totalRevisions: "",
    price: "",
    extraFeatures: []
  });
  const handleSubmit = async () => {
    setLoading(true);
    let senderId = props.senderId;
    let receiverId = props.receiverId;
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
        await firestore()
          .collection("Chats")
          .doc(chatId)
          .collection("messages")
          .add({
            ...state,
            price: priceRef.current.getRawValue(),
            type: "customOffer",
            status: "pending",
            senderId,
            receiverId,
            totalLiveSession:
              state.totalLiveSession == 0
                ? -1
                : parseInt(state.totalLiveSession) + 1,
            deliveryDays:
              state.deliveryDays == 0 ? -1 : parseInt(state.deliveryDays) + 1,
            totalRevisions:
              state.totalRevisions == 0 ? -1 : parseInt(state.totalRevisions),
            timestamp: Date.now()
          })
          .then(function (docRef) {
            firestore()
              .collection("Chats")
              .doc(chatId)
              .collection("messages")
              .doc(docRef.id)
              .update({ id: docRef.id });
          });
        props.close();
        //modifying inbox statuses
        firestore()
          .collection("Users")
          .doc(senderId)
          .get()
          .then((snapshot) => {
            const senderInfo = snapshot.data();
            let inbox = [];
            if (Array.isArray(senderInfo.inbox)) {
              inbox = senderInfo.inbox;
            }
            if (inbox.filter((o) => o.ID === props.item.ID).length === 0) {
              inbox.push({
                ID: props.item.ID,
                lastMessage: state.name,
                unread: 0,
                timestamp: Date.now()
              });
            } else {
              let index = inbox.findIndex((o) => o.ID === props.item.ID);
              inbox[index] = {
                ...inbox[index],
                lastMessage: state.name,
                timestamp: Date.now()
              };
            }
            snapshot.ref.update({ inbox });
          });
        firestore()
          .collection("Users")
          .doc(props.item.ID)
          .get()
          .then((snapshot) => {
            const receiverInfo = snapshot.data();
            let inbox = [];
            if (Array.isArray(receiverInfo.inbox)) {
              inbox = receiverInfo.inbox;
            }
            if (inbox.filter((o) => o.ID === senderId).length === 0) {
              inbox.push({
                ID: senderId,
                lastMessage: state.name,
                unread: 1,
                timestamp: Date.now()
              });
            } else {
              let index = inbox.findIndex((o) => o.ID === senderId);
              inbox[index] = {
                ...inbox[index],
                lastMessage: state.name,
                unread: ++inbox[index].unread,
                timestamp: Date.now()
              };
            }
            snapshot.ref.update({ inbox });
          });
        // SendNotification(message, [props.item.ID]);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleAddExtraFeatures = () => {
    let exFeatures = state.extraFeatures;
    exFeatures.push({
      title: "",
      description: "",
      price: ""
    });
    setState({
      ...state,
      extraFeatures: [...exFeatures]
    });
  };
  const handleDeleteExtraFeatures = (index) => {
    let prevArr = state.extraFeatures;
    let newArr = [...prevArr.slice(0, index), ...prevArr.slice(index + 1)];
    setState({
      ...state,
      extraFeatures: [...newArr]
    });
  };
  useEffect(() => {
    firestore()
      .collection("Categories")
      .onSnapshot((querysnapshot) => {
        const CatList = [];
        querysnapshot.forEach((docsnap) => {
          CatList.push({ ...docsnap.data(), key: docsnap.id });
        });

        let sorted = CatList.sort((a, b) => {
          if (a.Category < b.Category) {
            return -1;
          }
          if (a.Category > b.Category) {
            return 1;
          }
          return 0;
        });

        let tempSearch = sorted.findIndex((e) => e.Category === "Search");
        sorted.splice(tempSearch, 1);
        setCategory(sorted);
      });
  }, []);
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={props.open}
      onRequestClose={props.close}
    >
      <Pressable onPress={props.close} style={styles.centeredView}>
        <Pressable
          onPress={() => {}}
          style={[styles.modalView, { paddingHorizontal: 0 }]}
        >
          <Pressable
            style={{ position: "absolute", top: 10, right: 10 }}
            onPress={() => props.close()}
          >
            <MaterialCommunityIcons name="close" size={25} color={"#fff"} />
          </Pressable>
          <Text style={styles.modalHeader}>Create Custom Package</Text>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            style={{
              height: Dimensions.get("window").height - 100,
              width: "100%",
              paddingHorizontal: 15
            }}
          >
            <View>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLable}>Select a catagory:</Text>
                <ModalDropdown
                  options={category.map((item, i) => item.Category)}
                  style={{
                    backgroundColor: "white",
                    height: 40,
                    justifyContent: "center",
                    width: "100%",
                    alignSelf: "flex-end",
                    borderRadius: 5,
                    elevation: 3
                  }}
                  textStyle={{
                    color: "black",
                    alignSelf: "flex-start",
                    left: 5
                  }}
                  dropdownStyle={{
                    width: "77.5%",
                    marginTop: 13
                  }}
                  dropdownTextStyle={{
                    backgroundColor: "white",
                    color: "black",
                    borderRadius: 0
                  }}
                  dropdownTextHighlightStyle={{
                    color: "#F1C411",
                    backgroundColor: "black"
                  }}
                  onSelect={(index, string) =>
                    setState({ ...state, cat: string })
                  }
                  defaultValue="Package Catagory"
                />
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLable}>Select a tier:</Text>
                <ModalDropdown
                  options={["Bronze", "Silver", "Gold", "Platinum"]}
                  style={{
                    backgroundColor: "white",
                    height: 40,
                    justifyContent: "center",
                    width: "100%",
                    alignSelf: "flex-end",
                    borderRadius: 5,
                    elevation: 3
                  }}
                  textStyle={{
                    color: "black",
                    alignSelf: "flex-start",
                    left: 5
                  }}
                  dropdownStyle={{
                    width: "77.5%",
                    marginTop: 13
                  }}
                  dropdownTextStyle={{
                    backgroundColor: "white",
                    color: "black",
                    borderRadius: 0
                  }}
                  dropdownTextHighlightStyle={{
                    color: "#F1C411",
                    backgroundColor: "black"
                  }}
                  onSelect={(index, string) =>
                    setState({ ...state, tier: string })
                  }
                  defaultValue="Package Tier"
                />
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLable}>Name:</Text>
                <TextInput
                  style={styles.input}
                  value={state.name}
                  onChangeText={(name) => setState({ ...state, name })}
                />
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLable}>Description:</Text>
                <TextInput
                  style={styles.inputArea}
                  value={state.description}
                  onChangeText={(description) =>
                    setState({ ...state, description })
                  }
                />
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLable}>
                  Number of live video sessions:
                </Text>
                <ModalDropdown
                  options={[
                    "N/A",
                    ...Array(30)
                      .fill(0)
                      .map((e, i) => String(i + 1))
                  ]}
                  style={{
                    backgroundColor: "white",
                    height: 40,
                    justifyContent: "center",
                    width: "100%",
                    alignSelf: "flex-end",
                    borderRadius: 5,
                    elevation: 3
                  }}
                  textStyle={{
                    color: "black",
                    alignSelf: "flex-start",
                    left: 5
                  }}
                  dropdownStyle={{
                    width: "77.5%",
                    marginTop: 13
                  }}
                  dropdownTextStyle={{
                    backgroundColor: "white",
                    color: "black",
                    borderRadius: 0
                  }}
                  dropdownTextHighlightStyle={{
                    color: "#F1C411",
                    backgroundColor: "black"
                  }}
                  onSelect={(text) =>
                    setState({ ...state, totalLiveSession: text })
                  }
                  defaultValue={"Pick"}
                />
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLable}>Delivery Days:</Text>
                <ModalDropdown
                  options={[
                    "N/A",
                    ...Array(30)
                      .fill(0)
                      .map((e, i) => String(i + 1))
                  ]}
                  style={{
                    backgroundColor: "white",
                    height: 40,
                    justifyContent: "center",
                    width: "100%",
                    alignSelf: "flex-end",
                    borderRadius: 5,
                    elevation: 3
                  }}
                  textStyle={{
                    color: "black",
                    alignSelf: "flex-start",
                    left: 5
                  }}
                  dropdownStyle={{
                    width: "77.5%",
                    marginTop: 13
                  }}
                  dropdownTextStyle={{
                    backgroundColor: "white",
                    color: "black",
                    borderRadius: 0
                  }}
                  dropdownTextHighlightStyle={{
                    color: "#F1C411",
                    backgroundColor: "black"
                  }}
                  onSelect={(text) =>
                    setState({ ...state, deliveryDays: text })
                  }
                  defaultValue={"Pick"}
                />
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLable}>Number of revisions:</Text>
                <ModalDropdown
                  options={[
                    "N/A",
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                    "6",
                    "7",
                    "8",
                    "9",
                    "10"
                  ]}
                  style={{
                    backgroundColor: "white",
                    height: 40,
                    justifyContent: "center",
                    width: "100%",
                    alignSelf: "flex-end",
                    borderRadius: 5,
                    elevation: 3
                  }}
                  textStyle={{
                    color: "black",
                    alignSelf: "flex-start",
                    left: 5
                  }}
                  dropdownStyle={{
                    width: "77.5%",
                    marginTop: 13
                  }}
                  dropdownTextStyle={{
                    backgroundColor: "white",
                    color: "black",
                    borderRadius: 0
                  }}
                  dropdownTextHighlightStyle={{
                    color: "#F1C411",
                    backgroundColor: "black"
                  }}
                  onSelect={(text) =>
                    setState({ ...state, totalRevisions: text })
                  }
                  defaultValue={"Pick"}
                />
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLable}>Price:</Text>
                <TextInputMask
                  style={styles.input}
                  value={state.price}
                  onChangeText={(price) => setState({ ...state, price })}
                  type={"money"}
                  options={{
                    precision: 0,
                    separator: ",",
                    delimiter: ",",
                    unit: "$",
                    suffixUnit: ""
                  }}
                  ref={priceRef}
                />
              </View>
              <Pressable
                style={[styles.AddinputWrapper]}
                onPress={() => {
                  handleAddExtraFeatures();
                }}
              >
                <MaterialCommunityIcons
                  name="plus"
                  size={25}
                  color={"#fff"}
                  style={{ marginRight: 10 }}
                />
                <Text style={styles.inputLable}>Add extra packge feature</Text>
              </Pressable>
              {state.extraFeatures.map((extra, i) => (
                <View
                  style={{
                    display: "flex",
                    backgroundColor: "#ccc",
                    padding: 10,
                    borderRadius: 10,
                    marginBottom: 20
                  }}
                  key={i}
                >
                  <Pressable onPress={() => handleDeleteExtraFeatures(i)}>
                    <MaterialCommunityIcons
                      name="delete"
                      size={18}
                      color={"#000"}
                      style={{ textAlign: "right" }}
                    />
                  </Pressable>
                  <View style={styles.inputWrapper}>
                    <Text style={[styles.inputLable, { color: "#222" }]}>
                      Title:
                    </Text>
                    <TextInput
                      style={styles.input}
                      value={extra.title}
                      onChangeText={(value) => {
                        state.extraFeatures[i].title = value;
                        setState({
                          ...state,
                          extraFeatures: state.extraFeatures
                        });
                      }}
                    />
                  </View>
                  <View style={styles.inputWrapper}>
                    <Text style={[styles.inputLable, { color: "#222" }]}>
                      Description:
                    </Text>
                    <TextInput
                      style={styles.input}
                      value={extra.description}
                      onChangeText={(value) => {
                        state.extraFeatures[i].description = value;
                        setState({
                          ...state,
                          extraFeatures: state.extraFeatures
                        });
                      }}
                    />
                  </View>
                  {/* <View style={styles.inputWrapper}>
                    <Text style={[styles.inputLable, { color: "#222" }]}>Price:</Text>
                    <TextInput style={styles.input}
                      value={extra.price}
                      onChangeText={(value) => {
                        state.extraFeatures[i].price = value;
                        setState({
                          ...state,
                          extraFeatures: state.extraFeatures
                        })
                      }} keyboardType="number-pad" />
                  </View> */}
                </View>
              ))}
              <Pressable
                style={[styles.modalBtn]}
                onPress={() => {
                  handleSubmit();
                }}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={"#fff"} />
                ) : (
                  <>
                    <Text style={styles.modalBtnText}>Send</Text>
                    <MaterialCommunityIcons
                      name="send"
                      size={25}
                      color={"#fff"}
                      style={{ marginLeft: 10 }}
                    />
                  </>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  ...ChatStyle
});

export default CreateModal;
