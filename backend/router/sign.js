const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../model/user');
const Login = require('../model/login'); // Import Login model
const nodemailer = require('nodemailer'); 
const crypto = require('crypto');
const router = express.Router();
let otpStore = {};

// Helper function to send OTP email
const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

// Send OTP
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  const otp = crypto.randomInt(100000, 999999).toString();
  otpStore[email] = otp;

  try {
    await sendOtpEmail(email, otp);
    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP", error: error.message });
  }
});

// Verify OTP
router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (otpStore[email] && otpStore[email] === otp) {
    delete otpStore[email]; 
    res.status(200).json({ message: "OTP verified successfully" });
  } else {
    res.status(400).json({ message: "Invalid OTP" });
  }
});

// User Registration
router.post('/register', async (req, res) => {
  const { name, email, phone, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = new User({ name, email, phone, password: hashedPassword });

  try {
    const savedUser = await newUser.save();

    // Save email, hashed password, and role to Login model
    const newLogin = new Login({ email, password: hashedPassword });
    await newLogin.save();

    res.status(201).json({ message: "User registered successfully", user: savedUser });
  } catch (error) {
    console.error("Error saving user or login:", error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
