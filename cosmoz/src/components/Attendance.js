import React from "react";
import './Attendance.css';


const Attendance = ({ attendance }) => {
  const markAttendance = () => {
    // Logic for marking attendance
    console.log("Attendance marked");
  };

  return (
    <div>
      <h4>Attendance Record</h4>
      <p>Staff ID: {attendance.staffId}</p>
      <p>Date: {attendance.date}</p>
      <p>Status: {attendance.status}</p>
      <button onClick={markAttendance}>Mark Attendance</button>
    </div>
  );
};

export default Attendance;
