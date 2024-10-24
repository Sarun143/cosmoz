const express = require('express');
const router = express.Router();
const Route = require('../model/Route'); // Assuming your route model is in the models folder

// Search Route API
router.get('/search-bus', async (req, res) => {
  try {
    const { fromCity, toCity, date } = req.query;
    
    // Parse the search date
    const searchDate = new Date(date);
    const dayOfWeek = searchDate.toLocaleString('en-us', { weekday: 'long' }); // Get the name of the day (Monday, etc.)
    
    // Ensure searchDate has time set to 00:00:00 to avoid time zone issues
    searchDate.setUTCHours(0, 0, 0, 0);

    // Perform the query to find matching routes
    const routes = await Route.find({
      departureStop: fromCity,
      arrivalStop: toCity,
      $or: [
        { frequency: 'all_day' }, // If the route is available every day
        { frequency: 'particular_days', selectedDays: dayOfWeek }, // If it's a route that runs on specific days
        { frequency: 'particular_dates', selectedDates: { $eq: searchDate } } // If it's a route that runs on specific dates
      ]
    });

    // Return the results
    if (routes.length > 0) {
      return res.status(200).json(routes);
    } else {
      return res.status(404).json({ message: 'No routes found for the selected date' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
