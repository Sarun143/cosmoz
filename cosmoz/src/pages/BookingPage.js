import React, { useState, useEffect } from 'react';
import './BookingPage.css';
import { useLocation } from 'react-router-dom';

const BookingPage = () => {
  const location = useLocation();
  const { selectedRoute, busDetails: initialBusDetails, departureDate } = location.state || {};
  
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
  const [stops, setStops] = useState([]);
  const [availableStops, setAvailableStops] = useState({
    pickupPoints: [],
    dropoffPoints: []
  });

  // Add new state for bus details
  const [loading, setLoading] = useState(false);
  const [busDetails, setBusDetails] = useState(initialBusDetails || null);
  const [busLayout, setBusLayout] = useState({
    totalSeats: initialBusDetails?.seats?.totalSeats || 0,
    lowerDeck: initialBusDetails?.seats?.Lower || 0,
    upperDeck: initialBusDetails?.seats?.Upper || 0,
    bookedSeats: [],
    fareDetails: {
      lower: 800,
      upper: 700
    }
  });

  // Add these states directly from the passed data
  const [selectedRouteId, setSelectedRouteId] = useState(selectedRoute?._id || '');
  const [selectedBus, setSelectedBus] = useState(initialBusDetails?._id || '');

  // Add this useEffect to load the Razorpay script
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => {
          resolve(true);
        };
        script.onerror = () => {
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };

    // Load the script
    loadRazorpayScript();
  }, []);

  // Modify this useEffect to only fetch booked seats
  useEffect(() => {
    if (selectedRoute) {
      // No need to fetch bus details again as we already have them
      // fetchBusDetails();
      fetchStopsForRoute();
      // Set route automatically
      setSelectedRouteId(selectedRoute._id);
      if (initialBusDetails) {
        setSelectedBus(initialBusDetails._id);
      }
    }
  }, [selectedRoute, initialBusDetails]);

  // Add useEffect to fetch booked seats for the selected date
  useEffect(() => {
    const fetchBookedSeats = async () => {
      if (selectedRoute?._id && departureDate) {
        try {
          setLoading(true);
          const response = await fetch('http://localhost:5000/api/search/booked-seats', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              routeId: selectedRoute._id,
              journeyDate: departureDate
            }),
          });

          if (response.ok) {
            const data = await response.json();
            setBusLayout(prev => ({
              ...prev,
              bookedSeats: data.bookedSeats || []
            }));
          }
        } catch (error) {
          console.error('Error fetching booked seats:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBookedSeats();
  }, [selectedRoute?._id, departureDate]);

  const fetchStopsForRoute = async () => {
    try {
      // First, add departure and arrival stops
      const allStops = [
        {
          _id: 'departure',
          name: selectedRoute.departureStop,
          time: selectedRoute.departure
        },
        {
          _id: 'arrival',
          name: selectedRoute.arrivalStop,
          time: selectedRoute.arrival
        }
      ];

      // Add intermediate stops if they exist
      if (selectedRoute.stops && selectedRoute.stops.length > 0) {
        allStops.push(...selectedRoute.stops.map(stop => ({
          _id: stop._id || stop.stop,
          name: stop.stop,
          time: stop.arrival
        })));
      }

      // Organize stops into pickup and dropoff points
      // Pickup points are all stops except the last one
      // Dropoff points are all stops except the first one
      setAvailableStops({
        pickupPoints: allStops.slice(0, -1),
        dropoffPoints: allStops.slice(1)
      });

      // Set default pickup and dropoff points
      setPickupPoint(selectedRoute.departureStop);
      setDropoffPoint(selectedRoute.arrivalStop);

    } catch (error) {
      console.error('Error fetching stops:', error);
    }
  };

  const handleSeatClick = (seatNumber, seatType) => {
    if (!busLayout.bookedSeats.includes(seatNumber)) {
      const fare = seatType === 'Lower' ? busLayout.fareDetails.lower : busLayout.fareDetails.upper;
      setSelectedSeats(prevSeats => {
        const existingSeatIndex = prevSeats.findIndex(seat => seat.seatNo === seatNumber);
        if (existingSeatIndex !== -1) {
          return prevSeats.filter((_, index) => index !== existingSeatIndex);
        } else {
          return [...prevSeats, { seatNo: seatNumber, seatType, fare }];
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

    // Calculate total amount to be paid
    const amountPaid = selectedSeats.reduce((sum, seat) => sum + seat.fare, 0);

    // Format the selectedSeats properly according to your Booking model schema
    const formattedSeats = selectedSeats.map(seat => ({
      seatNo: seat.seatNo,
      seatType: seat.seatType,
      fare: seat.fare
    }));

    const bookingData = {
      selectedSeats: formattedSeats, // Send the complete seat objects
      pickupPoint,
      dropoffPoint,
      passengerDetails: validPassengers,
      bus: selectedBus,
      route: selectedRouteId,
      amountPaid,
      journeyDate: departureDate
    };

    try {
      // Check if Razorpay is loaded
      if (!window.Razorpay) {
        alert('Razorpay SDK failed to load. Please check your internet connection.');
        return;
      }

      // Use the /book endpoint which initiates payment
      const response = await fetch('http://localhost:5000/api/bookings/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Booking created successfully:', result);
        
        // Store the booking ID in a variable for easier access
        const bookingId = result.booking._id;
        console.log('Booking ID:', bookingId);
        
        // Handle Razorpay payment
        const { booking, payment } = result;
        
        // Initialize Razorpay
        const options = {
          key: 'rzp_test_b2TpjIJkb7Ffek',
          amount: payment.amount,
          currency: payment.currency,
          name: 'Cosmoz Bus Booking',
          description: 'Bus Ticket Payment',
          order_id: payment.id,
          handler: function(response) {
            // Prepare all booking data to send with payment verification
            const verificationData = {
              ...response,
              selectedSeats: formattedSeats,
              pickupPoint,
              dropoffPoint,
              passengerDetails: validPassengers,
              bus: selectedBus,
              route: selectedRouteId,
              amountPaid,
              journeyDate: departureDate
            };
            
            // Call verify-payment with all booking data
            verifyPayment(verificationData);
          },
          prefill: {
            name: validPassengers[0].name,
            email: validPassengers[0].email,
            contact: validPassengers[0].phone
          },
          theme: {
            color: '#3399cc'
          }
        };
        
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        const errorData = await response.json();
        alert(`Booking failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  // Update the verifyPayment function
  const verifyPayment = async (paymentData) => {
    try {
      console.log('Verifying payment with data:', paymentData);
      
      const response = await fetch('http://localhost:5000/api/bookings/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();
      console.log('Payment verification response:', result);
      
      if (response.ok) {
        alert('Payment successful! Your booking is confirmed.');
        // Redirect to a confirmation page
        // window.location.href = `/booking-confirmation/${result.booking._id}`;
      } else {
        alert(`Payment verification failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Error during payment verification:', error);
      alert(`An error occurred during payment verification: ${error.message}`);
    }
  };

  // Add a function to check if a seat is available
  const isSeatAvailable = (seatNo) => {
    return !busLayout.bookedSeats.includes(seatNo);
  };

  return (
    <div className="booking-page">
      {loading ? (
        <div>Loading bus details...</div>
      ) : (
        <>
          <h2>{selectedRoute?.departureStop} to {selectedRoute?.arrivalStop}</h2>
          
          {busDetails && (
            <div className="bus-details">
              <h3>Bus Details</h3>
              <p>Registration: {busDetails.registrationNumber}</p>
              <p>Type: {busDetails.type}</p>
              <p>Total Seats: {busDetails.seats.totalSeats}</p>
              <div className="seats-info">
                <p>Lower Deck Seats: {busDetails.seats.Lower}</p>
                <p>Upper Deck Seats: {busDetails.seats.Upper}</p>
                <p>Available Seats: {busDetails.remainingSeats?.total || 0}</p>
              </div>
            </div>
          )}

          <div className="seat-selection">
            <h3>Lower Deck</h3>
            <div className="bus-front">Front</div>
            <div className="seats-container">
              {Array.from({ length: Math.ceil(busLayout.lowerDeck / 4) }, (_, row) => (
                <div key={`lower-${row}`} className="seat-row">
                  {Array.from({ length: 4 }, (_, col) => {
                    // Calculate seat number (1-indexed)
                    const seatIndex = row * 4 + col;
                    // Only render if we haven't exceeded the total lower deck seats
                    if (seatIndex < busLayout.lowerDeck) {
                      const seatNo = `L${seatIndex + 1}`;
                      return (
                        <div
                          key={col}
                          className={`seat ${
                            !isSeatAvailable(seatNo) ? 'booked' : ''
                          } ${selectedSeats.some(s => s.seatNo === seatNo) ? 'selected' : ''}`}
                          onClick={() => isSeatAvailable(seatNo) && handleSeatClick(seatNo, 'Lower')}
                        >
                          {seatNo}
                        </div>
                      );
                    } else {
                      // Return empty space if we've exceeded the total seats
                      return <div key={col} className="seat-placeholder"></div>;
                    }
                  })}
                </div>
              ))}
            </div>

            <h3>Upper Deck</h3>
            <div className="seats-container">
              {Array.from({ length: Math.ceil(busLayout.upperDeck / 4) }, (_, row) => (
                <div key={`upper-${row}`} className="seat-row">
                  {Array.from({ length: 4 }, (_, col) => {
                    // Calculate seat number (1-indexed)
                    const seatIndex = row * 4 + col;
                    // Only render if we haven't exceeded the total upper deck seats
                    if (seatIndex < busLayout.upperDeck) {
                      const seatNo = `U${seatIndex + 1}`;
                      return (
                        <div
                          key={col}
                          className={`seat upper ${
                            !isSeatAvailable(seatNo) ? 'booked' : ''
                          } ${selectedSeats.some(s => s.seatNo === seatNo) ? 'selected' : ''}`}
                          onClick={() => isSeatAvailable(seatNo) && handleSeatClick(seatNo, 'Upper')}
                        >
                          {seatNo}
                        </div>
                      );
                    } else {
                      // Return empty space if we've exceeded the total seats
                      return <div key={col} className="seat-placeholder"></div>;
                    }
                  })}
                </div>
              ))}
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
              >
                <option value="">Select Pickup Point</option>
                {availableStops.pickupPoints.map(stop => (
                  <option key={stop._id} value={stop.name}>
                    {stop.name} {stop.time ? `- ${stop.time}` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Dropoff Point:</label>
              <select 
                value={dropoffPoint} 
                onChange={(e) => setDropoffPoint(e.target.value)}
              >
                <option value="">Select Dropoff Point</option>
                {availableStops.dropoffPoints.map(stop => (
                  <option key={stop._id} value={stop.name}>
                    {stop.name} {stop.time ? `- ${stop.time}` : ''}
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
            disabled={selectedSeats.length === 0 || !pickupPoint || !dropoffPoint}
          >
            Proceed to Payment
          </button>
        </>
      )}
    </div>
  );
};

export default BookingPage;