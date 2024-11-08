// routes/leaveRoutes.js
const express = require('express');
const Leave = require('../model/leaveModel');

const router = express.Router();

// Route to submit a leave request
router.post('/staff/requestleave', async (req, res) => {
  console.log('Received leave request:', req.body);
  
  const { staffId, startDate, endDate, reason } = req.body;
  
  try {
    if (!staffId || !startDate || !endDate || !reason) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        received: { staffId, startDate, endDate, reason }
      });
    }

    const newLeave = await Leave.create({
      staffId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      status: 'Pending'
    });

    console.log('Created leave:', newLeave);
    res.status(201).json(newLeave);
  } catch (error) {
    console.error('Leave creation error:', error);
    res.status(500).json({ 
      message: 'Error submitting leave request', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Route to fetch leave requests for staff
router.get('/staff/leaves/:staffId', async (req, res) => {
  try {
    const leaves = await Leave.find({ staffId: req.params.staffId });
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leave requests', error });
  }
});

// Route to fetch all leave requests for admin
router.get('/admin/leaves', async (req, res) => {
  try {
    const leaves = await Leave.find().populate('staffId', 'name'); // Include staff names
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leave requests', error });
  }
});

// Route to update leave status by admin
router.patch('/admin/leaves/:id', async (req, res) => {
  const { status } = req.body;
  try {
    const updatedLeave = await Leave.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.status(200).json(updatedLeave);
  } catch (error) {
    res.status(500).json({ message: 'Error updating leave status', error });
  }
});

module.exports = router;
