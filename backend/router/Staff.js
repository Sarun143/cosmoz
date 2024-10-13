const express = require('express');
const router = express.Router();
const Staff = require('../model/Staff');

// POST /api/create - Create new staff member
router.post('/create', async (req, res) => {
  const { name, email, phone, staffId, role } = req.body;

  try {
    // Validate that all fields are present
    if (!name || !email || !phone || !staffId || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create a new staff member
    const newStaff = new Staff({ name, email, phone, staffId, role });

    await newStaff.save();
    res.status(201).json(newStaff); // Send back the created staff data
  } catch (error) {
    console.error('Error creating staff:', error);
    res.status(500).json({ error: 'Server error, could not create staff.' });
  }
});

module.exports = router;
