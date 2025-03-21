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

// Create a new route with enhanced validation
router.post('/new-route', async (req, res) => {
  try {
    const { 
      routeId,
      name, 
      departureStop, 
      departure, 
      arrivalStop, 
      arrival, 
      stops,
      frequency, 
      selectedDays, 
      selectedDates, 
      totaldistance,
      busAssigned,
      staffs,
      status
    } = req.body;

    // Validate totaldistance
    const distance = parseFloat(totaldistance);
    if (isNaN(distance) || distance <= 0) {
      return res.status(400).json({ 
        message: 'Invalid total distance value. Must be a number greater than 0.' 
      });
    }

    const newRoute = new Route({
      routeId: routeId || `ROUTE${Date.now()}`,
      name,
      departureStop,
      departure,
      arrivalStop,
      arrival,
      stops: stops.map(stop => ({
        stop: stop.stop,
        arrival: stop.arrival,
        coordinates: stop.coordinates || [],
        distance: parseFloat(stop.fare) || 0  // Changed from distance to fare to match frontend
      })),
      frequency: frequency || 'daily',
      selectedDays: selectedDays || [],
      selectedDates: selectedDates || [],
      totaldistance: distance,
      busAssigned,
      staffs: staffs || [],
      status: status || 'Active'
    });

    console.log('Attempting to save route:', JSON.stringify(newRoute, null, 2));
    const savedRoute = await newRoute.save();
    res.status(201).json(savedRoute);
  } catch (error) {
    console.error('Error saving route:', error);
    res.status(500).json({ 
      message: 'Error creating route', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
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
  const { 
    name, 
    departureStop, 
    departure, 
    arrivalStop, 
    arrival, 
    stops,
    startLocation,
    endLocation,
    frequency, 
    selectedDays, 
    selectedDates, 
    distance 
  } = req.body;

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
      { 
        name, 
        departureStop, 
        departure, 
        arrivalStop, 
        arrival,
        startLocation: {
          name: startLocation.name,
          coordinates: startLocation.coordinates
        },
        endLocation: {
          name: endLocation.name,
          coordinates: endLocation.coordinates
        },
        stops: stops.map(stop => ({
          stop: stop.stop,
          arrival: stop.arrival,
          coordinates: stop.coordinates,
          distance: parseFloat(stop.distance) || 0
        })),
        frequency, 
        selectedDays, 
        selectedDates, 
        totaldistance: distance 
      },
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