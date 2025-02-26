const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({
  registrationNumber: { type: String, required: true},
  type: { type: String, enum: ['AC', 'Non-AC', 'Sleeper', 'Seater'], required: true },
  // route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },  
  status: { type: String, enum: ['Active', 'Inactive','Deleted'], default: 'Active' },
  seats: {
    totalSeats: { type: Number, required: true },
    Lower: { type: Number, default: 0 },
    Upper: { type: Number, default: 0 },
    seatNumbers: [{ type: String }]
  },
  // Bus Documents
  taxExpiryDate: { type: Date },
  insuranceExpiryDate: { type: Date },
  pollutionExpiryDate: { type: Date },
  taxDocument: { type: String },
  insuranceDocument: { type: String },
  pollutionDocument: { type: String }
  
}, { timestamps: true });


busSchema.pre('save', function (next) {
  if (!this.seats.seatNumbers || this.seats.seatNumbers.length === 0) {
    this.seats.seatNumbers = [];

    // Generate Lower Deck Seats
    for (let i = 1; i <= this.seats.Lower; i++) {
      this.seats.seatNumbers.push(`L${i}`); // L1, L2, L3...
    }

    // Generate Upper Deck Seats
    for (let i = 1; i <= this.seats.Upper; i++) {
      this.seats.seatNumbers.push(`U${i}`); // U1, U2, U3...
    }
  }
  next();
});

// Middleware to update seat numbers when modifying an existing bus
busSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  if (update.seats) {
    if (!update.seats.seatNumbers || update.seats.seatNumbers.length === 0) {
      update.seats.seatNumbers = [];

      for (let i = 1; i <= (update.seats.Lower || 0); i++) {
        update.seats.seatNumbers.push(`L${i}`);
      }

      for (let i = 1; i <= (update.seats.Upper || 0); i++) {
        update.seats.seatNumbers.push(`U${i}`);
      }
    }
  }
  next();
});

module.exports = mongoose.model("Bus", busSchema);
