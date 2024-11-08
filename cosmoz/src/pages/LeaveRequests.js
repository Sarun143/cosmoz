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
    try {
      const response = await fetch('http://localhost:5000/api/admin/leaves');
      if (!response.ok) throw new Error('Failed to fetch leaves');
      const data = await response.json();
      setLeaves(data);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    }
  };

  const handleUpdateStatus = async (leaveId, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/leaves/${leaveId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update status');
      fetchLeaves();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div>
      <Header/>
      <Sidebar/>
      <h2>Leave Requests</h2>
      <ul>
        {leaves.map((leave) => (
          <li key={leave._id}>
            {leave.staffId?.name || 'Unknown Staff'}: {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}: {leave.reason} 
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
