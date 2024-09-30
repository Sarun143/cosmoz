import React, { useState } from "react";
import './Staff.css';

const Staff = ({ staff }) => {
  const [status, setStatus] = useState(staff.status);

  const manageTrip = () => {
    // Logic for managing trip
    console.log("Managing trip...");
  };

  const updateStatus = (newStatus) => {
    setStatus(newStatus);
    console.log("Status updated to", newStatus);
  };

  return (
    <div className="staff-container"> {/* Apply the className here */}
      <h2>{staff.name}</h2>
      <p>Role: {staff.role}</p>
      <p>Contact: {staff.contactDetails}</p>
      <p>Schedule: {staff.schedule}</p>
      <button onClick={manageTrip}>Manage Trip</button>
      <button onClick={() => updateStatus("Active")}>Update Status</button>
      <p>Current Status: {status}</p>
    </div>
  );
};

export default Staff;
