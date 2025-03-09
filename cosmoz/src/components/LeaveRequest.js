import React, { useState, useEffect } from "react";
import axios from "axios";
import "./LeaveRequest.css"; // Ensure this CSS file exists and styles are defined
import Sidebar from "./Sidebar";
import Header from "./Header";

const ViewLeaveRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  // Function to fetch leave requests
  const fetchLeaveRequests = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get("http://localhost:5000/api/staff/viewleaves");
      setLeaveRequests(response.data.leaveRequests || []);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Failed to fetch leave requests.");
      } else if (err.request) {
        setError("No response from server. Please check your connection.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Update leave status
  const updateLeaveStatus = async (leaveId, status) => {
    setActionLoading(leaveId);
    try {
      // Get token from localStorage
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError("Please login first");
        return;
      }

      // Update leave status
      const response = await axios.put(
        `http://localhost:5000/api/staff/updatestatus/${leaveId}`,
        { status },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update the leave request in the UI
      setLeaveRequests(prevRequests => 
        prevRequests.map(leave => 
          leave._id === leaveId ? {...leave, status: status} : leave
        )
      );

      // Optional: Show success message
      alert(`Leave request ${status.toLowerCase()} successfully`);
    } catch (err) {
      console.error("Error updating leave status:", err);
      if (err.response) {
        setError(err.response.data.message || `Failed to ${status.toLowerCase()} leave request.`);
      } else {
        setError(`Failed to ${status.toLowerCase()} leave request. Please try again.`);
      }
    } finally {
      setActionLoading(null);
    }
  };

  // Fetch data when the component is mounted
  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  return (
    <div className="view-leave-requests-container">
      <Header />
      <Sidebar />
      <div className="content-wrapper">
        <h2>All Leave Requests</h2>

        {loading && <p className="loading-message">Loading leave requests...</p>}
        {error && <p className="error-message">{error}</p>}

        <table className="leave-requests-table">
          <thead>
            <tr>
              <th scope="col">Staff Name</th>
              <th scope="col">Email</th>
              <th scope="col">Role</th>
              <th scope="col">Start Date</th>
              <th scope="col">End Date</th>
              <th scope="col">Reason</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.length > 0 ? (
              leaveRequests.map((leave) => (
                <tr key={leave._id}>
                  <td>{leave.staffId?.name || "N/A"}</td>
                  <td>{leave.staffId?.email || "N/A"}</td>
                  <td>{leave.staffId?.role || "N/A"}</td>
                  <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                  <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                  <td>{leave.reason || "No reason provided"}</td>
                  <td className={`status-${leave.status?.toLowerCase() || 'pending'}`}>
                    {leave.status || "Pending"}
                  </td>
                  <td className="action-buttons">
                    {leave.status === 'Pending' && (
                      <>
                        <button 
                          className="approve-btn"
                          onClick={() => updateLeaveStatus(leave._id, 'Approved')}
                          disabled={actionLoading === leave._id}
                        >
                          {actionLoading === leave._id ? 'Processing...' : 'Approve'}
                        </button>
                        <button 
                          className="reject-btn"
                          onClick={() => updateLeaveStatus(leave._id, 'Rejected')}
                          disabled={actionLoading === leave._id}
                        >
                          {actionLoading === leave._id ? 'Processing...' : 'Reject'}
                        </button>
                      </>
                    )}
                    {leave.status !== 'Pending' && (
                      <span className="action-complete">
                        {leave.status === 'Approved' ? '✓ Approved' : '✗ Rejected'}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">
                  No leave requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewLeaveRequests;