import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  TextInput,
  Platform
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Card } from "react-native-elements";
import Modal from "react-native-modal";
import axios from "axios";
import firestore from "@react-native-firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import ImageUploader from "../../utils/ImageUploader";
import SendNotification from "../../utils/SendNotification";
import SendEmail from "../../utils/SendEmail";
import GetEmailTemplate from "../../utils/GetEmailTemplate";

const base64 = require("base-64");

const WithdrawModal = (props) => {
  const [isWesternUnionSelected, setIsWesternUnionSelected] = useState(false);
  const [paypalLoading, setPaypalLoading] = useState(false);
  const [westernUnionLoading, setWesternUnionLoading] = useState(false);
  const [uploadedImg, setUploadedImg] = useState(null);

  const [state, setState] = useState({
    name: "",
    city: "",
    country: "",
    phone: "",
    email: "",
    amount: ""
  });
  useEffect(() => {
    if (!props.visible) {
      setIsWesternUnionSelected(false);
    }
  }, [props.visible]);
  const handlePayouts = () => {
    setPaypalLoading(true);
    const obj = {
      grant_type: "client_credentials"
    };
    const data = Object.keys(obj)
      .map((key, index) => `${key}=${encodeURIComponent(obj[key])}`)
      .join("&");
    axios
      .post(`https://api-m.sandbox.paypal.com/v1/oauth2/token`, data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Basic ${base64.encode(
            "AZCWcD3o1IQA6GEZnFSPxf9eNdmwMOHrMRFhzOHyDUWN24iubjUql13zcvIQw2x6fkeud__Q5Llf66vT:EJUlr6p0d791HM8C5UgOtE1rbyQaiRB6MX7m_5GCXkN_nrziSpFakpyjNjFoKsldnlxHFlxJCZBLyWxr"
          )}`
        }
      })
      .then(async (response) => {
        let token = response.data.access_token;
        console.log(token, "::TOKEN::");
        if (token) {
          axios({
            method: "post",
            url: "https://api-m.sandbox.paypal.com/v1/payments/payouts",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            data: {
              sender_batch_header: {
                sender_batch_id: String(Date.now()),
                email_subject: "You have a payout!",
                email_message:
                  "You have received a payout! Thanks for using our service!"
              },
              items: [
                {
                  recipient_type: "EMAIL",
                  amount: {
                    value: parseInt(props.availableBalance),
                    currency: "USD"
                  },
                  note: "Thanks for your patronage!",
                  sender_item_id: "201403140001",
                  receiver: props.userData.Email
                }
              ]
            }
          })
            .then(async (response) => {
              console.log("::PAYPAL PAYOUTS::", response);
              firestore().collection("Users").doc(props.userData.ID).update({
                Balance: 0
              });
              props.close();
              alert("Payouts sent successfully!");

              let emailBody = GetEmailTemplate({
                title: `Congratulation! You have received new payouts.`,
                subtitle: `Hi ${props.userData?.Name}, Your withdrawal request of $${props.availableBalance} has been processed`,
                content: `You will receive another mail from PayPal to transfer your payment into your PayPal wallet.`
              });

              SendEmail(
                props.userData.Email,
                "Payouts from Tutoritto",
                emailBody
              );
              SendNotification(
                `Your withdrawal request of $${props.availableBalance} has been processed`,
                [props.userData.ID]
              );
            })
            .catch((err) => {
              console.log(err?.response?.data);
            });
        }
      })
      .catch((err) => {
        console.log(err?.response?.data);
        alert("Something went wrong! Please try again later.");
      })
      .finally(() => {
        setPaypalLoading(false);
      });
  };
  const handleWesternUnionSubmit = async () => {
    try {
      if (
        state.name === "" ||
        state.city === "" ||
        state.country === "" ||
        state.phone === "" ||
        state.email === "" ||
        state.amount === "" ||
        uploadedImg === null
      ) {
        alert("Please fillup all mandetory fields!");
      } else if (state.amount > props.availableBalance) {
        alert(`You don't have $${state.amount} in your Tallet!`);
      } else {
        setWesternUnionLoading(true);
        let uri = null;
        if (uploadedImg) {
          uri = await ImageUploader(uploadedImg.uri);
        }
        await firestore().collection("WesternUnionRequests").add({
          userId: props.userData.ID,
          name: state.name,
          city: state.city,
          country: state.country,
          phone: state.phone,
          email: state.email,
          amount: state.amount,
          timestamp: Date.now(),
          status: "pending",
          photo: uri
        });
        await firestore()
          .collection("Users")
          .doc(props.userData.ID)
          .update({
            Balance: props.availableBalance - state.amount
          });
        alert("Request sent, waiting for approval from admin");

        let emailBody = GetEmailTemplate({
          title: `Congratulation! You have received new payouts.`,
          subtitle: `Hi ${props.userData?.Name}, Your withdrawal request of $${props.availableBalance} is waiting to be approved by admin`,
          content: `It'll take 2-3 business days to verify and process your payment request by admin.`
        });

        SendEmail(props.userData.Email, "Payouts from Tutoritto", emailBody);
        SendNotification(
          `Your withdrawal request of $${props.availableBalance} is waiting to be approved by admin`,
          [props.userData.ID]
        );
        props.close();
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong!");
    } finally {
      setWesternUnionLoading(false);
    }
  };
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
  };
  return (
    <Modal isVisible={props.visible}>
      <View
        style={{
          backgroundColor: "#333939",
          width: "100%",
          minHeight: isWesternUnionSelected ? "75%" : "20%",
          alignSelf: "center",
          borderRadius: 10,
          padding: 5
        }}
      >
        <TouchableOpacity onPress={() => props.close()}>
          <MaterialIcons
            name="clear"
            size={25}
            style={{ alignSelf: "flex-end" }}
            color={"#F1C411"}
          />
        </TouchableOpacity>
        {!isWesternUnionSelected ? (
          <View
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              flexDirection: "row"
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#F1C411",
                width: "40%",
                height: 30,
                borderRadius: 5,
                justifyContent: "center",
                marginTop: 40,
                alignSelf: "flex-start"
              }}
              disabled={paypalLoading}
              onPress={() => {
                alert("Coming soon...");
                return;
                //   SKIP FOR VERSION 1
                handlePayouts();
              }}
            >
              {paypalLoading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={{ alignSelf: "center", fontWeight: "bold" }}>
                  STRIPE PAYOUTS
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#F1C411",
                width: "40%",
                height: 30,
                borderRadius: 5,
                justifyContent: "center",
                marginTop: 40,
                alignSelf: "flex-start"
              }}
              onPress={() => setIsWesternUnionSelected(true)}
            >
              <Text style={{ alignSelf: "center", fontWeight: "bold" }}>
                WESTERN UNION
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView>
            <View style={{ paddingLeft: 10 }}>
              <View
                style={{
                  width: "82%",
                  marginTop: 10,
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <Text
                  style={{
                    fontSize: 14,

                    color: "white",
                    alignSelf: "center"
                  }}
                >
                  Full Name
                </Text>
                <TextInput
                  style={{
                    alignSelf: "center",
                    backgroundColor: "white",
                    width: 150,
                    borderRadius: 5,
                    top: 5
                  }}
                  onChangeText={(text) => setState({ ...state, name: text })}
                  value={state.name}
                  multiline={true}
                  placeholder={"Your full name"}
                />
              </View>
              <View
                style={{
                  width: "82%",
                  marginTop: 10,
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <Text
                  style={{
                    fontSize: 14,

                    color: "white",
                    alignSelf: "center"
                  }}
                >
                  City
                </Text>
                <TextInput
                  style={{
                    alignSelf: "center",
                    backgroundColor: "white",
                    width: 150,
                    borderRadius: 5,
                    top: 5
                  }}
                  onChangeText={(text) => setState({ ...state, city: text })}
                  value={state.city}
                  multiline={true}
                  placeholder={"Your City"}
                />
              </View>
              <View
                style={{
                  width: "82%",
                  marginTop: 10,
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <Text
                  style={{
                    fontSize: 14,

                    color: "white",
                    alignSelf: "center"
                  }}
                >
                  Country
                </Text>
                <TextInput
                  style={{
                    alignSelf: "center",
                    backgroundColor: "white",
                    width: 150,
                    borderRadius: 5,
                    top: 5
                  }}
                  onChangeText={(text) => setState({ ...state, country: text })}
                  value={state.country}
                  multiline={true}
                  placeholder={"Your country"}
                />
              </View>
              <View
                style={{
                  width: "82%",
                  marginTop: 10,
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <Text
                  style={{
                    fontSize: 14,

                    color: "white",
                    alignSelf: "center"
                  }}
                >
                  Phone number
                </Text>
                <TextInput
                  style={{
                    alignSelf: "center",
                    backgroundColor: "white",
                    width: 150,
                    borderRadius: 5,
                    top: 5
                  }}
                  onChangeText={(text) => setState({ ...state, phone: text })}
                  value={state.phone}
                  multiline={true}
                  placeholder={"Your phone number"}
                  keyboardType="phone-pad"
                />
              </View>
              <View
                style={{
                  width: "82%",
                  marginTop: 10,
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <Text
                  style={{
                    fontSize: 14,

                    color: "white",
                    alignSelf: "center"
                  }}
                >
                  Email
                </Text>
                <TextInput
                  style={{
                    alignSelf: "center",
                    backgroundColor: "white",
                    width: 150,
                    borderRadius: 5,
                    top: 5
                  }}
                  onChangeText={(text) => setState({ ...state, email: text })}
                  value={state.email}
                  multiline={true}
                  placeholder={"Your email"}
                />
              </View>
              <View
                style={{
                  width: "82%",
                  marginTop: 10,
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <Text
                  style={{
                    fontSize: 14,

                    color: "white",
                    alignSelf: "center"
                  }}
                >
                  Amount
                </Text>
                <TextInput
                  style={{
                    alignSelf: "center",
                    backgroundColor: "white",
                    width: 150,
                    borderRadius: 5,
                    top: 5,
                    fontSize: 12
                  }}
                  onChangeText={(text) => setState({ ...state, amount: text })}
                  value={state.amount}
                  multiline={true}
                  placeholder={"Your amount to withdraw"}
                  keyboardType="number-pad"
                />
              </View>
              <TouchableOpacity
                style={{
                  width: "82%",
                  marginTop: 20,
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
                onPress={() => openImagePickerAsync()}
              >
                <Text
                  style={{
                    fontSize: 14,
                    borderWidth: 1,
                    borderColor: "#fff",
                    padding: 10,
                    color: "white",
                    alignSelf: "center"
                  }}
                >
                  {uploadedImg !== null
                    ? uploadedImg.uri.substring(
                        uploadedImg.uri.lastIndexOf("/") + 1
                      )
                    : "Upload scanned copy of Passport /local ID"}
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%"
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "#F1C411",
                  width: "40%",
                  height: 30,
                  borderRadius: 5,
                  marginTop: 40,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}
                disabled={westernUnionLoading}
                onPress={() => handleWesternUnionSubmit()}
              >
                {westernUnionLoading ? (
                  <ActivityIndicator color={"#000"} />
                ) : (
                  <Text style={{ fontWeight: "bold" }}>SUBMIT</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </View>
    </Modal>
  );
};
export default WithdrawModal;
