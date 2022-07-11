import React, { useContext, useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Pressable,
  ScrollView
} from "react-native";
import { Rating, AirbnbRating } from "react-native-ratings";
import Icon from "react-native-vector-icons/Feather";
import { TextInput } from "react-native-gesture-handler";
import LinearGradient from "react-native-linear-gradient";
import StarRating from "react-native-star-rating";
import Modal from "react-native-modal";
import { Card, CheckBox } from "react-native-elements";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useLinkProps, useNavigation } from "@react-navigation/native";
import * as demodata from "../demodata.json";
import BarCharts from "../Tutee/BarCharts";
import firestore from "@react-native-firebase/firestore";
import { ActivityIndicator } from "react-native-paper";
export default function Reviews(props) {
  const { userData } = props;
  const [rated, setRated] = useState(false);
  const [reviewData, setReviewData] = useState([]);
  const [review, setReview] = useState("");
  const [ratings, setRatings] = useState([]);
  const [ratings2, setRatings2] = useState([]);
  const [ratings3, setRatings3] = useState([]);
  const [totalavg, setAverage] = useState("");
  const [reviewcount, setreviewcount] = useState(0);
  const [title, settitle] = useState("");
  const [average, setaverage] = useState(0);
  const navigation = useNavigation();
  let Reviews = [];
  let Ratings1 = [];
  let Ratings2 = [];
  let Rating3 = [];

  const [isCategory, setcategory] = useState(true);
  const [isThisTutor, setisthistutor] = useState(true);
  const [isAlltutors, setisalltutors] = useState(true);
  const [q1average, setq1average] = useState(0);
  const [q2average, setq2average] = useState(0);
  const [q3average, setq3average] = useState(0);
  const [q4average, setq4average] = useState(0);
  const [totalaverage, settotalaverage] = useState(0);
  const [q1catavg, setq1catavg] = useState(0);
  const [q2catavg, setq2catavg] = useState(0);
  const [q3catavg, setq3catavg] = useState(0);
  const [q4catavg, setq4catavg] = useState(0);
  const [q1allavg, setq1allavg] = useState(0);
  const [q2allavg, setq2allavg] = useState(0);
  const [q3allavg, setq3allavg] = useState(0);
  const [q4allavg, setq4allavg] = useState(0);
  const [categoryaverage, setcategoryaverage] = useState(0);
  const [allaverage, setallaverage] = useState(0);
  const [tutorstring, setTutorString] = useState(
    `${props.userData?.Title || ""} ${props.userData.Name}`
  );

  useEffect(() => {
    if (props.userData) {
      let q1AVG = (Math.round(props.userData.Q1Average * 100) / 100).toFixed(2);
      let q2AVG = (Math.round(props.userData.Q2Average * 100) / 100).toFixed(2);
      let q3AVG = (Math.round(props.userData.Q3Average * 100) / 100).toFixed(2);
      let Q4AVG = (Math.round(props.userData.Q4Average * 100) / 100).toFixed(2);
      let totalAVG = (
        Math.round(props.userData.TotalAverage * 100) / 100
      ).toFixed(2);
      setq1average(q1AVG);
      setq2average(q2AVG);
      setq3average(q3AVG);
      setq4average(Q4AVG);
      settotalaverage(totalAVG);

      // setq1catavg((Math.round(q1catAVG * 100) / 100).toFixed(2));
      // setq2catavg(Math.round(q2catAVG * 100) / 100).toFixed(2);
      // setq3catavg(Math.round(q3catAVG * 100) / 100).toFixed(2);
      // setq4catavg(Math.round(q4catAVG * 100) / 100).toFixed(2);
      // setq1allavg(Math.round(q1allAVG * 100) / 100).toFixed(2);
      // setq2allavg(Math.round(q2allAVG * 100) / 100).toFixed(2);
      // setq3allavg(Math.round(q3allAVG * 100) / 100).toFixed(2);
      // setq4allavg(Math.round(q4allAVG * 100) / 100).toFixed(2);
      // setcategoryaverage(Math.round(categoryAVG * 100) / 100).toFixed(2);
      // setallaverage(Math.round(allAverages * 100) / 100).toFixed(2);
    }
  }, [props.userData]);
  function q1avg(q1catavg) {
    let sum = 0;
    let count = q1catavg.length;

    for (let i = 0; i < q1catavg.length; i++) {
      sum += q1catavg[i];
    }
    let avg4 = sum / count;
    return avg4;
  }
  function submitToggle() {
    navigation.navigate("Tutor");
  }
  async function getuserInfo() {
    await firestore()
      .collection("Users")
      .doc(props.userData.ID)
      .onSnapshot((querySnapShot) => {
        setreviewcount(querySnapShot.data().ReviewCount);
        let totalavg = (
          Math.round(querySnapShot.data().TotalAverage * 100) / 100
        ).toFixed(2);
        setaverage(totalavg);
        settitle(querySnapShot.data().NameTitle);
      });
  }
  useEffect(() => {
    async function getUserData() {
      await getuserInfo();
    }
    getUserData();
  }, []);

  useEffect(() => {
    async function getUserReviews() {
      await getReviews();
    }
    getUserReviews();
  }, []);
  async function getReviews() {
    await firestore()
      .collection("Ratings")
      .where("TutorID", "==", props.userData.ID)
      .limit(20)
      .onSnapshot((querySnapShot) => {
        console.log("read 1");
        Reviews = [];
        Ratings1 = [];
        Ratings2 = [];
        Rating3 = [];
        querySnapShot.forEach((documentSnapShot) => {
          console.log("read 2");
          Reviews.push({
            ...documentSnapShot.data(),
            key: documentSnapShot.id
          });
          Ratings1.push(documentSnapShot.data().CommunicationSkill);
          Ratings2.push(documentSnapShot.data().TeachingSkill);
          Rating3.push(documentSnapShot.data().WorkEthic);
        });

        setRatings(Ratings1);
        setRatings2(Ratings2);
        setRated(true);
        setRatings3(Rating3);
        setReviewData(Reviews);
      });
  }

  const ReviewCard = ({ item }) => {
    const [isReplyBoxOpen, setReplyBox] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [loading, setLoading] = useState(false);
    const handleSubmitReply = async () => {
      try {
        setLoading(true);
        await firestore()
          .collection("Ratings")
          .doc(item.key)
          .update({ Reply: replyText });
        setReplyBox(false);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    return (
      <View>
        <View
          style={{
            marginRight: "auto",
            marginLeft: 10,
            flexDirection: "row"
          }}
        >
          <Image
            source={{ uri: item.StudentPic }}
            style={{ width: 50, height: 50, borderRadius: 30 }}
          />
          <View
            style={{
              flexDirection: "column",
              alignItems: "flex-start",
              marginLeft: 9
            }}
          >
            <Text
              style={{
                alignItems: "flex-start",
                fontWeight: "bold",
                color: "black"
              }}
            >
              {" "}
              {item.StudentName}
            </Text>
            <View style={styles.row}>
              <Text style={{ color: "black" }}> Communication Skills </Text>
              <StarRating
                maxStars={5}
                starSize={10}
                disabled={true}
                rating={item.CommunicationSkill}
                fullStarColor="#F1C411"
                emptyStarColor="black"
                starStyle={{
                  alignItems: "flex-start",
                  marginTop: 5,
                  marginLeft: 5
                }}
              />
            </View>
            <View style={styles.row}>
              <Text style={{ color: "black" }}> Teaching Skills </Text>
              <StarRating
                maxStars={5}
                starSize={10}
                disabled={true}
                rating={item.TeachingSkill}
                fullStarColor="#F1C411"
                emptyStarColor="black"
                starStyle={{
                  alignItems: "flex-start",
                  marginTop: 5,
                  marginLeft: 5
                }}
              />
            </View>
            <View style={styles.row}>
              <Text style={{ color: "black" }}> Work Ethics </Text>
              <StarRating
                maxStars={5}
                starSize={10}
                disabled={true}
                rating={item.WorkEthic}
                fullStarColor="#F1C411"
                emptyStarColor="black"
                starStyle={{
                  alignItems: "flex-start",
                  marginTop: 5,
                  marginLeft: 5
                }}
              />
            </View>
            <View style={styles.row}>
              <Text style={{ color: "black" }}> Subject Knowledge </Text>
              <StarRating
                maxStars={5}
                starSize={10}
                disabled={true}
                rating={item.KnowledgeSubject}
                fullStarColor="#F1C411"
                emptyStarColor="black"
                starStyle={{
                  alignItems: "flex-start",
                  marginTop: 5,
                  marginLeft: 5
                }}
              />
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ color: "black" }}> Review: </Text>
              <Text style={{ marginLeft: 5, width: "75%" }}>{item.Review}</Text>
            </View>
            {item.Reply?.length > 0 && (
              <View style={{ flexDirection: "row" }}>
                <Text style={{ color: "black" }}> Reply: </Text>
                <Text style={{ marginLeft: 5, width: "75%" }}>
                  {item.Reply}
                </Text>
              </View>
            )}
            {!item.Reply && (
              <>
                {isReplyBoxOpen && (
                  <TextInput
                    style={{
                      borderColor: "#eee",
                      borderWidth: 2,
                      width: "75%",
                      marginVertical: 10
                    }}
                    placeholder="Write your reply here..."
                    value={replyText}
                    onChangeText={(text) => setReplyText(text)}
                  />
                )}
                <TouchableOpacity
                  style={{
                    backgroundColor: "#F1C411",
                    borderRadius: 10,
                    width: "auto",
                    paddingVertical: 5,
                    paddingHorizontal: 20,
                    elevation: 3,
                    marginVertical: 10
                  }}
                  onPress={() =>
                    isReplyBoxOpen ? handleSubmitReply() : setReplyBox(true)
                  }
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color={"#000"} />
                  ) : (
                    <Text style={{ alignSelf: "center", color: "black" }}>
                      Reply
                    </Text>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
        <Card.Divider style={{ backgroundColor: "black", marginTop: 5 }} />
      </View>
    );
  };
  return (
    <SafeAreaView
      style={{
        backgroundColor: "black",
        height: "100%",
        paddingTop: Platform.OS === "android" ? 15 : 0
      }}
    >
      <ScrollView>
        <View style={{ backgroundColor: "black", height: 250 }}>
          <View
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row"
            }}
          >
            <Pressable onPress={() => navigation.navigate("UpdateProfile")}>
              <Image
                source={{ uri: props.userData.Photo }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                  marginRight: 0
                }}
              />
              <View
                style={{
                  backgroundColor: "red",
                  width: 20,
                  height: 20,
                  borderRadius: 15,
                  justifyContent: "center",
                  position: "absolute",
                  right: 0,
                  top: 0
                }}
              >
                <Text
                  style={{ fontSize: 14, alignSelf: "center", color: "white" }}
                >
                  {reviewcount}
                </Text>
              </View>
            </Pressable>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", top: 0 }}>
                <Text style={{ color: "white", fontSize: 15 }}> Your </Text>
                <Text
                  style={{ color: "#F1C411", fontWeight: "bold", fontSize: 15 }}
                >
                  REVIEWS.
                </Text>
              </View>
              <Text style={{ color: "white", top: 0, fontSize: 12 }}>
                {" "}
                Check your reviews and see who rated you best.
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                justifyContent: "center"
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  width: 35,
                  height: 35,
                  borderRadius: 35,
                  justifyContent: "center",
                  alignSelf: "flex-end"
                }}
              >
                <MaterialIcons
                  name="home"
                  size={25}
                  style={{ alignSelf: "center" }}
                  color={"black"}
                />
              </View>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignSelf: "center",
              width: 70,
              top: 80 / 5
            }}
          >
            <View style={{ flexDirection: "row", width: 75, height: 75 }}>
              <Image
                source={require("../assets/yellowbox.png")}
                style={{
                  width: 690,
                  height: 200,
                  alignSelf: "center",
                  borderRadius: 35,
                  marginLeft: -Dimensions.get("window").width + 100,
                  marginTop: 100
                }}
                resizeMode="contain"
              />
            </View>
            <View
              style={{
                bottom: -25,
                backgroundColor: "white",
                borderRadius: 20,
                justifyContent: "center",
                flexDirection: "row",
                alignSelf: "center",
                paddingHorizontal: 5
              }}
            >
              <Text style={{ alignSelf: "center", color: "black" }}>
                {average}
              </Text>
              <MaterialIcons
                name="star"
                style={{ color: "black", alignSelf: "center" }}
              />
            </View>
            <Text
              style={{
                alignSelf: "center",
                fontSize: 14,
                color: "white",
                bottom: -35,
                width: 100,
                textAlign: "center"
              }}
            >
              {title} {props.userData.Name}
            </Text>
          </View>
        </View>

        <View
          style={{
            marginBottom: 20,
            width: "100%",
            backgroundColor: "#333939",
            borderColor: "#333939"
          }}
        >
          {/* <Text
              style={{
                color: "white",
                top: 4,
                fontWeight: "bold",
                left: 8,
                zIndex: 1,
              }}
            >
              A-
            </Text> */}
          <CheckBox
            onPress={() => setisthistutor(!isThisTutor)}
            title={tutorstring}
            checkedColor={"#F1C411"}
            checked={isThisTutor}
            containerStyle={{
              width: "100%",
              backgroundColor: "#333939",
              borderColor: "#333939"
            }}
            textStyle={{
              color: "white"
            }}
          />
          <View style={styles.row}>
            <StarRating
              maxStars={5}
              starSize={13}
              disabled={true}
              rating={totalaverage}
              fullStarColor="#fdc500"
              emptyStarColor="white"
              starStyle={{
                marginHorizontal: 2
              }}
              containerStyle={{
                marginLeft: 53,
                marginBottom: 10,
                marginTop: -10
              }}
            />
          </View>
        </View>
        {/* <View style={{ flexDirection: "row", bottom: 20 }}>
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                left: 8,
                zIndex: 1,
              }}
            >
              B-
            </Text>
            <CheckBox
              onPress={() => setcategory(!isCategory)}
              title="Same Category Tuto-rittoes"
              checkedColor={"#F1C411"}
              checked={isCategory}
              containerStyle={{
                width: "auto",
                right: 5,
                backgroundColor: "#333939",
                borderColor: "#333939",
                bottom: 20,
              }}
              textStyle={{
                color: "white",
                width: "auto",
                alignSelf: "center",
                right: 10,
              }}
              style={{}}
            />
            <View style={styles.row}>
              <StarRating
                maxStars={5}
                starSize={13}
                disabled={true}
                rating={categoryaverage}
                fullStarColor="#fdc500"
                emptyStarColor="white"
                starStyle={{
                  top: 2,
                  right: 40,
                }}
              />
            </View>
          </View> */}
        <View
          style={{
            marginBottom: 60,
            width: "100%",
            backgroundColor: "#333939",
            borderColor: "#333939"
          }}
        >
          {/* <Text
              style={{
                color: "white",
                fontWeight: "bold",
                left: 8,
                zIndex: 1,
              }}
            >
              C-
            </Text> */}
          <CheckBox
            onPress={() => setisalltutors(!isAlltutors)}
            title="All Tuto-rittoes"
            checkedColor={"#F1C411"}
            checked={isAlltutors}
            containerStyle={{
              width: "100%",
              backgroundColor: "#333939",
              borderColor: "#333939"
            }}
            textStyle={{
              color: "white"
            }}
          />
          <View style={styles.row}>
            <StarRating
              maxStars={5}
              starSize={13}
              disabled={true}
              rating={allaverage}
              fullStarColor="#fdc500"
              emptyStarColor="white"
              starStyle={{
                marginHorizontal: 2
              }}
              containerStyle={{
                marginLeft: 53,
                marginBottom: 10,
                marginTop: -10
              }}
            />
          </View>
        </View>
        <BarCharts
          userData={props.userData}
          isCategory={isCategory}
          isAlltutors={isAlltutors}
          isThisTutor={isThisTutor}
          totalaverage={totalaverage}
          q1average={q1average}
          q2average={q2average}
          q3average={q3average}
          q4average={q4average}
          q1allavg={q1allavg}
          q2allavg={q2allavg}
          q3allavg={q3allavg}
          q4allavg={q4allavg}
          q1catavg={q1catavg}
          q2catavg={q2catavg}
          q3catavg={q3catavg}
          q4catavg={q4catavg}
          allaverage={allaverage}
          categoryaverage={categoryaverage}
        />
        <Card
          containerStyle={{
            width: "100%",
            backgroundColor: "white",
            right: 15,
            bottom: 15,
            height: "100%"
          }}
        >
          <Card.Title>
            <Text
              style={{
                fontSize: 16,
                color: "black",
                fontWeight: "bold",
                bottom: 15,
                height: 100,
                textAlign: "left"
              }}
            >
              Reviews
            </Text>
          </Card.Title>
          <Card.Divider></Card.Divider>
          <FlatList
            data={reviewData}
            style={{}}
            renderItem={({ item }) => <ReviewCard item={item} />}
            keyExtractor={(item, index) => index.toString()}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  column: {
    flexDirection: "column"
  },
  row: {
    flexDirection: "row"
  }
});
