const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  selectedSeats: {
    type: [{
      seatNo: { type: String, required: true },
      seatType: { type: String, required: true, enum: ['Lower', 'Upper'] },
      fare: { type: Number, required: true },
    }],
    required: true
  },
  ticketNo: { type:Number, default: 0},
  pickupPoint: { type: String, required: true },
  dropoffPoint: { type: String, required: true },
  passengerDetails: [{
    name: { type: String, required: true },
    age: { type: Number, },
    gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
    phone: { type: String },
    email: { type: String },
    address: {
      street: String,
      city: String,
      state: String,
      zip: { type: String }
    }
  }],
  bookingDate: { type: Date, default: Date.now, index: true },
  bus: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  status: { type: String, enum: ['ACTIVE','NOT_PAID','CANCELLED'], default: 'ACTIVE' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
