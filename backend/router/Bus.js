// routes/busRoutes.js
const express = require('express');
const multer = require('multer');
const Bus = require('../model/Bus');
const router = express.Router();
const uploads = multer({ dest: 'uploads/' }); // Assuming 'uploads/' is the folder to store files

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to store uploaded photos
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Unique file name
  },
});
const upload = multer({ storage });

// @route GET /api/buses
// @desc Get all buses
router.get('/', async (req, res) => {
  try {
    const buses = await Bus.find();
    res.json(buses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route POST /api/buses
// @desc Add a new bus
// router.post('/', upload.single('photos'), async (req, res) => {
// const {
// busId,
// routeId,
// regNo,
// seatCapacity,
// status,
// pollutionStartDate,
// pollutionEndDate,
// taxStartDate,
// taxEndDate,
// permitStartDate,
// permitEndDate,
// } = req.body;

// try {
// const newBus = new Bus({
//     busId,
//     routeId,
//     regNo,
//     seatCapacity,
//     status,
//     pollutionStartDate,
//     pollutionEndDate,
//     taxStartDate,
//     taxEndDate,
//     permitStartDate,
//     permitEndDate,
//     photos: req.file ? [req.file.path] : [], // Save uploaded photo path
// });

// const savedBus = await newBus.save();
// res.json(savedBus);
// } catch (err) {
// res.status(500).json({ message: 'Server error' });
// }
// });
router.post('/', upload.single('photos'), async (req, res) => {
    try {
      const newBus = new Bus({
        busId: req.body.busId,
        routeId: req.body.routeId,
        regNo: req.body.regNo,
        seatCapacity: req.body.seatCapacity,
        status: req.body.status,
        pollutionStartDate: req.body.pollutionStartDate,
        pollutionEndDate: req.body.pollutionEndDate,
        taxStartDate: req.body.taxStartDate,
        taxEndDate: req.body.taxEndDate,
        permitStartDate: req.body.permitStartDate,
        permitEndDate: req.body.permitEndDate,
        photos: req.file ? req.file.filename : null, // Handling file upload
      });
  
      const savedBus = await newBus.save();
      res.status(201).json(savedBus);
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

// @route PUT /api/buses/:id
// @desc Update bus details
router.put('/:id', upload.single('photos'), async (req, res) => {
  const {
    busId,
    routeId,
    regNo,
    seatCapacity,
    status,
    pollutionStartDate,
    pollutionEndDate,
    taxStartDate,
    taxEndDate,
    permitStartDate,
    permitEndDate,
  } = req.body;

  try {
    const updatedBus = await Bus.findByIdAndUpdate(
      req.params.id,
      {
        busId,
        routeId,
        regNo,
        seatCapacity,
        status,
        pollutionStartDate,
        pollutionEndDate,
        taxStartDate,
        taxEndDate,
        permitStartDate,
        permitEndDate,
        photos: req.file ? [req.file.path] : [], // Update photo if uploaded
      },
      { new: true }
    );
    res.json(updatedBus);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route DELETE /api/buses/:id
// @desc Delete a bus
router.delete('/:id', async (req, res) => {
  try {
    await Bus.findByIdAndDelete(req.params.id);
    res.json({ message: 'Bus deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
