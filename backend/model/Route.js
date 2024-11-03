const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  routeId: {
    type: String,
    required: true,
    unique: true // Ensure routeId is unique
  },
  name: {
    type: String,
    required: true
  },
  departure: {
    type: String,
    required: true
  },
  departureStop: {
    type: String,
    required: true
  },
  arrivalStop: {
    type: String,
    required: true
  },
  arrival: {
    type: String,
    required: true
  },
  frequency: {
    type: String,
    enum: ['all_day', 'particular_days', 'particular_dates'],
    default: 'all_day'
  },
  selectedDays: [{
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  }],
  selectedDates: [Date],
  stops: [
    {
      stop: {
        type: String,
        required: true
      },
      arrival: {
        type: String,
        required: true  
      },
      distance: {
        type: Number,
        required: true,
        min: 0
      }
    }
  ],
  totaldistance: {
    type: Number,
    required: true,
    min: 0
  }
});

module.exports = mongoose.model('Route', routeSchema);
