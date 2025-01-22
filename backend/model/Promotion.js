const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  details: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  discountRule: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Promotion', promotionSchema);
