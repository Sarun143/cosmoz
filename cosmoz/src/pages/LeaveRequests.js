import React, { useState,useEffect } from 'react';
import './LeaveRequests.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const LeaveRequests = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    const response = await fetch('/api/admin/leaves');
    const data = await response.json();
    setLeaves(data);
  };

  const handleUpdateStatus = async (leaveId, status) => {
    await fetch(`/api/admin/leaves/${leaveId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchLeaves();
  };

  return (
    <div>
      <Header/>
      <Sidebar/>
      <h2>Leave Requests</h2>
      <ul>
        {leaves.map((leave) => (
          <li key={leave._id}>
            {leave.staffId.name}: {leave.startDate} - {leave.endDate}: {leave.reason} 
            (Status: {leave.status})
            <button onClick={() => handleUpdateStatus(leave._id, 'Approved')}>Approve</button>
            <button onClick={() => handleUpdateStatus(leave._id, 'Rejected')}>Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaveRequests;
