const express = require('express');
const router = express.Router();
const Staff = require('../model/Staff');  // Assuming the staff model is in models/Staff.js

// Get all staff
router.get('/view', async (req, res) => {
    try {
        const staff = await Staff.find();
        res.json(staff);  // Send staff data as JSON
    } catch (error) {
        res.status(500).json({ message: 'Error fetching staff data' });
    }
    
});

router.get('/profile/:id', async (req, res) => {
    try {
        const staff = await Staff.findById(req.params.id);
        if (!staff) {
            return res.status(404).json({ message: 'Staff not found' });
        }
        res.json(staff);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching staff profile' });
    }
});


module.exports = router;
