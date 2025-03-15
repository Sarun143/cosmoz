const express = require('express');
const router = express.Router();
const Booking = require('../model/Booking');
const Vehicle = require('../model/Bus');

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



/////////////////////////////// BOOKINGS ROUTES ///////////////////////////////

// New Booking Route
router.post('/book/tickets', async (req, res) => {
  try {
    const { selectedSeats, pickupPoint, dropoffPoint, passengerDetails, bus, route } = req.body;

    if (!Array.isArray(selectedSeats) || selectedSeats.length === 0) {
      return res.status(400).json({ message: "At least one seat must be selected" });
    }
    
    selectedSeats = selectedSeats.map(seat => parseInt(seat, 10)).filter(seat => !isNaN(seat));

    if (!pickupPoint || !dropoffPoint || !passengerDetails?.length || !bus || !route) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const busExists = await Vehicle.findById(bus);
    if (!busExists) {
      return res.status(404).json({ message: "Bus not found" });
    }

    if (new Set(selectedSeats).size !== selectedSeats.length) {
      return res.status(400).json({ message: "Duplicate seats are not allowed" });
    }

    const existingBooking = await Booking.findOne({ bus, selectedSeats: { $in: selectedSeats }, route });
    if (existingBooking) {
      return res.status(400).json({ message: "Some selected seats are already booked" });
    }

    const newBooking = new Booking({
      selectedSeats,
      pickupPoint,
      dropoffPoint,
      passengerDetails,
      bookingDate: new Date(),
      bus,
      route,
      status: "NOT_PAID"
    });

    await newBooking.save();
    

    return res.status(201).json({ message: "Booking successful", bookingId: newBooking._id });

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});


module.exports = router;
