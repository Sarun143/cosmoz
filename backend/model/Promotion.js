const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  offer: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true, // Default to true, meaning the offer is on initially
  },
});

const Promotion = mongoose.model('Promotion', promotionSchema);

module.exports = Promotion;
