// CODE ADDED BY UDDIPAN
import axios from "axios";
const SendNotification = (message, userIds) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `https://onesignal.com/api/v1/notifications`,
        {
          include_external_user_ids: userIds,
          app_id: "88b23002-f669-4795-89e8-d12b2b761e42",
          contents: { en: message, es: message },
          large_icon: "https://i.ibb.co/ZJJY7Rh/ic-launcher-round.png",
          isAndroid: true,
          isIos: true,
          isAnyWeb: false,
          isChrome: false,
          ios_attachments: {
            id: "https://i.ibb.co/ZJJY7Rh/ic-launcher-round.png"
          },
          small_icon: "ic_stat_onesignal_default"
        },
        {
          headers: {
            "Authorization": `Basic OWNhYmIwZDgtMjI2My00OTNlLWJjZjQtYjk3NTIwNzVmZDhh`,
            "Content-Type": "application/json; charset=utf-8"
          }
        }
      )
      .then((resp) => {
        console.log(resp);
        resolve(resp.data);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};
export default SendNotification;
// CODE ADDED BY UDDIPAN
