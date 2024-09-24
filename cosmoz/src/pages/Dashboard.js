import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../pages/Dashboard.css";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Use navigate hook for navigation
  const { firstName, lastName, email, mobile } = location.state || {}; // Retrieve user data

  // Handle logout and navigate to the home page
  const handleLogout = () => {
    // You can also clear any session or local storage if necessary
    navigate("/"); // Navigate to the home page
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="contact-info">
          <span>📞 {mobile}</span>
          <span>✉️ cozmostravel@gmail.com</span>
        </div>
        <div className="logo">COZMOS</div>
        <div className="header-buttons">
          <button className="account-btn">My Account</button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {/* Main content */}
      <main className="dashboard-main">
        <div className="welcome-section">
          <h1>Welcome, <span className="username">{firstName}</span></h1>
          <p>Manage your Bookings</p>
        </div>

        <div className="profile-section">
          <div className="profile-details">
            <form>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" value={firstName} readOnly />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" value={lastName} readOnly />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email address</label>
                  <input type="email" value={email} readOnly />
                </div>
                <div className="form-group">
                  <label>Mobile</label>
                  <input type="tel" value={mobile} readOnly />
                </div>
              </div>
              <button type="submit" className="update-btn">Update</button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        © Cozmos Travels
      </footer>
    </div>
  );
};

export default Dashboard;
