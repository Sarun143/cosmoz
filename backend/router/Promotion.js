const express = require('express');
const router = express.Router();
const Promotion = require('../model/Promotion');

// Create a new promotion
router.post('/add', async (req, res) => {
  const { offer, details, isActive } = req.body;
  try {
    const newPromotion = new Promotion({ offer, details, isActive });
    await newPromotion.save();
    res.status(201).json({ message: 'Promotion added successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add promotion' });
  }
});

// Fetch all promotions
router.get('/', async (req, res) => {
  try {
    const promotions = await Promotion.find();
    res.status(200).json(promotions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch promotions' });
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
    res.status(500).json({ error: 'Failed to update promotion' });
  }
});

module.exports = router;
