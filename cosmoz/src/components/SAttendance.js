import React, { useEffect, useState } from 'react';
import './SAttendance.css';
import SHeader from './SHeader';
import SSidebar from './SSidebar';
const StaffAttendance = () => {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    // Fetch attendance data from backend
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    const response = await fetch('/api/staff/attendance');
    const data = await response.json();
    setAttendance(data);
  };

  return (
    <div>
      <SHeader/>
      <SSidebar/>
      <h2>Attendance</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((entry, index) => (
            <tr key={index}>
              <td>{entry.date}</td>
              <td>{entry.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffAttendance;
