// // // server.js
// // const express = require('express');
// // const mongoose = require('mongoose');
// // const bodyParser = require('body-parser');
// // const staffRoutes = require('./routes/staffRoutes');

// // const app = express();

// // // Middleware
// // app.use(bodyParser.json());

// // // Connect to MongoDB
// // mongoose
// // .connect('mongodb://localhost:27017/staffdb', { useNewUrlParser: true, useUnifiedTopology: true })
// // .then(() => console.log('MongoDB connected'))
// // .catch((err) => console.log(err));

// // // Use staff routes
// // app.use('/api/staff', staffRoutes);

// // // Start server
// // const PORT = process.env.PORT || 5000;
// // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');

// // Import routes
// const sign = require('./router/sign'); // Assuming sign.js handles authentication
// const fetchUser = require('./router/fetch');
// const login = require('./router/login');

// // Import your Route model (assuming you have a Route model created)
// const Route = require('./models/Route'); // Ensure the correct path to your Route model

// // Initialize express and dotenv
// const app = express();
// dotenv.config();

// // Middleware
// app.use(express.json());  // To parse incoming JSON requests
// app.use(cors());          // To allow requests from your React frontend

// // MongoDB connection using mongoose
// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("MongoDB connected"))
//   .catch((error) => console.log("MongoDB connection error:", error));

// // Use authentication routes
// app.use('/api/auth', sign); // Mount auth routes under /api/auth
// app.use('/api', fetchUser);
// app.use('/api/auth', login);

// // Route to fetch all routes from the Route collection
// app.get('/api/routes', async (req, res) => {
// try {
//   const routes = await Route.find(); // Fetch all routes from MongoDB
//   res.json(routes); // Send routes back as JSON
// } catch (err) {
//   res.status(500).json({ error: 'Error fetching routes' });
// }
// });

// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const staffRouter = require('./router/Staff'); // Adjust the path to your Staff router

// Initialize express and dotenv
const app = express();
dotenv.config();

// Middleware
app.use(express.json());  // To parse incoming JSON requests
app.use(cors());          // To allow requests from your React frontend

// MongoDB connection using mongoose
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.log("MongoDB connection error:", error));

// Use staff routes
app.use('/api', staffRouter); // Mount staff routes under /api

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

/////route model //////
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
/////

//////route router////
const express = require('express');
const router = express.Router();
const Route = require('../model/Route'); // Make sure this path is correct

// Get all routes
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all routes...');
    // Add this to verify the model
    console.log('Collection name:', Route.collection.name);
    
    const routes = await Route.find().lean();
    console.log(`Found ${routes.length} routes:`, routes);
    res.json(routes);
  } catch (error) {
    console.error('Error in GET /api/routes:', error);
    res.status(500).json({ 
      message: 'Error fetching routes',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get a single route by ID
router.get('/:id', async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) return res.status(404).json({ message: 'Route not found' });
    res.json(route);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching route' });
  }
});

// Create a new route
// Create a new route with enhanced validation
router.post('/new-route', async (req, res) => {
  try {
    const { 
      name, 
      departureStop, 
      departure, 
      arrivalStop, 
      arrival, 
      stops, 
      frequency, 
      selectedDays, 
      selectedDates, 
      totaldistance 
    } = req.body;

    // Validate totaldistance
    const distance = parseFloat(totaldistance);
    if (isNaN(distance) || distance <= 0) {
      return res.status(400).json({ 
        message: 'Invalid total distance value. Must be a number greater than 0.' 
      });
    }

    // Generate automated routeId
    const routeCount = await Route.countDocuments();
    const routeId = `ROUTE${(routeCount + 1).toString().padStart(4, '0')}`; // Creates ROUTE0001, ROUTE0002, etc.

    const newRoute = new Route({
      routeId, // Use the generated routeId
      name,
      departureStop,
      departure,
      arrivalStop,
      arrival,
      stops: stops.map(stop => ({
        ...stop,
        distance: parseFloat(stop.distance) || 0
      })),
      frequency,
      selectedDays,
      selectedDates,
      totaldistance: distance,
      busAssigned: req.body.busAssigned,
      staffs: req.body.staffs,
      status: req.body.status
    });

    const savedRoute = await newRoute.save();
    res.status(201).json(savedRoute);
  } catch (error) {
    console.error('Error saving route:', error);
    res.status(500).json({ 
      message: 'Error creating route', 
      error: error.message 
    });
  }
});



// // Update an existing route
// router.put('/:id', async (req, res) => {
// const { routeId, name, departure, arrival, stops } = req.body;

// try {
//   const updatedRoute = await Route.findByIdAndUpdate(
//     req.params.id,
//     { routeId, name, departure, arrival, stops },
//     { new: true } // Return the updated document
//   );

//   if (!updatedRoute) return res.status(404).json({ message: 'Route not found' });
  
//   res.json(updatedRoute);
// } catch (error) {
//   res.status(400).json({ message: 'Error updating route' });
// }
// });

// Delete a route
router.delete('/:id', async (req, res) => {
  try {
    const deletedRoute = await Route.findByIdAndDelete(req.params.id);
    if (!deletedRoute) return res.status(404).json({ message: 'Route not found' });
    res.json({ message: 'Route deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting route' });
  }
});


// Update a route with distance
// Update an existing route
router.put('/:id', async (req, res) => {
  const { name, departureStop, departure, arrivalStop, arrival, stops, frequency, selectedDays, selectedDates, distance } = req.body;

  try {
    // Validate incoming data
    if (!name || !departureStop || !arrivalStop || !departure || !arrival || !distance) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (isNaN(distance) || distance <= 0) {
      return res.status(400).json({ message: 'Distance must be a positive number' });
    }

    const totalStopDistance = stops.reduce((acc, stop) => acc + (stop.distance || 0), 0);

    if (parseFloat(distance) < totalStopDistance) {
      return res.status(400).json({ message: 'Total route distance must be greater than or equal to the sum of all stop distances' });
    }

    const updatedRoute = await Route.findByIdAndUpdate(
      req.params.id,
      { name, departureStop, departure, arrivalStop, arrival, stops, frequency, selectedDays, selectedDates, totaldistance: distance },
      { new: true }
    );

    if (!updatedRoute) return res.status(404).json({ message: 'Route not found' });
    res.json(updatedRoute);
  } catch (error) {
    console.error('Error updating route:', error);
    res.status(500).json({ message: 'Error updating route' });
  }
});


// Create a new route


module.exports = router;

//////