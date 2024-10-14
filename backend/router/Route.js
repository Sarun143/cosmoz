const express = require('express');
const router = express.Router();
const Route = require('../model/Route'); // Assuming Route model is in the models folder

// Get all routes
router.get('/', async (req, res) => {
  try {
    const routes = await Route.find();
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching routes' });
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
router.post('/', async (req, res) => {
  const { routeId, name, departure, arrival, stops } = req.body;

  const newRoute = new Route({
    routeId,
    name,
    departure,
    arrival,
    stops
  });

  try {
    const savedRoute = await newRoute.save();
    res.status(201).json(savedRoute);
  } catch (error) {
    res.status(400).json({ message: 'Error creating route' });
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

// Update a route
router.put('/:id', async (req, res) => {
  try {
    const updatedRoute = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedRoute);
  } catch (err) {
    res.status(500).json({ error: 'Error updating route' });
  }
});


module.exports = router;
