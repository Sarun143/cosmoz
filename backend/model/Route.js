const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  routeId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  departure: {
    type: String,
    required: true
  },
  arrival: {
    type: String,
    required: true
  },
  stops: {
    type: [String],
    required: true
  }
});

module.exports = mongoose.model('Route', routeSchema);
