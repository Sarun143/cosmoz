// models/Bus.js
const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busId: {
    type: String,
    required: true,
    unique: true,
  },
  routeId: {
    type: String,
    required: true,
  },
  regNo: {
    type: String,
    required: true,
    unique: true,
  },
  seatCapacity: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Ready for Service', 'On Maintenance'],
    default: 'Ready for Service',
  },
  pollutionStartDate: {
    type: Date,
    required: true,
  },
  pollutionEndDate: {
    type: Date,
    required: true,
  },
  taxStartDate: {
    type: Date,
    required: true,
  },
  taxEndDate: {
    type: Date,
    required: true,
  },
  permitStartDate: {
    type: Date,
    required: true,
  },
  permitEndDate: {
    type: Date,
    required: true,
  },
  photos: {
    type: [String], // Array to store paths of uploaded photos
  },
});

const Bus = mongoose.model('Bus', busSchema);

module.exports = Bus;
