const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Otp = require("../models/otp");
const sendSms = require("../lib/sendSms");

router.post("/step-1", async (req, res) => {
  let { phone } = req.body;

  if (typeof phone !== "string") {
    phone = String(phone);
  }

  if (phone.length === 10) {
    phone = `91${phone}`;
  }

  try {
    const otp = Math.floor(1000 + Math.random() * 9000);

    const newOtp = new Otp({
      phone,
      otp,
    });

    await newOtp.save();

    await sendSms(phone, otp);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

router.post("/step-2", async (req, res) => {
  let { phone, otp } = req.body;

  if (typeof phone !== "string") {
    phone = String(phone);
  }

  if (phone.length === 10) {
    phone = `91${phone}`;
  }

  try {
    const doc = await Otp.findOne({ phone });

    if (!doc) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number",
      });
    }

    if (String(doc.otp) === String(otp)) {
      await Otp.deleteOne({ phone });
      res.json({
        success: true,
        message: "OTP verified. You can now proceed with registration",
      });
    } else {
      await Otp.deleteOne({ phone });
      return res.status(400).json({ success: false, message: "Invalid OTP! Please refresh and try again" });
    }
  } catch (err) {
    console.error("Error verifying OTP in MongoDB:", err);
    res.status(500).json({ success: false, message: "Failed to verify OTP" });
  }
});

router.post("/step-3", async (req, res) => {
  let { username, email, password, phone } = req.body;

  if (phone.length === 10) {
    phone = `91${phone}`;
  }

  if (!username || typeof username !== "string") {
    return res.status(400).json({
      success: false,
      message: "Name is required and must be a string",
    });
  }
  if (!email || typeof email !== "string") {
    return res.status(400).json({
      success: false,
      message: "Email is required and must be a string",
    });
  }
  if (!password || typeof password !== "string") {
    return res.status(400).json({
      success: false,
      message: "Name is required and must be a string",
    });
  }
  if (!phone || typeof phone !== "string") {
    return res.status(400).json({
      success: false,
      message: "Name is required and must be a string",
    });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({
        success: false,
        message: "User with that email already exists",
      });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      phone,
    });

    await user.save();
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      payload: {
        username,
        email,
        phone,
      },
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
});

module.exports = router;
