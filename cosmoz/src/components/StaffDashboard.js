import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SHeader from './SHeader';
import Sidebar from './SSidebar';
import Profile from './SProfile';
import Attendance from './SAttendance';
import LeaveManagement from './SLeaveManagement';
// import Salary from './SSalary';
import ScheduledTrips from './SScheduledTrips';
import './StaffDashboard.css';

function StaffDash() {
  return (
  
      <div>
        {/* Sidebar should be rendered persistently */}
        <SHeader/>
        <Sidebar />

        {/* Main content area */}
        <Routes>
          <Route path="/staff/profile" element={<Profile />} />
          <Route path="/staff/attendance" element={<Attendance />} />
          <Route path="/staff/leave-management" element={<LeaveManagement />} />
        {/* <Route path="/staff/salary" element={<Salary />} /> */}
          <Route path="/staff/scheduledtrips" element={<ScheduledTrips />} />
        </Routes>
      </div>
  
  );
}

export default StaffDash;
