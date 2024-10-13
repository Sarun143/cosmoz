import React from "react";
import './TripAssignment.css'
const TripAssignment = ({ assignment }) => {
  const assignTrip = () => {
    // Logic for assigning trip
    console.log("Trip assigned");
  };

  const updateStatus = (newStatus) => {
    // Logic for updating trip status
    console.log("Trip status updated to", newStatus);
  };

  return (
    <div className="trip-assignment-container">
      <h4>Trip Assignment</h4>
      <p>Trip ID: {assignment.tripId}</p>
      <p>Staff ID: {assignment.staffId}</p>
      <p>Status: {assignment.status}</p>
      <button onClick={assignTrip}>Assign Trip</button>
      <button onClick={() => updateStatus("Completed")}>Update Status</button>
    </div>
  );
};

export default TripAssignment;
