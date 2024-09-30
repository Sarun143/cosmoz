import React from "react";
import './LeaveRequest.css';


const LeaveRequest = ({ leaveRequest }) => {
  const requestLeave = () => {
    // Logic for requesting leave
    console.log("Leave requested"); 
  };

  const updateStatus = (newStatus) => {
    // Logic for updating leave request status
    console.log("Leave status updated to", newStatus);
  };

  return (
    <div>
      <h4>Leave Request</h4>
      <p>Staff ID: {leaveRequest.staffId}</p>
      <p>Start Date: {leaveRequest.startDate}</p>
      <p>End Date: {leaveRequest.endDate}</p>
      <p>Status: {leaveRequest.status}</p>
      <button onClick={requestLeave}>Request Leave</button>
      <button onClick={() => updateStatus("Approved")}>Update Status</button>
    </div>
  );
};

export default LeaveRequest;
