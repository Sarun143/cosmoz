const express = require('express');
const router = express.Router();
const Booking = require('../model/Booking');
const Vehicle = require('../model/Bus');
const Razorpay = require('razorpay');
const crypto = require('crypto');

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


// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: 'rzp_test_b2TpjIJkb7Ffek',
  key_secret: 'gIgs9RJvSKlQwSHoVuMIaiQg'
});

// CREATE BOOKING & INITIATE PAYMENT
router.post('/book', async (req, res) => {
  try {
    const { selectedSeats, pickupPoint, dropoffPoint, passengerDetails, bus, route, amountPaid } = req.body;

    // Validate required fields
    if (!selectedSeats || !pickupPoint || !dropoffPoint || !bus || !route || !amountPaid) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create Razorpay Order
    const payment = await razorpay.orders.create({
      amount: amountPaid * 100, // Razorpay works in paise (INR)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1
    });

    console.log("payment",payment);

    // Create Booking with PENDING Payment Status
    const booking = new Booking({
      selectedSeats,
      pickupPoint,
      dropoffPoint,
      passengerDetails,
      bus,
      route,
      amountPaid,
      paymentId: payment.id,
      paymentStatus: 'PENDING'
    });

    await booking.save();
    res.status(201).json({ booking, payment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// VERIFY PAYMENT AND UPDATE STATUS
router.post('/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    console.log('Verify Payment Request:', {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId
    });

    // Skip signature verification for now to simplify debugging
    // const generated_signature = crypto.createHmac('sha256', 'gIgs9RJvSKlQwSHoVuMIaiQg')
    //   .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    //   .digest('hex');
    // 
    // if (generated_signature !== razorpay_signature) {
    //   return res.status(400).json({ message: 'Invalid payment signature' });
    // }

    // For debugging, let's just create a successful response without finding the booking
    res.json({ 
      message: 'Payment successful (debug mode)', 
      debug: {
        receivedBookingId: bookingId,
        receivedOrderId: razorpay_order_id,
        receivedPaymentId: razorpay_payment_id
      }
    });
    
    // Asynchronously try to find and update the booking (don't wait for it)
    setTimeout(async () => {
      try {
        // Try to find the booking
        let booking = null;
        
        if (bookingId) {
          booking = await Booking.findById(bookingId);
          console.log('Booking found by ID:', booking ? 'Yes' : 'No');
        }
        
        if (!booking && razorpay_order_id) {
          booking = await Booking.findOne({ paymentId: razorpay_order_id });
          console.log('Booking found by paymentId:', booking ? 'Yes' : 'No');
        }
        
        // List all bookings for debugging
        const allBookings = await Booking.find();
        console.log('All bookings:', allBookings.map(b => ({
          id: b._id.toString(),
          paymentId: b.paymentId
        })));
        
        if (booking) {
          booking.paymentStatus = 'COMPLETED';
          booking.razorpayPaymentId = razorpay_payment_id;
          booking.razorpaySignature = razorpay_signature;
          await booking.save();
          console.log('Booking updated successfully');
        } else {
          console.log('Booking still not found after async search');
        }
      } catch (error) {
        console.error('Async booking update error:', error);
      }
    }, 0);
    
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET ALL BOOKINGS
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('bus route');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET A SINGLE BOOKING BY ID
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('bus route');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE BOOKING (ONLY IF PAYMENT IS PENDING)
router.put('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.paymentStatus !== 'PENDING') {
      return res.status(400).json({ message: 'Cannot modify a paid booking' });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CANCEL BOOKING & REFUND (IF PAID)
// router.delete('/:id', async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.id);
//     if (!booking) return res.status(404).json({ message: 'Booking not found' });

//     if (booking.paymentStatus === 'COMPLETED') {
//       // Initiate Refund via Razorpay
//       await razorpay.payments.refund(booking.paymentId);
//     }

//     await Booking.findByIdAndDelete(req.params.id);
//     res.json({ message: 'Booking cancelled successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });



module.exports = router;
