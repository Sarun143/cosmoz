const express = require('express');
const router = express.Router();
const Route = require('../model/Route');

router.post('/search-bus', async (req, res) => {
  const { departureStop, arrivalStop, departureDate } = req.body;
  console.log('Search request:', req.body);

  try {
    // Base query - look for routes that match departure and arrival
    let query = {
      departureStop: { $regex: new RegExp(departureStop, 'i') },
      arrivalStop: { $regex: new RegExp(arrivalStop, 'i') }
    };

    // Add date filtering if departureDate is provided
    if (departureDate) {
      const searchDate = new Date(departureDate);
      const dayOfWeek = searchDate.toLocaleString('en-us', { weekday: 'long' }).toLowerCase();
      
      // Format date for comparison with MongoDB (YYYY-MM-DD)
      const formattedDate = searchDate.toISOString().split('T')[0];
      
      query.$or = [
        { frequency: 'all_day' },
        { frequency: { $regex: /daily/i } },
        { 
          frequency: 'particular_days', 
          selectedDays: { $regex: new RegExp(dayOfWeek, 'i') }
        },
        { 
          frequency: 'particular_dates', 
          selectedDates: formattedDate 
        }
      ];
    }

    console.log('MongoDB query:', JSON.stringify(query, null, 2));
    
    // Find matching routes
    const routes = await Route.find(query);
    
    console.log(`Found ${routes.length} matching routes.`);
    
    if (routes.length === 0) {
      // If no exact matches, try a broader search
      const allRoutes = await Route.find({
        $or: [
          { departureStop: { $regex: new RegExp(departureStop, 'i') } },
          { arrivalStop: { $regex: new RegExp(arrivalStop, 'i') } },
          { 'stops.stop': { $regex: new RegExp(departureStop, 'i') } },
          { 'stops.stop': { $regex: new RegExp(arrivalStop, 'i') } }
        ]
      }).limit(10);
      
      console.log(`Found ${allRoutes.length} routes in broader search.`);
      
      // If still no routes, return empty array
      if (allRoutes.length === 0) {
        return res.json([]);
      }
      
      // Return these routes with a note that they're partial matches
      return res.json(allRoutes.map(route => ({
        ...route.toObject(),
        isPartialMatch: true
      })));
    }
    
    res.json(routes);
  } catch (error) {
    console.error('Error fetching routes:', error);
    res.status(500).json({ message: 'Error fetching routes', error: error.message });
  }
});

// Enhanced stop suggestions endpoint
router.get('/stop-suggestions', async (req, res) => {
  const { query } = req.query;
  
  if (!query || query.length < 2) {
    return res.json([]);
  }

  try {
    // Get all unique stops from both direct stop fields and stops arrays
    const suggestions = await Route.aggregate([
      {
        $facet: {
          // Get departure and arrival stops
          mainStops: [
            { 
              $group: { 
                _id: null, 
                departureStops: { $addToSet: '$departureStop' },
                arrivalStops: { $addToSet: '$arrivalStop' }
              } 
            }
          ],
          // Get stops from stops array
          arrayStops: [
            { $unwind: { path: '$stops', preserveNullAndEmptyArrays: true } },
            { $group: { _id: null, stops: { $addToSet: '$stops.stop' } } }
          ]
        }
      },
      {
        $project: {
          allStops: {
            $setUnion: [
              { $ifNull: [{ $arrayElemAt: ['$mainStops.departureStops', 0] }, []] },
              { $ifNull: [{ $arrayElemAt: ['$mainStops.arrivalStops', 0] }, []] },
              { $ifNull: [{ $arrayElemAt: ['$arrayStops.stops', 0] }, []] }
            ]
          }
        }
      }
    ]);

    const allStops = suggestions[0]?.allStops || [];
    
    // Filter stops based on query
    const filteredStops = allStops
      .filter(stop => stop && stop.toLowerCase().includes(query.toLowerCase()))
      .sort(); // Sort alphabetically

    console.log(`Found ${filteredStops.length} matching stops for query: ${query}`);
    
    res.json(filteredStops);
  } catch (error) {
    console.error('Error fetching stop suggestions:', error);
    res.status(500).json({ message: 'Error fetching stop suggestions', error: error.message });
  }
});

module.exports = router;