const express = require('express');
const bcrypt = require('bcrypt'); // Import bcrypt for password comparison
const Login = require('../model/login'); // Import Login model
const router = express.Router();

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
        redirectUrl = '/staffpage';
        break;
      default:
        redirectUrl = '/userpage'; // Default to user page
        break;
    }

    // Send a successful response with the role and redirection URL
    res.status(200).json({ message: 'Login successful', role, redirectUrl });

  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
