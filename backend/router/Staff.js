const express = require('express');
const multer = require('multer');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const router = express.Router();
const dotenv = require('dotenv');

dotenv.config();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this folder existsv
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({ storage });



// Create Staff Model
const Staff = require('../model/Staff');
const Login = require('../model/login');

// Function to generate a random password
const generateRandomPassword = () => {
  return Math.random().toString(36).slice(-8); // Simple random password generator
};

router.delete('/staff/:id', async (req, res) => {
  try {
    // Find and delete the staff by ID
    const staff = await Staff.findByIdAndDelete(req.params.id);
    
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    // After successfully deleting staff, delete the corresponding login entry
    const login = await Login.findOneAndDelete({ email: staff.email });
    
    if (!login) {
      return res.status(404).json({ message: 'Associated login record not found' });
    }

    // Send response after both deletions
    res.json({ message: 'Staff and associated login deleted successfully' });
  } catch (error) {
    console.error('Error deleting staff:', error);
    res.status(500).json({ message: 'Error deleting staff or login' });
  }
});


// Create staff route
router.post('/create', upload.fields([{ name: 'aadhaarPhoto' }, { name: 'drivingLicensePhoto' }]), async (req, res) => {
  const { name, email, phone, role, aadhaarNumber, drivingLicense, password: adminPassword } = req.body;

  // Validate required fields
  if (!name || !email || !phone || !role || !aadhaarNumber || !drivingLicense) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const staffCount = await Staff.countDocuments();
    const staffId = `STF${staffCount + 1}`;

    // Check if admin provided a password or generate a random one
    const password = adminPassword || generateRandomPassword();

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newStaff = new Staff({
      name,
      email,
      phone,
      staffId,
      role,
      aadhaarNumber,
      aadhaarPhoto: req.files['aadhaarPhoto'][0]?.path || '', // Save file path if exists
      drivingLicense,
      drivingLicensePhoto: req.files['drivingLicensePhoto'][0]?.path || '', // Save file path if exists
      password: hashedPassword, // Save hashed password
    });
    
// Create and save the login details with hashed password
const login = new Login({
  email,
  password: hashedPassword, // Store the hashed password
  role: 'staff'
});
await login.save();


    await newStaff.save();

    // Send email with staff ID and password
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS // Your email password or app password
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Staff Account Details',
      text: `Dear ${name},\n\nYour account has been created.\nemail: ${email}\nPassword: ${password}\n\nPlease log in and change your password after logging in.`, // Send the plain password
    };
    

    // Send email and handle potential errors
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    res.status(201).json(newStaff);
  } catch (error) {
    console.error('Error creating staff:', error); // Log the error
    res.status(500).json({ error: error.message || 'Server error, could not create staff.' }); // Return error message
  }
});

// Export the router
module.exports = router;
