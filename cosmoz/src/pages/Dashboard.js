import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../pages/Dashboard.css";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {};
  
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: ""
  });

  // Fetch user data from the backend
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

  const handleLogout = () => {
    navigate("/"); // Navigate to the home page
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="contact-info">
          <span>📞 {userData.phone}</span>
          <span>✉️ cozmostravel@gmail.com</span>
        </div>
        <div className="logo">COZMOS</div>
        <div className="header-buttons">
          <button className="account-btn">My Account</button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="welcome-section">
          <h1>Welcome, <span className="username">{userData.name}</span></h1>
          <p>Manage your Bookings</p>
        </div>

        <div className="profile-section">
          <div className="profile-details">
            <form>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" value={userData.name} readOnly />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email address</label>
                  <input type="email" value={userData.email} readOnly />
                </div>
                <div className="form-group">
                  <label>Mobile</label>
                  <input type="tel" value={userData.phone} readOnly />
                </div>
              </div>
              <button type="submit" className="update-btn">Update</button>
            </form>
          </div>
        </div>
      </main>

      <footer className="dashboard-footer">
        © Cozmos Travels
      </footer>
    </div>
  );
};

export default Dashboard;
