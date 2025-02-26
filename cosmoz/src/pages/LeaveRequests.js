import React, { useState, useEffect } from 'react';
import './LeaveRequests.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const LeaveRequests = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeaves();
  }, []);
 
  const fetchLeaves = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/staff/viewleaves');
      if (!response.ok) throw new Error('Failed to fetch leave requests.');
      const data = await response.json();
      setLeaves(data.leaveRequests || []);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      setError('Failed to load leave requests. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (leaveId, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/leaves/${leaveId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update status.');
      fetchLeaves(); // Refresh the leave requests after update
    } catch (error) {
      console.error('Error updating leave status:', error);
      alert('Failed to update leave status. Please try again.');
    }
  };

  return (
    <div className="leave-requests">
      <Header />
      <Sidebar />
      <main>
        <h2>Leave Requests</h2>
        {loading ? (
          <p>Loading leave requests...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : leaves.length === 0 ? (
          <p>No leave requests found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr key={leave._id}>
                  <td>{leave.email}</td>
                  <td>{leave.role}</td>
                  <td>{leave.startDate}</td>
                  <td>{leave.endDate}</td>
                  <td>{leave.reason}</td>
                  <td>{leave.status}</td>
                  <td>
                    <button
                      onClick={() => handleUpdateStatus(leave._id, 'Approved')}
                      style={{ backgroundColor: '#4CAF50', color: 'white', marginRight: '5px' }}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(leave._id, 'Rejected')}
                      style={{ backgroundColor: '#f44336', color: 'white' }}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
};

export default LeaveRequests;
