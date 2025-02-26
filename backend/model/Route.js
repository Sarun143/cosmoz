const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  routeId: {
    type: String,
    unique: true,
    required: true
  },
  name: String,
  departureStop: String,
  departure: String,
  arrivalStop: String,
  arrival: String,
  stops: [{
    stop: String,
    arrival: String,
    distance: {
      type: Number,
      min: 0,
      default: 0
    }
  }],
  frequency: String,
  selectedDays: [String],
  selectedDates: [Date],
  totaldistance: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: function(v) {
        return !isNaN(v) && v > 0;
      },
      message: props => `${props.value} is not a valid distance!`
    }
  },
  busAssigned: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus'
  },
  staffs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  }],
  status: {
    type: String,
    default: 'Active'
  }
}, {
  timestamps: true,
  collection: 'bustriproutes'
});

routeSchema.pre('find', function() {
  console.log('Finding in collection:', this.model.collection.name);
});

// Add a pre-save middleware to ensure totaldistance is a valid number
routeSchema.pre('save', function(next) {
  if (isNaN(this.totaldistance)) {
    next(new Error('Total distance must be a valid number'));
  } else {
    next();
  }
});

// Add index for routeId to ensure uniqueness
routeSchema.index({ routeId: 1 }, { unique: true });

const Route = mongoose.model('Route', routeSchema, 'bustriproutes');
module.exports = Route;