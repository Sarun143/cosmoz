import React, { useState } from 'react';
import './Attendance.css';
import Sidebar from '../components/Sidebar'; // Sidebar component is used here


const Attendance = () => {
    
  const [attendanceList, setAttendanceList] = useState([
    { id: 1, name: 'John Doe', status: 'Present' },
    { id: 2, name: 'Jane Smith', status: 'Absent' }
  ]);

  return (
    <div className="attendance">
        <Sidebar/>
      <h2>Staff Attendance</h2>
      <table>
        <thead>
          <tr>
            <th>Staff Name</th>
            <th>Attendance</th>
          </tr>
        </thead>
        <tbody>
          {attendanceList.map((staff) => (
            <tr key={staff.id}>
              <td>{staff.name}</td>
              <td>{staff.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Attendance;
