// CODE ADDED BY UDDIPAN
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  TextInput,
  ScrollView,
  Touchable,
  TouchableOpacity
} from "react-native";
import MessagesStyle from "./Messages.style";
import { useNavigation } from "@react-navigation/native";
import MyLoader from "../components/loader/MyLoader";

// Icon
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import asyncForEach from "../utils/asyncForeach";

import firestore from "@react-native-firebase/firestore";
const ChatListing = (props) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const fetchInboxMessages = async () => {
    try {
      setLoading(true);
      firestore()
        .collection("Users")
        .doc(props.userData.ID)
        .onSnapshot(async (querySnapshot) => {
          const data = querySnapshot.data();
          if (data) {
            let inbox = data.inbox;
            if (Array.isArray(inbox)) {
              let populatedInbox = [];
              await asyncForEach(inbox, async (item) => {
                const userDetailsSnapshot = await firestore()
                  .collection("Users")
                  .doc(item.ID)
                  .get();
                const userDetails = userDetailsSnapshot.data();
                if (userDetails) {
                  populatedInbox.push({
                    ...item,
                    Name: userDetails.Name,
                    Photo: userDetails.Photo
                  });
                }
              });
              populatedInbox.sort(function (a, b) {
                return new Date(b.timestamp) - new Date(a.timestamp);
              });
              setUsers([...populatedInbox]);
              setFilteredUsers([...populatedInbox]);
              setSearch("");
              setLoading(false);
            } else {
              setUsers([]);
              setFilteredUsers([]);
              setSearch("");
              setLoading(false);
            }
          } else {
            setUsers([]);
            setFilteredUsers([]);
            setSearch("");
            setLoading(false);
          }
        });
    } catch (err) {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchInboxMessages();
  }, []);
  useEffect(() => {
    if (search) {
      const results = users.filter((user) =>
        user.Name.toLowerCase().includes(search.toLowerCase())
      );
      if (results.length) {
        setFilteredUsers([...results]);
      }
    } else {
      setFilteredUsers([...users]);
    }
  }, [search]);
  return (
    <>
      <View style={styles.header}>
        <MyLoader loading={loading} color={"#fff"} />
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.back}
            onPress={() => navigation.goBack()}
            style={{ paddingHorizontal: 10 }}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={25}
              color={"#fff"}
            />
          </TouchableOpacity>
          <View style={styles.headerTitle}>
            <Text style={styles.headerTitleText}>Messages</Text>
          </View>
        </View>
        {/* <MaterialCommunityIcons.Button
          name="cog-outline"
          size={25}
          color={Colors.postBtnText}
          style={{backgroundColor: Colors.white}}
        /> */}
      </View>
      <View style={styles.searchWrapper}>
        <View style={styles.search}>
          <MaterialCommunityIcons
            name="account-search-outline"
            size={20}
            color="#aaa"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search for friends"
            placeholderTextColor="#aaa"
            style={styles.searchInput}
            value={search}
            onChangeText={(value) => setSearch(value)}
          />
        </View>
      </View>
      <ScrollView style={{ backgroundColor: "#000" }}>
        {filteredUsers.map((user, i) => (
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate("Chat", { item: user });
            }}
            style={styles.item}
            key={i}
          >
            <View style={styles.itemImageWrapper}>
              <Image
                source={{ uri: user.Photo }}
                style={[styles.itemIamge]}
                resizeMode="cover"
              />
              {/* <View style={[styles.itemActive, {backgroundColor: '#ccc'}]}></View> */}
            </View>
            <View style={[styles.itemName]}>
              <Text style={[styles.itemNameText]}>{user.Name}</Text>
              <Text style={[styles.itemMsgText]} numberOfLines={1}>
                {user.lastMessage}
              </Text>
            </View>
            {user.unread > 0 && (
              <View
                style={[styles.itemActiveMsgs, { backgroundColor: "#03a9f4" }]}
              >
                <Text style={[styles.itemActiveMsgsText]}>{user.unread}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  ...MessagesStyle
});

export default ChatListing;
// CODE ADDED BY UDDIPAN
