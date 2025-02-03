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
      const response = await fetch('http://localhost:5000/api/admin/leaves');
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
                <th>Staff Name</th>
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
                  <td>{leave.staffId?.name || 'Unknown'}</td>
                  <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                  <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                  <td>{leave.reason}</td>
                  <td>{leave.status}</td>
                  <td>
                    {leave.status === 'Pending' ? (
                      <>
                        <button
                          className="approve-btn"
                          onClick={() => handleUpdateStatus(leave._id, 'Approved')}
                        >
                          Approve
                        </button>
                        <button
                          className="reject-btn"
                          onClick={() => handleUpdateStatus(leave._id, 'Rejected')}
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span>{leave.status}</span>
                    )}
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
