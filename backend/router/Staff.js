const express = require('express');
const router = express.Router();
const Staff = require('../model/Staff');
const LoginModel = require('../model/login')

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
    const newLogin = new LoginModel({email,password,role :'staff'})

    await newStaff.save();
    res.status(201).json(newStaff); // Send back the created staff data
  } catch (error) {
    console.error('Error creating staff:', error);
    res.status(500).json({ error: 'Server error, could not create staff.' });
  }
  
});

// Update staff
router.put('/staff/:id', async (req, res) => {
  try {
    const updatedStaff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedStaff);
  } catch (error) {
    res.status(500).json({ message: 'Error updating staff' });
  }
});

// Delete staff
router.delete('/staff/:id', async (req, res) => {
  try {
    await Staff.findByIdAndDelete(req.params.id);
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).json({ message: 'Error deleting staff' });
  }
});
module.exports = router;
