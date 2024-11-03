import React, { useState } from 'react';
import './BookingPage.css';

const BookingPage = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [pickupPoint, setPickupPoint] = useState('');
  const [dropoffPoint, setDropoffPoint] = useState('');
  const [passengerDetails, setPassengerDetails] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
  });

  // Assume seat 1 and 5 are already booked
  const bookedSeats = [];
  const totalSeats = 48;

  const handleSeatClick = (seatNumber) => {
    if (!bookedSeats.includes(seatNumber)) {
      setSelectedSeats((prevSeats) =>
        prevSeats.includes(seatNumber)
          ? prevSeats.filter((seat) => seat !== seatNumber)
          : [...prevSeats, seatNumber]
      );
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPassengerDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleProceedToPayment = async () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }
    if (!pickupPoint || !dropoffPoint) {
      alert("Please select both pickup and dropoff points.");
      return;
    }

    const bookingData = {
      selectedSeats,
      pickupPoint,
      dropoffPoint,
      passengerDetails,
    };

    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        const result = await response.json();
        alert('Booking successful!');
        console.log(result);
      } else {
        alert('Booking failed!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="booking-page">
      <h2>Bus Seat Selection</h2>
      
      <div className="seat-selection">
        <div className="bus-front">Front</div>
        <div className="seats-container">
          {Array.from({ length: totalSeats / 4 }, (_, row) => (
            <div key={row} className="seat-row">
              <div
                className={`seat ${bookedSeats.includes(row * 4 + 1) ? 'booked' : ''} ${
                  selectedSeats.includes(row * 4 + 1) ? 'selected' : ''
                }`}
                onClick={() => handleSeatClick(row * 4 + 1)}
              >
                {row * 4 + 1}
              </div>
              <div
                className={`seat ${bookedSeats.includes(row * 4 + 2) ? 'booked' : ''} ${
                  selectedSeats.includes(row * 4 + 2) ? 'selected' : ''
                }`}
                onClick={() => handleSeatClick(row * 4 + 2)}
              >
                {row * 4 + 2}
              </div>
              <div className="aisle"></div>
              <div
                className={`seat ${bookedSeats.includes(row * 4 + 3) ? 'booked' : ''} ${
                  selectedSeats.includes(row * 4 + 3) ? 'selected' : ''
                }`}
                onClick={() => handleSeatClick(row * 4 + 3)}
              >
                {row * 4 + 3}
              </div>
              <div
                className={`seat ${bookedSeats.includes(row * 4 + 4) ? 'booked' : ''} ${
                  selectedSeats.includes(row * 4 + 4) ? 'selected' : ''
                }`}
                onClick={() => handleSeatClick(row * 4 + 4)}
              >
                {row * 4 + 4}
              </div>
            </div>
          ))}
        </div>
        <div className="legend">
          <span className="seat booked"></span> Booked
          <span className="seat selected"></span> Selected
          <span className="seat available"></span> Available
        </div>
      </div>

      <div className="pickup-dropoff">
        <label>Pickup Point:</label>
        <select value={pickupPoint} onChange={(e) => setPickupPoint(e.target.value)}>
          <option value="">Select Pickup Point</option>
          <option value="Stop 1">Stop 1</option>
          <option value="Stop 2">Stop 2</option>
          <option value="Stop 3">Stop 3</option>
        </select>

        <label>Dropoff Point:</label>
        <select value={dropoffPoint} onChange={(e) => setDropoffPoint(e.target.value)}>
          <option value="">Select Dropoff Point</option>
          <option value="Stop A">Stop A</option>
          <option value="Stop B">Stop B</option>
          <option value="Stop C">Stop C</option>
        </select>
      </div>

      <div className="passenger-details">
        <label>Name:</label>
        <input type="text" name="name" value={passengerDetails.name} onChange={handleInputChange} />

        <label>Age:</label>
        <input type="number" name="age" value={passengerDetails.age} onChange={handleInputChange} />

        <label>Gender:</label>
        <select name="gender" value={passengerDetails.gender} onChange={handleInputChange}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <label>Phone Number:</label>
        <input type="tel" name="phone" value={passengerDetails.phone} onChange={handleInputChange} />
      </div>

      <button className="proceed-button" onClick={handleProceedToPayment}>
        Proceed to Payment
      </button>
    </div>
  );
};

export default BookingPage;
