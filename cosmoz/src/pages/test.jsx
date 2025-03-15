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

//routemngmnt new

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RouteManagement.css';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const RouteManagement = () => {
const [routes, setRoutes] = useState([]);
const [newRoute, setNewRoute] = useState({
  routeName: '',
  startLocation: {
    name: '',
    coordinates: []
  },
  endLocation: {
    name: '',
    coordinates: []
  },
  startDateTime: '',
  endDateTime: '',
  serviceDays: [],
  distance: 0,
  estimatedTime: '',
  busAssigned: '',
  status: 'Active',
  staffs: []
});

const [stops, setStops] = useState([]);
const [newStop, setNewStop] = useState({
  name: '',
  coordinates: [],
  arrivalTime: '',
  fare: 0,
  isBoardingPoint: false,
  isTopStation: false
});

const [errors, setErrors] = useState({});
const [editingRoute, setEditingRoute] = useState(null);
const [buses, setBuses] = useState([]);
const [staffList, setStaffList] = useState([]);
const [apiError, setApiError] = useState('');

useEffect(() => {
  fetchRoutes();
  fetchBuses();
  fetchStaff();
}, []);

const fetchRoutes = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/routes/list-routes');
    setRoutes(response.data);
    setApiError('');
  } catch (error) {
    console.error('Error fetching routes:', error);
    setApiError(`Failed to fetch routes: ${error.response?.data?.error || error.message}`);
  }
};

const fetchBuses = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/buses/all/buses');
    // Filter only Active buses
    const activeBuses = response.data.filter(bus => bus.status === 'Active');
    setBuses(activeBuses);
    setApiError('');
  } catch (error) {
    console.error('Error fetching buses:', error);
    setApiError(`Failed to fetch buses: ${error.response?.data?.error || error.message}`);
  }
};

const fetchStaff = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/vstaff/view');
    const staffData = Array.isArray(response.data) ? response.data : 
                      (response.data.data || response.data.staffs || []);
    setStaffList(staffData);
    setApiError('');
    console.log('Staff data:', staffData); // For debugging
  } catch (error) {
    console.error('Error fetching staff:', error);
    setApiError(`Failed to fetch staff: ${error.response?.data?.error || error.message}`);
  }
};

const validateRoute = () => {
  const errors = {};
  if (!newRoute.routeName) errors.routeName = 'Route name is required';
  if (!newRoute.startLocation.name) errors.startLocation = 'Start location is required';
  if (!newRoute.endLocation.name) errors.endLocation = 'End location is required';
  if (!newRoute.startDateTime) errors.startDateTime = 'Start time is required';
  if (!newRoute.endDateTime) errors.endDateTime = 'End time is required';
  if (!newRoute.distance) errors.distance = 'Distance is required';
  if (!newRoute.estimatedTime) errors.estimatedTime = 'Estimated time is required';
  if (!newRoute.busAssigned) errors.busAssigned = 'Bus assignment is required';
  if (newRoute.serviceDays.length === 0) errors.serviceDays = 'Select at least one service day';
  if (newRoute.staffs.length === 0) errors.staffs = 'Assign at least one staff member';
  
  setErrors(errors);
  return Object.keys(errors).length === 0;
};

const handleInputChange = (e) => {
  const { name, value } = e.target;
  if (name.includes('.')) {
    const [parent, child] = name.split('.');
    setNewRoute(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: value
      }
    }));
  } else {
    setNewRoute(prev => ({
      ...prev,
      [name]: value
    }));
  }
};

const handleServiceDayChange = (day) => {
  setNewRoute(prev => ({
    ...prev,
    serviceDays: prev.serviceDays.includes(day)
      ? prev.serviceDays.filter(d => d !== day)
      : [...prev.serviceDays, day]
  }));
};

const handleStopChange = (index, field, value) => {
  const updatedStops = [...stops];
  updatedStops[index][field] = value;
  setStops(updatedStops);
};

const addStop = () => {
  setStops([...stops, { ...newStop }]);
};

