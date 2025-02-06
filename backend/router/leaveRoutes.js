const express = require('express');
const router = express.Router();
const Leave = require('../model/leaveModel');
const Staff = require('../model/Staff');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
console.log('JWT_SECRET being used:', JWT_SECRET);
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

// Middleware to extract staff ID from the token
const authenticate = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    console.log('Received auth header:', authHeader ? authHeader.substring(0, 30) + '...' : 'No header');
    
    if (!authHeader) {
      return res.status(401).json({ message: 'No authorization header' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Extracted token:', token ? token.substring(0, 20) + '...' : 'No token');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify token using the environment variable
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Successfully decoded token:', decoded);
    
    // Add user info to request
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Authentication error details:', error);
    return res.status(401).json({ message: `Invalid token: ${error.message}` });
  }
};

// to get leave requests

router.get("/viewleaves", async (req, res) => {
  try {
    const leaveRequests = await Leave.find().populate("staffId", "name email role");

    res.json({ leaveRequests });
  } catch (error) {
    res.status(500).json({ message: "Error fetching leave requests", error });
  }
});

// Endpoint to request leave
router.post('/requestleave', authenticate, async (req, res) => {
  const { startDate, endDate, reason } = req.body;

  try {
    // Check for missing fields
    if (!startDate || !endDate || !reason) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Add debug logging
    console.log('Searching for staff with ID:', req.user.id);
    
    // Validate staff ID from the token
    const staffExists = await Staff.findById(req.user.id);
    console.log('Staff search result:', staffExists);

    if (!staffExists) {
      // Try to find staff by email as fallback
      const staffByEmail = await Staff.findOne({ email: req.user.email });
      console.log('Staff search by email result:', staffByEmail);
      
      if (staffByEmail) {
        req.user.id = staffByEmail._id; // Update the ID to use the correct one
      } else {
        return res.status(400).json({ 
          message: 'Invalid staff ID. Staff does not exist.',
          debug: {
            searchedId: req.user.id,
            searchedEmail: req.user.email
          }
        });
      }
    }

    // Validate date logic
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: 'Invalid dates provided.' });
    }
    if (start > end) {
      return res.status(400).json({ message: 'End date cannot be before start date.' });
    }

    // Create the leave request
    const leaveRequest = new Leave({
      staffId: req.user.id,
      startDate: start,
      endDate: end,
      reason,
    });

    await leaveRequest.save();
    return res.status(201).json({ message: 'Leave request submitted successfully.', leaveRequest });
  } catch (error) {
    console.error('Error in /requestleave:', error);
    res.status(500).json({ message: 'An error occurred while submitting the leave request.' });
  }
});

// Endpoint to fetch all leave requests
router.get("/viewleaves", authenticate, async (req, res) => {
  try {
    const leaveRequests = await Leave.find({ staffId: req.user.id }).populate("staffId"); // Only fetch requests of the logged-in staff
    res.status(200).json({ leaveRequests });
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    res.status(500).json({ message: "Failed to fetch leave requests." });
  }
});

// Add this route for debugging
router.get("/checkstaff", authenticate, async (req, res) => {
  try {
    const staff = await Staff.findById(req.user.id);
    const staffByEmail = await Staff.findOne({ email: req.user.email });
    
    res.json({
      searchedId: req.user.id,
      staffById: staff,
      searchedEmail: req.user.email,
      staffByEmail: staffByEmail,
    });
  } catch (error) {
    console.error('Error checking staff:', error);
    res.status(500).json({ message: "Failed to check staff details", error: error.message });
  }
});

// Add this new endpoint for updating leave status
router.put('/updatestatus/:leaveId', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    const { leaveId } = req.params;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updatedLeave = await Leave.findByIdAndUpdate(
      leaveId,
      { status },
      { new: true }
    ).populate('staffId');

    if (!updatedLeave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    res.status(200).json({ message: `Leave request ${status.toLowerCase()}`, leave: updatedLeave });
  } catch (error) {
    console.error('Error updating leave status:', error);
    res.status(500).json({ message: 'Failed to update leave status' });
  }
});

module.exports = router;
