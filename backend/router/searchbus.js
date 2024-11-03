const express = require('express');
const router = express.Router();
const Route = require('../model/Route');


router.post('/search-bus', async (req, res) => {
  const { departureStop, arrivalStop, departureDate } = req.body;

  try {
    const query = {
      departureStop,
      arrivalStop,
    };

    // Add date filtering
    if (departureDate) {
      const searchDate = new Date(departureDate);
      query.$or = [
        { frequency: 'all_day' },
        { frequency: 'particular_days', selectedDays: searchDate.toLocaleString('en-us', {weekday: 'long'}) },
        { frequency: 'particular_dates', selectedDates: searchDate }
      ];
    }

    const routes = await Route.find(query);

    console.log('Search query:', query);
    console.log('Routes found:', routes.length);

    res.json(routes);
  } catch (error) {
    console.error('Error fetching routes:', error);
    res.status(500).json({ message: 'Error fetching routes' });
  }
});

// Add a new route for stop suggestions
router.get('/stop-suggestions', async (req, res) => {
  const { query } = req.query;

  try {
    const suggestions = await Route.aggregate([
      { $unwind: '$stops' },
      { $group: { _id: null, allStops: { $addToSet: '$stops.stop' } } },
      { $project: { _id: 0, allStops: 1 } }
    ]);

    const allStops = suggestions[0]?.allStops || [];
    const filteredStops = allStops.filter(stop => 
      stop.toLowerCase().includes(query.toLowerCase())
    );

    res.json(filteredStops);
  } catch (error) {
    console.error('Error fetching stop suggestions:', error);
    res.status(500).json({ message: 'Error fetching stop suggestions' });
  }
});

module.exports = router;
