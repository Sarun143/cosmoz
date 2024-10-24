const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  staffId: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ['driver', 'conductor'],
    required: true,
  },
  aadhaarNumber: {
    type: String,
    required: true,
  },
  aadhaarPhoto: {
    type: String, // Path to the uploaded file
    required: true,
  },
  drivingLicense: {
    type: String,
    required: true,
  },
  drivingLicensePhoto: {
    type: String, // Path to the uploaded file
    required: true,
  },
  password: {
    type: String, // Hashed password
    required: true,
  },
});

const Staff = mongoose.model('Staff', staffSchema);

module.exports = Staff;
