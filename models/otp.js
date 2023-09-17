const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  phone: String,
  otp: Number,
});

const OTP = mongoose.model("otp", otpSchema);

module.exports = OTP;
