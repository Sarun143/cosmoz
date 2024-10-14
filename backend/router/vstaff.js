const express = require('express');
const router = express.Router();
const Staff = require('../model/Staff');  // Assuming the staff model is in models/Staff.js

// Get all staff
router.get('/', async (req, res) => {
    try {
        const staff = await Staff.find();
        res.json(staff);  // Send staff data as JSON
    } catch (error) {
        res.status(500).json({ message: 'Error fetching staff data' });
    }
});

module.exports = router;
