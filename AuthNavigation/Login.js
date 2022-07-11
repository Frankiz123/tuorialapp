import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform
} from "react-native";
import * as Facebook from "expo-facebook";

import {
  GoogleSignin,
  statusCodes
} from "@react-native-google-signin/google-signin";

import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import publicIP from "react-native-public-ip";
// WebBrowser.maybeCompleteAuthSession();
import OneSignal from "react-native-onesignal";
import SendNotification from "../utils/SendNotification";
import SendEmail from "../utils/SendEmail";
import GetEmailTemplate from "../utils/GetEmailTemplate";
import { androidClientId, iosClientId, webClientId } from "../key/KEYS";
// const useProxy = Platform.select({ web: false, default: true });
import appleAuth from "@invertase/react-native-apple-authentication";

export default function Login(props) {
  const { updateLogged, userUpdate, userData } = props;
  const [expoPushToken, setExpoPushToken] = useState("");
  const usersCollection = firestore();
  const [instagramtoken, settoken] = useState("");
  const [loading, setloading] = useState(false);
  const [userdata, setuserdata] = useState(null);
  const [check, setcheck] = useState(false);
  const [linkedin, setlinkedin] = useState(false);

  const sendWelcomeEmail = (email) => {
    let emailBody = GetEmailTemplate({
      title: `I would like to personally welcome you to tutoritto, a patent pending mobile app that provides opportunity by connecting people.`,
      content: `The opportunities are endless and you are always in control.<br /><br />Make sure to try out our unique bidding war and crowd funding opportunities within the app. Also, you can collect reward points (that can be redeemed as cash) by referring colleagues to join and other positive interactions with the app.<br /><br />For any issues, make sure to visit our website (www.tutoritto.com) and go through the FAQs as well. You can also contact us directly by email (info@tutoritto.com) and we promise to respond within 24 hours. <br />Welcome to the future. Welcome to tutoritto.<br/><br /><br />Tutoritto founder and CEO,<br />Prof. M.Watfa`,
      subtitle:
        "We are so happy to have you join turoritto and start exploring opportunities to earn money and/or acquire online services ANYTIME, ANYWHERE."
    });
    SendEmail(email, "Message from Tutoritto", emailBody);
  };
  const checkReferral = (email) => {
    publicIP()
      .then((ip) => {
        console.log(ip);
        firestore()
          .collection("Referrals")
          .where("ip", "==", ip)
          .get()
          .then((snapshot) => {
            let list = [];
            snapshot.forEach((documentSnapshot) => {
              list.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id
              });
            });

            if (list.length > 0) {
              let status = list[0]?.status;
              if (status === "pending") {
                firestore()
                  .collection("Users")
                  .doc(list[0]?.referent)
                  .get()
                  .then((userSnapshot) => {
                    let userInfo = userSnapshot.data();
                    if (userInfo?.referedEmails?.includes(email)) {
                      return;
                    }
                    let emailArray = [email];
                    if (userInfo?.referralReward) {
                      if (userInfo.referralReward === 4) {
                        userSnapshot.ref.update({
                          referralReward: 0,
                          referedEmails: firestore.FieldValue.arrayUnion(
                            ...emailArray
                          ),
                          RewardCount: firestore.FieldValue.increment(5)
                        });
                      } else {
                        userSnapshot.ref.update({
                          referralReward: firestore.FieldValue.increment(1),
                          referedEmails: firestore.FieldValue.arrayUnion(
                            ...emailArray
                          )
                        });
                      }
                    } else {
                      userSnapshot.ref.update({
                        referralReward: firestore.FieldValue.increment(1),
                        referedEmails: firestore.FieldValue.arrayUnion(
                          ...emailArray
                        )
                      });
                    }

                    SendNotification(
                      `You have received reward points of 5 for your referral.
                    `,
                      [userInfo?.ID]
                    );

                    let emailBody = GetEmailTemplate({
                      title: `Congratulation! You have received new reward points.`,
                      subtitle: `Hi ${userInfo?.Name}, You have received reward points of 5 for your referral.`,
                      content: `You can manage all your reward points from Tutoritto app and withdraw in your wallet!`
                    });

                    SendEmail(
                      userInfo?.Email,
                      "Message from Tutoritto",
                      emailBody
                    );
                  });
                firestore()
                  .collection("Referrals")
                  .doc(list[0]?.key)
                  .get()
                  .then((snapshot) => {
                    snapshot.ref.update({ status: "completed" });
                  });
              }
            }
            // console.log(list);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((error) => {
        console.log(error);
        // 'Unable to get IP address.'
      });
  };
  const setExternalUserIdforOneSignal = async (externalUserId) => {
    // console.log(externalUserId, "----------->>>>>>>>>>>");
    // let pushToken = await AsyncStorage.getItem("DEVICE_TOKEN");
    // await AddDeviceOnesignal({
    //   id: externalUserId,
    //   pushToken
    // })
    // console.log(externalUserId); return
    OneSignal.setExternalUserId(externalUserId, (results) => {
      // The results will contain push and email success statuses
      console.log("Results of setting external user id");
      console.log(results);
      // Push can be expected in almost every situation with a success status, but
      // as a pre-caution its good to verify it exists
      if (results.push && results.push.success) {
        console.log("Results of setting external user id push status:");
        console.log(results.push.success);
      }
    });
  };
  //getting the data for linkedin users once the sign in is successful
  const createUser = async (newUserData) => {
    await usersCollection
      .collection("Users")
      .doc(newUserData.ID)
      .set(
        {
          Name: newUserData.Name,
          Photo: newUserData.Photo,
          ID: newUserData.ID,
          ProfileChanged: false,
          Type: newUserData.Type,
          Country: [],
          FirstTime: false,
          Email: newUserData.Email,
          Organization: "",
          Language: ["English"],
          Balance: 0,
          CategoryCount: 0,
          EducationCount: 0,
          EndorsementCount: 0,
          LanguageCount: 0,
          Q1Average: 0,
          Q2Average: 0,
          Q3Average: 0,
          Q4Average: 0,
          TotalAverage: 0,
          RequestCount: 0,
          SessionCount: 0,
          RewardCount: 0,
          SkillCount: 0,
          UpcomingCount: 0,
          NotifCount: 1,
          PreviousCount: 0,
          ScheduleSet: false,
          GroupSessionCount: 0,
          VideoCount: 0,
          BiddingCount: 0,
          HourReward: 0,
          EndorsedReward: 0,
          Hours: 0,
          ReviewCount: 0,
          Rate: 0
        },
        { merge: true }
      );
    let Notifarray = [
      {
        Message:
          "Update your profile with your skills, expertise, promo video, hourly rate and more.",
        Type: "StartUp"
      }
    ];
    const query = usersCollection.collection("Users").doc(newUserData.ID);
    query.get().then((querySnapShot) => {
      userUpdate(querySnapShot.data());
      updateLogged(true);
    });
    firestore()
      .collection("Notifications")
      .doc(newUserData.ID)
      .set(
        { Messages: firestore.FieldValue.arrayUnion(...Notifarray) },
        { merge: true }
      );
  };
  //CODE ADDED BY UDDIPAN
  const getLinkedInUser = async (access_token) => {
    try {
      const resp = await fetch(
        "https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,emailAddress,profilePicture(displayImage~:playableStreams))",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + access_token.access_token
          }
        }
      );
      const jsonResp = await resp.json();
      const respEmail = await fetch(
        `https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + access_token.access_token
          }
        }
      );
      const emailJsonResp = await respEmail.json();
      if (emailJsonResp.elements?.length) {
        let email = emailJsonResp.elements[0]["handle~"]["emailAddress"];
        let image = jsonResp.profilePicture;
        // getting the profile pic url
        let values = Object.entries(image);
        let PICURL = "";
        values[1][1].elements.map((item, i) =>
          item.identifiers.map((item, i) => {
            PICURL = item.identifier;
          })
        );
        var newUserData = {
          Name: jsonResp.firstName.localized.en_US,
          ID: jsonResp.id,
          Photo: PICURL,
          Email: email,
          Type: "",
          Country: "",
          NotificationToken: expoPushToken
        };

        auth()
          .createUserWithEmailAndPassword(email, jsonResp.id)
          .then((u) => {
            const query = usersCollection.collection("Users").doc(jsonResp.id);
            query.get().then(async (querySnapShot) => {
              checkReferral(email);
              sendWelcomeEmail(email);
              if (querySnapShot.data.ID != undefined) {
                userUpdate(querySnapShot.data());
                console.log("hellooo", querySnapShot.data());
                updateLogged(true);
              } else {
                await createUser(newUserData);
                // navigation.navigate("SetUp");
              }
            });
          })
          .catch((error) => {
            switch (error.code) {
              case "auth/email-already-in-use":
                console.log(`Email address already in use.`);
                auth()
                  .signInWithEmailAndPassword(email, jsonResp.id)
                  .then((u) => {
                    const query = usersCollection
                      .collection("Users")
                      .doc(jsonResp.id);
                    query.get().then(async (querySnapShot) => {
                      checkReferral(email);
                      if (querySnapShot.data.ID != undefined) {
                        userUpdate(querySnapShot.data());
                        console.log("hellooo", querySnapShot.data());
                        updateLogged(true);
                      } else {
                        await createUser(newUserData);
                        // navigation.navigate("SetUp");
                      }
                    });
                  });
                break;
              case "auth/invalid-email":
                console.log(`Email address is invalid.`);
                break;
              case "auth/operation-not-allowed":
                console.log(`Error during sign up.`);
                break;
              case "auth/weak-password":
                console.log(
                  "Password is not strong enough. Add additional characters including special characters and numbers."
                );
                break;
              default:
                console.log(error.message);
                break;
            }
          });
        return access_token.access_token;
      }
    } catch (error) {
      console.log("error", error.message);
    }
  };
  //CODE ADDED BY UDDIPAN
  useEffect(() => {
    //checking authentication
    const authlistener = auth().onAuthStateChanged((user) => {
      if (user != null) {
        console.log("we are authenticated now!");
        let uid;
        user.providerData.map((item, i) => (uid = item.uid));
        console.log("uid", uid);
        if (true) {
          const query = firestore().collection("Users").doc(uid);
          query.get().then((querySnapShot) => {
            //if firebase firestore has data in it then move on
            if (querySnapShot.exists) {
              console.log("EXISTS in login page ");
              updateLogged(true);
              userUpdate(querySnapShot.data());
            } else {
              let photourl;

              var newUserData = {
                Name: user.displayName,
                ID: uid,
                Photo: user.photoURL,
                Type: "",
                Email: user.email,
                Description: "",
                Country: ""
              };
              userUpdate(newUserData);
              props.navigation.navigate("SetUp");
              console.log("DOES NOT EXIST");
            }
          });
        }
      }
    });
    return authlistener;
  }, []);
  useEffect(() => {
    //CODE ADDED BY UDDIPAN
    GoogleSignin.configure({
      webClientId: webClientId
    });
    //CODE ADDED BY UDDIPAN
  }, []);
  //for fb sign in
  async function SignInWithFacebook() {
    try {
      await Facebook.initializeAsync({
        appId: "657664924907015",
        appName: "Tutorrito"
      });
      const { type, token } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ["public_profile", "email"],
        behavior: "web"
      });
      if (type === "success") {
        const credential = auth.FacebookAuthProvider.credential(token);
        await auth()
          .signInWithCredential(credential)
          .catch((error) => {
            console.log(error);
          });
        fetch(
          `https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,picture.height(500)`
        )
          .then((response) => response.json())
          .then((data) => {
            console.log("this is ", data);
            const displayname = data.name;
            const profilepicture = data.picture;
            const userid = data.id;
            const token = data.token;
            const email = data.email;
            const photourl = data.picture.data.url;
            const type = "";
            var newUserData = {
              Name: displayname,
              ID: userid,
              Photo: photourl,
              Type: "",
              Email: email,
              Description: "",
              Country: "",
              NotificationToken: expoPushToken
            };
            userUpdate(newUserData);
            console.log("this you ", userData);
            const query = usersCollection.collection("Users").doc(userid);
            query.get().then((querySnapShot) => {
              checkReferral(email);
              if (querySnapShot.exists) {
                userUpdate(querySnapShot.data());
                console.log("LOG IN PAGE EXISTS ", querySnapShot.data());
                updateLogged(true);
              } else {
                if (email) {
                  sendWelcomeEmail(email);
                }
                console.log("doesnt exist");
                userUpdate(newUserData);
                props.navigation.navigate("SetUp");
              }
            });
          });
      }
    } catch (e) {
      console.log(e);
    }
  }
  // for google sign in
  //CODE ADDED BY UDDIPAN
  async function signInWithGoogleAsync() {
    try {
      await GoogleSignin.hasPlayServices();
      const result = await GoogleSignin.signIn({
        androidClientId: androidClientId,
        iosClientId: iosClientId,
        scopes: ["profile", "email"]
      });
      const { idToken, user } = result;

      console.log(user);

      const credential = auth.GoogleAuthProvider.credential(idToken);
      await auth().create;
      await auth()
        .signInWithCredential(credential)
        .catch((error) => {
          alert(error);
        });
      console.log("=======>>>>>>", auth().currentUser);
      const displayname = user.givenName;
      const profilepicture =
        user.photo || "https://i.stack.imgur.com/34AD2.jpg";
      const userid = user.id;
      const email = user.email;

      var newUserData = {
        Name: displayname,
        ID: userid,
        Photo: profilepicture,
        Email: email,
        Type: "",
        Country: "",
        NotificationToken: expoPushToken
      };
      const query = usersCollection.collection("Users").doc(userid);
      query.get().then((querySnapShot) => {
        checkReferral(email);
        setExternalUserIdforOneSignal(userid);
        if (querySnapShot.exists) {
          userUpdate(querySnapShot.data());
          console.log("hellooo", querySnapShot.data());
          updateLogged(true);
        } else {
          console.log("doesnt exist", newUserData);
          if (email) {
            sendWelcomeEmail(email);
          }
          userUpdate(newUserData);
          props.navigation.navigate("SetUp");
        }
      });
      return user.id;
    } catch (error) {
      console.log("Error ", error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        alert("Google Play Services not available");
      } else {
        // some other error happened
        alert(error.toString());
      }
    } finally {
    }
  }

  async function signInWithAppleAsync() {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME]
      });

      // Ensure Apple returned a user identityToken
      if (!appleAuthRequestResponse.identityToken) {
        throw "Apple Sign-In failed - no identify token returned";
      }

      // Create a Firebase credential from the response
      const { identityToken, nonce, fullName } = appleAuthRequestResponse;
      const appleCredential = auth.AppleAuthProvider.credential(
        identityToken,
        nonce
      );

      // Sign the user in with the credential
      const user = await auth()
        .signInWithCredential(appleCredential)

        .catch((error) => {
          alert(error);
        });
      const displayname = fullName.givenName + " " + fullName.familyName;
      const profilepicture =
        user.photo || "https://i.stack.imgur.com/34AD2.jpg";
      const userid = user.id;
      const email = user.email;

      var newUserData = {
        Name: displayname,
        ID: userid,
        Photo: profilepicture,
        Email: email,
        Type: "",
        Country: "",
        NotificationToken: expoPushToken
      };
      const query = usersCollection.collection("Users").doc(userid);
      query.get().then((querySnapShot) => {
        checkReferral(email);
        setExternalUserIdforOneSignal(userid);
        if (querySnapShot.exists) {
          userUpdate(querySnapShot.data());
          updateLogged(true);
        } else {
          if (email) {
            sendWelcomeEmail(email);
          }
          userUpdate(newUserData);
          props.navigation.navigate("SetUp", { displayname });
        }
      });
      return user.id;
    } catch (error) {
      console.log("Error in catch ", error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        alert("Google Play Services not available");
      } else {
        // some other error happened
        // alert(error.toString());
        console.log("ERRORRR ", error);
      }
    }
  }

  //CODE ADDED BY UDDIPAN
  if (loading) {
    return <ActivityIndicator></ActivityIndicator>;
  }
  return check ? (
    <View>
      <Text>OOK</Text>
    </View>
  ) : (
    // <WebView
    //   source={{
    //     uri: "https://api.instagram.com/oauth/authorize?client_id=231714785274024&redirect_uri=https://google.com/&scope=user_profile,user_media&response_type=code",
    //   }}
    //   style={{ flex: 1 }}
    //   startInLoadingState
    //   scalesPageToFit={false}
    //   javaScriptEnabled={true}
    // />
    <View style={{ flex: 2, backgroundColor: "#101820FF", width: "100%" }}>
      <Image
        style={{
          width: 100,
          height: 100,
          marginBottom: 0,
          alignSelf: "center",
          marginTop: 50,
          marginBottom: 15
        }}
        source={require("../assets/logopt1.png")}
        s
      />

      <Text style={styles.welcometext}>
        Welcome to <Text style={{ fontWeight: "bold" }}> TUTORITTO </Text> where
        opportunities are created by connecting people remotely.
      </Text>
      {/* <TouchableOpacity
        style={styles.CustomBTN}
        onPress={() => {
          signInWithGoogleAsync();
        }}
      >
        <Image
          source={require("../assets/custom.png")}
          style={{ width: 45, height: 35, alignSelf: "center" }}
        />
        <Text style={{ marginLeft: 0, fontSize: 16, color: "black" }}>
          Create an account
        </Text>
      </TouchableOpacity>
      <Text style={{ color: "white", alignSelf: "center", marginTop: 20 }}>
        {" "}
        OR{" "}
      </Text> */}
      <Image
        source={require("../assets/tutorioto-fly.png")}
        style={{ width: "100%", height: "47%" }}
        resizeMode="contain"
      />
      <Text
        style={{
          color: "white",
          alignSelf: "center",
          marginTop: 10,
          fontSize: 15
        }}
      >
        {" "}
        Sign in with{" "}
      </Text>
      <View
        style={{
          marginTop: 20,
          flexDirection: "row",
          alignSelf: "center",
          paddingHorizontal: 20
        }}
      >
        <TouchableOpacity
          style={styles.FB_Btn}
          onPress={() => {
            SignInWithFacebook();
          }}
        >
          <Image
            source={require("../assets/fblogo.png")}
            style={{
              width: 50,
              height: 50,
              justifyContent: "center",
              alignSelf: "center",
              resizeMode: "contain",
              marginLeft: 10
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.GmailBTN}
          onPress={() => {
            signInWithGoogleAsync();
          }}
        >
          <Image
            source={require("../assets/googleicon.png")}
            style={{
              width: 45,
              height: 50,
              alignSelf: "center",
              resizeMode: "contain",
              justifyContent: "center"
            }}
          />
        </TouchableOpacity>
        {Platform.OS == "ios" && (
          <TouchableOpacity
            style={styles.GmailBTN}
            onPress={() => {
              signInWithAppleAsync();
            }}
          >
            <Image
              source={{
                uri: "https://seeklogo.com/images/A/apple-icon-logo-26EE948661-seeklogo.com.png"
              }}
              style={{
                width: 45,
                height: 50,
                alignSelf: "center",
                resizeMode: "contain",
                justifyContent: "center"
              }}
            />
          </TouchableOpacity>
        )}
        {/* <TouchableOpacity
          style={styles.GmailBTN}
          onPress={() => alert("Coming in next version.")}
          // onPress={() => login.current.open()}
        >
          <Image
            source={require("../assets/linkedin.png")}
            style={{
              width: 50,
              height: 50,
              alignSelf: "center",
              resizeMode: "contain",
              justifyContent: "center"
            }}
          />
        </TouchableOpacity> */}
      </View>
      {/* CODE ADDED BY UDDIPAN */}
      {/* <LinkedInModal
        ref={login}
        clientID="78bm1mlg95tev6"
        permissions={["r_liteprofile", "r_emailaddress"]}
        clientSecret="pU7wC0u1IwszNpys"
        redirectUri="https://www.google.com"
        onSuccess={(token) => {
          getLinkedInUser(token);
        }}
        onError={(error) => {
          console.log(error);
        }}
        // onSignIn={(token) => console.log("token", token)}
        linkText={null}
      /> */}
      {/* CODE ADDED BY UDDIPAN */}
    </View>
  );
}

const styles = StyleSheet.create({
  welcometext: {
    color: "white",
    marginRight: 0,
    fontSize: 16,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: "80%",
    textAlign: "center",
    lineHeight: 25
  },
  FB_Btn: {
    backgroundColor: "#101820FF",
    height: 55,
    alignItems: "center",
    flexDirection: "row",

    justifyContent: "center"
  },
  GmailBTN: {
    height: 55,
    marginLeft: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  CustomBTN: {
    width: "70%",
    borderRadius: 25,
    height: 55,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderColor: "#20232a",
    borderWidth: 2,
    marginLeft: 50,
    flexDirection: "row",
    marginTop: 50
  }
});
