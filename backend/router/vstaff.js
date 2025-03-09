const express = require('express');
const router = express.Router();
const Staff = require('../model/Staff');

// Get all staff (keep this for admin purposes)
router.get('/view', async (req, res) => {
    try {
        const staff = await Staff.find();
        res.json(staff);
    } catch (error) {
        console.error('Error fetching all staff:', error);
        res.status(500).json({ message: 'Error fetching staff data' });
    }
});

// Get staff profile by ID
router.get('/profile/:id', async (req, res) => {
    try {
        const staff = await Staff.findById(req.params.id);
        if (!staff) {
            return res.status(404).json({ message: 'Staff not found' });
        }
        res.json(staff);
    } catch (error) {
        console.error('Error fetching staff by ID:', error);
        res.status(500).json({ message: 'Error fetching staff profile' });
    }
});

// NEW ROUTE: Get staff profile by email (for logged-in user)
router.get('/profile-by-email/:email', async (req, res) => {
    try {
        const staff = await Staff.findOne({ email: req.params.email });
        if (!staff) {
            return res.status(404).json({ message: 'Staff not found with this email' });
        }
        res.json(staff);
    } catch (error) {
        console.error('Error fetching staff by email:', error);
        res.status(500).json({ message: 'Error fetching staff profile' });
    }
});

// NEW ROUTE: Update staff profile
router.put('/update-profile/:id', async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        
        // Find the staff member first to check if they exist
        const existingStaff = await Staff.findById(req.params.id);
        if (!existingStaff) {
            return res.status(404).json({ message: 'Staff not found' });
        }
        
        // Only allow updating certain fields (name, email, phone)
        const updatedStaff = await Staff.findByIdAndUpdate(
            req.params.id,
            { name, email, phone },
            { new: true, runValidators: true }
        );
        
        res.json(updatedStaff);
    } catch (error) {
        console.error('Error updating staff profile:', error);
        res.status(500).json({ message: 'Error updating staff profile' });
    }
});

module.exports = router;