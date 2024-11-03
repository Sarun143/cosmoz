// routes/leaveRoutes.js
const express = require('express');
const Leave = require('../model/leaveModel');

const router = express.Router();

// Route to submit a leave request
router.post('/requestleave', async (req, res) => {
  const { staffId, startDate, endDate, reason } = req.body;
  try {
    const newLeave = await Leave.create({ staffId, startDate, endDate, reason });
    res.status(201).json(newLeave);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting leave request', error });
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
