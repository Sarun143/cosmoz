import React, { useState } from 'react';
import './LeaveRequests.css';
import Sidebar from '../components/Sidebar';

const LeaveRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, name: 'John Doe', date: '2024-10-01', reason: 'Medical', days: 2 },
    { id: 2, name: 'Jane Smith', date: '2024-10-05', reason: 'Vacation', days: 5 }
  ]);

  return (
    <div className="leave-requests"> {/* Updated the class name here */}
      <Sidebar />
      <h2>Leave Requests</h2>
      <table>
        <thead>
          <tr>
            <th>Staff Name</th>
            <th>Date</th>
            <th>Reason</th>
            <th>Days</th>
          </tr>
        </thead>
        <tbody>
          {leaveRequests.map((request) => (
            <tr key={request.id}>
              <td>{request.name}</td>
              <td>{request.date}</td>
              <td>{request.reason}</td>
              <td>{request.days}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveRequests;
