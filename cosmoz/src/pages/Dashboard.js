import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import UHeader from "../components/UHeader";
import "./Dashboard.css";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {};

  const [userData, setUserData] = useState({
    Name: "sarun",
    email: "stilbeen143@gmail.com",
    mobile: "7559910825"
  });
  
  const [activeSection, setActiveSection] = useState("profile");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    if (email) {
      const fetchUserData = async () => {
        try {
          const response = await axios.post("http://localhost:5000/api/user", { email });
          setUserData(response.data);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      };
      fetchUserData();
    }
  }, [email]);

  useEffect(() => {
    if (activeSection === "bookings") {
      fetchBookings();
    }
  }, [activeSection, userData.email]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      
      // Check if we have user email
      if (!userData.email) {
        console.error("No email available to fetch bookings");
        setLoading(false);
        return;
      }
      
      // Make the API call to fetch bookings for this user
      console.log("Fetching bookings for email:", userData.email);
      const response = await axios.get(`http://localhost:5000/api/bookings/user/${userData.email}`);
      console.log("Raw booking data:", response.data);
      
      // Handle the response regardless of whether populate worked or not
      const formattedBookings = response.data.map(booking => {
        // Determine status based on backend status field
        let status = "CONFIRMED";
        if (booking.status === "NOT_PAID") {
          status = "PENDING";
        } else if (booking.status === "CANCELLED") {
          status = "CANCELLED";
        } else if (booking.status === "ACTIVE") {
          status = "CONFIRMED";
        }
        
        // Determine payment status with fallbacks
        let paymentStatus = booking.paymentStatus || "PENDING";
        if (status === "CONFIRMED" && !booking.paymentStatus) {
          paymentStatus = "COMPLETED";
        }
        
        // Calculate total fare from selected seats if amountPaid is missing
        let amountPaid = booking.amountPaid;
        if (!amountPaid && booking.selectedSeats && booking.selectedSeats.length > 0) {
          amountPaid = booking.selectedSeats.reduce((total, seat) => {
            return total + (parseFloat(seat.fare) || 0);
          }, 0);
        }
        
        // Create sensible defaults for route info if populate failed
        const routeInfo = {
          departureStop: booking.route?.departureStop || "Departure",
          arrivalStop: booking.route?.arrivalStop || "Arrival"
        };
        
        // Format booking data for UI
        return {
          ...booking,
          status: status,
          paymentStatus: paymentStatus,
          journeyDate: booking.journeyDate || booking.bookingDate || new Date(),
          amountPaid: amountPaid || 0,
          route: routeInfo
        };
      });
      
      console.log("Formatted bookings:", formattedBookings);
      setBookings(formattedBookings);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      setLoading(false);
      
      // Show a more user-friendly error message
      alert("There was an issue loading your bookings. Please try again later.");
    }
  };
  
  // Add manual refresh ability for bookings
  const refreshBookings = () => {
    if (userData.email) {
      fetchBookings();
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    // Handle update logic here
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/feedback/submit", feedbackData);
      alert(response.data.message);
      // Show sentiment analysis result to user
      if (response.data.analysis) {
        const { sentiment, topics } = response.data.analysis;
        let message = `Thank you for your ${sentiment} feedback`;
        if (topics.length > 0 && topics[0] !== 'general') {
          message += ` about ${topics.join(', ')}`;
        }
        message += "! We appreciate your input.";
        alert(message);
      }
      setFeedbackData({ name: userData.Name, mobile: userData.mobile, email: userData.email, feedback: "" });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback");
    }
  };

  const [feedbackData, setFeedbackData] = useState({
    name: userData.Name,
    mobile: userData.mobile,
    email: userData.email,
    feedback: ""
  });

  return (
    <div className="dashboard-layout">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Welcome, {userData.Name}</h2>
          <p>Manage your Bookings</p>
        </div>
        <UHeader/>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeSection === "profile" ? "active" : ""}`}
            onClick={() => setActiveSection("profile")}
          >
            <span className="nav-icon">👤</span>
            My Profile
          </button>
          <button 
            className={`nav-item ${activeSection === "bookings" ? "active" : ""}`}
            onClick={() => setActiveSection("bookings")}
          >
            <span className="nav-icon">📋</span>
            My Bookings
          </button>
          <button 
            className={`nav-item ${activeSection === "track" ? "active" : ""}`}
            onClick={() => navigate("/LiveTracking")} 
          >
            <span className="nav-icon">🚌</span>
            Track My Bus
          </button>
          <button 
            className={`nav-item ${activeSection === "feedback" ? "active" : ""}`}
            onClick={() => setActiveSection("feedback")} id="feedback"
          >
            <span className="nav-icon">💬</span>
            Feedback
          </button>
        </nav>
      </div>

      <main className="main-content">
        {activeSection === "profile" && (
          <div className="profile-form">
            <form onSubmit={handleUpdate}>
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <div className="input-with-icon">
                    <span className="input-icon">👤</span>
                    <input
                      type="text"
                      value={userData.Name}
                      onChange={(e) => setUserData({...userData, Name: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email address</label>
                  <div className="input-with-icon">
                    <span className="input-icon">✉️</span>
                    <input
                      type="email"
                      value={userData.email}
                      onChange={(e) => setUserData({...userData, email: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Mobile</label>
                  <div className="input-with-icon">
                    <span className="input-icon">📱</span>
                    <input
                      type="tel"
                      value={userData.mobile}
                      onChange={(e) => setUserData({...userData, mobile: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="update-button">
                Update
              </button>
            </form>
          </div>
        )}

        {activeSection === "bookings" && (
          <div className="bookings-container">
            <div className="bookings-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>My Bookings</h2>
              <div>
                <button 
                  className="book-new-button"
                  onClick={() => navigate("/")}
                  style={{ 
                    backgroundColor: '#4CAF50', 
                    color: 'white', 
                    padding: '8px 16px', 
                    border: 'none', 
                    borderRadius: '4px',
                    marginRight: '10px',
                    cursor: 'pointer'
                  }}
                >
                  Book New Trip
                </button>
                <button 
                  className="refresh-button"
                  onClick={refreshBookings}
                  style={{ padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Refresh Bookings
                </button>
              </div>
            </div>
            
            {loading ? (
              <p>Loading your bookings...</p>
            ) : bookings.length > 0 ? (
              <div className="bookings-table-container">
                <table className="bookings-table">
                  <thead>
                    <tr>
                      <th>Ticket #</th>
                      <th>Journey</th>
                      <th>Date</th>
                      <th>Seats</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking._id} className={booking.status === "CANCELLED" ? "cancelled-booking" : ""}>
                        <td>{booking._id.substring(0, 8)}</td>
                        <td>
                          {booking.route?.departureStop} → {booking.route?.arrivalStop}
                          <div className="booking-points">
                            <small>Pickup: {booking.pickupPoint}</small>
                            <small>Dropoff: {booking.dropoffPoint}</small>
                          </div>
                        </td>
                        <td>{new Date(booking.journeyDate).toLocaleDateString()}</td>
                        <td>
                          {booking.selectedSeats.map(seat => seat.seatNo).join(", ")}
                          <div className="seat-count">
                            <small>{booking.selectedSeats.length} seat(s)</small>
                          </div>
                        </td>
                        <td>₹{booking.amountPaid}</td>
                        <td>
                          <span className={`status-badge ${booking.status.toLowerCase()}`}>
                            {booking.status}
                          </span>
                          {booking.paymentStatus && (
                            <div className="payment-status">
                              <small className={`payment-badge ${booking.paymentStatus.toLowerCase()}`}>
                                {booking.paymentStatus}
                              </small>
                            </div>
                          )}
                        </td>
                        <td className="action-buttons">
                          {booking.status === "CONFIRMED" && new Date(booking.journeyDate) > new Date() && (
                            <>
                              <button 
                                className="track-button"
                                onClick={() => navigate("/LiveTracking", { state: { bookingId: booking._id } })}
                              >
                                Track
                              </button>
                              <button className="cancel-button">
                                Cancel
                              </button>
                            </>
                          )}
                          <button className="view-button" onClick={() => setSelectedBooking(booking)}>
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-bookings">
                <p>You don't have any bookings yet.</p>
                <div style={{ margin: '10px 0', color: '#666' }}>
                  <p>If you've recently made a booking, it may take a moment to appear. Click "Refresh Bookings" to check again.</p>
                </div>
                <button 
                  className="book-now-button"
                  onClick={() => navigate("/")}
                >
                  Book a Trip
                </button>
              </div>
            )}
            
            {/* Booking Details Modal */}
            {selectedBooking && (
              <div className="booking-modal">
                <div className="booking-modal-content">
                  <span className="close-modal" onClick={() => setSelectedBooking(null)}>&times;</span>
                  <h3>Booking Details</h3>
                  
                  <div className="booking-detail-section">
                    <h4>Journey Information</h4>
                    <p><strong>Route:</strong> {selectedBooking.route?.departureStop} → {selectedBooking.route?.arrivalStop}</p>
                    <p><strong>Date:</strong> {new Date(selectedBooking.journeyDate).toLocaleDateString()}</p>
                    <p><strong>Pickup:</strong> {selectedBooking.pickupPoint}</p>
                    <p><strong>Dropoff:</strong> {selectedBooking.dropoffPoint}</p>
                  </div>
                  
                  <div className="booking-detail-section">
                    <h4>Seat Information</h4>
                    <ul className="seat-list">
                      {selectedBooking.selectedSeats.map((seat, index) => (
                        <li key={index}>
                          {seat.seatNo} ({seat.seatType}) - ₹{seat.fare}
                        </li>
                      ))}
                    </ul>
                    <p><strong>Total Amount:</strong> ₹{selectedBooking.amountPaid}</p>
                    <p><strong>Payment Status:</strong> 
                      <span className={`payment-badge ${selectedBooking.paymentStatus?.toLowerCase() || 'unknown'}`}>
                        {selectedBooking.paymentStatus || (selectedBooking.status === "CONFIRMED" ? "COMPLETED" : "PENDING")}
                      </span>
                    </p>
                  </div>
                  
                  <div className="booking-detail-section">
                    <h4>Passenger Details</h4>
                    <ul className="passenger-list">
                      {selectedBooking.passengerDetails.map((passenger, index) => (
                        <li key={index}>
                          <strong>{passenger.name}</strong> {passenger.age && `(${passenger.age})`} - {passenger.gender}
                          {passenger.phone && <div><small>Phone: {passenger.phone}</small></div>}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="booking-modal-actions">
                    <button className="download-button">Download Ticket</button>
                    {selectedBooking.status === "CONFIRMED" && new Date(selectedBooking.journeyDate) > new Date() && (
                      <button className="cancel-button">Cancel Booking</button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeSection === "feedback" && (
          <div className="feedback-container">
            <h2>Feedback</h2>
            <p>Leave your feedback and queries to help us to continue our high quality of service.</p>
            
            <form onSubmit={handleFeedbackSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={feedbackData.name}
                  onChange={(e) => setFeedbackData({...feedbackData, name: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Mobile Number</label>
                <input
                  type="tel"
                  value={feedbackData.mobile}
                  onChange={(e) => setFeedbackData({...feedbackData, mobile: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Email address</label>
                <input
                  type="email"
                  value={feedbackData.email}
                  onChange={(e) => setFeedbackData({...feedbackData, email: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Feedback</label>
                <textarea
                  placeholder="Your Feedback"
                  id="fillfeedback"
                  value={feedbackData.feedback}
                  onChange={(e) => setFeedbackData({...feedbackData, feedback: e.target.value})}
                ></textarea>
              </div>
              
              <button type="submit" className="feedback-button" id="submitfeedback">
                Feedback
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;