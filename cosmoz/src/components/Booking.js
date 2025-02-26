import React, { useState, useEffect } from "react";
import axios from "axios";

const BusBooking = () => {
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [pickupPoint, setPickupPoint] = useState("");
  const [dropoffPoint, setDropoffPoint] = useState("");
  const [bus, setBus] = useState("");
  const [route, setRoute] = useState("");
  const [passengerDetails, setPassengerDetails] = useState([{ name: "", age: "", gender: "" }]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("/api/buses").then(res => setBuses(res.data));
    axios.get("/api/routes").then(res => setRoutes(res.data));
  }, []);

  const handleSeatSelection = (e) => {
    const seat = e.target.value;
    setSelectedSeats(prev => prev.includes(seat) ? prev.filter(s => s !== seat) : [...prev, seat]);
  };

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengerDetails];
    updatedPassengers[index][field] = value;
    setPassengerDetails(updatedPassengers);
  };

  const addPassenger = () => {
    setPassengerDetails([...passengerDetails, { name: "", age: "", gender: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/bookings/book/tickets", {
        selectedSeats,
        pickupPoint,
        dropoffPoint,
        bus,
        route,
        passengerDetails
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div>
      <h2>Bus Ticket Booking</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>Pickup Point:</label>
        <input type="text" value={pickupPoint} onChange={(e) => setPickupPoint(e.target.value)} required />
        
        <label>Dropoff Point:</label>
        <input type="text" value={dropoffPoint} onChange={(e) => setDropoffPoint(e.target.value)} required />
        
        <label>Select Bus:</label>
        <select value={bus} onChange={(e) => setBus(e.target.value)} required>
          <option value="">Select a bus</option>
          {buses.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
        </select>
        
        <label>Select Route:</label>
        <select value={route} onChange={(e) => setRoute(e.target.value)} required>
          <option value="">Select a route</option>
          {routes.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
        </select>
        
        <label>Select Seats:</label>
        <input type="text" placeholder="Seat numbers (comma separated)" onBlur={handleSeatSelection} />

        <h3>Passenger Details</h3>
        {passengerDetails.map((p, index) => (
          <div key={index}>
            <input type="text" placeholder="Name" value={p.name} onChange={(e) => handlePassengerChange(index, "name", e.target.value)} required />
            <input type="number" placeholder="Age" value={p.age} onChange={(e) => handlePassengerChange(index, "age", e.target.value)} required />
            <select value={p.gender} onChange={(e) => handlePassengerChange(index, "gender", e.target.value)} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        ))}
        <button type="button" onClick={addPassenger}>Add Passenger</button>

        <button type="submit">Book Ticket</button>
      </form>
    </div>
  );
};

export default BusBooking;
