const express = require('express');
const router = express.Router();
const Booking = require('../model/Booking');

// Route to handle new booking
router.post('/', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    const savedBooking = await booking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create booking', details: error });
  }
});

// Route to fetch all bookings (optional)
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings', details: error });
  }
});

module.exports = router;
