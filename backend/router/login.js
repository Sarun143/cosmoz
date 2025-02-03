const express = require('express');
const bcrypt = require('bcrypt'); // Import bcrypt for password comparison
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for token generation
const Login = require('../model/login'); // Import Login model
const router = express.Router();

// Secret key for signing the JWT (should be stored in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await Login.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    // Check the role of the user
    const { role } = user;
    let isPasswordMatch = false;

    // If role is admin, compare plain text password
    if (role === 'admin') {
      // For admin, just compare plain text passwords
      if (password === user.password) {
        isPasswordMatch = true;
      }
    } else {
      // For other users, use bcrypt to compare hashed passwords
      isPasswordMatch = await bcrypt.compare(password, user.password);
    }

    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Redirect based on role
    let redirectUrl = '';
    switch (role) {
      case 'admin':
        redirectUrl = '/AdminHome';
        break;
      case 'user':
        redirectUrl = '/Dashboard';
        break;
      case 'staff':
        redirectUrl = '/StaffDashboard';
        break;
      default:
        redirectUrl = '/Dashboard'; // Default to user page
        break;
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role }, // Payload (user ID and role)
      JWT_SECRET, // Secret key
      { expiresIn: '1h' } // Token expiration time
    );

    // Send a successful response with the token, role, and redirection URL
    res.status(200).json({ 
      message: 'Login successful', 
      token, // Include the token
      role, 
      redirectUrl 
    });

  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
