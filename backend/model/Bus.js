const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  registrationNumber: {
    type: String,
    required: true,
    unique: true,
  },
  model: {
    type: String,
    required: true,
  },
  taxExpiryDate: {
    type: Date,
    required: false,
  },
  insuranceExpiryDate: {
    type: Date,
    required: false,
  },
  pollutionExpiryDate: {
    type: Date,
    required: false,
  },
  taxDocument: {
    data: Buffer,
    contentType: String
  },
  insuranceDocument: {
    data: Buffer,
    contentType: String
  },
  pollutionDocument: {
    data: Buffer,
    contentType: String
  }
});

module.exports = mongoose.model("Vehicle", vehicleSchema);
