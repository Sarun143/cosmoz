const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  selectedSeats: [Number],
  pickupPoint: String,
  dropoffPoint: String,
  passengerDetails: {
    name: String,
    age: Number,
    gender: String,
    phone: String,
  },
  bookingDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Booking', bookingSchema);
