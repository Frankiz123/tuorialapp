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
} from "react-native";
import { Rating, AirbnbRating } from "react-native-ratings";
import Icon from "react-native-vector-icons/Feather";
import { MaterialIcons } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";
import LinearGradient from "react-native-linear-gradient";
import StarRating from "react-native-star-rating";
import ModalDropdown from "react-native-modal-dropdown";
import Modal from "react-native-modal";
import { Card, CheckBox } from "react-native-elements";
import { useRoute } from "@react-navigation/native";
import firestore from '@react-native-firebase/firestore';
export default function Ratings(props) {
  const route = useRoute();
  const { userData, TutorData } = route.params;
  const [rated, setRated] = useState(false);
  const [reviewData, setReviewData] = useState([]);
  const [isvisible, setVisible] = useState(false);
  const [skillbool1, setBool1] = useState(false);
  const [skillbool2, setBool2] = useState(false);
  const [skillbool3, setBool3] = useState(false);
  const [skillbool4, setBool4] = useState(false);
  const [skillCount1, setSkillCount] = useState(3.5);
  const [skillCount2, setSkillCount2] = useState(3.5);
  const [skillCount3, setSkillCount3] = useState(3.5);
  const [skillCount4, setSkillCount4] = useState(3.5);
  const [review, setReview] = useState("");
  const [ratings, setRatings] = useState([]);
  const [ratings2, setRatings2] = useState([]);
  const [ratings3, setRatings3] = useState([]);
  const [ratings4, setRatings4] = useState([]);
  const [totalavg, setAverage] = useState("");
  const [reviewCount, setreviewCount] = useState(0);
  const [tutorReview, settutorreview] = useState(0);
  const [tutorname, settutorname] = useState("");
  const [tutorskills, settutorskills] = useState([]);
  const [skillSelected, setskillselected] = useState("");
  const [checked, setchecked] = useState(true);
  const [tuteeCounter, setTuteeCounter] = useState(0);
  const [skillstring, setskillstring] = useState("");
  const [endorsedCount, setEndorsedCount] = useState(0);
  const [endorsementcount, setendorsementcount] = useState(0);
  const [endorsedArray, setendorsedArray] = useState([]);
  const [endorsedtalentData, setendorsedtalentData] = useState([]);
  const [isSameSkill, setsameskill] = useState(false);
  const [rewardpoints, setrewardpoints] = useState(0);
  const [rewardCount, setrewardCount] = useState(0);
  const [finalendorsementCount, setfinalEndorsement] = useState(0);
  const [isRewardPoint, setrewardbool] = useState(false);
  const [isEndorsed, setisendorsed] = useState(false);
  const [tutoraverage, settutoraverage] = useState("");
  let pic;
  let average, average2, average3, average4;
  const [tutorpic, settutorpic] = useState("");
  const Reviews = [];
  const Ratings1 = [];
  const Ratings2 = [];
  const Rating3 = [];
  const Ratings4 = [];
  useEffect(() => {
    var unsubscribe;
    let ismounted = true;

    if (average4 !== NaN && rated === true) {
      usersCollection.collection("Users").doc(TutorData).update({
        TotalAverage: totalAvg,
        Q1Average: average,
        Q2Average: average2,
        Q3Average: average3,
        Q4Average: average4,
        ReviewCount: tutorReview,
      });
    }
  }, [rated]);
  useEffect(() => {
    const unsubscribe = firestore()
      .collection("Users")
      .doc(TutorData)
      .onSnapshot((querysnapshot) => {
        pic = querysnapshot.data().Photo;
        settutorpic(pic);
        setreviewCount(querysnapshot.data().ReviewCount);
        settutorname(querysnapshot.data().Name);
        setendorsedArray(querysnapshot.data().Endorsements);
        settutorskills(querysnapshot.data().Specialization);
        setendorsementcount(querysnapshot.data().EndorsementCount);

        let tutorAVG = (
          Math.round(querysnapshot.data().TotalAverage * 100) / 100
        ).toFixed(2);
        settutoraverage(tutorAVG);
      });
    return () => unsubscribe;
  }, []);
  useEffect(() => {
    let unsubscribe = firestore()
      .collection("Ratings")
      .where("TutorID", "==", TutorData)
      .limit(20)
      .onSnapshot((querySnapShot) => {
        querySnapShot.forEach((documentSnapShot) => {
          Reviews.push({
            ...documentSnapShot.data(),
            key: documentSnapShot.id,
          });
          Ratings1.push(documentSnapShot.data().CommunicationSkill);
          Ratings2.push(documentSnapShot.data().TeachingSkill);
          Rating3.push(documentSnapShot.data().WorkEthic);
          Ratings4.push(documentSnapShot.data().KnowledgeSubject);
        });

        setRatings(Ratings1);
        setRatings2(Ratings2);
        setRatings3(Rating3);
        setRatings4(Ratings4);
        setReviewData(Reviews);
      });
    return () => unsubscribe;
  }, []);
  useEffect(() => {
    let unsubscribe;
    if (isEndorsed === true) {
      const list = [];
      //updating endorsement count
      // firestore()
      //   .collection("Users")
      //   .doc(TutorData)
      //   .update({ EndorsementCount: finalendorsementCount });
        firestore()
        .collection("Users")
        .doc(TutorData)
        .get()
        .then((userSnapshot)=>{
          let userInfo = userSnapshot.data();
            if(userInfo.EndorsedReward === 4){
              userSnapshot.ref.update({
                EndorsedReward: 0,
                RewardCount:  firestore.FieldValue.increment(5),
                EndorsementCount: finalendorsementCount
              })
            }else{
              userSnapshot.ref.update({
                EndorsedReward: firestore.FieldValue.increment(1),
                EndorsementCount: finalendorsementCount
              })
            }
        })
      //updating rewards for endorsements
      unsubscribe = firestore()
        .collection("Rewards")
        .doc(TutorData)
        .onSnapshot((querysnapshot) => {
          list.push(querysnapshot.data());
          var obj;
          for (var i = 0; i < list.length; i++) {
            var dataset = list[i].Rewards;
            obj = Object.values(dataset);
          }
          if (obj !== undefined) {
            obj.forEach((snapshot) => {
              if (snapshot.Reward === "Endorsement") {
                snapshot.Accessed = finalendorsementCount;
              }
            });
          }
          firestore()
            .collection("Rewards")
            .doc(TutorData)
            .update({ Rewards: obj });
        });
    }
    return () => {
      unsubscribe;
    };
  }, [isEndorsed]);
  useEffect(() => {
    if (isSameSkill) {
      var obj;

      let num = endorsedArray.findIndex(
        (e) => e.EndorsedTalent === skillSelected
      );
      endorsedArray[num].NumberofTutees = tuteeCounter;
      let newIDarray = [];
      const newEndorsements = [
        {
          EndorsedTalent: skillSelected,
          NumberofTutees: tuteeCounter,
        },
      ];
      const list = [];
      //updating the specific object in endorsement array in firebase
      firestore()
        .collection("Endorsements")
        .doc(TutorData)
        .onSnapshot((querysnapshot) => {
          list.push(querysnapshot.data());
          var obj;
          for (var i = 0; i < list.length; i++) {
            var dataset = list[i].Endorsements;
            obj = Object.values(dataset);
          }
          if (obj !== undefined) {
            console.log("endorsement document");
            obj.forEach((snapshot) => {
              if (snapshot.EndorsedTalent === skillSelected) {
                snapshot.NumberofTutees = tuteeCounter;
              }
            });
          }
          firestore()
            .collection("Endorsements")
            .doc(TutorData)
            .update({ Endorsements: obj });
        });

      setsameskill(false);
      setRated(false);
    }
  }, [isSameSkill]);
  const showReviewModel = () => {
    setVisible(true);
  };

  function avg(ratings) {
    let sum = 0;
    let count = ratings.length;
    for (let i = 0; i < ratings.length; i++) {
      sum += ratings[i];
    }
    let avg = sum / count;
    return avg;
  }
  function avg2(ratings2) {
    let sum = 0;
    let count = ratings2.length;

    for (let i = 0; i < ratings2.length; i++) {
      sum += ratings2[i];
    }
    let avg2 = sum / count;
    return avg2;
  }
  function avg3(ratings3) {
    let sum = 0;
    let count = ratings3.length;

    for (let i = 0; i < ratings3.length; i++) {
      sum += ratings3[i];
    }
    let avg3 = sum / count;
    return avg3;
  }
  function avg4(ratings4) {
    let sum = 0;
    let count = ratings4.length;

    for (let i = 0; i < ratings4.length; i++) {
      sum += ratings4[i];
    }
    let avg4 = sum / count;
    return avg4;
  }
  function avg5(totalaverage) {
    let sum = 0;
    let count = totalaverage.length;

    for (let i = 0; i < totalaverage.length; i++) {
      sum += totalaverage[i];
    }
    let avg4 = sum / count;
    return avg4;
  }
  if (ratings !== NaN && ratings2 !== NaN) {
    average = avg(ratings);
    average2 = avg2(ratings2);
    average3 = avg3(ratings3);
    average4 = avg4(ratings4);
  }
  const totalaverage = [average, average2, average3, average4];

  // console.log(totalAvg(totalaverage))
  const totalAvg = avg5(totalaverage);
  //  console.log("total ",totalAvg)

  const usersCollection = firestore();
  const onStarRatingPress = (rating) => {
    if (skillbool1) {
      setSkillCount(rating);
    }
    if (skillbool2) {
      setSkillCount2(rating);
    }
    if (skillbool3) {
      setSkillCount3(rating);
    }
    if (skillbool4) {
      setSkillCount4(rating);
    }
  };
  function onSubmit() {
    setRated(true);
    const ratingsID = userData.ID + TutorData;
    var reviewnumber = parseInt(reviewCount);
    settutorreview(reviewnumber + 1);
    setReview(review);
    //checking if skill is more than or equal to 4
    if (skillCount4 >= 4) {
      setisendorsed(true);
      //incrementing endorsement count
      if (endorsementcount >= 1) {
        var endorsednumber = parseInt(endorsementcount);
        setfinalEndorsement(endorsednumber + 1);
      } else {
        setfinalEndorsement(finalendorsementCount + 1);
      }
      //checking if an endorsed array already exists
      if (endorsedArray !== undefined) {
        console.log("endorsed array does exist");
        endorsedArray.map((item, i) => {
          setEndorsedCount(item.NumberofTutees);
          //checking if the skill a tutee selected already exists in the endorsed array
          if (skillSelected === item.EndorsedTalent) {
            //increments the count of tutees who endorsed that talent
            var number2 = parseInt(item.NumberofTutees);
            setTuteeCounter(number2 + 1);
            console.log(number2);
            setsameskill(true);
          } else if (skillSelected !== item.EndorsedTalent) {
            console.log("item not already endorsed");
            //checks if the skill is entered by the user, adds it to endorsements
            if (skillSelected === "Others") {
              const newEndorsements = [
                {
                  EndorsedTalent: skillstring,
                  NumberofTutees: 1,
                },
              ];
              firestore()
                .collection("Endorsements")
                .doc(TutorData)
                .update({
                  Endorsements: firestore.FieldValue.arrayUnion(
                    ...newEndorsements
                  ),
                });
              //adds the input to list of skills a tutor already has
              let skillarray = [skillstring];
              let newarray = [];
              newarray.push(...tutorskills, skillstring);
              console.log("string of skills ", newarray, skillstring);
              firestore().collection("Users").doc(TutorData).update({
                Specialization: newarray,
              });

              //checks if user allowed his identity to be visible
              if (checked === true) {
                const Endorsements = [
                  {
                    EndorsedTalent: skillstring,
                    NumberofTutees: 1,
                    TuteeName: userData.Name,
                    TuteeID: userData.ID,
                    TuteePic: userData.Photo,
                  },
                ];
                firestore()
                  .collection("Users")
                  .doc(TutorData)
                  .update({
                    Endorsements: firestore.FieldValue.arrayUnion(
                      ...Endorsements
                    ),
                  });
              } //if identity not visible
              else if (checked === false) {
                const Endorsements = [
                  {
                    EndorsedTalent: skillstring,
                    NumberofTutees: 1,
                  },
                ];
                firestore()
                  .collection("Users")
                  .doc(TutorData)
                  .update({
                    Endorsements: firestore.FieldValue.arrayUnion(
                      ...Endorsements
                    ),
                  });
              }
            }
            //if tutee selected skills other than "Others"
            else {
              const newEndorsements = [
                {
                  EndorsedTalent: skillSelected,
                  NumberofTutees: 1,
                },
              ];
              firestore()
                .collection("Endorsements")
                .doc(TutorData)
                .update({
                  Endorsements: firestore.FieldValue.arrayUnion(
                    ...newEndorsements
                  ),
                });
              //checking for identity visibility
              if (checked === true) {
                const Endorsements = [
                  {
                    EndorsedTalent: skillSelected,
                    NumberofTutees: 1,
                    TuteeName: props.userData.Name,
                    TuteeID: props.userData.ID,
                    TuteePic: props.userData.Photo,
                  },
                ];
                firestore()
                  .collection("Users")
                  .doc(TutorData)
                  .update({
                    Endorsements: firestore.FieldValue.arrayUnion(
                      ...Endorsements
                    ),
                  });
              } else if (checked === false) {
                const Endorsements = [
                  {
                    EndorsedTalent: skillSelected,
                    NumberofTutees: 1,
                  },
                ];
                firestore()
                  .collection("Users")
                  .doc(TutorData)
                  .update({
                    Endorsements: firestore.FieldValue.arrayUnion(
                      ...Endorsements
                    ),
                  });
              }
            }
          }
        });
      } //if first endorsement for a tutor
      else {
        console.log("endorsed array does not already exist ");
        if (skillSelected !== "Others") {
          const newEndorsements = [
            {
              EndorsedTalent: skillSelected,
              NumberofTutees: 1,
            },
          ];
          firestore()
            .collection("Endorsements")
            .doc(TutorData)
            .update({
              Endorsements: firestore.FieldValue.arrayUnion(
                ...newEndorsements
              ),
            });
          if (checked === true) {
            const Endorsements = [
              {
                EndorsedTalent: skillSelected,
                NumberofTutees: 1,
                TuteeName: userData.Name,
                TuteeID: userData.ID,
                TuteePic: userData.Photo,
              },
            ];
            firestore()
              .collection("Users")
              .doc(TutorData)
              .update({
                Endorsements: firestore.FieldValue.arrayUnion(
                  ...Endorsements
                ),
              });
          } else if (checked === false) {
            const Endorsements = [
              {
                EndorsedTalent: skillSelected,
                NumberofTutees: 1,
              },
            ];
            firestore()
              .collection("Users")
              .doc(TutorData)
              .update({
                Endorsements: firestore.FieldValue.arrayUnion(
                  ...Endorsements
                ),
              });
          }
        } else {
          const newEndorsements = [
            {
              EndorsedTalent: skillstring,
              NumberofTutees: 1,
            },
          ];
          firestore()
            .collection("Endorsements")
            .doc(TutorData)
            .update({
              Endorsements: firestore.FieldValue.arrayUnion(
                ...newEndorsements
              ),
            });
          if (checked === true) {
            const Endorsements = [
              {
                EndorsedTalent: skillstring,
                NumberofTutees: 1,
                TuteeName: userData.Name,
                TuteeID: userData.ID,
                TuteePic: userData.Photo,
              },
            ];
            firestore()
              .collection("Users")
              .doc(TutorData)
              .update({
                Endorsements: firestore.FieldValue.arrayUnion(
                  ...Endorsements
                ),
              });
          } else if (checked === false) {
            const Endorsements = [
              {
                EndorsedTalent: skillstring,
                NumberofTutees: 1,
              },
            ];
            firestore()
              .collection("Users")
              .doc(TutorData)
              .update({
                Endorsements: firestore.FieldValue.arrayUnion(
                  ...Endorsements
                ),
              });
          }
        }
      }
    } // end of endorsements
    //normal rating
    firestore().collection("Ratings").doc(ratingsID).set(
      {
        StudentID: userData.ID,
        TutorID: TutorData,
        CommunicationSkill: skillCount1,
        TeachingSkill: skillCount2,
        WorkEthic: skillCount3,
        KnowledgeSubject: skillCount4,
        Review: review,
        Rated: true,
        StudentName: userData.Name,
        StudentPic: userData.Photo,
      },
      { merge: true }
    );
    setVisible(false);
  }

  return (
    <SafeAreaView
      style={{
        backgroundColor: "black",
        height: "100%",
        paddingTop: Platform.OS === "android" ? 25 : 0,
      }}
    >
      <View style={{ backgroundColor: "black", height: 150 }}>
        <View
          style={{
            alignSelf: "flex-end",
            right: 5,
            left: 0,
            top: 0,
            position: "absolute",
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("Home")}
            style={{
              justifyContent: "center",
              alignSelf: "flex-end",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                width: 35,
                height: 35,
                borderRadius: 35,
                justifyContent: "center",
                alignSelf: "flex-end",
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
        <View style={{ flexDirection: "row", top: 0 }}>
          <Text style={{ color: "white", fontSize: 15 }}> Your </Text>
          <Text style={{ color: "#F1C411", fontWeight: "bold", fontSize: 15 }}>
            Tutors Reviews
          </Text>
        </View>
        <Text style={{ color: "white", top: 0, fontSize: 15 }}>
          {" "}
          View reviews or add your own.
        </Text>

        <View
          style={{ justifyContent: "flex-end", alignSelf: "flex-end" }}
        ></View>
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            alignSelf: "center",
            top: 120 / 5 - 0,
          }}
        >
          <Image
            source={{ uri: tutorpic }}
            style={{
              width: 70,
              height: 70,
              alignSelf: "center",
              borderRadius: 35,
            }}
          />
          <View
            style={{
              backgroundColor: "red",
              width: 25,
              height: 25,
              borderRadius: 15,
              justifyContent: "center",
              position: "absolute",
              left: 58,
              top: -8,
            }}
          >
            <Text style={{ fontSize: 14, alignSelf: "center", color: "white" }}>
              {reviewCount}
            </Text>
          </View>
          <View
            style={{
              bottom: 15,
              backgroundColor: "white",
              borderRadius: 20,
              justifyContent: "center",
              flexDirection: "row",
              width: 55,
              alignSelf: "center",
            }}
          >
            <Text style={{ alignSelf: "center" }}> {tutoraverage} </Text>
            <MaterialIcons
              name="star"
              style={{ color: "black", alignSelf: "center", right: 2 }}
            />
          </View>
          <Text
            style={{
              alignSelf: "center",
              fontSize: 16,
              color: "white",
              bottom: 10,
            }}
          >
            {" "}
            Mr. {tutorname}
          </Text>
        </View>
      </View>
      <Card
        containerStyle={{
          shadowColor: "grey",
          shadowOpacity: 0.5,
          shadowOffset: { width: 2, height: 2 },
          height: "300%",
          backgroundColor: "white",
          borderColor: "white",
          width: "100%",
          right: 15,
        }}
      >
        <Card.Title
          style={{
            textAlign: "left",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ marginTop: 5, fontSize: 16, color: "black" }}>
              {" "}
              Reviews{" "}
            </Text>
            <TouchableOpacity onPress={showReviewModel}>
              <MaterialIcons
                name="add"
                size={30}
                style={{
                  color: "black",
                  alignSelf: "center",
                  marginLeft: 0,
                }}
              />
            </TouchableOpacity>
          </View>
        </Card.Title>
        <View style={{ height: "auto" }}>
          <FlatList
            data={reviewData}
            contentContainerStyle={{ height: "200%" }}
            style={{ height: "auto" }}
            renderItem={({ item }) => (
              <View>
                <View
                  style={{
                    marginTop: 0,
                    marginRight: "auto",
                    marginLeft: 10,
                    flexDirection: "row",
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
                      marginLeft: 9,
                    }}
                  >
                    <Text
                      style={{
                        alignItems: "flex-start",
                        fontWeight: "bold",
                        color: "black",
                      }}
                    >
                      {" "}
                      {item.StudentName}
                    </Text>
                    <View style={styles.row}>
                      <Text style={{ color: "black" }}>
                        {" "}
                        Communication Skills{" "}
                      </Text>
                      <StarRating
                        maxStars={5}
                        starSize={10}
                        disabled={true}
                        rating={item.CommunicationSkill}
                        fullStarColor="#fdc500"
                        emptyStarColor="black"
                        starStyle={{
                          alignItems: "flex-start",
                          marginTop: 5,
                          marginLeft: 5,
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
                        fullStarColor="#fdc500"
                        emptyStarColor="black"
                        starStyle={{
                          alignItems: "flex-start",
                          marginTop: 5,
                          marginLeft: 5,
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
                        fullStarColor="#fdc500"
                        emptyStarColor="black"
                        starStyle={{
                          alignItems: "flex-start",
                          marginTop: 5,
                          marginLeft: 5,
                        }}
                      />
                    </View>
                    <View style={styles.row}>
                      <Text style={{ color: "black" }}>
                        {" "}
                        Knowledge Subject{" "}
                      </Text>
                      <StarRating
                        maxStars={5}
                        starSize={10}
                        disabled={true}
                        rating={item.KnowledgeSubject}
                        fullStarColor="#fdc500"
                        emptyStarColor="black"
                        starStyle={{
                          alignItems: "flex-start",
                          marginTop: 5,
                          marginLeft: 5,
                        }}
                      />
                    </View>
                    <Text style={{ marginLeft: 5, color: "black" }}>
                      {item.Review}
                    </Text>
                  </View>
                </View>
                <Card.Divider
                  style={{ backgroundColor: "black", marginTop: 5 }}
                />
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <Modal isVisible={isvisible}>
          <View
            style={{
              backgroundColor: "#333939",
              width: "100%",
              height: "60%",
              alignSelf: "center",
              borderRadius: 10,
            }}
          >
            <View
              style={{
                height: "100%",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  alignSelf: "center",
                  fontWeight: "bold",
                }}
              >
                Rate this tutor
              </Text>
              <View style={{ left: 10, marginTop: 30 }}>
                <View style={styles.column}>
                  <View style={styles.row}>
                    <Text style={{ color: "white" }}>Communication Skills</Text>
                    <StarRating
                      maxStars={5}
                      starSize={15}
                      disabled={false}
                      animation="jello"
                      rating={skillCount1}
                      fullStarColor="#fdc500"
                      emptyStarColor="white"
                      starStyle={{ marginLeft: 8 }}
                      selectedStar={(rating) => {
                        setBool1(true), setSkillCount(rating);
                      }}
                    />
                  </View>
                  <View style={styles.row}>
                    <Text style={{ color: "white" }}>Teaching Skills</Text>
                    <StarRating
                      maxStars={5}
                      starSize={15}
                      disabled={false}
                      animation="jello"
                      rating={skillCount2}
                      fullStarColor="#fdc500"
                      emptyStarColor="white"
                      starStyle={{ marginLeft: 8 }}
                      selectedStar={(rating) => {
                        setBool2(true), setSkillCount2(rating);
                      }}
                    />
                  </View>
                  <View style={styles.row}>
                    <Text style={{ color: "white" }}>Work Ethics</Text>
                    <StarRating
                      maxStars={5}
                      starSize={15}
                      disabled={false}
                      animation="jello"
                      rating={skillCount3}
                      fullStarColor="#fdc500"
                      emptyStarColor="white"
                      starStyle={{ marginLeft: 8 }}
                      selectedStar={(rating) => {
                        setBool3(true), setSkillCount3(rating);
                      }}
                    />
                  </View>
                  <View>
                    <View style={{ flexDirection: "row" }}>
                      <Text style={{ color: "white" }}>
                        Knowledge of the subject:{" "}
                      </Text>
                      <View style={{ flexDirection: "column" }}>
                        <ModalDropdown
                          options={[...tutorskills, "Others"]}
                          style={{
                            backgroundColor: "#eaeaf4",
                            height: 30,
                            borderRadius: 5,
                            justifyContent: "center",
                            width: 140,
                            marginLeft: 10,
                          }}
                          textStyle={{
                            color: "black",
                            alignSelf: "center",
                          }}
                          dropdownStyle={{
                            backgroundColor: "white",
                            width: 140,
                            borderRadius: 10,
                            height: 100,
                            alignSelf: "center",
                            bottom: 100,
                          }}
                          dropdownTextStyle={{
                            backgroundColor: "white",
                            color: "black",
                          }}
                          dropdownTextHighlightStyle={{
                            color: "#fdc500",
                            backgroundColor: "black",
                          }}
                          onSelect={(index, string) => setskillselected(string)}
                          defaultValue="Skills"
                        ></ModalDropdown>

                        {skillSelected === "Others" ? (
                          <TextInput
                            value={skillstring}
                            onChangeText={(text) => setskillstring(text)}
                            placeholder={"Ex. Strategic Planning"}
                            style={{
                              borderWidth: 1,
                              left: 0,
                              top: 10,
                              width: 150,
                              height: 30,
                              backgroundColor: "#eaeaf4",
                              borderColor: "#eaeaf4",
                              borderRadius: 5,
                            }}
                          />
                        ) : null}
                        <View style={{ top: 15, flexDirection: "row" }}>
                          <StarRating
                            maxStars={5}
                            starSize={15}
                            disabled={false}
                            animation="jello"
                            rating={skillCount4}
                            fullStarColor="#fdc500"
                            emptyStarColor="white"
                            starStyle={{ marginLeft: 8 }}
                            selectedStar={(rating) => {
                              setBool4(true), setSkillCount4(rating);
                            }}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <TextInput
                maxCharLimit={50}
                exceedCharCountColor="red"
                onChangeText={(text) => setReview(text)}
                placeholder={"Write your review..."}
                placeholderTextColor="white"
                style={{
                  marginTop: 30,
                  width: "90%",
                  alignItems: "baseline",
                  borderBottomWidth: 2,
                  marginLeft: 5,
                  textAlign: "left",
                }}
              />
              <TouchableOpacity
                style={{
                  height: 30,
                  width: "95%",
                  justifyContent: "center",
                  borderRadius: 10,
                  top: 50,
                  alignSelf: "center",
                  backgroundColor: "#fdc500",
                }}
                onPress={() => onSubmit()}
              >
                <Text
                  style={{
                    color: "black",
                    fontSize: 16,
                    textAlign: "center",
                    alignSelf: "center",
                  }}
                >
                  Submit
                </Text>
              </TouchableOpacity>
              <View style={{ top: 45, alignSelf: "center", width: "100%" }}>
                <CheckBox
                  onPress={() => setchecked(!checked)}
                  title="Your identity will be visible"
                  center
                  checkedColor={"#F1C411"}
                  checked={checked}
                  containerStyle={{
                    width: "auto",
                    alignSelf: "center",
                    left: 10,
                    backgroundColor: "#333939",
                    borderColor: "#333939",
                  }}
                  textStyle={{
                    color: "white",
                    width: "auto",
                    alignSelf: "center",
                    right: 10,
                  }}
                  style={{ alignSelf: "center" }}
                />
              </View>
            </View>
          </View>
        </Modal>
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  column: {
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
  },
});
