import React, { useState, useEffect } from 'react';
import SHeader from './SHeader';
import SSidebar from './SSidebar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SLeaveManagement.css'; // Using the original CSS filename

const StaffLeaveStatus = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Function to fetch leave requests
    const fetchLeaveRequests = async () => {
      try {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          setError('Authentication token not found. Please login again.');
          setLoading(false);
          return;
        }
        
        // Make the API call
        const response = await axios.get('http://localhost:5000/api/staff/viewleaves', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        // Set the leave requests
        if (response.data && response.data.leaveRequests) {
          setLeaveRequests(response.data.leaveRequests);
        } else {
          setLeaveRequests([]);
        }
        
      } catch (error) {
        console.error('Error fetching leave requests:', error);
        setError('Failed to fetch leave requests. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveRequests();
  }, []);

  const navigateToLeaveRequest = () => {
    navigate('/staff/leave-management2');
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Including both start and end days
  };

  return (
    <div className="leave-management-page">
      <SHeader />
      <div className="leave-management-layout">
        <SSidebar />
        <div className="leave-management-content">
          <h2>Leave Requests</h2>
          
          {loading ? (
            <div className="leave-loading">
              <div className="spinner"></div>
              <p>Loading your leave requests...</p>
            </div>
          ) : error ? (
            <div className="leave-error">
              <p>{error}</p>
            </div>
          ) : (
            <>
              <div className="leave-action-bar">
                <button onClick={navigateToLeaveRequest} className="request-leave-button">
                  Request New Leave
                </button>
              </div>
              
              {leaveRequests.length > 0 ? (
                <div className="leave-table-container">
                  <table className="leave-table">
                    <thead>
                      <tr>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Duration</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Requested On</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaveRequests.map((leave) => (
                        <tr key={leave._id}>
                          <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                          <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                          <td>{calculateDuration(leave.startDate, leave.endDate)} days</td>
                          <td>{leave.reason}</td>
                          <td className={`leave-status ${leave.status ? leave.status.toLowerCase() : 'pending'}`}>
                            {leave.status || 'Pending'}
                          </td>
                          <td>{new Date(leave.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="no-leaves-message">
                  <p>You haven't submitted any leave requests yet.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffLeaveStatus;