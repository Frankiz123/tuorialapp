// CODE ADDED BY UDDIPAN
import axios from "axios";
const SendEmail = (to, subject, body) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `https://sendmail-pro.herokuapp.com/api/send-mail`,
        {
          to,
          subject,
          body,
          fromAlias: "Tutoritto <info@tutoritto.com>"
        },
        {
          headers: {
            Authorization: `Basic OWNhYmIwZDgtMjI2My00OTNlLWJjZjQtYjk3NTIwNzVmZDhh`
          }
        }
      )
      .then((resp) => {
        console.log(resp.data);
        resolve(resp.data);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};
export default SendEmail;
// CODE ADDED BY UDDIPAN
