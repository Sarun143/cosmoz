import React, { useState, useEffect } from "react";
import axios from "axios";
import "./LeaveRequest.css"; // Ensure this CSS file exists and styles are defined
import Sidebar from "./Sidebar";
import Header from "./Header";

const ViewLeaveRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to fetch leave requests
  const fetchLeaveRequests = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get("http://localhost:5000/api/staff/viewleaves"); // Ensure the backend is running
      setLeaveRequests(response.data.leaveRequests || []); // Handle undefined response properly
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

  // Fetch data when the component is mounted
  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  return (
    <div className="view-leave-requests-container">
      <Header />
      <Sidebar />
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
          </tr>
        </thead>
        <tbody>
  {leaveRequests.length > 0 ? (
    leaveRequests.map((leave) => (
      <tr key={leave._id}>
        <td>{leave.staffId?.name || "N/A"}</td>
        <td>{leave.staffId?.email || "N/A"}</td> {/* Access email inside staffId */}
        <td>{leave.staffId?.role || "N/A"}</td> {/* Access role inside staffId */}
        <td>{new Date(leave.startDate).toLocaleDateString()}</td>
        <td>{new Date(leave.endDate).toLocaleDateString()}</td>
        <td>{leave.reason || "No reason provided"}</td>
        <td>{leave.status || "Pending"}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="7" className="no-data">
        No leave requests found.
      </td>
    </tr>
  )}
</tbody>
      </table>
    </div>
  );
};

export default ViewLeaveRequests;
