import React from 'react';
import Staff from '../components/Staff';
import TripAssignment from '../components/TripAssignment';
import Attendance from '../components/Attendance';
import LeaveRequest from '../components/LeaveRequest';

const staffData = { /* Staff Data */ };
const assignmentData = { /* Assignment Data */ };
const attendanceData = { /* Attendance Data */ };
const leaveRequestData = { /* Leave Request Data */ };

const StaffHome = () => {
  return (
    <div>
      <Staff staff={staffData} />
      <TripAssignment assignment={assignmentData} />
      <Attendance attendance={attendanceData} />
      <LeaveRequest leaveRequest={leaveRequestData} />
    </div>
  );
};

export default StaffHome;