const removeStop = (index) => {
  const updatedStops = [...stops];
  updatedStops.splice(index, 1);
  setStops(updatedStops);
};

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateRoute()) return;

  try {
    setApiError('');
    if (editingRoute) {
      await handleUpdate();
    } else {
      await createNewRoute();
    }
  } catch (error) {
    console.error('Error submitting route:', error);
    setApiError(`Error: ${error.response?.data?.message || error.response?.data?.error || error.message}`);
  }
};

const createNewRoute = async () => {
  try {
    const routeData = {
      routeName: newRoute.routeName,
      startLocation: newRoute.startLocation,
      endLocation: newRoute.endLocation,
      startDateTime: newRoute.startDateTime,
      endDateTime: newRoute.endDateTime,
      serviceDays: newRoute.serviceDays,
      distance: parseFloat(newRoute.distance),
      estimatedTime: newRoute.estimatedTime,
      busAssigned: newRoute.busAssigned,
      staffs: newRoute.staffs,
      stops: stops
    };

    const response = await axios.post('http://localhost:5000/api/routes/add-route', routeData);
    
    if (response.data) {
      fetchRoutes(); // Refresh the routes list
      alert('Route added successfully!');
      resetForm();
    }
  } catch (error) {
    if (error.response?.data?.message) {
      alert(error.response.data.message);
    } else {
      throw error;
    }
  }
};

const handleUpdate = async () => {
  try {
    const routeData = {
      routeName: newRoute.routeName,
      startLocation: newRoute.startLocation,
      endLocation: newRoute.endLocation,
      startDateTime: newRoute.startDateTime,
      endDateTime: newRoute.endDateTime,
      serviceDays: newRoute.serviceDays,
      distance: parseFloat(newRoute.distance),
      estimatedTime: newRoute.estimatedTime,
      busAssigned: newRoute.busAssigned,
      staffs: newRoute.staffs,
      stops: stops
    };

    const response = await axios.put(`http://localhost:5000/api/routes/edit-route/${editingRoute._id}`, routeData);
    
    if (response.data) {
      fetchRoutes(); // Refresh the routes list
      alert('Route updated successfully!');
      resetForm();
    }
  } catch (error) {
    if (error.response?.data?.message) {
      alert(error.response.data.message);
    } else {
      throw error;
    }
  }
};

const resetForm = () => {
  setNewRoute({
    routeName: '',
    startLocation: { name: '', coordinates: [] },
    endLocation: { name: '', coordinates: [] },
    startDateTime: '',
    endDateTime: '',
    serviceDays: [],
    distance: 0,
    estimatedTime: '',
    busAssigned: '',
    status: 'Active',
    staffs: []
  });
  setStops([]);
  setErrors({});
  setEditingRoute(null);
  setApiError('');
};

const handleDelete = async (routeId) => {
  if (!window.confirm('Are you sure you want to delete this route?')) {
    return;
  }

  try {
    await axios.delete(`http://localhost:5000/api/routes/delete-route/${routeId}`);
    fetchRoutes(); // Refresh the routes list
    alert('Route deleted successfully!');
    setApiError('');
  } catch (error) {
    console.error('Error deleting route:', error);
    setApiError(`Failed to delete route: ${error.response?.data?.error || error.message}`);
  }
};

const handleEdit = async (routeId) => {
  try {
    setApiError('');
    const response = await axios.get(`http://localhost:5000/api/routes/view-route/${routeId}`);
    const { route, stops: routeStops } = response.data;
    
    setEditingRoute(route);
    setNewRoute({
      routeName: route.routeName,
      startLocation: route.startLocation,
      endLocation: route.endLocation,
      startDateTime: route.startDateTime,
      endDateTime: route.endDateTime,
      serviceDays: route.serviceDays || [],
      distance: route.distance,
      estimatedTime: route.estimatedTime,
      busAssigned: route.busAssigned?._id || route.busAssigned,
      status: route.status,
      staffs: route.staffs.map(staff => typeof staff === 'object' ? staff._id : staff)
    });
    
    setStops(routeStops.map(stop => ({
      name: stop.name,
      coordinates: stop.coordinates || [],
      arrivalTime: stop.arrivalTime,
      fare: stop.fare,
      isBoardingPoint: stop.isBoardingPoint,
      isTopStation: stop.isTopStation
    })));
  } catch (error) {
    console.error('Error fetching route details:', error);
    setApiError(`Failed to fetch route details: ${error.response?.data?.error || error.message}`);
  }
};

