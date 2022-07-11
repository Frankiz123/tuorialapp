import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  Dimensions,
  Pressable,
  Keyboard,
  Platform
} from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { event } from "react-native-reanimated";
import Icon from "react-native-vector-icons/Feather";
import { Card } from "react-native-elements";
import { useLinkProps, useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import LottieView from "lottie-react-native";
import Modal from "react-native-modal";
import * as demodata from "../demodata.json";
import { MaterialIcons } from "@expo/vector-icons";
import MyLoader from "../components/loader/MyLoader";
import ModalDropdown from "react-native-modal-dropdown";
import FastImage from "react-native-fast-image";
import firestore from "@react-native-firebase/firestore";
export default function TutorSkills(props) {
  const flatListRef = useRef(null);
  const [value, setValue] = useState("");
  const [isvisible, setVisible] = useState(false);
  const [items, setItem] = useState([]);
  const [arrayvalue, setarrayvalue] = useState([]);
  const [list, setList] = useState({});
  const subcatList = [];
  const [subcategories, setsubcategories] = useState([]);
  const { userData } = props;
  const usersCollection = firestore();
  const [categoryselected, setcategoryselected] = useState("");
  const [subcategorylist, setsubcategorylist] = useState("");
  const [icon, seticon] = useState([]);
  const [play, setplay] = useState("");
  const [specific, setspecific] = useState("");
  const [categories, setcategories] = useState([]);
  const [iconindex, seticonindex] = useState("");
  const navigation = useNavigation();
  const [skillcount, setskillcount] = useState(0);
  const [endorsedArray, setendorsedArray] = useState([]);
  const [copyarray, setcopyarray] = useState([]);
  const [categoryicon, setcategoryicon] = useState("");
  const [searchtext, setsearchtext] = useState("");
  const [otherCategory, setOtherCategory] = useState("");
  const [othersubcategory, setothersubcategory] = useState("");
  const [experience, setexperience] = useState(0);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [isEditOn, setIsEditOn] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState({});
  const [selectedSkillIndex, setSelectedSkillIndex] = useState(0);
  const [editCategroyField, setEditCategroyField] = useState({});
  const [editSubCategroyField, setEditSubCategroyField] = useState({});
  const [editSubCategroyValue, setEditSubCategroyValue] = useState("");
  const [editSpecializationField, setEditSpecializationField] = useState("");
  async function categorySelect(item, index) {
    // st
    // uddipan
    setValue(item.ID);
    // console.log("item selected", item);
    setcategoryselected(item.Category);
    setcategoryicon(item.Icon);

    await firestore()
      .collection("SubCategories")
      .where("CategoryID", "==", item.ID)
      .onSnapshot((querysnap) => {
        if (querysnap.empty) {
          console.log("nope");
          console.log(value);
        }

        querysnap.forEach((docsnap) => {
          subcatList.push({ ...docsnap.data(), key: docsnap.id });
        });
        setsubcategories(subcatList);
        setsubcategorylist("");
        setspecific("");
        const generals = subcatList.map((item, i) => item.General);
      });
    setsearchtext("");
    flatListRef.current.scrollToIndex({
      animated: true,
      index: index.toString()
      // viewOffset: Dimensions.get('window').width - 500,
    });
  }
  let newcategory;
  async function getUserInfo() {
    try {
      setLoading(true);
      await firestore()
        .collection("Users")
        .doc(userData.ID)
        .onSnapshot((querysnapshot) => {
          setcategories(querysnapshot.data().Categories);
          setskillcount(querysnapshot.data().SkillCount);
          setUser(querysnapshot.data());
        });
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }
  async function getUserEndorsements() {
    await firestore()
      .collection("Endorsements")
      .doc(props.userData.ID)
      .onSnapshot((querysnap) => {
        if (querysnap.exists) {
          setendorsedArray(querysnap.data().Endorsements);
        }
      });
  }
  async function getUserCategories() {
    await firestore()
      .collection("Categories")
      .onSnapshot((querysnapshot) => {
        const list = [];

        querysnapshot.forEach((docsnapshot) => {
          list.push({ ...docsnapshot.data(), key: docsnapshot.id });
        });
        let sorted = list.sort((a, b) => {
          if (a.Category < b.Category) {
            return -1;
          }
          if (a.Category > b.Category) {
            return 1;
          }
          return 0;
        });
        let updated = sorted.filter((e) => e.Category != "My organisation");
        let tempOthers = updated.findIndex((e) => e.Category === "Others");
        const movingothers = updated[tempOthers];
        updated.push(updated.splice(tempOthers, 1)[0]);
        // updated.push(
        //   updated
        //     .splice(
        //       updated.findIndex((e) => (e.Category = "Others")),
        //       1
        //     )
        //     .pop()
        // );

        let tempSearch = updated.findIndex((e) => e.Category === "Search");
        const movingsearch = updated[tempSearch];
        updated.splice(tempSearch, 1);
        updated.splice(0, 0, movingsearch);

        setarrayvalue(updated);
        let categories = updated.map((item, i) => item.Category);
      });
  }
  useEffect(() => {
    async function getUserendorsements() {
      await getUserEndorsements();
    }
    getUserendorsements();
  }, []);

  useEffect(() => {
    async function getusercategories() {
      await getUserCategories();
    }
    getusercategories();
  }, []);

  useEffect(() => {
    async function getuserinfo() {
      await getUserInfo();
    }

    getuserinfo();
  }, []);

  function subcategoryselect(value, i) {
    setsubcategorylist(value);
  }

  async function deleteItems(item, index) {
    console.log(item);
    setLoading(true);
    try {
      let prevArr = user.Categories;
      let newArr = [...prevArr.slice(0, index), ...prevArr.slice(index + 1)];

      let updatedCategories = newArr;
      let updatedCategoryID = user.CategoryID;
      if (
        !updatedCategories.filter((cat) => cat.CategoryID == item.CategoryID)
          .length
      ) {
        updatedCategoryID = user.CategoryID.filter(
          (catId) => catId !== item.CategoryID
        );
      }
      let updatedSubCategoryID = user.SubCategoryID.filter(
        (subCatId) => subCatId !== item.General
      );
      let updatedSpecialization = user.Specialization.filter(
        (item) => item !== item.Specific
      );
      await firestore().collection("Users").doc(props.userData.ID).update({
        Categories: updatedCategories,
        CategoryID: updatedCategoryID,
        SubCategoryID: updatedSubCategoryID,
        SkillCount: updatedCategories.length,
        Specialization: updatedSpecialization
      });

      //Decrement counts of category
      firestore()
        .collection("Categories")
        .where("ID", "==", item.CategoryID)
        .get()
        .then((querySnapshot) => {
          let obj = {};
          querySnapshot.forEach((doc) => {
            obj = { ...doc.data(), id: doc.id };
          });
          firestore()
            .collection("Categories")
            .doc(obj.id)
            .update({
              Count: firestore.FieldValue.increment(-1)
            });
        })
        .catch((err) => {
          console.log(err);
        });
      //Increment counts of subcategory
      firestore()
        .collection("SubCategories")
        .where("General", "array-contains", item.General)
        .get()
        .then((querySnapshot) => {
          let obj = {};
          querySnapshot.forEach((doc) => {
            obj = { ...doc.data(), id: doc.id };
          });
          if (obj?.id) {
            firestore()
              .collection("SubCategories")
              .doc(obj.id)
              .update({
                Count: firestore.FieldValue.increment(-1)
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });

      if (item.CategoryID == "20") {
        firestore()
          .collection("SubCategories")
          .where("General", "array-contains", item.Name)
          .get()
          .then((querySnapshot) => {
            let obj = {};
            querySnapshot.forEach((doc) => {
              obj = { ...doc.data(), id: doc.id };
            });

            if (obj?.id) {
              let newGeneral = obj.General.filter((gen) => gen !== item.Name);
              let icons = [...obj.Icon];
              icons.shift();
              firestore().collection("SubCategories").doc(obj.id).update({
                General: newGeneral,
                Icon: icons
              });
            }
            console.log(newGeneral);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }

  function searchCategory(text) {
    setsearchtext(text);
    let categories = arrayvalue.map((item, i) => item.Category);

    const newdata = arrayvalue.filter((item) => {
      let itemdata = item.Category.toString().toUpperCase();
      let textdata = text.toUpperCase();
      return itemdata.indexOf(textdata) > -1;
    });

    setcopyarray(newdata);
  }

  async function saveDetails() {
    Keyboard.dismiss();
    try {
      setLoading(true);
      await firestore()
        .collection("Users")
        .where("ID", "==", props.userData.ID)
        .where("CategoryID", "array-contains", value)
        .get()
        .then(async (querySnapshot) => {
          let obj = {};
          querySnapshot.forEach((doc) => {
            obj = { ...doc.data(), id: doc.id };
          });

          if (
            obj.SubCategoryID?.includes(
              subcategorylist != "Others" ? subcategorylist : othersubcategory
            ) &&
            !otherCategory?.length
          ) {
            alert("Already included");
          } else {
            var number2 = parseInt(skillcount);
            let copyskillCount = number2 + 1;
            const newArray = [
              {
                CategoryID: value,
                Name:
                  categoryselected != "Others"
                    ? categoryselected
                    : otherCategory,
                General:
                  subcategorylist != "Others"
                    ? subcategorylist
                    : othersubcategory,
                Specific: specific,
                Icon: categoryicon,
                experience
              }
            ];
            console.log("new array", newArray, otherCategory, categoryselected);
            let newSpecificArray = [specific];
            const newCategoryarray = [value];
            let subcategoryarray = [
              subcategorylist != "Others" ? subcategorylist : othersubcategory
            ];
            if (categoryselected === "Others") {
              firestore()
                .collection("SubCategories")
                .where("CategoryName", "==", "Others")
                .get()
                .then((querySnapshot) => {
                  let obj = {};
                  querySnapshot.forEach((doc) => {
                    obj = { ...doc.data(), id: doc.id };
                  });
                  if (obj?.id) {
                    let newIcons = [...obj.Icon, newArray[0]?.Icon];
                    firestore()
                      .collection("SubCategories")
                      .doc(obj.id)
                      .update({
                        General: firestore.FieldValue.arrayUnion(
                          ...[otherCategory]
                        ),
                        Icon: newIcons
                      });
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            }
            await firestore()
              .collection("Users")
              .doc(props.userData.ID)
              .update({
                SkillCount: copyskillCount,
                CategoryID: firestore.FieldValue.arrayUnion(
                  ...newCategoryarray
                ),
                SubCategoryID: firestore.FieldValue.arrayUnion(
                  ...subcategoryarray
                ),
                Categories: firestore.FieldValue.arrayUnion(...newArray),
                CategorySet: true,
                Specialization: firestore.FieldValue.arrayUnion(
                  ...newSpecificArray
                )
              });
            //Increment counts of category
            firestore()
              .collection("Categories")
              .where("ID", "==", value)
              .get()
              .then((querySnapshot) => {
                let obj = {};
                querySnapshot.forEach((doc) => {
                  obj = { ...doc.data(), id: doc.id };
                });
                firestore()
                  .collection("Categories")
                  .doc(obj.id)
                  .update({
                    Count: firestore.FieldValue.increment(1)
                  });
              })
              .catch((err) => {
                console.log(err);
              });
            //Increment counts of subcategory
            firestore()
              .collection("SubCategories")
              .where(
                "General",
                "array-contains",
                subcategorylist != "Others" ? subcategorylist : othersubcategory
              )
              .get()
              .then((querySnapshot) => {
                let obj = {};
                querySnapshot.forEach((doc) => {
                  obj = { ...doc.data(), id: doc.id };
                });
                if (obj?.id) {
                  firestore()
                    .collection("SubCategories")
                    .doc(obj.id)
                    .update({
                      Count: firestore.FieldValue.increment(1)
                    });
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        });
      setspecific("");
      setOtherCategory("");
      setothersubcategory("");
    } catch (err) {
      console.log(err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (selectedSkill) {
      setEditCategroyField(selectedSkill);
      setEditSpecializationField(selectedSkill.Specific);
    }
  }, [selectedSkill]);

  const handleSelectCategoryInEditForm = async (item) => {
    await firestore()
      .collection("SubCategories")
      .where("CategoryID", "==", item?.ID ? item.ID : item.CategoryID)
      .onSnapshot((querysnap) => {
        let subcat_list = [];
        querysnap.forEach((docsnap) => {
          subcat_list.push({ ...docsnap.data(), key: docsnap.id });
        });
        setEditSubCategroyField(subcat_list);
      });
    setEditCategroyField(item);
  };

  const handleEditSkill = async () => {
    try {
      setLoading(true);
      let categories = user.Categories;
      categories[selectedSkillIndex] = {
        CategoryID: editCategroyField.ID
          ? editCategroyField.ID
          : editCategroyField.CategoryID,
        Name: editCategroyField.Category
          ? editCategroyField.Category
          : editCategroyField.Name,
        General: editSubCategroyValue,
        Specific: editSpecializationField,
        Icon: editCategroyField.Icon
      };

      let newSpecificArray = [...user.Specialization, editSpecializationField];
      const newCategoryarray = categories.map((cat) => cat.CategoryID);
      let subcategoryarray = [...user.SubCategoryID, editSubCategroyValue];
      await firestore()
        .collection("Users")
        .doc(props.userData.ID)
        .update({
          CategoryID: firestore.FieldValue.arrayUnion(...newCategoryarray),
          SubCategoryID: firestore.FieldValue.arrayUnion(...subcategoryarray),
          Categories: firestore.FieldValue.arrayUnion(...categories),
          CategorySet: true,
          Specialization: firestore.FieldValue.arrayUnion(...newSpecificArray)
        });
      setIsEditOn(false);
      setSelectedSkill({});
      setSelectedSkillIndex(0);
      setEditCategroyField({});
      setEditSubCategroyField({});
      setEditSpecializationField("");
    } catch (err) {
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (value === "22") {
      setcategoryselected("");
    }
  }, [value]);

  return (
    <SafeAreaView
      style={{
        height: "300%",
        backgroundColor: "black",
        paddingTop: Platform.OS === "android" ? 15 : 0
      }}
    >
      <MyLoader color={"#fff"} loading={loading} />
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%"
        }}
      >
        <View
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            flexDirection: "row",
            width: "100%"
          }}
        >
          <Pressable onPress={() => navigation.navigate("UpdateProfile")}>
            <Image
              source={{ uri: props.userData.Photo }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 50,
                marginRight: 10,
                marginTop: -15
              }}
            />
          </Pressable>
          <View style={{ marginTop: -5, marginBottom: 5, flex: 1 }}>
            <View style={{ flexDirection: "row", top: 10 }}>
              <Text
                style={{
                  justifyContent: "center",
                  color: "white"
                }}
              >
                {" "}
                Your{" "}
              </Text>
              <Text
                style={{
                  justifyContent: "center",
                  color: "#F1C411",
                  left: 0,
                  fontWeight: "bold"
                }}
              >
                TALENTS AND EXPERTISE.{" "}
              </Text>
            </View>
            <View
              style={{
                height: 50,
                backgroundColor: "black",
                flexDirection: "row",
                justifyContent: "space-between",
                top: 10
              }}
            >
              <Text
                style={{
                  alignSelf: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  marginBottom: 30,
                  width: "auto",
                  height: 50,
                  top: 15,
                  textAlign: "left"
                }}
              >
                {" "}
                Pick a Category {"|"} Sub-Category.
              </Text>
            </View>
          </View>
          <View
            style={{
              height: 50,
              backgroundColor: "black",
              flexDirection: "row",
              justifyContent: "flex-end",
              top: 10,
              left: -28,
              backgroundColor: "#ff00",
              width: "30%"
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate("Tutor")}
              style={{
                alignSelf: "center",
                bottom: 25,
                backgroundColor: "white",
                width: 35,
                height: 35,
                borderRadius: 35,
                justifyContent: "center",
                marginTop: 10
              }}
            >
              <MaterialIcons
                name="home"
                size={25}
                style={{ alignSelf: "center" }}
                color={"black"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <FlatList
        data={arrayvalue}
        horizontal={true}
        ref={flatListRef}
        style={{
          backgroundColor: "black",
          bottom: 20
        }}
        contentContainerStyle={{}}
        snapToInterval={Dimensions.get("window").width / 4}
        getItemLayout={(data, index) =>
          // Max 5 items visibles at once
          ({
            length: Dimensions.get("window").width / 4,
            offset: (Dimensions.get("window").width / 4) * index,
            index
          })
        }
        renderItem={({ item, index }) => {
          newcategory = item.ID;

          return (
            <View
              style={{
                marginTop: 10,
                flex: 1,
                backgroundColor: "white",
                height: 76,
                padding: 5,
                right: 0,
                borderRadius: 0,
                alignContent: "center"
              }}
            >
              <TouchableOpacity
                style={{ width: Dimensions.get("screen").width / 3.5 }}
                onPress={() => {
                  categorySelect(item, index);
                }}
              >
                <View
                  style={{
                    backgroundColor: "white",
                    borderRadius: value === index ? 20 : 0,
                    width: value === index ? 70 : "auto",
                    alignSelf: "center"
                  }}
                >
                  {/* <Image
                    source={{ uri: item.Icon }}
                    style={{
                      width: 35,
                      height: 40,
                      alignSelf: "center",
                      resizeMode: "contain"
                    }}
                  /> */}
                  <FastImage
                    style={{
                      width: 35,
                      height: 40,
                      resizeMode: "contain",
                      alignSelf: "center"
                    }}
                    source={{
                      uri: item.Icon,
                      priority: FastImage.priority.normal
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                  {value === item.ID ? (
                    <LottieView
                      ref={(animation) => {
                        setplay(animation);
                      }}
                      autoPlay={true}
                      style={{
                        width: 80,
                        height: 90,
                        alignSelf: "center",
                        marginTop: Platform.OS === "android" ? -10 : -7,
                        position: "absolute",
                        zIndex: -1
                      }}
                      source={require("../assets/focus3.json")}
                      loop={true}
                    />
                  ) : searchtext === item.Category ? (
                    <LottieView
                      ref={(animation) => {
                        setplay(animation);
                      }}
                      autoPlay={true}
                      style={{
                        width: 80,
                        height: 90,
                        alignSelf: "center",
                        marginTop: Platform.OS === "android" ? -10 : -7,
                        position: "absolute",
                        zIndex: -1
                      }}
                      source={require("../assets/focus3.json")}
                      loop={true}
                    />
                  ) : null}
                </View>
                <Text
                  style={{
                    color: "black",
                    alignSelf: "center",
                    width: "auto",
                    fontSize: 10.5
                  }}
                >
                  {item.Category}{" "}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
        keyExtractor={(item, index) => index.toString()}
      />

      {value != "22" && value != "20" && value != "" ? (
        <ScrollView
          horizontal={true}
          style={{ bottom: 15 }}
          contentContainerStyle={{
            flexDirection: "column",
            backgroundColor: value != null ? "#F1C411" : "black",
            height: 76,
            padding: 5,
            zIndex: 10,

            alignContent: "center",
            width: value != null ? "auto" : "auto",
            top: 0
          }}
        >
          {subcategories.map((item, i) => {
            const keys = Object.values(item?.General || {});
            const string = Object.values(item?.Icon || {});

            return (
              <View key={i} style={{ flexDirection: "column", right: 8 }}>
                <View
                  style={{
                    flexDirection: "row",
                    paddingHorizontal: 0
                  }}
                >
                  {string.map((item, i) => {
                    return (
                      <View
                        key={i}
                        style={{
                          width: Dimensions.get("screen").width / 3
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            seticon(item),
                              setsubcategorylist(keys[i]),
                              seticonindex(i);
                          }}
                          style={{
                            backgroundColor: "#F1C411",
                            borderRadius: icon === item ? 20 : 0
                          }}
                        >
                          <FastImage
                            style={{
                              width: 35,
                              height: 40,
                              resizeMode: "contain",
                              alignSelf: "center"
                            }}
                            source={{
                              uri: item,
                              priority: FastImage.priority.normal
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                          />
                          {/* <Image
                            source={{ uri: item }}
                            style={{
                              width: 35,
                              height: 40,
                              resizeMode: "contain",
                              alignSelf: "center"
                            }}
                          ></Image> */}
                          {icon === item ? (
                            <LottieView
                              ref={(animation) => {
                                setplay(animation);
                              }}
                              autoPlay={true}
                              style={{
                                width: 90,
                                height: 90,
                                alignSelf: "center",
                                marginTop: Platform.OS === "android" ? -12 : -8,
                                position: "absolute",
                                zIndex: -1
                              }}
                              source={require("../assets/focus2.json")}
                              loop={true}
                            />
                          ) : null}
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
                <View style={{ flexDirection: "row" }}>
                  {keys.map((value, i) => {
                    return (
                      <View
                        key={i}
                        style={{
                          width: Dimensions.get("screen").width / 3
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => subcategoryselect(value, i)}
                        >
                          <Text
                            style={{
                              color: "black",
                              fontSize: 10.5,
                              width: "auto",
                              alignContent: "center",
                              right: 0,
                              alignSelf: "center"
                            }}
                          >
                            {value}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </ScrollView>
      ) : value === "22" ? (
        <View
          style={{
            alignSelf: "center",
            justifyContent: "center",
            bottom: 15,
            width: "100%"
          }}
        >
          <TextInput
            value={searchtext}
            style={{
              borderColor: "#000",
              borderWidth: 1,
              alignSelf: "center",
              borderRadius: 10,
              backgroundColor: "white",
              width: "100%",
              height: 45
            }}
            placeholder="Ex: Physics"
            onChangeText={(text) => searchCategory(text)}
          />
          {searchtext !== "" ? (
            <>
              {/* // <View style={{ maxHeight: 250,  width: Dimensions.get('window').width, padding: 1, backgroundColor: '#ff0', marginLeft: - Dimensions.get('window').width / 2  }}> */}
              {/* <ScrollView style={{flex: 1, width: '100%'}} >
                {copyarray
                  .filter((e) => e.Category != "Search")
                  .map((item, i) => (
                    <TouchableOpacity
                      onPress={() => categorySelect(item)}
                      style={{
                        backgroundColor: "white",
                        borderWidth: 1,
                        borderRadius: 0,
                        zIndex: 10,
                        borderRadius: 0,
                        width: '100%',
                        padding: 10
                      }}
                    >
                      <Text style={{ padding: 10 }}>{item.Category} </Text>
                    </TouchableOpacity>
                  ))}
              </ScrollView> */}
              <FlatList
                data={copyarray.filter((e) => e.Category != "Search")}
                style={{
                  zIndex: 20,
                  width: 350,
                  flexGrow: 1,
                  borderRadius: 10,
                  alignSelf: "center",
                  height: 200,
                  borderRadius: 10
                }}
                contentContainerStyle={{ zIndex: 10, flexGrow: 1 }}
                renderItem={({ item, index }) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        var actualIndex = arrayvalue.findIndex(function (cat) {
                          return cat.Category.includes(item.Category);
                        });
                        // if((actualIndex + 2) < arrayvalue.length){
                        //   actualIndex = actualIndex + 2
                        // }
                        categorySelect(item, actualIndex);
                      }}
                      style={{
                        backgroundColor: "white",
                        borderBottomWidth: 1,
                        borderBottomColor: "#eee",
                        borderRadius: 0,
                        zIndex: 10,
                        borderRadius: 0
                      }}
                    >
                      <Text style={{ padding: 10 }}>{item.Category} </Text>
                    </TouchableOpacity>
                  );
                }}
                keyExtractor={(item, index) => index.toString()}
              />
              {/* // </View> */}
            </>
          ) : null}
        </View>
      ) : value === "20" ? (
        <></>
      ) : (
        // <View
        //   style={{
        //     width: 100,

        //     justifyContent: "center",
        //     height: "auto",
        //     bottom: 10,
        //     left: 5,
        //   }}
        // >
        //   <TextInput
        //     value={otherCategory}
        //     style={{
        //       height: "auto",
        //       borderColor: "#0001",
        //       borderWidth: 1,
        //       width: 200,

        //       borderRadius: 10,
        //       backgroundColor: "white",
        //     }}
        //     placeholder="Ex: Mathematics"
        //     onChangeText={(text) => setOtherCategory(text)}
        //   />
        // </View>
        <Image
          source={require("../assets/yellowbox.png")}
          style={{
            width: 370,
            height: 190,
            zIndex: 0,
            resizeMode: "cover",
            top: 190,
            position: "absolute",
            alignSelf: "center"
          }}
        />
      )}
      {/* bread crumb */}
      <Text
        style={{
          color: "#fff",
          paddingVertical: 10,
          paddingHorizontal: 15,
          fontSize: 12,
          width: "100%",
          backgroundColor: "#4448",
          marginTop: -10,
          marginBottom: 5
        }}
      >
        {categoryselected !== "" &&
          subcategorylist === "" &&
          specific === "" &&
          categoryselected}
        {categoryselected !== "" &&
          subcategorylist !== "" &&
          specific === "" &&
          `${categoryselected} > ${subcategorylist}`}
        {categoryselected !== "" &&
          subcategorylist !== "" &&
          specific !== "" &&
          `${categoryselected} > ${subcategorylist} > ${specific}`}
        {/* {`Artists > Design & Illustration > Adobe Illustrator masterclass`} */}
      </Text>

      {categoryselected !== "" && (
        <View
          style={{
            width: "90%",
            backgroundColor: "#eee",
            borderRadius: 10,
            elevation: 3,
            marginLeft: "5%"
          }}
        >
          {value === "20" && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <TextInput
                value={otherCategory}
                style={{
                  borderWidth: 1,
                  borderColor: "#fff",
                  elevation: 5,
                  width: "90%",
                  height: "auto",
                  borderRadius: 10,
                  textAlign: "left",
                  left: 5,
                  backgroundColor: "white",
                  marginTop: 20
                }}
                placeholder="Ex: Mathematics"
                onChangeText={(text) => setOtherCategory(text)}
              />
            </View>
          )}
          {subcategorylist === "Others" && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 20
              }}
            >
              <TextInput
                value={othersubcategory}
                style={{
                  borderWidth: 1,
                  borderColor: "#fff",
                  elevation: 5,
                  width: "90%",
                  height: "auto",
                  borderRadius: 10,
                  textAlign: "left",
                  left: 5,
                  backgroundColor: "white",
                  marginTop: 20
                }}
                placeholder="Subcategory. ex: Mathematics"
                onChangeText={(text) => setothersubcategory(text)}
              />
            </View>
          )}
          <View style={{ zIndex: -1 }}>
            {value != "" && (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                {/* <Text style={{ marginTop: 0, color: "white", alignSelf: "center" }}>
              {" "}
              Specify:{" "}
            </Text> */}
                <TextInput
                  value={specific}
                  placeholder="Specialization. ex: Artificial Intelligence"
                  style={{
                    borderWidth: 1,
                    borderColor: "#fff",
                    elevation: 5,
                    width: "90%",
                    height: "auto",
                    borderRadius: 10,
                    textAlign: "left",
                    left: 5,
                    backgroundColor: "white",
                    marginBottom: 20,
                    height: 40,
                    paddingLeft: 10,
                    marginTop: subcategorylist === "Others" ? 0 : 40
                  }}
                  onChangeText={(text) => setspecific(text)}
                ></TextInput>
                <View style={{ flexDirection: "row" }}>
                  <TextInput
                    value={experience}
                    placeholder="Years of experience"
                    style={{
                      borderWidth: 1,
                      borderColor: "#fff",
                      elevation: 5,
                      width: "90%",
                      borderRadius: 10,
                      textAlign: "left",
                      left: 5,
                      backgroundColor: "white",
                      height: 40,
                      paddingLeft: 10
                    }}
                    onChangeText={(text) => setexperience(text)}
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>
            )}

            <View
              style={{
                alignSelf: "center",
                top: value != "" ? 15 : 90,
                alignSelf: "center"
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "#F1C411",
                  borderRadius: 10,
                  width: "auto",
                  flexDirection: "row",
                  alignSelf: "center",
                  paddingVertical: 5,
                  paddingHorizontal: 20,
                  elevation: 3,
                  marginBottom: 50
                }}
                onPress={() => saveDetails()}
              >
                <Text style={{ alignSelf: "center", color: "black" }}>
                  {" "}
                  Add to expertise{" "}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      {endorsedArray.length && endorsedArray != null ? (
        <Card
          containerStyle={{
            borderRadius: 20,
            shadowColor: "black",
            width: "90%",
            height: "auto",
            shadowOpacity: 0.5,
            shadowOffset: { width: 5, height: 5 },
            backgroundColor: "#7a0000",
            borderColor: "#7a0000",
            elevation: 10,
            shadowRadius: 10,
            left: 5,
            marginTop: value != "" ? 20 : 100
          }}
        >
          <View style={{ flexDirection: "row", bottom: 0 }}>
            <View
              style={{
                backgroundColor: "#F1C411",
                width: 40,
                height: 40,
                borderRadius: 20,
                justifyContent: "center",
                right: 5
              }}
            >
              <Image
                source={require("../assets/talent.png")}
                style={{
                  width: 30,
                  height: 30,
                  opacity: 1,
                  alignSelf: "center",
                  resizeMode: "contain"
                }}
              />
            </View>
            <Text
              style={{
                alignSelf: "center",
                alignSelf: "flex-start",
                color: "white",

                left: 0,
                fontWeight: "bold"
              }}
            >
              AUTOMATICALLY ENDORESED TALENTS
            </Text>
          </View>
          <FlatList
            data={endorsedArray}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              return (
                <View
                  style={{
                    left: 40,
                    bottom: 0,
                    alignSelf: "flex-start",
                    flexDirection: "row"
                  }}
                >
                  <Text style={{ fontWeight: "bold", color: "white" }}>
                    {item.EndorsedTalent}
                  </Text>
                  <View
                    style={{
                      backgroundColor: "white",
                      width: 2,
                      height: 18,
                      left: 5,
                      alignSelf: "center"
                    }}
                  />
                  <Text style={{ color: "white", left: 8 }}>
                    {item.NumberofTutees} endorsements
                  </Text>
                </View>
              );
            }}
          />
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Endorsements", {
                endorsements: endoresedtalents
              })
            }
            style={{
              height: 30,
              width: 100,
              top: 5,
              alignSelf: "center",
              justifyContent: "center",
              backgroundColor: "#F1C411",
              borderRadius: 10
            }}
          >
            <Text
              style={{
                alignSelf: "center",
                fontWeight: "bold",
                color: "black",
                top: 0,
                right: 0
              }}
            >
              View all
            </Text>
          </TouchableOpacity>
        </Card>
      ) : null}
      {isEditOn ? (
        <Card
          containerStyle={{
            backgroundColor: "#101820FF",
            borderColor: "#101820FF",
            width: "auto",
            borderRadius: 15,
            shadowOffset: { width: 0, height: 2 },
            shadowColor: "black",
            shadowRadius: 2,
            shadowOpacity: 0.5,
            marginBottom: 20,
            height: "400%",
            maxHeight: "400%",
            marginTop: 80
          }}
        >
          <TouchableOpacity
            style={{ position: "absolute", alignSelf: "flex-end" }}
            onPress={() => {
              setSelectedSkill({});
              setSelectedSkillIndex(0);
              setIsEditOn(false);
              setEditCategroyField({});
              setEditSubCategroyField({});
              setEditSpecializationField("");
            }}
          >
            <MaterialIcons
              name="clear"
              size={25}
              style={{ alignSelf: "flex-end" }}
              color={"#F1C411"}
            />
          </TouchableOpacity>
          <Text
            style={{
              alignSelf: "flex-start",
              color: "white",
              fontSize: 16,
              marginBottom: 5
            }}
          >
            Category
          </Text>
          <ModalDropdown
            options={arrayvalue}
            style={{
              width: "100%",
              borderColor: "#333939",
              height: 40,
              borderRadius: 10,
              borderWidth: 1,
              color: "white",
              backgroundColor: "#333939",
              marginBottom: 10,
              paddingLeft: 10
            }}
            textStyle={{
              color: "white"
            }}
            dropdownStyle={{
              width: "80%",
              marginTop: -22,
              backgroundColor: "black"
            }}
            dropdownTextStyle={{ backgroundColor: "white", color: "black" }}
            dropdownTextHighlightStyle={{
              color: "#F1C411",
              backgroundColor: "black"
            }}
            onSelect={(index, item) => handleSelectCategoryInEditForm(item)}
            defaultValue={editCategroyField?.Name || "Category"}
            renderRowText={(item) => item.Category}
            renderButtonText={(item) => item.Category}
          />
          <Text
            style={{
              alignSelf: "flex-start",
              color: "white",
              fontSize: 16,
              marginTop: 10,
              marginBottom: 5
            }}
          >
            SubCategory
          </Text>
          <ModalDropdown
            options={
              Array.isArray(editSubCategroyField[0]?.General)
                ? editSubCategroyField[0].General
                : []
            }
            style={{
              width: "100%",
              borderColor: "#333939",
              height: 40,
              borderRadius: 10,
              borderWidth: 1,
              color: "white",
              backgroundColor: "#333939",
              marginBottom: 10,
              paddingLeft: 10
            }}
            textStyle={{
              color: "white"
            }}
            dropdownStyle={{
              width: "80%",
              marginTop: -22,
              backgroundColor: "black"
            }}
            dropdownTextStyle={{ backgroundColor: "white", color: "black" }}
            dropdownTextHighlightStyle={{
              color: "#F1C411",
              backgroundColor: "black"
            }}
            onSelect={(index, item) => setEditSubCategroyValue(item)}
            defaultValue="Sub Category"
            // renderRowText={(item) => item.CategroyName}
            // renderButtonText={(item) => item.CategroyName}
          />
          <Text
            style={{
              alignSelf: "flex-start",
              color: "white",
              fontSize: 16,
              marginTop: 10,
              marginBottom: 5
            }}
          >
            Specialization
          </Text>
          <TextInput
            value={editSpecializationField}
            onChangeText={(text) => setEditSpecializationField(text)}
            placeholder={"ex: Artificial Intelligence"}
            placeholderTextColor="white"
            style={{
              width: "100%",
              borderColor: "#333939",
              height: 40,
              borderRadius: 10,
              borderWidth: 1,
              color: "white",
              backgroundColor: "#333939",
              marginBottom: 10,
              paddingLeft: 10
            }}
          />
          <TouchableOpacity
            onPress={() => handleEditSkill()}
            style={{
              width: "100%",
              height: 40,
              backgroundColor: "#F1C411",
              marginTop: 20,
              justifyContent: "center",
              alignSelf: "center",
              borderRadius: 10
            }}
          >
            <Text style={{ alignSelf: "center" }}>Save</Text>
          </TouchableOpacity>
        </Card>
      ) : (
        <FlatList
          data={categories}
          scrollEnabled={true}
          contentContainerStyle={{ height: "300%" }}
          renderItem={({ item, index }) => {
            // const string = Object.values(item.Specific);
            return (
              <View
                style={{
                  alignSelf: "center",
                  backgroundColor: "black",
                  width: "100%",
                  alignSelf: "center",
                  justifyContent: "center"
                }}
              >
                <Card
                  containerStyle={{
                    borderRadius: 20,
                    shadowColor: "black",
                    width: "90%",
                    height: "auto",
                    shadowOpacity: 0.5,
                    shadowOffset: { width: 5, height: 5 },
                    backgroundColor: "white",
                    borderColor: "white",
                    elevation: 10,
                    shadowRadius: 10,
                    left: 5
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      bottom: 0
                    }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <Image
                        source={{ uri: item.Icon }}
                        style={{
                          width: 30,
                          height: 30,
                          opacity: 1,
                          position: "relative",
                          alignSelf: "center",
                          right: 10,
                          resizeMode: "contain",
                          marginRight: 5
                        }}
                      />
                      <Text
                        style={{
                          alignSelf: "center",
                          alignSelf: "center",
                          color: "red",
                          bottom: 5
                        }}
                      >
                        Category: {item.Name}
                      </Text>
                    </View>
                    {/* <TouchableOpacity
                    onPress={() => {
                      setSelectedSkill(item);
                      handleSelectCategoryInEditForm(item)
                      setSelectedSkillIndex(index);
                      setIsEditOn(true)
                    }}
                    style={{ alignSelf: "center" }}
                  >
                    <MaterialIcons
                      name="edit"
                      size={20}
                      style={{ right: 0, left: 0, bottom: 5 }}
                    />
                  </TouchableOpacity> */}
                    <TouchableOpacity
                      onPress={() => deleteItems(item, index)}
                      style={{ alignSelf: "center" }}
                    >
                      <MaterialIcons
                        name="delete"
                        size={20}
                        style={{ right: 0, left: 0, bottom: 5 }}
                      />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignSelf: "center"
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "column",
                        width: "100%",
                        left: 30,
                        bottom: 10
                      }}
                    >
                      {item.General != "" && (
                        <Text style={{}}>SubCategory: {item.General} </Text>
                      )}
                      <Text style={{}}>Specialization: {item.Specific}</Text>
                      {item.experience && (
                        <Text style={{}}>
                          Experience: {item.experience} years
                        </Text>
                      )}
                    </View>
                  </View>
                </Card>
              </View>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  TextInput: {
    width: "50%",
    left: 10,
    alignItems: "baseline",
    borderBottomWidth: 2,
    textAlign: "left"
  },
  onePicker: {
    width: 120,
    height: 30,
    marginTop: 10,
    justifyContent: "center",
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 10
  },
  onePickerItem: {
    height: 40,
    color: "white"
  },
  scrollView: {
    alignSelf: "stretch",
    right: 30,
    top: 5
  },
  autocompleteContainer: {
    width: 300,
    alignSelf: "center",
    right: 5,
    backgroundColor: "#F1C411",

    height: 300,
    borderWidth: 1
  },
  itemText: {
    fontSize: 15,
    margin: 2,
    backgroundColor: "#F1C411"
  }
});
