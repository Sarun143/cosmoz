const express = require('express');
const router = express.Router();
const UserModel = require('../model/user');
const LoginModel = require('../model/login');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

let OTPs = {}; // Temporary store for OTPs
const OTP_EXPIRY_TIME = 300000; // 5 minutes in milliseconds

// Configure nodemailer with hardcoded credentials (for demo purposes; consider using environment variables)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sarunsaji2025@mca.ajce.in', // Replace with your email
    pass: 'gvdt nhte wird nrqu',    // Replace with your app password
  },
});

// Send OTP
router.post('/', async (req, res) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "Email does not exist" });
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  OTPs[email] = { otp, generatedAt: Date.now() };

  // Send OTP email
  await transporter.sendMail({
    from: 'sarunsaji2025@mca.ajce.in', // Replace with your email
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
  });

  res.status(200).json({ message: "OTP sent to your email" });
});

// Verify OTP
router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  if (OTPs[email]) {
    const { otp: storedOtp, generatedAt } = OTPs[email];

    // Check if OTP is valid and not expired
    if (storedOtp === otp && (Date.now() - generatedAt) <= OTP_EXPIRY_TIME) {
      return res.status(200).json({ message: "OTP verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
  } else {
    return res.status(400).json({ message: "Invalid OTP" });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  await UserModel.updateOne({ email }, { password: hashedPassword });
  await LoginModel.updateOne({ email}, {password:hashedPassword})

  // Remove OTP from memory
  delete OTPs[email];

  res.status(200).json({ message: "Password reset successfully" });
});

module.exports = router;