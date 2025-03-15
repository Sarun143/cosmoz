import React, { useState, useEffect } from 'react';
import './BookingPage.css';

const BookingPage = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [pickupPoint, setPickupPoint] = useState('');
  const [dropoffPoint, setDropoffPoint] = useState('');
  const [passengerDetails, setPassengerDetails] = useState([{
    name: '',
    age: '',
    gender: '',
    phone: '',
    email: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: ''
    }
  }]);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState('');
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState('');
  const [stops, setStops] = useState([]);

  // Fetch routes when component mounts
  useEffect(() => {
    fetchRoutes();
  }, []);

  // Fetch buses when a route is selected
  useEffect(() => {
    if (selectedRoute) {
      fetchBusesForRoute(selectedRoute);
      fetchStopsForRoute(selectedRoute);
    }
  }, [selectedRoute]);

  const fetchRoutes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/routes');
      if (response.ok) {
        const data = await response.json();
        setRoutes(data);
      }
    } catch (error) {
      console.error('Error fetching routes:', error);
    }
  };

  const fetchBusesForRoute = async (routeId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/vehicles/route/${routeId}`);
      if (response.ok) {
        const data = await response.json();
        setBuses(data);
      }
    } catch (error) {
      console.error('Error fetching buses:', error);
    }
  };

  const fetchStopsForRoute = async (routeId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/routes/${routeId}/stops`);
      if (response.ok) {
        const data = await response.json();
        setStops(data);
      }
    } catch (error) {
      console.error('Error fetching stops:', error);
    }
  };

  // Mock data for seat layout - in a real app this would come from the API
  const busLayout = {
    totalSeats: 48,
    lowerDeck: 24,
    upperDeck: 24,
    bookedSeats: [],
    fareDetails: {
      lower: 800,
      upper: 700
    }
  };

  const handleSeatClick = (seatNumber, seatType) => {
    if (!busLayout.bookedSeats.includes(seatNumber)) {
      const fare = seatType === 'Lower' ? busLayout.fareDetails.lower : busLayout.fareDetails.upper;
      const seatInfo = {
        seatNo: seatNumber.toString(),
        seatType,
        fare
      };

      setSelectedSeats((prevSeats) => {
        const existingSeatIndex = prevSeats.findIndex(seat => seat.seatNo === seatNumber.toString());
        if (existingSeatIndex !== -1) {
          return prevSeats.filter((_, index) => index !== existingSeatIndex);
        } else {
          return [...prevSeats, seatInfo];
        }
      });
    }
  };

  const handlePassengerDetailsChange = (index, field, value) => {
    setPassengerDetails(prevDetails => {
      const newDetails = [...prevDetails];
      
      if (field.includes('.')) {
        // Handle nested fields like address.street
        const [parent, child] = field.split('.');
        newDetails[index] = {
          ...newDetails[index],
          [parent]: {
            ...newDetails[index][parent],
            [child]: value
          }
        };
      } else {
        newDetails[index] = {
          ...newDetails[index],
          [field]: value
        };
      }
      
      return newDetails;
    });
  };

  const addPassenger = () => {
    setPassengerDetails([...passengerDetails, {
      name: '',
      age: '',
      gender: '',
      phone: '',
      email: '',
      address: {
        street: '',
        city: '',
        state: '',
        zip: ''
      }
    }]);
  };

  const removePassenger = (index) => {
    if (passengerDetails.length > 1) {
      setPassengerDetails(passengerDetails.filter((_, i) => i !== index));
    }
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
    if (!selectedBus || !selectedRoute) {
      alert("Please select a route and bus.");
      return;
    }
    
    // Validate passenger details
    const validPassengers = passengerDetails.filter(p => p.name && p.gender);
    if (validPassengers.length === 0) {
      alert("Please enter at least one passenger's details.");
      return;
    }
    if (validPassengers.length !== selectedSeats.length) {
      alert(`Please enter details for all ${selectedSeats.length} selected seats.`);
      return;
    }

    const bookingData = {
      selectedSeats,
      pickupPoint,
      dropoffPoint,
      passengerDetails: validPassengers,
      bus: selectedBus,
      route: selectedRoute
    };

    try {
      const response = await fetch('http://localhost:5000/api/bookings/book/tickets', {
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
        const errorData = await response.json();
        alert(`Booking failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  // Determine if a seat is selected
  const isSeatSelected = (seatNo) => {
    return selectedSeats.some(seat => seat.seatNo === seatNo.toString());
  };

  return (
    <div className="booking-page">
      <h2>Bus Seat Selection</h2>

      <div className="route-selection">
        <h3>Select Route and Bus</h3>
        <div className="form-group">
          <label>Route:</label>
          <select 
            value={selectedRoute} 
            onChange={(e) => setSelectedRoute(e.target.value)}
          >
            <option value="">Select Route</option>
            {routes.map(route => (
              <option key={route._id} value={route._id}>
                {route.name || `${route.origin} to ${route.destination}`}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Bus:</label>
          <select 
            value={selectedBus} 
            onChange={(e) => setSelectedBus(e.target.value)}
            disabled={!selectedRoute}
          >
            <option value="">Select Bus</option>
            {buses.map(bus => (
              <option key={bus._id} value={bus._id}>
                {bus.registrationNumber} - {bus.type} ({bus.totalSeats} seats)
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="seat-selection">
        <h3>Lower Deck</h3>
        <div className="bus-front">Front</div>
        <div className="seats-container">
          {Array.from({ length: busLayout.lowerDeck / 4 }, (_, row) => (
            <div key={`lower-${row}`} className="seat-row">
              <div
                className={`seat ${busLayout.bookedSeats.includes(row * 4 + 1) ? 'booked' : ''} ${
                  isSeatSelected(row * 4 + 1) ? 'selected' : ''
                }`}
                onClick={() => handleSeatClick(row * 4 + 1, 'Lower')}
              >
                {row * 4 + 1}
              </div>
              <div
                className={`seat ${busLayout.bookedSeats.includes(row * 4 + 2) ? 'booked' : ''} ${
                  isSeatSelected(row * 4 + 2) ? 'selected' : ''
                }`}
                onClick={() => handleSeatClick(row * 4 + 2, 'Lower')}
              >
                {row * 4 + 2}
              </div>
              <div className="aisle"></div>
              <div
                className={`seat ${busLayout.bookedSeats.includes(row * 4 + 3) ? 'booked' : ''} ${
                  isSeatSelected(row * 4 + 3) ? 'selected' : ''
                }`}
                onClick={() => handleSeatClick(row * 4 + 3, 'Lower')}
              >
                {row * 4 + 3}
              </div>
              <div
                className={`seat ${busLayout.bookedSeats.includes(row * 4 + 4) ? 'booked' : ''} ${
                  isSeatSelected(row * 4 + 4) ? 'selected' : ''
                }`}
                onClick={() => handleSeatClick(row * 4 + 4, 'Lower')}
              >
                {row * 4 + 4}
              </div>
            </div>
          ))}
        </div>

        <h3>Upper Deck</h3>
        <div className="seats-container">
          {Array.from({ length: busLayout.upperDeck / 4 }, (_, row) => {
            const startSeat = busLayout.lowerDeck + row * 4 + 1;
            return (
              <div key={`upper-${row}`} className="seat-row">
                <div
                  className={`seat ${busLayout.bookedSeats.includes(startSeat) ? 'booked' : ''} ${
                    isSeatSelected(startSeat) ? 'selected' : ''
                  }`}
                  onClick={() => handleSeatClick(startSeat, 'Upper')}
                >
                  {startSeat}
                </div>
                <div
                  className={`seat ${busLayout.bookedSeats.includes(startSeat + 1) ? 'booked' : ''} ${
                    isSeatSelected(startSeat + 1) ? 'selected' : ''
                  }`}
                  onClick={() => handleSeatClick(startSeat + 1, 'Upper')}
                >
                  {startSeat + 1}
                </div>
                <div className="aisle"></div>
                <div
                  className={`seat ${busLayout.bookedSeats.includes(startSeat + 2) ? 'booked' : ''} ${
                    isSeatSelected(startSeat + 2) ? 'selected' : ''
                  }`}
                  onClick={() => handleSeatClick(startSeat + 2, 'Upper')}
                >
                  {startSeat + 2}
                </div>
                <div
                  className={`seat ${busLayout.bookedSeats.includes(startSeat + 3) ? 'booked' : ''} ${
                    isSeatSelected(startSeat + 3) ? 'selected' : ''
                  }`}
                  onClick={() => handleSeatClick(startSeat + 3, 'Upper')}
                >
                  {startSeat + 3}
                </div>
              </div>
            );
          })}
        </div>

        <div className="legend">
          <div><span className="seat booked"></span> Booked</div>
          <div><span className="seat selected"></span> Selected</div>
          <div><span className="seat available"></span> Available</div>
          <div><span className="seat"></span> Lower Deck - ₹{busLayout.fareDetails.lower}</div>
          <div><span className="seat upper"></span> Upper Deck - ₹{busLayout.fareDetails.upper}</div>
        </div>

        <div className="selected-seats-summary">
          <h3>Selected Seats</h3>
          {selectedSeats.length > 0 ? (
            <ul>
              {selectedSeats.map((seat, index) => (
                <li key={index}>
                  Seat {seat.seatNo} ({seat.seatType}) - ₹{seat.fare}
                </li>
              ))}
              <li className="total">
                Total: ₹{selectedSeats.reduce((sum, seat) => sum + seat.fare, 0)}
              </li>
            </ul>
          ) : (
            <p>No seats selected</p>
          )}
        </div>
      </div>

      <div className="pickup-dropoff">
        <h3>Journey Details</h3>
        <div className="form-group">
          <label>Pickup Point:</label>
          <select 
            value={pickupPoint} 
            onChange={(e) => setPickupPoint(e.target.value)}
            disabled={!selectedRoute}
          >
            <option value="">Select Pickup Point</option>
            {stops.map(stop => (
              <option key={stop._id} value={stop._id}>
                {stop.name} - {stop.location}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Dropoff Point:</label>
          <select 
            value={dropoffPoint} 
            onChange={(e) => setDropoffPoint(e.target.value)}
            disabled={!selectedRoute}
          >
            <option value="">Select Dropoff Point</option>
            {stops.map(stop => (
              <option key={stop._id} value={stop._id}>
                {stop.name} - {stop.location}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="passenger-details-container">
        <h3>Passenger Details</h3>
        <p>Please enter details for {selectedSeats.length} passenger(s)</p>
        
        {passengerDetails.map((passenger, index) => (
          <div key={index} className="passenger-details">
            <h4>Passenger {index + 1}</h4>
            
            <div className="form-row">
              <div className="form-group">
                <label>Name: *</label>
                <input
                  type="text"
                  value={passenger.name}
                  onChange={(e) => handlePassengerDetailsChange(index, 'name', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Age:</label>
                <input
                  type="number"
                  value={passenger.age}
                  onChange={(e) => handlePassengerDetailsChange(index, 'age', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Gender: *</label>
                <select
                  value={passenger.gender}
                  onChange={(e) => handlePassengerDetailsChange(index, 'gender', e.target.value)}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone:</label>
                <input
                  type="tel"
                  value={passenger.phone}
                  onChange={(e) => handlePassengerDetailsChange(index, 'phone', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={passenger.email}
                  onChange={(e) => handlePassengerDetailsChange(index, 'email', e.target.value)}
                />
              </div>
            </div>

            <div className="address-section">
              <h5>Address (Optional)</h5>
              <div className="form-row">
                <div className="form-group">
                  <label>Street:</label>
                  <input
                    type="text"
                    value={passenger.address.street}
                    onChange={(e) => handlePassengerDetailsChange(index, 'address.street', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>City:</label>
                  <input
                    type="text"
                    value={passenger.address.city}
                    onChange={(e) => handlePassengerDetailsChange(index, 'address.city', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>State:</label>
                  <input
                    type="text"
                    value={passenger.address.state}
                    onChange={(e) => handlePassengerDetailsChange(index, 'address.state', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Zip:</label>
                  <input
                    type="text"
                    value={passenger.address.zip}
                    onChange={(e) => handlePassengerDetailsChange(index, 'address.zip', e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            {index > 0 && (
              <button 
                type="button" 
                className="remove-passenger" 
                onClick={() => removePassenger(index)}
              >
                Remove Passenger
              </button>
            )}
            
            {index === passengerDetails.length - 1 && index < selectedSeats.length - 1 && (
              <button 
                type="button" 
                className="add-passenger" 
                onClick={addPassenger}
              >
                Add Another Passenger
              </button>
            )}
          </div>
        ))}
        
        {passengerDetails.length < selectedSeats.length && (
          <button 
            type="button" 
            className="add-passenger" 
            onClick={addPassenger}
          >
            Add Passenger
          </button>
        )}
      </div>

      <button 
        className="proceed-button" 
        onClick={handleProceedToPayment}
        disabled={!selectedBus || !selectedRoute || selectedSeats.length === 0 || !pickupPoint || !dropoffPoint}
      >
        Proceed to Payment
      </button>
    </div>
  );
};

export default BookingPage;