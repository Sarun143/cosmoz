import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import Header from './Header';
import './BusBookingDetails.css';

const BusBookingDetails = () => {
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/buses') // Fetch bus booking details
      .then(response => {
        setBuses(response.data);
      })
      .catch(error => console.log(error));
  }, []);

  return (
    <div className="bus-booking-details">
      <Header />
      <Sidebar />
      <h1>Bus Booking Details</h1>
      <div className="bus-list">
        <table>
          <thead>
            <tr>
              <th>Bus ID</th>
              <th>Route ID</th>
              <th>Total Seats</th>
              <th>Booked Seats</th>
              <th>Vacant Seats</th>
            </tr>
          </thead>
          <tbody>
            {buses.map(bus => (
              <tr key={bus._id}>
                <td>{bus.busId}</td>
                <td>{bus.routeId}</td>
                <td>{bus.totalSeats}</td>
                <td>{bus.bookedSeats}</td>
                <td>{bus.totalSeats - bus.bookedSeats}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BusBookingDetails;
