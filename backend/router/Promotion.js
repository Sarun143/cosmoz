const express = require('express');
const router = express.Router();
const Promotion = require('../model/Promotion');

// Assuming you're using Express
router.post('/api/promotions/add', async (req, res) => {
  try {
    const promotion = new Promotion(req.body);
    await promotion.save();
    res.status(201).json({ message: 'Promotion added successfully', promotion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add promotion' });
  }
});


// Fetch all promotions
router.get('/', async (req, res) => {
  try {
    const promotions = await Promotion.find();
    res.status(200).json(promotions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch promotions', details: error.message });
  }
});

// Toggle promotion on/off
router.put('/toggle/:id', async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) return res.status(404).json({ error: 'Promotion not found' });

    promotion.isActive = !promotion.isActive;
    await promotion.save();
    res.status(200).json({ message: 'Promotion status updated', promotion });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update promotion', details: error.message });
  }
});

module.exports = router;
