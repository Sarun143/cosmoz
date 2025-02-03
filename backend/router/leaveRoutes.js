const express = require('express');
const router = express.Router();
const Leave = require('../model/leaveModel');
const Staff = require('../model/Staff');
const dotenv = require('dotenv');

dotenv.config();

// Middleware to extract staff ID from the token (example)
const authenticate = (req, res, next) => {
  // Assuming the token contains the staffId (implement JWT logic here)
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized access. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace 'your-secret-key' with your actual JWT secret
    req.staffId = decoded.staffId;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ message: 'Unauthorized access. Invalid token.' });
  }
};

// Endpoint to request leave
router.post('/requestleave', authenticate, async (req, res) => {
  const { startDate, endDate, reason } = req.body;

  try {
    // Check for missing fields
    if (!startDate || !endDate || !reason) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Validate staff ID from the token
    const staffExists = await Staff.findById(req.staffId);
    if (!staffExists) {
      return res.status(400).json({ message: 'Invalid staff ID. Staff does not exist.' });
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
      staffId: req.staffId,
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
    const leaveRequests = await Leave.find({ staffId: req.staffId }).populate("staffId"); // Only fetch requests of the logged-in staff
    res.status(200).json({ leaveRequests });
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    res.status(500).json({ message: "Failed to fetch leave requests." });
  }
});

module.exports = router;
