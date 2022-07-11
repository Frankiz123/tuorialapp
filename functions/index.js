const functions = require("firebase-functions");
const admin = require("firebase-admin");
const config = require("./config.json");
// const https = require("https");
// const crypto = require("crypto");

admin.initializeApp();

var fetch = require("node-fetch");
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.UpdateNotifications = functions.firestore
  .document("Users/{userID}")
  .onUpdate((change, context) => {
    const newValue = change.after.data();

    let video = newValue.Video;
    let hourlyrate = newValue.Rate;
    let skills = newValue.CategoryID;

    if (video != undefined && hourlyrate != undefined && skills != undefined) {
      console.log("HELLO", video, hourlyrate, skills, change.after.id);
      let id = change.after.id;
      admin
        .firestore()
        .collection("Users")
        .doc(change.after.id)
        .update({ DetailsSet: true });

      admin
        .firestore()
        .collection("Notifications")
        .doc(id)
        .onSnapshot((querysnapshot) => {
          let notifications = [];
          notifications.push(querysnapshot.data().Messages);
          //let newnotifs = notifications.shift();
          let newnotifs = querysnapshot
            .data()
            .Messages.filter((e) => e.Type != "StartUp");
          console.log("notifications ", newnotifs);

          admin
            .firestore()
            .collection("Notifications")
            .doc(id)
            .update({ Messages: newnotifs });

          admin
            .firestore()
            .collection("Users")
            .doc(id)
            .update({ NotifCount: newnotifs.length });
        });
    }
  });
