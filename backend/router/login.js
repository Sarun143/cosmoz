const express = require('express');
const bcrypt = require('bcrypt'); // Import bcrypt for password comparison
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for token generation
const Login = require('../model/login'); // Import Login model
const Staff = require('../model/Staff'); // Import Staff model
const router = express.Router();
const dotenv = require('dotenv'); // Add this at the top with other imports
dotenv.config();

// Replace the hardcoded secret with the environment variable
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

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

    // If the role is staff, validate that they exist in Staff collection
    if (role === 'staff') {
      const staffExists = await Staff.findOne({ email: user.email });
      if (!staffExists) {
        return res.status(400).json({ message: 'Staff account not found' });
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Add debug logging
    console.log('Generated token first 20 chars:', token.substring(0, 20) + '...');

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

    // Send a successful response with the token, role, and redirection URL
    res.status(200).json({ 
      message: 'Login successful', 
      token, 
      role, 
      redirectUrl 
    });

  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
