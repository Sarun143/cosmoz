const express = require('express');
const router = express.Router();
const User = require('../model/user'); // Import the User model

// Route to fetch user details based on email
router.post('/user', async (req, res) => {
    const { email } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        if (user) {
            // Send user details back to client, except for the password
            res.status(200).json({
                name: user.name,
                email: user.email,
                phone: user.phone,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
