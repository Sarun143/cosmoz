import React, { useState } from 'react';
import './LeaveRequests.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const LeaveRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, name: 'John Doe', date: '2024-10-01', reason: 'Medical', days: 2 },
    { id: 2, name: 'Jane Smith', date: '2024-10-05', reason: 'Vacation', days: 5 }
  ]);

  const handleApproval = (id) => {
    // Handle approval logic (e.g., update state, make API call)
    console.log(`Approved leave request with ID: ${id}`);
  };

  const handleDenial = (id) => {
    // Handle denial logic (e.g., update state, make API call)
    console.log(`Denied leave request with ID: ${id}`);
  };

  return (
    <div className="leave-requests">
      <Sidebar />
      <Header />
      <h2>Leave Requests</h2>
      <table>
        <thead>
          <tr>
            <th>Staff Name</th>
            <th>Date</th>
            <th>Reason</th>
            <th>Days</th>
            <th>Actions</th> {/* Added Actions header */}
          </tr>
        </thead>
        <tbody>
          {leaveRequests.map((request) => (
            <tr key={request.id}>
              <td>{request.name}</td>
              <td>{request.date}</td>
              <td>{request.reason}</td>
              <td>{request.days}</td>
              <td> {/* Added Actions column for buttons */}
                <button onClick={() => handleApproval(request.id)}>Approve</button>
                <button onClick={() => handleDenial(request.id)}>Deny</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveRequests;
