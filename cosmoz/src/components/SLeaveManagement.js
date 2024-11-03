import React, { useState, useEffect } from 'react';
import './SLeaveManagement.css';
// import SHeader from './SHeader';
// import SSidebar from './SSidebar';

const StaffLeaveManagement = ({ staffId }) => {
  const [leaves, setLeaves] = useState([]);
  const [newLeave, setNewLeave] = useState({ startDate: '', endDate: '', reason: '', staffId });

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    const response = await fetch('/api/staff/leaves/${staffId}');
    const data = await response.json();
    setLeaves(data);
  };

  const handleSubmitLeave = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/staff/requestleave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLeave),
      });
      
      if (!response.ok) throw new Error('Failed to submit leave request');
      
      fetchLeaves(); // Refresh leave list
    } catch (error) {
      console.error("Error submitting leave request:", error);
    }
  };
  
  

  return (
    <div>
    {/* <SHeader /> */}
    {/* <SSidebar /> */}
      <h2>Leave Management</h2>
      <form onSubmit={handleSubmitLeave}>
        <label>Start Date:</label>
        <input type="date" value={newLeave.startDate} onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })} />
        
        <label>End Date:</label>
        <input type="date" value={newLeave.endDate} onChange={(e) => setNewLeave({ ...newLeave, endDate: e.target.value })} />
        
        <label>Reason:</label>
        <textarea value={newLeave.reason} onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}></textarea>
        
        <button type="submit">Submit Leave Request</button>
      </form>

      <h3>Your Leave Requests</h3>
      <ul>
        {leaves.map((leave, index) => (
          <li key={index}>
            {leave.startDate} - {leave.endDate}: {leave.reason} (Status: {leave.status})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StaffLeaveManagement;
