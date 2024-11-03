import React, { useEffect, useState } from 'react';
import './SScheduledTrips.css';
import SHeader from './SHeader';
import SSidebar from './SSidebar';


const StaffScheduledTrips = () => {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    // Fetch scheduled trips from backend
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    const response = await fetch('/api/staff/trips');
    const data = await response.json();
    setTrips(data);
  };

  return (
    <div>
      <SHeader/>
      <SSidebar/>
      <h2>Scheduled Trips</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Route</th>
            <th>Departure Time</th>
            <th>Arrival Time</th>
          </tr>
        </thead>
        <tbody>
          {trips.map((trip, index) => (
            <tr key={index}>
              <td>{trip.date}</td>
              <td>{trip.route}</td>
              <td>{trip.departureTime}</td>
              <td>{trip.arrivalTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffScheduledTrips;
