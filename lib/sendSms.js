const Vonage = require("@vonage/server-sdk");

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_SECRET,
});

const sender = "Nika";

module.exports = (recipient, otp) => {
  const message = `Your otp is ${otp}`;
  return new Promise((resolve, reject) => {
    vonage.message.sendSms(sender, recipient, message, (err, responseData) => {
      if (err) {
        reject(err.message);
      } else {
        if (responseData.messages[0]["status"] === "0") {
          resolve(responseData);
        } else {
          reject(`${responseData.messages[0]["error-text"]}`);
        }
      }
    });
  });
};
