import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  PureComponent
} from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Animated,
  TextInput,
  LayoutAnimation,
  Alert
} from "react-native";
import { useLinkProps, useNavigation } from "@react-navigation/native";
import { Card, ListItem, Button, List } from "react-native-elements";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import Swipeable from "react-native-gesture-handler/Swipeable";
import StarRating from "react-native-star-rating";
import Icon from "react-native-vector-icons/Feather";
import { useRoute } from "@react-navigation/native";
import Modal from "react-native-modal";
import ModalDropdown from "react-native-modal-dropdown";
import YoutubePlayer from "react-native-youtube-iframe";
import { KeyboardAvoidingView } from "react-native";
import * as demodata from "../demodata.json";
export default function AdvancedList(props) {
  const { filteredList } = props;
  const [modaldata, setmodaldata] = useState([]);
  const [skills, isSkills] = useState(false);
  const [XP, isXP] = useState(false);
  const [expertise, isExpertise] = useState(false);
  const [expertisearray, setexparray] = useState([]);
  const [language, islanguage] = useState(false);
  const [topic, settopic] = useState("");
  const [languagearr, setlanguagearr] = useState([]);
  const [reviews, isreviews] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [ratings2, setRatings2] = useState([]);
  const [ratings3, setRatings3] = useState([]);
  const [popup, setpopup] = useState(false);
  const [reviewData, setReviewData] = useState([]);
  const [modalkey, setmodalkey] = useState([]);
  const [XParray, setxparray] = useState([]);
  const [skillarray, setskillarr] = useState([]);
  const [educationarr, seteducationarr] = useState([]);
  const [education, iseducation] = useState(false);
  const [hours, sethours] = useState("");
  const [playing, setPlaying] = useState(false);
  const [bookpopup, setbookpopup] = useState(false);
  const [filename, setfilename] = useState("");
  const [downloadurl, setdownloadurl] = useState("");
  const [isOnetoOne, setOnetoOne] = useState(false);

  const [hours2, sethours2] = useState("");
  const Reviews = [];
  const Ratings1 = [];
  const Ratings2 = [];
  const Rating3 = [];
  const pickdoc = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({});
      console.log(
        "result info",
        result.uri,
        result.type,
        result.name,
        result.size,
        result
      );
      if (result.size > 2000000) {
        Alert.alert("File too big. Please compress it");
      } else {
        setfilename(result.name);
        const username = userData.Name;
        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = () => {
            resolve(xhr.response);
          };
          xhr.responseType = "blob";
          xhr.open("GET", result.uri, true);
          xhr.send(null);
        });
        // const ref = firebase.storage().ref().child('BookingFile/'+ userData.Name+ result.name);
        // let snapshot = await ref.put(blob);
        // const url =  await snapshot.ref.getDownloadURL();
        // setdownloadurl(url);

        // console.log('url', url)
      }
    } catch (err) {
      console.log(err);
    }
  };
  function openPopUp(item) {
    console.log("modal function", item.Title);
    setmodaldata(item);
    setpopup(true);
  }
  function pushforSkills(item) {
    isSkills(true);
    setskillarr(item);
  }
  function pushforXP(item) {
    isXP(true);
    setxparray(item);
  }
  function pushforExpertise(item) {
    isExpertise(true);
    setexparray(item.Categories);
    setmodalkey(item);
  }
  function pushforLanguage(item) {
    islanguage(true);
    setlanguagearr(item);
  }
  function pushforEducation(item) {
    iseducation(true);
    seteducationarr(item);
  }
  const [itemid, setitemid] = useState("");
  const [name, setname] = useState([]);
  function pushforReviews(item) {
    isreviews(true);
    setitemid(item.ID);
    setname(item.Name);
  }
  function closePopup() {
    setpopup(false);
    isSkills(false);
    isExpertise(false);
    islanguage(false);
    isreviews(false);
    isXP(false);
    iseducation(false);
  }
  // useEffect(() => {
  //   var unsubscribe;
  //   if (reviews == true) {
  //     unsubscribe = firebase
  //       .firestore()
  //       .collection("Ratings")
  //       .where("TutorID", "==", itemid)
  //       .limit(5)
  //       .onSnapshot((querySnapShot) => {
  //         console.log("read 1");
  //         querySnapShot.forEach((documentSnapShot) => {
  //           console.log("read 2");
  //           Reviews.push({
  //             ...documentSnapShot.data(),
  //             key: documentSnapShot.id,
  //           });
  //           Ratings1.push(documentSnapShot.data().CommunicationSkill);
  //           Ratings2.push(documentSnapShot.data().TeachingSkill);
  //           Rating3.push(documentSnapShot.data().WorkEthic);
  //         });

  //         setRatings(Ratings1);
  //         setRatings2(Ratings2);
  //         setRatings3(Rating3);
  //         setReviewData(Reviews);
  //       });
  //   }
  //   return () => {
  //     unsubscribe;
  //   };
  // }, []);

  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
      Alert.alert("video has finished playing!");
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying((prev) => !prev);
  }, []);
  const RightItem = ({ index, progress, drag }) => {
    drag = 0;
    var itemList = [...filteredList];
    let id = itemList.findIndex((e) => e.ID == index);
    itemList.splice(id, 1);

    return (
      <View style={{ backgroundColor: "black" }}>
        <Text>Delete</Text>
      </View>
    );
  };
  const LeftItem = ({ progress, drag }) => {
    // drag = 0;
    if (drag > 50) {
      //setbookpopup(true);
      console.log("ITS SWIPED");
    }
    function openmodal() {}
    return (
      <View style={{ backgroundColor: "black" }}>
        <TouchableOpacity onPress={() => openmodal()}>
          <Text style={{ fontSize: 20, marginLeft: 20, color: "black" }}>
            Book
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  function rightrender(index) {
    var itemList = [...arrayofdemodata];
    let id = itemList.findIndex((e) => e.ID == index);
    itemList.splice(id, 1);
    console.log("item left", id, "items", itemList);
    setdemodata(itemList);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
  }

  function leftrender() {
    setbookpopup(true);
  }

  return (
    <SafeAreaView>
      <FlatList
        data={filteredList}
        scrollEnabled={true}
        initialNumToRender={10}
        windowSize={5}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={30}
        removeClippedSubviews={false}
        style={{ width: "100%", height: "100%", flexGrow: 1 }}
        keyExtractor={(item, index) => {
          return index.toString();
        }}
        renderItem={({ item, index }) => {
          return (
            <View>
              <Swipeable
                renderLeftActions={(progress, dragx) => (
                  <LeftItem index={index} />
                )}
                renderRightActions={(progress, dragx) => (
                  <RightItem index={index} />
                )}
                onSwipeableLeftWillOpen={() => {
                  setOnetoOne(true), leftrender(index);
                }}
                onSwipeableRightWillOpen={() => {
                  setOnetoOne(true), rightrender(index);
                }}
              >
                <Card
                  containerStyle={{
                    borderRadius: 20,
                    shadowColor: "black",
                    width: "90%",
                    shadowOpacity: 0.5,
                    shadowOffset: { width: 5, height: 5 },
                    backgroundColor: "#333939",
                    borderColor: "#161a1d",
                    elevation: 10,
                    shadowRadius: 10
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity onPress={() => pushforEducation(item)}>
                      <Image
                        source={{ uri: item.Photo }}
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 25,
                          marginBottom: 5
                        }}
                      />
                    </TouchableOpacity>
                    <View style={{ flexDirection: "column" }}>
                      <View style={{ flexDirection: "row", left: 5 }}>
                        <Text
                          style={{
                            alignItems: "flex-start",
                            color: "white",
                            textAlign: "left"
                          }}
                        >
                          {" "}
                          {item.Name}
                        </Text>
                        <Text style={{ color: "white" }}>
                          , {item.Country},
                        </Text>
                        <Text style={{ color: "white" }}>
                          {" "}
                          {item.Education}{" "}
                        </Text>
                        <View
                          style={{ backgroundColor: "#fdc500" }}
                          style={{
                            left: 55,
                            backgroundColor: "#fdc500",
                            width: 30,
                            height: 30,
                            borderRadius: 20,
                            justifyContent: "center",
                            alignSelf: "flex-start",
                            bottom: 5
                          }}
                        >
                          <Image
                            source={require("../assets/follower.png")}
                            style={{
                              width: 20,
                              height: 20,
                              resizeMode: "contain",
                              alignSelf: "center"
                            }}
                          />
                        </View>
                      </View>
                      <View
                        style={{ flexDirection: "row", left: 10, bottom: 10 }}
                      >
                        <StarRating
                          maxStars={5}
                          starSize={15}
                          disabled={true}
                          rating={item.Average}
                          fullStarColor="#e8a80c"
                          emptyStarColor="white"
                          starStyle={{ alignItems: "center", marginLeft: 0 }}
                        />
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          marginTop: 15,
                          right: 42
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => pushforReviews(item)}
                          style={{
                            backgroundColor: "#fdc500",
                            alignSelf: "center",
                            borderRadius: 10,
                            height: 35,
                            width: 35,
                            alignContent: "center",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: 20
                          }}
                        >
                          <MaterialIcons
                            name="rate-review"
                            style={{ alignSelf: "center" }}
                            size={20}
                          />
                        </TouchableOpacity>
                        <View
                          style={{
                            backgroundColor: "red",
                            width: 20,
                            height: 20,
                            borderRadius: 15,
                            position: "absolute",
                            left: 23,
                            bottom: 20,
                            justifyContent: "center"
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 12,
                              alignSelf: "center",
                              color: "white"
                            }}
                          >
                            {item.ReviewCount}
                          </Text>
                        </View>
                        <TouchableOpacity onPress={() => pushforSkills(item)}>
                          <View
                            style={{
                              backgroundColor: "#fdc500",
                              alignSelf: "center",
                              borderRadius: 10,
                              height: 35,
                              width: 35,
                              alignContent: "center",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          >
                            <Image
                              source={require("../assets/availability.png")}
                              style={{
                                alignSelf: "center",
                                width: 25,
                                height: 25,
                                left: 2,
                                top: 2
                              }}
                            />
                          </View>
                        </TouchableOpacity>
                        <View
                          style={{
                            backgroundColor: "red",
                            width: 20,
                            height: 20,
                            borderRadius: 15,
                            position: "relative",
                            right: 9,
                            justifyContent: "center",
                            bottom: 5
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 12,
                              alignSelf: "center",
                              color: "white"
                            }}
                          >
                            {item.SkillCount}
                          </Text>
                        </View>
                        <TouchableOpacity onPress={() => pushforXP(item)}>
                          <View
                            style={{
                              backgroundColor: "#fdc500",
                              alignSelf: "center",
                              borderRadius: 10,
                              height: 35,
                              width: 35,
                              alignContent: "center",
                              alignItems: "center",
                              justifyContent: "center",
                              marginLeft: 5
                            }}
                          >
                            <Image
                              source={require("../assets/experience.png")}
                              style={{
                                alignSelf: "center",
                                width: 20,
                                height: 20,
                                resizeMode: "contain",
                                left: 2
                              }}
                            />
                          </View>
                        </TouchableOpacity>
                        <View
                          style={{
                            backgroundColor: "red",
                            width: 20,
                            height: 20,
                            borderRadius: 15,
                            right: 9,
                            justifyContent: "center",
                            position: "relative",
                            bottom: 5
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 12,
                              alignSelf: "center",
                              color: "white"
                            }}
                          >
                            {item.Experience}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => pushforExpertise(item)}
                        >
                          <View
                            style={{
                              backgroundColor: "#fdc500",
                              alignSelf: "flex-start",
                              borderRadius: 10,
                              height: 35,
                              width: 35,
                              alignContent: "center",
                              alignItems: "center",
                              justifyContent: "center",
                              marginLeft: 5
                            }}
                          >
                            <Image
                              source={require("../assets/interests.png")}
                              style={{
                                alignSelf: "center",
                                width: 25,
                                height: 25,
                                resizeMode: "contain"
                              }}
                            />
                          </View>
                        </TouchableOpacity>
                        <View
                          style={{
                            backgroundColor: "red",
                            width: 20,
                            height: 20,
                            borderRadius: 15,
                            right: 9,
                            justifyContent: "center",
                            position: "relative",
                            bottom: 5
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 12,
                              alignSelf: "center",
                              color: "white"
                            }}
                          >
                            {item.CategoryCount}
                          </Text>
                        </View>
                        <TouchableOpacity onPress={() => pushforLanguage(item)}>
                          <View
                            style={{
                              backgroundColor: "#fdc500",
                              alignSelf: "center",
                              borderRadius: 10,
                              height: 35,
                              width: 35,
                              alignContent: "center",
                              alignItems: "center",
                              justifyContent: "center",
                              marginLeft: 5
                            }}
                          >
                            <Icon
                              name="globe"
                              size={25}
                              style={{
                                alignSelf: "center",
                                width: 25,
                                height: 25
                              }}
                            />
                          </View>
                        </TouchableOpacity>
                        <View
                          style={{
                            backgroundColor: "red",
                            width: 20,
                            height: 20,
                            borderRadius: 15,
                            right: 9,
                            justifyContent: "center",
                            position: "relative",
                            bottom: 5
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 12,
                              alignSelf: "center",
                              color: "white"
                            }}
                          >
                            {item.LanguageCount}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={{ marginTop: 5 }}>
                    <YoutubePlayer
                      height={200}
                      play={playing}
                      videoId={"pVE92TNDwUk"}
                      onChangeState={onStateChange}
                      onFullScreenChange={(status) => console.log("ok")}
                    />
                  </View>
                </Card>
              </Swipeable>
            </View>
          );
        }}
        onEndReachedThreshold={0.1}
      />

      <Modal isVisible={skills}>
        <View
          style={{
            backgroundColor: "#333939",
            width: "100%",
            height: "50%",
            alignSelf: "center",
            borderRadius: 10
          }}
        >
          <TouchableOpacity onPress={() => closePopup()}>
            <MaterialIcons
              name="clear"
              size={25}
              style={{ alignSelf: "flex-end" }}
              color={"#fdc500"}
            />
          </TouchableOpacity>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ color: "white", left: 10, bottom: 10 }}>
              {skillarray.Name} -
            </Text>
            <Text
              style={{
                color: "white",
                left: 15,
                bottom: 10,
                fontWeight: "bold"
              }}
            >
              Availability
            </Text>
          </View>

          {demodata[0].Schedule.map((item, i) => {
            const values = Object.values(item);
            const id = Object.keys(item);
            return (
              <View key={i}>
                {id.map((keys, i) => {
                  return (
                    <View key={i} style={{ marginVertical: 10 }}>
                      <Text style={{ color: "white", marginLeft: 10 }}>
                        {keys}
                      </Text>
                      {values.map((times, i) => {
                        return (
                          <View key={i} style={{ flexDirection: "row" }}>
                            {times.map((slots, i) => {
                              return (
                                <View
                                  key={i}
                                  style={{
                                    flexDirection: "row",
                                    width: "auto",
                                    height: 30,
                                    backgroundColor: "#fdc500",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: 10,
                                    marginLeft: 5
                                  }}
                                >
                                  <TouchableOpacity>
                                    <Text
                                      style={{
                                        color: "black",
                                        alignSelf: "center",
                                        paddingHorizontal: 10
                                      }}
                                    >
                                      {slots}
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              );
                            })}
                          </View>
                        );
                      })}
                    </View>
                  );
                })}
              </View>
            );
          })}
        </View>
      </Modal>
      <Modal isVisible={education}>
        <View
          style={{
            backgroundColor: "#333939",
            width: "100%",
            height: "50%",
            alignSelf: "center",
            borderRadius: 10
          }}
        >
          <TouchableOpacity onPress={() => closePopup()}>
            <MaterialIcons
              name="clear"
              size={25}
              style={{ alignSelf: "flex-end" }}
              color={"#fdc500"}
            />
          </TouchableOpacity>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ color: "white", left: 10, bottom: 10 }}>
              {educationarr.Name} -
            </Text>
            <Text
              style={{
                color: "white",
                left: 15,
                bottom: 10,
                fontWeight: "bold"
              }}
            >
              Academic Background
            </Text>
          </View>

          <Text style={{ color: "white", fontSize: 18, left: 10 }}>
            Institution Name
          </Text>
          <Text style={{ color: "white", fontSize: 16, left: 10 }}>
            {educationarr.Education} degree
          </Text>
        </View>
      </Modal>

      <Modal key={XParray.ID} isVisible={XP}>
        <View
          style={{
            backgroundColor: "#333939",
            width: "100%",
            height: "50%",
            alignSelf: "center",
            borderRadius: 10
          }}
        >
          <TouchableOpacity onPress={() => closePopup()}>
            <MaterialIcons
              name="clear"
              size={25}
              style={{ alignSelf: "flex-end" }}
              color={"#fdc500"}
            />
          </TouchableOpacity>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ color: "white", left: 10, bottom: 10 }}>
              {XParray.Name} -
            </Text>
            <Text
              style={{
                color: "white",
                left: 15,
                bottom: 10,
                fontWeight: "bold"
              }}
            >
              Experience
            </Text>
          </View>
          <Text style={{ left: 5, color: "white", fontWeight: "bold" }}>
            Years of experience
          </Text>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 25,
              borderWidth: 1,
              justifyContent: "center",
              borderColor: "white",
              left: 5,
              top: 5
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 18,
                alignSelf: "center",
                color: "#fdc500"
              }}
            >
              {XParray.Experience}
            </Text>
          </View>
          <Card.Divider
            style={{ backgroundColor: "black", top: 10 }}
          ></Card.Divider>
          <View style={{ flexDirection: "row", top: 5 }}>
            <Text
              style={{
                color: "white",
                left: 5,
                fontWeight: "bold",
                alignSelf: "center"
              }}
            >
              Tutoritto hours
            </Text>
            <View
              style={{
                backgroundColor: "#fdc500",
                width: 25,
                height: 25,
                justifyContent: "center",
                borderRadius: 20,
                left: 10,
                alignSelf: "center"
              }}
            >
              <Image
                source={require("../assets/blacklogo.png")}
                style={{
                  width: 25,
                  height: 25,
                  opacity: 1,
                  position: "relative",
                  alignSelf: "center",
                  resizeMode: "contain"
                }}
              />
            </View>
          </View>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 25,
              borderWidth: 1,
              justifyContent: "center",
              borderColor: "white",
              left: 5,
              top: 5
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 18,
                alignSelf: "center",
                color: "#fdc500"
              }}
            >
              20
            </Text>
          </View>
        </View>
      </Modal>

      <Modal isVisible={expertise}>
        <View
          style={{
            backgroundColor: "#333939",
            width: "100%",
            height: "50%",
            alignSelf: "center",
            borderRadius: 10
          }}
        >
          <TouchableOpacity onPress={() => closePopup()}>
            <MaterialIcons
              name="clear"
              size={25}
              style={{ alignSelf: "flex-end" }}
              color={"#fdc500"}
            />
          </TouchableOpacity>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ color: "white", left: 10, bottom: 10 }}>
              {modalkey.Name} -
            </Text>
            <Text
              style={{
                color: "white",
                left: 15,
                bottom: 10,
                fontWeight: "bold"
              }}
            >
              Expertise & Skills
            </Text>
          </View>
          <FlatList
            data={expertisearray}
            renderItem={({ item }) => {
              const string = Object.values(item.Specific);
              return (
                <View
                  style={{
                    alignSelf: "center",
                    alignSelf: "center",
                    justifyContent: "center",
                    left: 20
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <View
                      style={{
                        backgroundColor: "#fdc500",
                        width: 40,
                        height: 40,
                        justifyContent: "center",
                        borderRadius: 20,
                        left: 5,
                        alignSelf: "flex-start"
                      }}
                    >
                      <Image
                        source={{ uri: item.Icon }}
                        style={{
                          width: 25,
                          height: 25,
                          opacity: 1,
                          position: "relative",
                          alignSelf: "center",
                          resizeMode: "contain"
                        }}
                      />
                    </View>
                    <View style={{ flexDirection: "column", marginLeft: 10 }}>
                      <Text style={{ fontWeight: "bold", color: "white" }}>
                        {item.Name}
                      </Text>

                      <View
                        style={{ flexDirection: "row", alignSelf: "center" }}
                      >
                        <View
                          style={{ flexDirection: "column", width: "100%" }}
                        >
                          <Text style={{ color: "white" }}>
                            General: {item.General}{" "}
                          </Text>

                          <Text style={{ color: "white" }}>Specific:- </Text>
                          <View style={{ flexDirection: "column" }}>
                            {string.map((strvalue, i) => {
                              return (
                                <View
                                  key={i}
                                  style={{ flexDirection: "column" }}
                                >
                                  <Text style={{ color: "white", right: 5 }}>
                                    {"\u2022"}
                                    {strvalue}
                                  </Text>
                                </View>
                              );
                            })}
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                  <Card.Divider
                    style={{ backgroundColor: "black", marginTop: 5 }}
                  />
                </View>
              );
            }}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </Modal>
      <Modal isVisible={language}>
        <View
          style={{
            backgroundColor: "#333939",
            width: "100%",
            height: "50%",
            alignSelf: "center",
            borderRadius: 10
          }}
        >
          <TouchableOpacity onPress={() => closePopup()}>
            <MaterialIcons
              name="clear"
              size={25}
              style={{ alignSelf: "flex-end" }}
              color={"#fdc500"}
            />
          </TouchableOpacity>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ color: "white", left: 10, bottom: 10 }}>
              {languagearr.Name} -
            </Text>
            <Text
              style={{
                color: "white",
                left: 15,
                bottom: 10,
                fontWeight: "bold"
              }}
            >
              Spoken Languages
            </Text>
          </View>

          <FlatList
            data={languagearr.Language}
            renderItem={({ item }) => {
              return (
                <View style={{ top: 5, left: 10 }}>
                  <Text
                    style={{
                      color: "white",
                      fontSize: 14,
                      paddingVertical: 10
                    }}
                  >
                    {"\u2022"} {item}
                  </Text>
                </View>
              );
            }}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </Modal>

      <Modal key={name} isVisible={reviews}>
        <View
          style={{
            backgroundColor: "#333939",
            width: "100%",
            height: "50%",
            alignSelf: "center",
            borderRadius: 10
          }}
        >
          <TouchableOpacity onPress={() => closePopup()}>
            <MaterialIcons
              name="clear"
              size={25}
              style={{ alignSelf: "flex-end" }}
              color={"#fdc500"}
            />
          </TouchableOpacity>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ color: "white", left: 10, bottom: 10 }}>
              {name} -
            </Text>
            <Text
              style={{
                color: "white",
                left: 15,
                bottom: 10,
                fontWeight: "bold"
              }}
            >
              Tutoritto Reviews
            </Text>
          </View>
          <FlatList
            data={reviewData}
            renderItem={({ item }) => (
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
                        color: "white"
                      }}
                    >
                      {" "}
                      {item.StudentName}
                    </Text>
                    <View style={styles.row}>
                      <Text style={{ color: "white" }}>
                        {" "}
                        Communication Skills{" "}
                      </Text>
                      <StarRating
                        maxStars={5}
                        starSize={10}
                        disabled={true}
                        rating={item.CommunicationSkill}
                        fullStarColor="#fdc500"
                        emptyStarColor="white"
                        starStyle={{
                          alignItems: "flex-start",
                          marginTop: 5,
                          marginLeft: 5
                        }}
                      />
                    </View>
                    <View style={styles.row}>
                      <Text style={{ color: "white" }}> Teaching Skills </Text>
                      <StarRating
                        maxStars={5}
                        starSize={10}
                        disabled={true}
                        rating={item.TeachingSkill}
                        fullStarColor="#fdc500"
                        emptyStarColor="white"
                        starStyle={{
                          alignItems: "flex-start",
                          marginTop: 5,
                          marginLeft: 5
                        }}
                      />
                    </View>
                    <View style={styles.row}>
                      <Text style={{ color: "white" }}> Work Ethics </Text>
                      <StarRating
                        maxStars={5}
                        starSize={10}
                        disabled={true}
                        rating={item.WorkEthic}
                        fullStarColor="#fdc500"
                        emptyStarColor="white"
                        starStyle={{
                          alignItems: "flex-start",
                          marginTop: 5,
                          marginLeft: 5
                        }}
                      />
                    </View>
                    <Text style={{ marginLeft: 5, color: "white" }}>
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
      </Modal>
      <Modal isVisible={bookpopup} style={{ width: "100%" }}>
        <KeyboardAvoidingView
          style={{
            width: "95%",
            height: "50%",
            backgroundColor: "#333939",
            right: 5,
            borderRadius: 10
          }}
          behavior={Platform.OS == "ios" ? "padding" : "height"}
          enabled={false}
        >
          <TouchableOpacity onPress={() => setbookpopup(false)}>
            <MaterialIcons
              name="clear"
              size={25}
              style={{ alignSelf: "flex-end" }}
              color={"#fdc500"}
            />
          </TouchableOpacity>

          <View style={{ alignSelf: "center" }}>
            <Text
              style={{
                color: "white",
                bottom: 10,
                fontWeight: "bold",
                textAlign: "center"
              }}
            >
              Add your booking details
            </Text>
            <Text
              style={{ color: "white", marginTop: 20, textAlign: "center" }}
            >
              Topic:
            </Text>
            <TextInput
              style={styles.TextInput}
              onChangeText={(text) => settopic(text)}
              value={topic}
            />
            <TouchableOpacity
              onPress={() => pickdoc()}
              style={{
                paddingHorizontal: 20,
                height: 30,
                backgroundColor: "white",
                justifyContent: "center",
                borderRadius: 10,
                marginTop: 20,
                flexDirection: "row",
                alignSelf: "center"
              }}
            >
              <MaterialIcons
                name="folder"
                size={15}
                style={{ alignSelf: "center" }}
              />
              {filename != "" ? (
                <Text>{filename}</Text>
              ) : (
                <Text style={{ alignSelf: "center" }}>Documents</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                marginTop: 20,
                backgroundColor: "white",
                height: 30,
                borderRadius: 10,
                justifyContent: "center",
                flexDirection: "row",
                alignSelf: "center",
                paddingHorizontal: 50
              }}
            >
              <MaterialIcons
                name="book-online"
                size={15}
                style={{ alignSelf: "center" }}
              />
              <Text style={{ alignSelf: "center" }}>Book</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  row: {
    flexDirection: "row"
  },

  TextInput: {
    borderBottomColor: "#e8a80c",
    borderBottomWidth: 2,
    color: "white",
    textAlign: "left",
    marginTop: 5
  }
});