return (
  <div className="route-management-container">
    <Header />
    <Sidebar />
    <div className="route-management">
      <h2>{editingRoute ? 'Edit Route' : 'Add New Route'}</h2>
      
      {apiError && <div className="error-message">{apiError}</div>}
      
      <form onSubmit={handleSubmit} className="route-form">
        <div className="form-group">
          <label>Route Name *</label>
          <input
            type="text"
            name="routeName"
            value={newRoute.routeName}
            onChange={handleInputChange}
            placeholder="Enter route name"
            className={errors.routeName ? 'error-input' : ''}
          />
          {errors.routeName && <span className="error">{errors.routeName}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Start Location *</label>
            <input
              type="text"
              name="startLocation.name"
              value={newRoute.startLocation.name}
              onChange={handleInputChange}
              placeholder="Enter start location"
              className={errors.startLocation ? 'error-input' : ''}
            />
            {errors.startLocation && <span className="error">{errors.startLocation}</span>}
          </div>

          <div className="form-group">
            <label>End Location *</label>
            <input
              type="text"
              name="endLocation.name"
              value={newRoute.endLocation.name}
              onChange={handleInputChange}
              placeholder="Enter end location"
              className={errors.endLocation ? 'error-input' : ''}
            />
            {errors.endLocation && <span className="error">{errors.endLocation}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Start Time *</label>
            <input
              type="time"
              name="startDateTime"
              value={newRoute.startDateTime}
              onChange={handleInputChange}
              className={errors.startDateTime ? 'error-input' : ''}
            />
            {errors.startDateTime && <span className="error">{errors.startDateTime}</span>}
          </div>

          <div className="form-group">
            <label>End Time *</label>
            <input
              type="time"
              name="endDateTime"
              value={newRoute.endDateTime}
              onChange={handleInputChange}
              className={errors.endDateTime ? 'error-input' : ''}
            />
            {errors.endDateTime && <span className="error">{errors.endDateTime}</span>}
          </div>
        </div>

        <div className="form-group">
          <label>Service Days *</label>
          <div className="service-days">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
              <label key={day} className="day-checkbox">
                <input
                  type="checkbox"
                  checked={newRoute.serviceDays.includes(day)}
                  onChange={() => handleServiceDayChange(day)}
                />
                {day}
              </label>
            ))}
          </div>
          {errors.serviceDays && <span className="error">{errors.serviceDays}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Distance (km) *</label>
            <input
              type="number"
              name="distance"
              value={newRoute.distance}
              onChange={handleInputChange}
              min="0"
              step="0.1"
              className={errors.distance ? 'error-input' : ''}
            />
            {errors.distance && <span className="error">{errors.distance}</span>}
          </div>

          <div className="form-group">
            <label>Estimated Time *</label>
            <input
              type="text"
              name="estimatedTime"
              value={newRoute.estimatedTime}
              onChange={handleInputChange}
              placeholder="HH:MM format"
              className={errors.estimatedTime ? 'error-input' : ''}
            />
            {errors.estimatedTime && <span className="error">{errors.estimatedTime}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Assign Bus *</label>
            <select
              name="busAssigned"
              value={newRoute.busAssigned}
              onChange={handleInputChange}
              className={errors.busAssigned ? 'error-input' : ''}
            >
              <option value="">Select Bus</option>
              {buses.map(bus => (
                <option key={bus._id} value={bus._id}>
                  {bus.registrationNumber} - {bus.type}
                </option>
              ))}
            </select>
            {errors.busAssigned && <span className="error">{errors.busAssigned}</span>}
          </div>

          <div className="form-group">
            <label>Status</label>
            <select name="status" value={newRoute.status} onChange={handleInputChange}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Assign Staff *</label>
          <select
            multiple
            name="staffs"
            value={newRoute.staffs}
            onChange={(e) => {
              const selectedStaff = Array.from(e.target.selectedOptions, option => option.value);
              setNewRoute(prev => ({
                ...prev,
                staffs: selectedStaff
              }));
            }}
            className={`staff-select ${errors.staffs ? 'error-input' : ''}`}
          >
            {staffList.map(staff => (
              <option key={staff._id} value={staff._id}>
                {staff.name} - {staff.role}
              </option>
            ))}
          </select>
          <small>Hold Ctrl/Cmd to select multiple staff members</small>
          {errors.staffs && <span className="error">{errors.staffs}</span>}
        </div>

        <div className="stops-section">
          <h3>Route Stops</h3>
          
          {stops.length > 0 && (
            <div className="stops-table">
              <div className="stops-header">
                <div>Stop Name</div>
                <div>Arrival Time</div>
                <div>Fare</div>
                <div>Features</div>
                <div>Actions</div>
              </div>
              
              {stops.map((stop, index) => (
                <div key={index} className="stop-row">
                  <div>
                    <input
                      type="text"
                      value={stop.name}
                      onChange={(e) => handleStopChange(index, 'name', e.target.value)}
                      placeholder="Stop name"
                    />
                  </div>
                  <div>
                    <input
                      type="time"
                      value={stop.arrivalTime}
                      onChange={(e) => handleStopChange(index, 'arrivalTime', e.target.value)}
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      value={stop.fare}
                      onChange={(e) => handleStopChange(index, 'fare', e.target.value)}
                      placeholder="Fare"
                      step="0.01"
                    />
                  </div>
                  <div className="stop-features">
                    <label>
                      <input
                        type="checkbox"
                        checked={stop.isBoardingPoint}
                        onChange={(e) => handleStopChange(index, 'isBoardingPoint', e.target.checked)}
                      />
                      Boarding
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={stop.isTopStation}
                        onChange={(e) => handleStopChange(index, 'isTopStation', e.target.checked)}
                      />
                      Top Station
                    </label>
                  </div>
                  <div>
                    <button 
                      type="button" 
                      className="remove-btn"
                      onClick={() => removeStop(index)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <button type="button" className="add-stop-btn" onClick={addStop}>
            Add Stop
          </button>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">
            {editingRoute ? 'Update Route' : 'Create Route'}
          </button>
          <button type="button" className="cancel-button" onClick={resetForm}>
            Cancel
          </button>
        </div>
      </form>

      <div className="routes-list">
        <h3>Existing Routes</h3>
        <table>
          <thead>
            <tr>
              <th>Route Name</th>
              <th>From - To</th>
              <th>Time</th>
              <th>Service Days</th>
              <th>Distance</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {routes.map(route => (
              <tr key={route._id}>
                <td>{route.routeName}</td>
                <td>{route.startLocation.name} - {route.endLocation.name}</td>
                <td>{route.startDateTime} - {route.endDateTime}</td>
                <td>
                  <div className="service-days-cell">
                    {route.serviceDays.map(day => (
                      <span key={day} className="day-tag">
                        {day.substring(0, 3)}
                      </span>
                    ))}
                  </div>
                </td>
                <td>{route.distance} km</td>
                <td>
                  <span className={`status-badge ${route.status.toLowerCase()}`}>
                    {route.status}
                  </span>
                </td>
                <td>
                  <button 
                    className="view-btn" 
                    onClick={() => handleEdit(route._id)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-btn" 
                    onClick={() => handleDelete(route._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {routes.length === 0 && (
              <tr>
                <td colSpan="7" className="no-data">No routes found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
};

export default RouteManagement;
//
