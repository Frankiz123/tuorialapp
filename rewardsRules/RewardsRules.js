import React from "react";
import {
  View,
  Modal,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TouchableOpacity
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";

const RewardsRules = (props) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={props.visible}
      onRequestClose={() => {
        props.onClose();
      }}
    >
      <View
        style={styles.Modal}
        onPress={() => {
          props.onClose();
        }}
      >
        <View style={styles.CardModal}>
          <Pressable
            style={{ marginLeft: "85%", padding: 10 }}
            onPress={() => props.onClose()}
          >
            <AntDesign name="close" size={18} style={{ fontWeight: "bold" }} />
          </Pressable>
          <ScrollView>
            <View style={{ marginVertical: 10 }}>
              <Text
                style={{
                  textAlign: "center",
                  lineHeight: 24,
                  fontSize: 16,
                  color: "#444"
                }}
              >
                o TUTORITTO sellers (Tuto-Rittoes) and Buyers (Tuto-Rittees) can
                collect reward points based on their continuous “Positive” usage
                of the system.
              </Text>
            </View>
            <View style={{ marginVertical: 15 }}>
              <Text
                style={{
                  textAlign: "center",
                  lineHeight: 24,
                  fontSize: 16,
                  color: "#444"
                }}
              >
                o Rewards points collected can be transferred to their wallets
                as cash with every 100 rewards points equating to 5 $ in Cash in
                their tutoritto wallet (Tallet).
              </Text>
            </View>
            <View style={{ marginVertical: 15 }}>
              <Text
                style={{
                  textAlign: "center",
                  lineHeight: 24,
                  fontSize: 16,
                  color: "#444"
                }}
              >
                o The positive activities can vary over time with more positive
                actions resulting in more reward points however at the early
                stages the reward points are calculated as follows:
              </Text>
            </View>
            <View style={{ marginVertical: 15 }}>
              <Text
                style={{
                  textAlign: "center",
                  lineHeight: 24,
                  fontSize: 16,
                  color: "#444"
                }}
              >
                o For every 5 referrals who successfully join tutoritto after
                receiving an invite from the tutoritto user, the user will
                receive 5 reward points.
              </Text>
            </View>
            <View style={{ marginVertical: 15 }}>
              <Text
                style={{
                  textAlign: "center",
                  lineHeight: 24,
                  fontSize: 16,
                  color: "#444"
                }}
              >
                o For every 50 synchronous sessions (or 15 asynchronous
                packages) successfully delivered, the user will receive 5 reward
                points.
              </Text>
            </View>
            <View style={{ marginVertical: 15 }}>
              <Text
                style={{
                  textAlign: "center",
                  lineHeight: 24,
                  fontSize: 16,
                  color: "#444"
                }}
              >
                o The reward points are automatically updated once a positive
                action has been completed.
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
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
    width: "85%",
    maxHeight: "80%"
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

export default RewardsRules;
