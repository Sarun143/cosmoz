// Express.js backend for attendance management with MongoDB
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');

// MongoDB Schema and Model for Staff Attendance
const attendanceSchema = new mongoose.Schema({
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Present', 'Absent'],
    default: 'Present'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure a staff member has only one attendance record per day
attendanceSchema.index({ staffId: 1, date: 1 }, { unique: true });

const StaffAttendance = mongoose.model('StaffAttendance', attendanceSchema);

// Get attendance records for the logged-in staff
router.get('/api/staff/attendance', auth, async (req, res) => {
  try {
    const staffId = req.user.id; // Assuming auth middleware sets req.user
    
    const attendanceRecords = await StaffAttendance.find({ staffId })
      .sort({ date: -1 }) // Newest first
      .lean();
    
    // Format the dates for frontend
    const formattedRecords = attendanceRecords.map(record => ({
      id: record._id,
      staffId: record.staffId,
      date: new Date(record.date).toISOString().split('T')[0],
      status: record.status
    }));
    
    res.status(200).json(formattedRecords);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update attendance status
router.put('/api/staff/attendance/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const staffId = req.user.id;
    
    if (!status || !['Present', 'Absent'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    // Verify the attendance record belongs to the staff member
    const attendance = await StaffAttendance.findOne({ 
      _id: id, 
      staffId 
    });
    
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    
    // Update the attendance status
    attendance.status = status;
    await attendance.save();
    
    res.status(200).json({ message: 'Attendance updated successfully' });
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Mark today's attendance
router.post('/api/staff/attendance/today', auth, async (req, res) => {
  try {
    const staffId = req.user.id;
    const { date, status } = req.body;
    
    if (!date || !status || !['Present', 'Absent'].includes(status)) {
      return res.status(400).json({ message: 'Invalid date or status' });
    }
    
    // Convert the date string to a Date object with time set to midnight
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);
    
    // Use findOneAndUpdate with upsert to either update or create a new record
    await StaffAttendance.findOneAndUpdate(
      { staffId, date: attendanceDate },
      { status },
      { upsert: true, new: true }
    );
    
    res.status(201).json({ message: 'Attendance marked successfully' });
  } catch (error) {
    // Handle the duplicate key error specifically
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Attendance already marked for today' });
    }
    
    console.error('Error marking attendance:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;