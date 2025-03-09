import React, { useState, useEffect } from 'react';
import SHeader from './SHeader';
import SSidebar from './SSidebar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LeaveRequest.css';

const StaffLeaveStatus = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Use React Router's navigate function

  // Function to fetch leave requests for the logged-in staff
  const fetchMyLeaveRequests = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setError('Please login first');
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:5000/api/staff/viewleaves', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setLeaveRequests(response.data.leaveRequests || []);
    } catch (err) {
      console.error('Error fetching leave requests:', err);
      if (err.response) {
        setError(err.response.data.message || 'Failed to fetch leave requests.');
      } else if (err.request) {
        setError('Could not connect to server. Please check your internet connection.');
      } else {
        setError('An error occurred while fetching leave requests: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchMyLeaveRequests();
  }, []);

  // Function to get status class for styling
  const getStatusClass = (status) => {
    switch(status.toLowerCase()) {
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  };

  // Function to navigate to the leave request form
  const navigateToLeaveRequest = () => {
    // Update this route to match your application's route structure
    navigate('/staff/leaverequests'); // Modify this to your actual route
    
    // If you're not using React Router, use this instead:
    // window.location.href = '/staff/leave-request';
  };

  // Calculate the duration of leave in days
  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Including both start and end days
  };

  return (
    <div className="staff-dashboard-container">
      <SHeader />
      <div className="dashboard-content">
        <SSidebar />
        <div className="main-content">
          <h2>My Leave Requests</h2>
          
          {loading && <p className="loading-message">Loading your leave requests...</p>}
          
          {error && <p className="error-message">{error}</p>}
          
          <div className="request-button-container">
            <button onClick={navigateToLeaveRequest} className="new-leave-btn">
              Request New Leave
            </button>
          </div>
          
          {leaveRequests.length > 0 ? (
            <div className="leave-requests-container">
              <table className="leave-requests-table">
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
                      <td className={getStatusClass(leave.status || 'pending')}>
                        {leave.status || 'Pending'}
                      </td>
                      <td>{new Date(leave.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-leave-requests">
              <p>You haven't submitted any leave requests yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffLeaveStatus;